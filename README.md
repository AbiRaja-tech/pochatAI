📦 Imprinta Chat & Analytics Widget
A fully customizable floating chatbot + analytics widget that can be embedded into any website. The widget supports natural language querying, purchase order analytics, role-based access control, and is built for production deployment on Google Cloud using scalable microservices architecture.

🚀 Project Goal
Enable businesses to plug a smart chatbot widget into their purchase order systems for:

📊 Real-time analytics & predictions

💬 Conversational querying of Firestore data

🔐 Role-based secure access (admin vs user)

🌐 Cloud-native hosting with monitoring & CI/CD

🎯 Features Overview
Feature	Description
💬 Floating Chatbot	Appears bottom-right on any webpage. Expands to 25% width on click
🧠 AI Integration	Natural language processing powered by Vertex AI or LangChain
🔐 Role Management	Admin vs User access control via Firebase Auth
📊 Analytics Engine	Embedded microservice for charts, stats, and ML predictions
☁️ Cloud Native	Dockerized, deployed on GCP Cloud Run, with CI/CD and monitoring
📈 Metrics & Logs	Google Cloud Monitoring, Prometheus optional

📁 Architecture
Frontend Widget (React/JS)
│
├── Embedded via <script> tag
│   └── Opens chat window (25% width)
│
└── API Layer (Cloud Run - Docker)
    ├── Service A: Chat/NLP (Node.js or Python)
    └── Service B: Analytics Engine (Python/Node.js)
        └── Role-check, Firestore queries, ML/Stats

Data Layer:
- Firebase Firestore (PO data)
- Firebase Auth (JWT + Role claims)
⚙️ Tech Stack
Layer	Tool/Service
Frontend	React + Tailwind + Web Components
Chat Backend	Node.js / Python + Vertex AI / LangChain
Data Store	Firebase Firestore
Auth	Firebase Auth with role-based rules
Container	Docker (2 services)
Hosting	Google Cloud Run
CI/CD	CircleCI + Google Cloud Build
Monitoring	GCP Monitoring + Logging (optionally Prometheus/Grafana)

🛠️ Development Roadmap
Phase	Description	Status
1	🧱 Widget UI - Embed + Click-to-Expand	✅ Done / 🔄 In Progress
2	🔌 Firebase Auth Integration	🔄 In Progress
3	🗣️ Chat API - Firestore Q&A (admin/user)	🔲 Pending
4	📦 Dockerize Microservices (Chat + Analytics)	🔲 Pending
5	☁️ Deploy to Cloud Run (GCP)	🔲 Pending
6	🔁 Setup CI/CD with CircleCI + Cloud Build	🔲 Pending
7	📊 Add Analytics + Basic Prediction	🔲 Planned
8	🧠 Integrate Vertex AI / Gemini / LangChain	🔲 Planned
9	📡 Monitoring Dashboard (GCP Logs, Metrics)	🔲 Planned
10	🧪 Final Testing & Production Handoff	🔲 Planned

Track all updates via Git commits + GitHub Projects board (or Issues).

🔐 Access Control Overview
Role	Access Capabilities
Admin	🔓 Full access to all PO data, analytics, downloads, prediction
User	🔒 View only own POs, restricted insights, no raw data export

Role stored as customClaims in Firebase Auth JWT

Enforced at API + Firestore rules level

🧪 Example Use Case
Query: "Show me the last 5 POs for vendor AlphaTech with status pending."

Bot Response:

Here are the last 5 purchase orders for AlphaTech with status "Pending":

PO1234 – 3 May 2025 – $4,500

PO1231 – 1 May 2025 – $2,800
(…and so on)

📦 Setup Instructions (Coming Soon)
 npm install for widget

 Firebase project setup

 Dockerfile and Cloud Run deploy instructions

 CircleCI .yml config

 .env variable structure and Firebase rules

🤝 Contributions
This project is currently under active development by the core team.
If you'd like to contribute, raise a discussion or fork the widget structure.

📌 License
MIT © 2025 | Built with ❤️ by Abi Raja and Contributors 