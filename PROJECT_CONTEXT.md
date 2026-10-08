# PROJECT ARCHITECTURE & IMPLEMENTATION CONTEXT REPORT

## 1. OVERVIEW & GOAL
This document details the architectural layout, frontend implementations, and Python backend integrations built for the Quantum Network Simulation & Media Desktop Suite.

---

## 2. FRONTEND IMPLEMENTATIONS (React 18 + Vite + Tailwind CSS v4)

### A. Global Session State Management (`src/App.jsx` & `sessionStorage`)
- **Persistent Connected Node**: Global React state in `App.jsx` initialized and saved via `sessionStorage.getItem('connectedNode')` / `sessionStorage.setItem(...)`.
- **Main Launcher Session Banner (`QuickAccessGrid.jsx`)**: Displays a high-profile session status header showing `SESSION STORE CONNECTED NODE: IIT Roorkee (192.168.1.101)` with live latency, active protocol, and quick module navigation buttons (`Video Call`, `Chat Node`).
- **Cross-Module Sync**: Automatically synchronizes the connected quantum node across System Interface, Video Conference, Quantum Chat, and File Transfer modules.

### B. System Interface Workflow Module (`src/components/modules/SystemInterfaceModule.jsx`)
- **Step 1 — Target Node Selection**: Allows selecting remote nodes (IIT Roorkee, IISER Bhopal, IISc Bangalore, IIT Delhi, IIT Jammu) with live ping latency and status indicator.
- **Step 2 — Simulation Backend Selection**: Framework choices including SimulaQron, SQUANCH, QuNetSim, QKDNetSim.
- **Step 3 — QKD Protocol Selection**: BB84, E91, E92, CV-QKD.
- **Step 4 — Parameter Config & Key Generation**:
  - **Connected Node Status Banner**: Displays an active connection status header showing the remote node name (e.g. `IIT Roorkee`), IP address (`192.168.1.101`), latency (`0.4 ms`), and `Channel Active` status.
  - **Real-Time Key Telemetry**: Real-time random key selection from `key_database.txt` with QBER estimation, sifted bits, and latency metrics.
  - **Available Keys Table**: Rendered in a high-tech dark table with emerald highlights (`border-emerald-500/30`), showing Key ID, Node Pair, Protocol, Bit Length, Status, Created Timestamp, and Raw Binary Stream.
  - **Deactivated Keys Table**: Rendered in a dark red table (`border-red-500/40`), grouping expired/deactivated keys.

### B. Quantum Encrypted Video Meeting — Google Meet Suite (`src/components/modules/VideoConfModule.jsx`)
- Overhauled layout to match modern **Google Meet** executive interface with quantum encryption branding.
- **256-Bit QKD Encrypted Header**: Top status bar displaying target peer connection (`IIT Roorkee ↔ IISER Bhopal`), active encryption status, and SimulaQron backend state.
- **No Static Photos**: Replaced stock photo avatars with high-tech **Quantum Node Telemetry Cards** featuring live frequency badges (`LIVE`), node identifiers (`IB`, `IS`, `ID`), and active signal meters.
- **Live OpenCV Stream & Grid Views**: Renders live OpenCV webcam stream (`http://localhost:8000/video`) for local camera feed, with picture-in-picture node telemetry cards and full 2x2 Grid view toggle (`IISER Bhopal Node`, `IISc Bangalore Node`, `IIT Delhi Node`).
- **Google Meet Controls Toolbar**: Floating bottom toolbar with Mute/Unmute microphone, Camera Toggle, Raise Hand, Grid View Toggle, Share Screen, and Leave Meeting controls.

### C. Quantum Media & Video Player Stream (`src/components/modules/VideoPlayerModule.jsx`)
- Integrated embedded **YouTube Video Player** for Quantum Networking (`https://www.youtube.com/watch?v=HGRQmHkRtZU`).
- **Fullscreen Mode & Overlay Controls**: Includes a quick Fullscreen toggle button, verified media badges, and high-definition stream tags.
- **Quantum Video Library & Playlist**: Interactive right-side panel featuring distinct, selectable quantum videos (*Quantum Networking & QKD Principles*, *Quantum Key Distribution Physics & Hardware*, *Quantum Entanglement & Information Networks*). Clean layout with duration timestamps removed as requested.

### D. Quantum Nodes Chat Module (`src/components/modules/ChatModule.jsx`)
- Reorganized to support Quantum Node Channels (`#iiser-bhopal`, `#iit-roorkee`, `#iisc-bangalore`, `#iit-delhi`, `#iit-jammu`).
- Top header displays active node status badge (`CONNECTED: IISER Bhopal (192.168.1.104)`).
- Side thread panel displaying active peer nodes (IISER Bhopal Node, IIT Roorkee Node, IIT Delhi Node) and encrypted quantum key message cards.

---

## 3. PYTHON BACKEND & OPENCV INTEGRATION (`GUI_lab/backend/`)

> [!NOTE]
> A complete step-by-step setup guide is available in **[`BACKEND_SETUP_GUIDE.md`](file:///home/student/CYQT/GUI_lab/gui_lab/BACKEND_SETUP_GUIDE.md)**.

### A. FastAPI Server (`backend/app.py`)
- Built with **FastAPI**, **Uvicorn**, and **OpenCV** (`cv2`).
- CORS middleware enabled (`allow_origins=["*"]`) for React frontend integration.
- `GET /` endpoint: Returns server status JSON (`{"message": "OpenCV backend is running", "status": "active"}`).
- `GET /video` endpoint: Serves a continuous HTTP MJPEG multipart stream (`multipart/x-mixed-replace; boundary=frame`) captured live from webcam (`cv2.VideoCapture(0)`).

### B. Dependencies (`backend/requirements.txt`)
```txt
fastapi
uvicorn
opencv-python
```

---

## 4. HOW TO RUN THE SYSTEM

1. **Start Python Backend**:
   ```bash
   cd /home/student/CYQT/GUI_lab/backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   python app.py
   ```

2. **Start React Frontend**:
   ```bash
   cd /home/student/CYQT/GUI_lab/gui_lab
   npm run dev
   ```

3. **Access Application**:
   - React UI: [http://localhost:5173](http://localhost:5173)
   - OpenCV Stream Endpoint: [http://localhost:8000/video](http://localhost:8000/video)
