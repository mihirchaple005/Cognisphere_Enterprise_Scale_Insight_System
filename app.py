from flask import Flask, request, jsonify
from flask_cors import CORS
import os, re, nltk, docx, pdfplumber, torch
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer, util
from rapidfuzz import process, fuzz
import spacy

# ----------------------------------------------------
# Initialization
# ----------------------------------------------------
nltk.download('punkt')
app = Flask(__name__)
CORS(app)

@app.after_request
def add_csp_headers(response):
    response.headers['Content-Security-Policy'] = "default-src 'self' 'unsafe-inline' 'unsafe-eval'"
    return response
nlp = spacy.load('en_core_web_sm', disable=["parser", "ner"])
kw_model = KeyBERT(model='all-MiniLM-L6-v2')
embed_model = SentenceTransformer('all-MiniLM-L6-v2')

# ----------------------------------------------------
# Skills Ontology
# ----------------------------------------------------
SKILLS = [
    'Python','C','C++','Java','JavaScript','TypeScript','Go','Rust','R','Scala','Kotlin','Ruby','Perl','Swift','Objective-C',
    'PHP','MATLAB','SQL','NoSQL','Shell','Bash','Machine Learning','Deep Learning','Neural Networks','CNN','RNN','LSTM',
    'Transformer','BERT','GPT','T5','RoBERTa','DistilBERT','GAN','Autoencoder','Feature Engineering','Transfer Learning',
    'Data Analysis','EDA','Data Visualization','Pandas','NumPy','Matplotlib','Seaborn','Plotly','Scikit-learn',
    'Regression','Classification','Clustering','PCA','t-SNE','NLP','Text Mining','NER','POS Tagging','Sentiment Analysis',
    'Topic Modeling','LDA','TF-IDF','Word2Vec','FastText','Transformer Models','Computer Vision','Image Processing',
    'OpenCV','YOLO','ResNet','VGG','UNet','OCR','Tesseract','Hadoop','Spark','Hive','Kafka','Airflow','Snowflake',
    'AWS','GCP','Azure','Docker','Kubernetes','Terraform','CI/CD','Jenkins','GitHub Actions','GitLab CI',
    'TensorFlow','Keras','PyTorch','FastAI','XGBoost','LightGBM','CatBoost','HuggingFace','LangChain','Gradio',
    'Streamlit','Flask','Django','FastAPI','MySQL','PostgreSQL','SQLite','MongoDB','Redis','Cassandra','Elasticsearch',
    'React','Angular','Vue','Next.js','Node.js','Express','REST API','GraphQL','HTML','CSS','Tailwind',
    'Blockchain','Ethereum','Solidity','Smart Contracts','Web3.js','IPFS','DeFi','MLOps','MLflow','Kubeflow',
    'Seldon','Prometheus','Grafana','Unit Testing','pytest','Selenium','Cypress','Cybersecurity','Encryption',
    'TLS','SSL','Cryptography','Git','GitHub','GitLab','Docker Compose','Microservices','Serverless','Nginx','Apache'
]
SKILL_CANONICAL = {s.lower(): s for s in SKILLS}
SKILL_EMBEDDINGS = embed_model.encode([s.lower() for s in SKILLS], convert_to_tensor=True)

# ----------------------------------------------------
# File-text utilities
# ----------------------------------------------------
def extract_text_from_pdf(path):
    text_parts = []
    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            text_parts.append(page.extract_text() or "")
    return "\n".join(text_parts)

def extract_text_from_docx(path):
    doc = docx.Document(path)
    return "\n".join(p.text for p in doc.paragraphs)

def extract_text(path):
    ext = os.path.splitext(path)[1].lower()
    if ext == ".pdf": return extract_text_from_pdf(path)
    if ext in [".doc", ".docx"]: return extract_text_from_docx(path)
    with open(path, "r", encoding="utf-8", errors="ignore") as f: return f.read()

def preprocess(text):
    text = re.sub(r"\s+", " ", text).strip()
    doc = nlp(text)
    return " ".join([t.lemma_ for t in doc if not t.is_punct and not t.is_space])

#helpers
def fuzzy_match(candidate, limit=5, score_cutoff=80):
    matches = process.extract(candidate, SKILLS, scorer=fuzz.token_sort_ratio, limit=limit)
    return [(m[0], m[1]) for m in matches if m[1] >= score_cutoff]

def semantic_match(candidate, top_k=3, score_cutoff=0.7):
    cand_emb = embed_model.encode(candidate.lower(), convert_to_tensor=True)
    cos_scores = util.cos_sim(cand_emb, SKILL_EMBEDDINGS)[0]
    top_results = torch.topk(cos_scores, top_k)
    results = []
    for idx, score in zip(top_results[1].cpu().numpy(), top_results[0].cpu().numpy()):
        if score >= score_cutoff:
            results.append((SKILLS[idx], float(score)))
    return results

def extract_keywords(text, top_n=30):
    return kw_model.extract_keywords(text, keyphrase_ngram_range=(1,3), stop_words='english',
                                     use_mmr=True, diversity=0.7, top_n=top_n)


@app.route("/")
def home():
    return jsonify({"message": "Skill Extraction & HR Matching API running"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
