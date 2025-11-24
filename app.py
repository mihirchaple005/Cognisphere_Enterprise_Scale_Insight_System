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

# ----------------------------------------------------
# Matching helpers
# ----------------------------------------------------
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

# ----------------------------------------------------
# Document skill extraction
# ----------------------------------------------------
def process_document(path):
    raw = extract_text(path)
    pre = preprocess(raw)
    keywords = extract_keywords(pre)
    matched = {}
    for phrase, rel in keywords:
        phrase_lower = phrase.lower()
        for s_lower, canonical in SKILL_CANONICAL.items():
            if s_lower in phrase_lower or phrase_lower in s_lower:
                matched[canonical] = max(matched.get(canonical, 0.0), rel)
                break
        else:
            for name, score in fuzzy_match(phrase):
                weight = (score / 100.0) * rel
                matched[name] = max(matched.get(name, 0.0), weight)
            for name, sscore in semantic_match(phrase):
                weight = sscore * rel
                matched[name] = max(matched.get(name, 0.0), weight)
    return sorted(matched.items(), key=lambda kv: kv[1], reverse=True)

# ----------------------------------------------------
# HR role-matching (KNN)
# ----------------------------------------------------
def compute_embedding_similarity(req_skills, emp_skills):
    if not emp_skills: return 0.0
    emb1 = embed_model.encode(", ".join(req_skills), convert_to_tensor=True)
    emb2 = embed_model.encode(", ".join(emp_skills), convert_to_tensor=True)
    sim = util.cos_sim(emb1, emb2).item()
    return (sim + 1) / 2

@app.route("/find_best_employees", methods=["POST"])
def find_best_employees():
    data = request.json
    job_text = data.get("job_description", "")
    k = int(data.get("k", 10))
    if not job_text:
        return jsonify({"error": "job_description missing"}), 400

    required_skills = [kw[0] for kw in extract_keywords(job_text, top_n=15)]
    # --- Replace with DB call or route in production ---
    EMPLOYEES = [
        {"id": 1, "name": "Alice", "skills": ["Python","Machine Learning","Flask"], "experience_years": 1},
        {"id": 2, "name": "Bob", "skills": ["JavaScript","React","Node.js"], "experience_years": 2},
        {"id": 3, "name": "Charlie", "skills": ["Deep Learning","Python","TensorFlow"], "experience_years": 0.5},
        {"id": 4, "name": "David", "skills": ["SQL","Data Analysis","Python"], "experience_years": 3},
        {"id": 5, "name": "Eva", "skills": ["Computer Vision","Pytorch","Machine Learning"], "experience_years": 1.5},
    ]

    avg_exp = sum(e["experience_years"] for e in EMPLOYEES) / len(EMPLOYEES)
    results = []
    for emp in EMPLOYEES:
        sim_score = compute_embedding_similarity(required_skills, emp["skills"])
        exp_factor = 1 - abs(avg_exp - emp["experience_years"]) / avg_exp
        final_score = 0.8 * sim_score + 0.2 * exp_factor
        results.append({
            "employee_id": emp["id"],
            "name": emp["name"],
            "skills": emp["skills"],
            "experience": emp["experience_years"],
            "similarity": round(sim_score, 3),
            "match_score": round(final_score, 3)
        })

    top_k = sorted(results, key=lambda x: x["match_score"], reverse=True)[:k]
    print("K")
    print(top_k)
    return jsonify({"required_skills": required_skills, "k_value": k, "top_matches": top_k})

# ----------------------------------------------------
# Skill extraction route
# ----------------------------------------------------
@app.route("/extract_skills", methods=["POST"])
def extract_skills_api():
    files = request.files.getlist("files")
    os.makedirs("uploads", exist_ok=True)
    results = {}
    for file in files:
        path = os.path.join("uploads", file.filename)
        file.save(path)
        skills = process_document(path)
        results[file.filename] = skills
    print(results)
    return jsonify(results)

@app.route("/")
def home(): return jsonify({"message": "Skill Extraction & HR Matching API running"})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8000, debug=True)
