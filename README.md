# 🏥 HealthCompanion — AI-Powered Emergency Healthcare Assistant

HealthCompanion is a **real-time, AI-driven healthcare monitoring and emergency response system** that continuously tracks patient vitals, detects medical emergencies, explains AI decisions, and intelligently routes patients to the **best nearby hospital** using live maps.

The system is designed for **wearables + mobile + hospital coordination**, focusing on **speed, clarity, and reliability** during critical medical events.

---

## 🚀 Key Features

### 🫀 Real-Time Vitals Monitoring
- Continuous ingestion of vitals (heart rate, SpO₂, BP, motion, fall detection)
- Live dashboard updates via polling
- Automatic escalation on abnormal vitals

### 🚨 Emergency Detection & Triage
- AI agent analyzes vitals patterns
- Assigns **triage level (1–5)**
- Detects conditions like **tachycardia, hypoxia, falls**
- Supports **manual SOS trigger**

### 🧠 AI Medical Reasoning (Explainability)
- Transparent AI decisions
- Shows:
  - Detected condition
  - Confidence score
  - Supporting evidence
  - Explanation of why an emergency was triggered
- Designed to be understandable by doctors and caregivers

### 🗺️ Intelligent Hospital Routing
- Uses **Google Places API** to fetch real hospitals
- Uses **Google Distance Matrix API** to calculate ETA
- Scoring system prioritizes:
  - Hospital rating
  - Proximity / ETA
  - Popularity (reviews)
- Visualized using **Leaflet + OpenStreetMap**
- One-click navigation to **Google Maps**

### 📞 Emergency Notifications (Pluggable)
- SMS / WhatsApp / Push architecture
- Currently supports Twilio (optional, can be disabled safely)
- Graceful fallback when credentials are missing

### 🧩 Modular Multi-Agent Architecture
- Orchestrator agent
- Medical reasoning agent
- Routing agent
- Notification agent
- Easily extensible to new AI agents

---

## 🏗️ Tech Stack

### Frontend
- **React (Vite)**
- **Tailwind CSS**
- **React Router**
- **Axios**
- **Leaflet + OpenStreetMap**

### Backend
- **FastAPI**
- **Pydantic**
- **Python Multi-Agent Architecture**
- **Google Maps APIs**
- **Twilio (optional)**
- **dotenv for secrets**

---

## 📂 Project Structure

