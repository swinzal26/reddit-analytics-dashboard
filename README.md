# AppDev Analytics Studio

This repository has been transformed into a full-stack portfolio project with a Flask backend and a modern React + Vite frontend.

## Structure

- `backend/` – Flask API implementing post and comment management.
- `frontend/` – Vite React dashboard with Tailwind CSS, React Router, Axios, Recharts, and Lucide icons.

## Run locally

### Backend

```bash
cd backend
python3 app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend is configured to proxy `/api` requests to the backend on `http://127.0.0.1:5000`.

## Key features

- Analytics dashboard with charts and post metrics
- Post creation, upvoting, and comment management
- Clean, reusable UI components and routing structure
- Production-ready frontend tooling with Tailwind CSS
