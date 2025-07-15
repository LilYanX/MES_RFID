# MES_RFID

**MES_RFID** is a lightweight and scalable Manufacturing Execution System (MES) project connected to UHF RFID readers. It allows real-time tracking of textile items across various production steps.

---

## Project Structure

```bash
MES_RFID/
├── backend/               # FastAPI backend with MongoDB
├── frontend/              # Next.js + TailwindCSS dashboard
└── README.md              # Project documentation
```

---

## Features

- Automatic logging to MongoDB (via Atlas)
- MES Dashboard with:
  - Current step of each article
  - Process history logs
  - Filtering by article UUID or step
  - Total number of articles in the process

---

## Technologies

- Backend: Python, FastAPI, Uvicorn, PyMongo
- Frontend: React (Next.js), Tailwind CSS, Typescript
- Database: MongoDB Atlas (cloud)

---

## Installation Instructions

### 1. Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8000
```

### 2. Frontend (Next.js + Tailwind)

```bash
cd frontend
npm install
npm run dev
```

---

## MongoDB Configuration

- Cloud Provider: [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- Database: `mes_rfid`
- Collections: `rfid_events`, `articles`, `steps`

> Make sure to whitelist your IP address and create a user with read/write access.

---

## 🧪 API Endpoints

| Method | Endpoint                 | Description                          |
|--------|--------------------------|--------------------------------------|
| GET    | `/api/dashboard`         | Get all article process data         |
| GET    | `/api/articles`          | Get enriched article information     |
| GET    | `/api/steps`             | List of available process steps      |
| POST   | `/api/log_event`         | Log a scan (from scanner)            |

---

## Environment Variables

Backend `.env`:
```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
DB_NAME=mes_rfid
COLLECTION_NAME=rfid_events
```

---

## Contributors

- **LilYanX** — Project Owner/Manager & Backend Developer
- **MaximePiçois1** — Data manager
- **aLopes1** - IoT Developer
- **toto8050** - Frontend Developer & UI/UX Designer
- **OlivierMartiniakCesi** - Web Security Developer
- **ThomasGRN** - Software Architect
