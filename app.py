from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os, re, nltk, docx, pdfplumber, torch, requests
from keybert import KeyBERT
from sentence_transformers import SentenceTransformer, util
from rapidfuzz import process, fuzz
import spacy

# ---- Configuration ----
SPRING_BOOT_URL = "http://localhost:8081"
FLASK_PORT = 5000

# Initialize
nltk.download('punkt')
app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app, resources={r"/api/*": {"origins": "*"}})


# ✅ FIXED: Improved CSP Headers - Allow all localhost connections
@app.after_request
def add_csp_headers(response):
    # Allow connections to localhost:8080 (Spring Boot)
    response.headers['Content-Security-Policy'] = (
        "default-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* https://localhost:*; "
        "connect-src 'self' http://localhost:* https://localhost:* http://127.0.0.1:* https://127.0.0.1:*; "
        "script-src 'self' 'unsafe-inline' 'unsafe-eval'; "
        "style-src 'self' 'unsafe-inline'; "
        "img-src 'self' data:; "
        "font-src 'self' data:"
    )
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    return response


nlp = spacy.load('en_core_web_sm', disable=["parser", "ner"])
kw_model = KeyBERT(model='all-MiniLM-L6-v2')
embed_model = SentenceTransformer('all-MiniLM-L6-v2')

# Skills Ontology - Comprehensive List
SKILLS = [
    # Programming Languages
    'Python', 'Java', 'JavaScript', 'C', 'C++', 'TypeScript', 'Go', 'Rust', 'R', 'Scala', 'Kotlin', 'Ruby', 'PHP',

    # Frameworks & Libraries
    'Spring', 'Spring Boot', 'Django', 'Flask', 'FastAPI', 'React', 'Vue', 'Angular', 'Express', 'Node.js',
    'Hibernate', 'JPA', 'MyBatis',

    # Databases
    'SQL', 'MySQL', 'PostgreSQL', 'MongoDB', 'Neo4j', 'Redis', 'Cassandra', 'Oracle', 'MSSQL',

    # DevOps & Cloud
    'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP', 'Jenkins', 'CI/CD', 'DevOps',

    # Tools & Technologies
    'Git', 'GitHub', 'GitLab', 'Maven', 'Gradle', 'REST API', 'GraphQL', 'Microservices',
    'Kafka', 'RabbitMQ', 'Elasticsearch',

    # Data & AI
    'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Natural Language Processing',
    'Computer Vision', 'Data Science', 'Analytics',

    # Testing
    'JUnit', 'Pytest', 'Selenium', 'Testing', 'Unit Testing', 'Integration Testing',

    # Methodologies
    'Agile', 'Scrum', 'SDLC', 'Design Patterns', 'Software Architecture', 'System Design',

    # Core Concepts
    'Data Structures', 'Algorithms', 'OOP', 'Functional Programming', 'SOLID Principles',
]


# ---- Document Processing Functions ----

def extract_text_from_pdf(file_path):
    """Extract text from PDF"""
    try:
        text = ""
        with pdfplumber.open(file_path) as pdf:
            print(f"  📖 PDF has {len(pdf.pages)} pages")
            for i, page in enumerate(pdf.pages):
                extracted = page.extract_text()
                if extracted:
                    text += extracted + "\n"
                    print(f"    ✓ Page {i + 1}: {len(extracted)} chars")
        print(f"  📝 Total extracted: {len(text)} characters")
        return text
    except Exception as e:
        print(f"❌ Error extracting PDF: {e}")
        return ""


def extract_text_from_docx(file_path):
    """Extract text from DOCX"""
    try:
        doc = docx.Document(file_path)
        text = "\n".join([para.text for para in doc.paragraphs if para.text.strip()])
        print(f"  📝 DOCX extracted: {len(text)} characters")
        return text
    except Exception as e:
        print(f"❌ Error extracting DOCX: {e}")
        return ""


def extract_skills_keybert(text):
    """Extract keywords using KeyBERT"""
    try:
        if not text or len(text.strip()) < 10:
            print("  ⚠️  Text too short to extract keywords")
            return []

        keywords = kw_model.extract_keywords(text, top_n=30, use_maxsum=True)
        print(f"  🔑 KeyBERT found {len(keywords)} keywords")
        return keywords
    except Exception as e:
        print(f"❌ KeyBERT Error: {e}")
        return []


def extract_skills_manual(text):
    """Manual skill extraction using fuzzy matching"""
    try:
        found_skills = {}

        text_lower = text.lower()

        for skill in SKILLS:
            skill_lower = skill.lower()
            count = text_lower.count(skill_lower)

            if count > 0:
                proficiency = min(count * 10, 100.0)
                found_skills[skill] = proficiency
                print(f"    ✓ Found '{skill}': {count} mentions → {proficiency}% proficiency")

        return found_skills
    except Exception as e:
        print(f"❌ Manual extraction error: {e}")
        return {}


def process_document(file_path):
    """Extract skills from document"""
    try:
        print(f"\n🔄 Processing: {os.path.basename(file_path)}")

        if file_path.endswith('.pdf'):
            text = extract_text_from_pdf(file_path)
        elif file_path.endswith('.docx'):
            text = extract_text_from_docx(file_path)
        else:
            print(f"❌ Unsupported file format")
            return []

        if not text:
            print("❌ No text could be extracted from file")
            return []

        print("\n  🤖 Method 1: KeyBERT Extraction")
        keybert_keywords = extract_skills_keybert(text)

        print("\n  🔍 Method 2: Manual Skill Matching")
        manual_skills = extract_skills_manual(text)

        final_skills = {}
        final_skills.update(manual_skills)

        for kw, score in keybert_keywords:
            for skill in SKILLS:
                similarity = fuzz.token_set_ratio(kw.lower(), skill.lower()) / 100.0
                if similarity > 0.6:
                    if skill not in final_skills:
                        proficiency = round(score * 100, 2)
                        final_skills[skill] = proficiency
                        print(f"    ✓ KeyBERT: '{skill}' ({similarity:.2%} match) → {proficiency}% proficiency")
                    break

        sorted_skills = sorted(final_skills.items(), key=lambda x: x[1], reverse=True)

        print(f"\n✅ TOTAL SKILLS FOUND: {len(sorted_skills)}")
        for skill, prof in sorted_skills[:10]:
            print(f"   • {skill}: {prof}%")

        return sorted_skills
    except Exception as e:
        print(f"❌ Error processing document: {e}")
        import traceback
        traceback.print_exc()
        return []


# ---- Flask Routes ----

@app.route('/')
def serve_index():
    """Serve the HTML interface"""
    return send_from_directory('.', 'index.html')


@app.route('/health', methods=['GET'])
def health():
    """Health check"""
    return jsonify({"status": "UP", "service": "Flask Scraper"}), 200

@app.route('/extract/batch', methods=['POST', 'OPTIONS'])
def extract_batch():
    """Extract skills from multiple files"""
    if request.method == 'OPTIONS':
        return '', 200

    try:
        if 'files' not in request.files:
            return jsonify({"status": "error", "message": "No files provided"}), 400

        files = request.files.getlist('files')  # IMPORTANT
        if len(files) == 0:
            return jsonify({"status": "error", "message": "No files selected"}), 400

        os.makedirs("uploads", exist_ok=True)

        batch_results = []

        for file in files:
            if file.filename == '':
                continue

            file_path = os.path.join("uploads", file.filename)
            file.save(file_path)

            print(f"📄 Processing file: {file.filename}")
            skills = process_document(file_path)

            if not skills:
                batch_results.append({
                    "fileName": file.filename,
                    "status": "warning",
                    "message": "No skills found",
                    "skillCount": 0,
                    "skills": []
                })
                continue

            batch_results.append({
                "fileName": file.filename,
                "status": "success",
                "skillCount": len(skills),
                "skills": [{"skillName": skill, "proficiency": score} for skill, score in skills[:15]]
            })

        return jsonify({
            "status": "success",
            "fileCount": len(batch_results),
            "results": batch_results
        }), 200

    except Exception as e:
        print(f"❌ Batch extract error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500



# ✅ FIXED: Correct endpoint name - extract_and_save (not extract_skills)
@app.route('/extract_and_save', methods=['POST', 'OPTIONS'])
def extract_and_save():
    """Extract skills from documents and save to Spring Boot + Neo4j"""
    if request.method == 'OPTIONS':
        return '', 200

    try:
        files = request.files.getlist("files")
        if not files:
            return jsonify({"status": "error", "message": "No files provided"}), 400

        os.makedirs("uploads", exist_ok=True)
        all_employees = []

        for file in files:
            if file.filename == '':
                continue

            file_path = os.path.join("uploads", file.filename)
            file.save(file_path)

            skills = process_document(file_path)

            if not skills:
                print(f"⚠️  No skills found in {file.filename}, skipping...")
                continue

            employee_name = file.filename.rsplit('.', 1)[0]
            employee_data = {
                "name": employee_name,
                "email": f"{employee_name.lower().replace(' ', '.')}@extracted.local",
                "skills": [
                    {
                        "skillName": skill_name,
                        "proficiency": round(score, 2)
                    }
                    for skill_name, score in skills[:15]
                ]
            }

            all_employees.append(employee_data)
            print(f"✓ Prepared: {employee_name} with {len(employee_data['skills'])} skills")

        if not all_employees:
            return jsonify({"status": "error", "message": "No valid documents found"}), 400

        print(f"\n📤 Sending {len(all_employees)} employees to Spring Boot...")
        print(f"   URL: {SPRING_BOOT_URL}/api/employees/batch")

        response = requests.post(
            f"{SPRING_BOOT_URL}/api/employees/batch",
            json=all_employees,
            headers={"Content-Type": "application/json"},
            timeout=30
        )

        print(f"📥 Backend Response Status: {response.status_code}")

        if response.status_code in [200, 201]:
            result = response.json()
            print(f"✅ Backend response: {result}")
            return jsonify({
                "status": "success",
                "message": "Employees extracted and saved successfully",
                "filesProcessed": len(all_employees),
                "backendResponse": result
            }), 201
        else:
            print(f"❌ Backend error response: {response.text}")
            return jsonify({
                "status": "error",
                "message": "Failed to save to backend",
                "backendStatus": response.status_code,
                "backendResponse": response.text
            }), 500

    except requests.exceptions.ConnectionError as e:
        print(f"❌ Connection Error: {e}")
        return jsonify({
            "status": "error",
            "message": f"Cannot connect to Spring Boot at {SPRING_BOOT_URL}",
            "hint": "Ensure Spring Boot is running on port 8080"
        }), 503
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        import traceback
        traceback.print_exc()
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/test_backend', methods=['GET'])
def test_backend():
    """Test connection to Spring Boot backend"""
    try:
        print(f"🧪 Testing connection to {SPRING_BOOT_URL}/api/employees/health")
        response = requests.get(f"{SPRING_BOOT_URL}/api/employees/health", timeout=5)

        if response.status_code == 200:
            data = response.json()
            print(f"✅ Backend is reachable: {data}")
            return jsonify({
                "status": "success",
                "message": "Backend is reachable",
                "backend": data
            }), 200
        else:
            print(f"❌ Backend returned status {response.status_code}")
            return jsonify({
                "status": "error",
                "message": "Backend returned error",
                "statusCode": response.status_code
            }), 500
    except requests.exceptions.ConnectionError as e:
        print(f"❌ Cannot connect to backend: {e}")
        return jsonify({
            "status": "error",
            "message": f"Cannot connect to Spring Boot at {SPRING_BOOT_URL}",
            "hint": "Ensure Spring Boot is running on port 8080"
        }), 503
    except Exception as e:
        print(f"❌ Test error: {e}")
        return jsonify({"status": "error", "message": str(e)}), 500



@app.route('/match_employees', methods=['POST'])
def match_employees():
    """
    HR uploads a job description file (PDF/DOCX).
    We extract skills → fetch employees from backend → compute similarity → return sorted employees.
    """
    try:
        if 'file' not in request.files:
            return jsonify({"status": "error", "message": "No file uploaded"}), 400

        file = request.files['file']
        if file.filename == '':
            return jsonify({"status": "error", "message": "Empty file name"}), 400

        # Save temporarily
        os.makedirs("uploads", exist_ok=True)
        file_path = os.path.join("uploads", file.filename)
        file.save(file_path)

        # Extract skills using your existing processing
        jd_skills = process_document(file_path)
        if not jd_skills:
            return jsonify({"status": "error", "message": "No skills extracted from JD"}), 400

        jd_skill_list = [s[0] for s in jd_skills]
        jd_text = " ".join(jd_skill_list)

        # 1 FETCH EMPLOYEES FROM SPRING BOOT BACKEND
        try:
            employees_response = requests.get(f"{SPRING_BOOT_URL}/api/employees", timeout=10)
            employees_response.raise_for_status()
        except Exception as fetch_err:
            return jsonify({
                "status": "error",
                "message": f"Failed to fetch employees from backend: {str(fetch_err)}"
            }), 500

        employees = employees_response.json()

        # 2️ Compute embeddings
        jd_embedding = embed_model.encode(jd_text, convert_to_tensor=True)

        scored_employees = []

        for emp in employees:
            emp_skill_text = " ".join(
                [skill.get("skillName", "") for skill in emp.get("skills", [])]
            )

            emp_embedding = embed_model.encode(emp_skill_text, convert_to_tensor=True)

            similarity = util.cos_sim(jd_embedding, emp_embedding).item()
            similarity = round(float(similarity) * 100, 2)

            scored_employees.append({
                "name": emp.get("name"),
                "email": emp.get("email"),
                "skills": emp.get("skills", []),
                "similarity": similarity
            })

        # 3️ Sort employees by similarity
        scored_employees.sort(key=lambda x: x["similarity"], reverse=True)

        return jsonify({
            "status": "success",
            "uploadedJD": file.filename,
            "jdSkills": jd_skill_list,
            "employeeCount": len(scored_employees),
            "matchedEmployees": scored_employees
        }), 200

    except Exception as e:
        print("❌ Error:", e)
        return jsonify({"status": "error", "message": str(e)}), 500

# ---- Main ----
if __name__ == '__main__':
    print(f"🚀 Starting Flask Scraper on http://localhost:{FLASK_PORT}")
    print(f"📡 Will send data to Spring Boot at {SPRING_BOOT_URL}/api/employees/batch")
    app.run(debug=True, host='0.0.0.0', port=FLASK_PORT)
