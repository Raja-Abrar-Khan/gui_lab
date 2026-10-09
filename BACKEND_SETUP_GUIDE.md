# BACKEND STEP-BY-STEP INTEGRATION GUIDE

This guide provides step-by-step instructions for installing, configuring, running, and testing the **Python FastAPI + OpenCV** backend server.

---

## 📁 1. BACKEND DIRECTORY STRUCTURE

Location: `/home/student/CYQT/GUI_lab/backend`

```
GUI_lab/
├── backend/
│   ├── app.py              # FastAPI server & OpenCV video streaming
│   ├── requirements.txt    # Python dependencies
│   └── venv/               # Python Virtual Environment
└── gui_lab/                # React Frontend Workspace
```

---

## ⚙️ 2. STEP-BY-STEP BACKEND SETUP

### Step 1: Open Terminal & Navigate to Backend Folder
```bash
cd /home/student/CYQT/GUI_lab/backend
```

### Step 2: Create a Python Virtual Environment
- **On Linux / macOS:**
  ```bash
  python3 -m venv venv
  ```
- **On Windows (PowerShell / CMD):**
  ```powershell
  python -m venv venv
  # or
  py -m venv venv
  ```

### Step 3: Activate Virtual Environment
- **On Linux / macOS:**
  ```bash
  source venv/bin/activate
  ```
- **On Windows (PowerShell):**
  ```powershell
  .\venv\Scripts\Activate.ps1
  ```

### Step 4: Install Backend Dependencies
```bash
pip install -r requirements.txt
```

*Requirements inside `requirements.txt`:*
```txt
fastapi
uvicorn
opencv-python
```

## 3. TWO-PC VIDEO CALL ON THE SAME WI-FI

Run the Python backend and React app on both computers. The backend uses HTTP port `8000` for local/remote video and TCP port `8765` for the peer connection.

1. Start the backend from `backend/` on both PCs:
   ```bash
   python3 app.py
   ```
2. Start React from `gui_lab/` on both PCs:
   ```bash
   npm install
   npm run dev
   ```
3. On PC 1, open **Video Call**, select **Host call**, then share the displayed IP address.
4. On PC 2, enter PC 1's IP address and select **Join**. Both screens show local and remote video when connected.
5. Select **End call** to close the connection.

Allow inbound TCP port `8765` through PC 1's firewall. On Ubuntu with UFW, run `sudo ufw allow 8765/tcp`. Both PCs must be able to communicate directly on the LAN; guest Wi-Fi or client isolation can block this. This prototype is video-only and has no encryption or authentication, so use it only on a trusted network.

---

## 4. PYTHON BACKEND COMPONENTS

`app.py` exposes the local webcam (`/video`), remote webcam (`/remote-video`), and call control/status endpoints (`/call/host`, `/call/join`, `/call/end`, `/call/status`). `video.py` captures and JPEG-encodes the latest camera frame. `networking.py` exchanges length-prefixed JPEG frames over a bidirectional TCP socket.

---

## 5. RUNNING THE BACKEND SERVER

Ensure your virtual environment is active (`(venv)` prefix in terminal), then run:

```bash
python3 app.py
```
*or using uvicorn directly:*
```bash
uvicorn app:app --reload --port 8000
```

---

## 6. VERIFYING & TESTING ENDPOINTS

1. **Check Backend Status**:
   Open browser or run curl:
   ```bash
   curl http://localhost:8000/
   ```
   *Response:*
   ```json
    {"message": "Video call backend is running", "status": "active"}
   ```

2. **Test OpenCV Webcam Stream**:
   Open browser to:
   **[http://localhost:8000/video](http://localhost:8000/video)**

   You will see your live webcam feed served as an HTTP MJPEG stream.

---

## 7. CONNECTING TO REACT FRONTEND

1. In a separate terminal, start the React dev server:
   ```bash
   cd /home/student/CYQT/GUI_lab/gui_lab
   npm run dev
   ```
2. Open **[http://localhost:5173](http://localhost:5173)**.
3. Open the **Video Call** module.
4. Use **Host call** on the host PC or enter its IP and select **Join** on the client PC.
