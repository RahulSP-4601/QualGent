# QualGent – Test Case Management Web App

QualGent is a full-stack test case repository management platform built with **FastAPI**, **React**, and **MySQL**. It allows users to create, edit, delete, and manage categorized test cases with the help of AI-powered test case generation.

## Live Demo

**Frontend**: [https://qualgent-frontend-508592510915.us-central1.run.app](https://qualgent-frontend-508592510915.us-central1.run.app)  
**Video Demo**: [Watch on Google Drive](https://drive.google.com/file/d/13dkRw5ai5hy03XT9CFACvCWCFfDknJzI/view?usp=sharing)

---

## AI Chat Assistant (OpenAI Integrated)

The built-in AI assistant allows you to interact using natural language. It supports:

- **Create Category**: `Create category <CategoryName>`
- **Update Category**: `Update category <OldName> to <NewName>`
- **Delete Category**: `Delete category <CategoryName>`
- **Generate Test Cases**: Ask AI to generate test cases by describing the feature/scenario

All AI interactions reflect live changes in the app.

---

## Features

Category-wise test case management  
Create, Edit, Delete categories and test cases  
AI-powered test case generation using OpenAI GPT-4  
Modal-based UI for smooth inline editing  
dark-themed frontend UI  
Real-time category updates  
Full Dockerized setup and Google Cloud Run deployment

---

## Tech Stack

| Layer      | Tech                      |
| ---------- | ------------------------- |
| Frontend   | React, JavaScript, Axios  |
| Backend    | FastAPI (Python), Uvicorn |
| Database   | MySQL (Cloud-hosted)      |
| AI Engine  | OpenAI API (GPT-4)        |
| Deployment | Docker, Google Cloud Run  |

---

## Setup Instructions

### Prerequisites:

- Docker
- Google Cloud SDK (for deployment)

### Run Locally

```bash
# Frontend
cd frontend
npm install
npm run dev

# Backend
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

---

## Environment Variables

### Backend `.env`

```
DATABASE_URL=mysql+pymysql://root:<password>@<host>:3306/QualGent
OPENAI_API_KEY=sk-...
```

Google Cloud Run handles env injection during deployment.

---

## Deployment

### Local with Docker:

```bash
docker-compose up --build
```

### Google Cloud Run:

1. Build and push Docker images to Artifact Registry
2. Deploy via `gcloud`:

```bash
gcloud run deploy qualgent-backend \
  --image=us-central1-docker.pkg.dev/qualgent/qualgent-repo/qualgent-backend \
  --platform=managed \
  --region=us-central1 \
  --allow-unauthenticated \
  --set-env-vars="OPENAI_API_KEY=sk-...,DATABASE_URL=..."
```

---
