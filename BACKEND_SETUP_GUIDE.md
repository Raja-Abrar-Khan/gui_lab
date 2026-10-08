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

---

## 🐍 3. PYTHON BACKEND CODE EXPLANATION (`app.py`)

Below is the implementation in `backend/app.py`:

```python
import cv2
from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Quantum GUI - OpenCV Video Backend")

# Allow React frontend (localhost:5173) to communicate with Python backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_frames():
    """Captures webcam frames using OpenCV and yields MJPEG stream."""
    camera = cv2.VideoCapture(0)
    try:
        while True:
            success, frame = camera.read()
            if not success:
                break
            # Encode frame to JPEG
            success, buffer = cv2.imencode(".jpg", frame)
            if not success:
                continue
            frame_bytes = buffer.tobytes()
            yield (
                b"--frame\r\n"
                b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n"
            )
    finally:
        camera.release()

@app.get("/")
def read_root():
    """Health check endpoint."""
    return {"message": "OpenCV backend is running", "status": "active"}

@app.get("/video")
def video_feed():
    """Serves real-time webcam video stream for React frontend <img src>."""
    return StreamingResponse(
        generate_frames(),
        media_type="multipart/x-mixed-replace; boundary=frame"
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

---

## 🚀 4. RUNNING THE BACKEND SERVER

Ensure your virtual environment is active (`(venv)` prefix in terminal), then run:

```bash
python app.py
```
*or using uvicorn directly:*
```bash
uvicorn app:app --reload --port 8000
```

---

## 🧪 5. VERIFYING & TESTING ENDPOINTS

1. **Check Backend Status**:
   Open browser or run curl:
   ```bash
   curl http://localhost:8000/
   ```
   *Response:*
   ```json
   {"message": "OpenCV backend is running", "status": "active"}
   ```

2. **Test OpenCV Webcam Stream**:
   Open browser to:
   **[http://localhost:8000/video](http://localhost:8000/video)**

   You will see your live webcam feed served as an HTTP MJPEG stream.

---

## ⚛️ 6. CONNECTING TO REACT FRONTEND

1. In a separate terminal, start the React dev server:
   ```bash
   cd /home/student/CYQT/GUI_lab/gui_lab
   npm run dev
   ```
2. Open **[http://localhost:5173](http://localhost:5173)**.
3. Open the **Video Call** module.
4. Click **Start Video**. The React component loads `<img src="http://localhost:8000/video" />` rendering the OpenCV feed inside the Google Meet UI.

---

## 🔮 7. FUTURE SIMULAQRON INTEGRATION ARCHITECTURE

```
                    React GUI (Port 5173)
                              │
                              ▼
                   Python FastAPI (Port 8000)
                    /                    \
                   /                      \
                  ▼                        ▼
           OpenCV Video Module      SimulaQron Engine
           (Webcam / Frames)       (Quantum Communication)
```

When you add SimulaQron later:
1. Install SimulaQron inside the backend virtual environment: `pip install simulaqron`.
2. Add quantum network endpoints to `app.py` (e.g. `POST /api/quantum/simulate`).
3. Keep OpenCV video streaming and SimulaQron quantum logic as decoupled modules inside `backend/`.
