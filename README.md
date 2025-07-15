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

# MES RFID System

This project is a full-stack RFID-based Manufacturing Execution System (MES) designed to track and manage textile articles through various production steps. It provides real-time visibility, traceability, and a customizable workflow, ideal for industrial laundries or factories with RFID-tagged goods.

---

## Core Features

- ✅ Complete traceability of each article’s production steps
- ✅ Real-time dashboard interface with status monitoring
- ✅ Article catalog enriched with product data (type, size, color, etc.)
- 🔜 Production order planning
- 🔜 Performance statistics
- 🔜 Alerts on errors or slowdowns
- 🔜 Visualization of connected devices (RFID scanners) and their status

---

## Roadmap

- [x] Functional MES dashboard
- [x] Step-by-step RFID traceability
- [x] Enriched article database
- [ ] User & role management
- [ ] Visualization of process statistics
- [ ] Full article history view
- [ ] Live connected device status (scanners, etc.)
- [ ] Mobile compatibility
- [ ] Cloud deployment

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
## MongoDB Atlas Access

### External Connection

- Use `MONGO_URI` from `.env`
- Ensure your client IP address is allowed in:  
  [https://cloud.mongodb.com](https://cloud.mongodb.com) > Project > Network Access

### Project Sharing

To give access to other team members:

1. Go to **Database Access > Add New User**
2. Recommended role: `Read and write to any database`
3. MongoDB Atlas UI: [https://cloud.mongodb.com](https://cloud.mongodb.com)

---

## Example Article Data

```json
{
  "uuid": "78CBBC9E",
  "type": "Shirt",
  "matiere": "Cotton",
  "couleur": "White",
  "taille": "M",
  "temps_process": {
    "lavage": "15min",
    "sechage": "10min",
    "pliage": "5min"
  }
}
```

---

## API

| Method | Endpoint                 | Description                          |
|--------|--------------------------|--------------------------------------|
| GET    | `/api/dashboard`         | Get all article process data         |
| GET    | `/api/articles`          | Get enriched article information     |
| GET    | `/api/steps`             | List of available process steps      |
| POST   | `/api/log_event`         | Log a scan (from scanner)            |

### Example routes:
- GET /api/dashboard → List of articles currently in process
- POST /api/log → Record an RFID scan event
- GET /api/articles/:uuid → Detailed information about one article

Interactive Swagger docs:
http://localhost:8000/docs

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
