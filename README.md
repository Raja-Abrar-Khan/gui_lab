# GUI_LAB: Quantum Communications Desktop Platform
## React + Vite Frontend for Live QKD Simulation & Encrypted Operations

The frontend control platform provides real-time interfaces for Quantum Key Distribution (BB84 via SimulaQron), Quantum Secure Chat, Encrypted File Transfer, and AES-256-GCM Video Conferencing.

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (>= 18.0)
- npm (>= 9.0)
- Python Backend running on `http://localhost:8000` (from `GUI_BACKEND`)

### 2. Installation
```bash
# Clone the repository
git clone https://github.com/Raja-Abrar-Khan/gui_lab.git
cd gui_lab

# Install dependencies
npm install
```

### 3. Launch Development Server
```bash
npm run dev
```

Open your browser at: **`http://localhost:5173`**

---

## 🖥️ Operational Modules

1. **System Interface (Run Simulation):**
   - Live trigger for SimulaQron BB84 QKD simulation across 100 qubits.
   - Live streaming of quantum states, basis matching, error rate estimation, and 256-bit key distillation.
   - Synchronizes distilled key across all other modules.

2. **Quantum Chat (`#iiser-bhopal`):**
   - Telemetry inspector showing IV, AES-256-CBC ciphertext, and key SHA-256 fingerprint.
   - Real-time zero-knowledge verification.

3. **Quantum File Transfer:**
   - Chunked file encryption using AES-256-GCM.
   - Direct streaming over raw TCP to port 6001.

4. **Quantum Video Conferencing:**
   - Real-time webcam streaming with fallback synthetic quantum radar test pattern.
   - AES-256-GCM frame encryption with selectable QKD keys.
   - P2P Host / Join controls with automated local IP detection.
