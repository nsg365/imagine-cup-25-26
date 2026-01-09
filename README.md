
---

#  Emergency AI Healthcare Companion

> **An AI-powered, multi-agent emergency response system that detects medical anomalies in real time and delivers reliable alerts across multiple channels, designed with real-world healthcare constraints in mind.**

---

## 🩺 Problem Statement

Medical emergencies such as **severe tachycardia, hypoxia, or sudden vitals deterioration** often go unnoticed until it is too late. Existing systems are typically:

* Reactive instead of proactive
* Dependent on a single notification channel
* Fragile under real-world constraints (telecom regulations, network failures, regional restrictions)

**Goal:** Build a *reliable, intelligent, and explainable emergency-response companion* that can detect anomalies early and ensure alerts reach caregivers **without a single point of failure**.

---

##  Our Solution

We propose an **AI-driven, multi-agent healthcare companion** that:

1. Continuously monitors patient vitals (simulated / real-time)
2. Detects anomalies using intelligent agents
3. Performs medical severity classification (triage)
4. Identifies nearby hospitals and estimates ETA
5. Sends alerts via **redundant notification channels**
6. Gracefully handles real-world failures (SMS blocking, auth issues, missing channels)

> **Reliability is treated as a first-class design constraint, not an afterthought.**

---

##  System Architecture (High-Level)

```
Vitals Stream
     ↓
Vital Monitor Agent
     ↓
Medical Agent (Risk + Triage)
     ↓
Orchestrator Agent
     ↓
Routing Agent ──→ Nearest Hospital + ETA
     ↓
Notification Agent
     ↓
SMS | WhatsApp | Push | Webhook
```

Each agent is **loosely coupled**, **independently testable**, and replaceable.

---

## Agents Overview

### 1. Vital Monitor Agent

* Continuously processes vitals (HR, SpO₂, etc.)
* Detects deviations from patient baseline

### 2. Medical Agent

* Performs medical triage and severity classification
* Generates **explainable medical reasoning** using an LLM

### 3. Orchestrator Agent

* Central decision-maker
* Coordinates agents and ensures fail-safe execution

### 4. Routing Agent

* Identifies nearest medical facilities
* Estimates ETA based on location

### 5. Notification Agent

* Sends alerts across multiple channels
* Implements graceful fallback logic

---

## Notification Strategy (Real-World Aware)

### Supported Channels

* SMS *(Twilio – demo only)*
* WhatsApp *(Twilio – demo only)*
* Push Notifications *(planned)*
* Webhooks *(supported)*

### Why Multi-Channel Matters

In many regions (e.g. India), **SMS delivery is regulated (DLT)** and may fail silently.

Our system:

* Differentiates *“SMS sent”* vs *“SMS delivered”*
* Treats SMS as **best-effort**, not guaranteed
* Is designed to fall back to other channels automatically

> This reflects **real-world deployment readiness**, not idealized assumptions.

---

##  Important Note on Twilio (Demo-Only)

**Twilio is used temporarily for demonstration and testing purposes only.**

* SMS / WhatsApp delivery may be restricted by regional regulations
* Phone numbers must be verified on Twilio (trial accounts)
* In real-world deployments, this module would be replaced with:

  * Government-compliant SMS gateways
  * Hospital paging systems
  * Secure push notification services

> The system architecture is **provider-agnostic** — Twilio is *not* a hard dependency.

---

##  Tech Stack

### Backend

* **Python**
* **FastAPI**
* **Uvicorn**
* **SQLite** (local auth DB)
* **Twilio API** (temporary demo integration)
* **Ollama** (local LLM inference)

### Frontend

* **React**
* **Vite**
* Modular component-based architecture

### AI / LLM

* **Ollama (local inference)**
* Used for:

  * Medical reasoning
  * Triage explanation
  * Decision justification

---

##  Demonstration Flow

1. Vitals cross a critical threshold
2. System detects anomaly
3. Medical agent classifies severity (e.g. *Severe Tachycardia – High Risk*)
4. Routing agent identifies nearest hospital + ETA
5. Alerts are dispatched via:

   * Webhooks
   * SMS / WhatsApp *(best-effort, demo only)*
6. All actions are logged and visible on the dashboard

---

##  Environment Configuration

Create a `.env` file in the project root:

```env
TWILIO_SID=ACxxxxxxxxxxxxxxxxxxxx
TWILIO_TOKEN=xxxxxxxxxxxxxxxxxxxx
TWILIO_NUMBER=+1xxxxxxxxxx
EMERGENCY_PHONE=+91xxxxxxxxxx
```

🔹 **Notes**

* `.env` is **not committed** to the repository
* Twilio credentials are optional if SMS is not required
* The system will continue functioning even if SMS is disabled

---

##  How to Run the Project

### 1 Start Ollama (LLM Server)

Ollama **must be running in the background**:

```bash
ollama serve
```

Ensure your required model is available:

```bash
ollama pull llama3
```

```bash
llama run phi3
```
and then type hello
---

### 2️    Start Backend Server

From the project root:

```bash
pip install -r requirements.txt
uvicorn backend.main:app --reload --port 8000
```

---

### 3️ Start Frontend Server

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at:

```
http://localhost:5173
```

---

##  Services That Must Be Running

| Service           | Purpose                             |
| ----------------- | ----------------------------------- |
| Ollama            | LLM inference for medical reasoning |
| FastAPI backend   | Core logic & agents                 |
| Frontend (Vite)   | Dashboard & visualization           |
| Twilio (optional) | Demo SMS / WhatsApp                 |

---

##  Key Innovations

* Multi-agent intelligence (not a monolith)
* Reliability-first system design
* Explainable medical reasoning
* Graceful degradation under failures
* Designed for real-world healthcare constraints

---


## Team
    Nihar Sagar G
    Seepana Rishita 

**Emergency AI Healthcare Companion**

* Interdisciplinary collaboration across AI, systems, and frontend
* Built with scalability, ethics, and reliability in mind

---

## Final Note to Judges

Healthcare systems must function **when conditions are worst**.

This project is not just a prototype — it is a **resilient, thoughtful blueprint** for intelligent emergency response systems.

Thank you for your time and consideration.

---
