import { useEffect, useState, useRef } from 'react';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Monitor, 
  PhoneOff, 
  MessageSquare, 
  ShieldCheck, 
  Hand, 
  Grid, 
  Server, 
  Activity, 
  Wifi, 
  Phone, 
  AlertCircle, 
  Maximize2,
  Move,
  Expand,
  Shrink,
  RotateCcw,
  Key,
  Lock
} from 'lucide-react';
import BreadcrumbHeader from '../BreadcrumbHeader';

const BACKEND_URL = 'http://localhost:8000';

export default function VideoConfModule({ connectedNode, onBack }) {
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [raisedHand, setRaisedHand] = useState(false);
  const [gridMode, setGridMode] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);
  const [focusedTile, setFocusedTile] = useState('remote');

  // Fit mode: 'contain' shows entire uncropped webcam (not too close), 'cover' fills entire box
  const [fitMode, setFitMode] = useState('contain');

  // Draggable PiP (Picture-in-Picture) state
  const [pipPosition, setPipPosition] = useState({ x: null, y: null, corner: 'top-right' });
  const [isDragging, setIsDragging] = useState(false);
  const stageRef = useRef(null);
  const pipRef = useRef(null);
  const dragStartRef = useRef({ mouseX: 0, mouseY: 0, startX: 0, startY: 0, stageWidth: 0, stageHeight: 0, pipWidth: 0, pipHeight: 0 });
  const hasDraggedRef = useRef(false);

  const [callStatus, setCallStatus] = useState({ status: 'idle' });
  const [hostAddress, setHostAddress] = useState('');
  const [localAddresses, setLocalAddresses] = useState([]);
  const [actionError, setActionError] = useState('');
  const [keys, setKeys] = useState([]);
  const [selectedKeyId, setSelectedKeyId] = useState(() => Number(sessionStorage.getItem('selectedKeyId')) || 1);

  const targetNodeName = connectedNode?.name || 'IIT Roorkee';
  const targetNodeIp = connectedNode?.ip || '192.168.1.101';
  const callStatusLabel = {
    idle: 'Not connected',
    starting: 'Starting call...',
    waiting: 'Waiting for participant',
    connecting: 'Connecting...',
    connected: `Connected${callStatus.peer ? ` · ${callStatus.peer}` : ''}`,
    disconnected: 'Call disconnected',
    error: 'Connection error',
  }[callStatus.status] || callStatus.status;

  const [messages, setMessages] = useState([
    { id: 1, sender: 'Call', text: 'Start or join a call to connect to another computer.', time: 'Ready' },
    { id: 2, sender: 'Call', text: 'Video is sent directly over your local network.', time: 'Ready' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  useEffect(() => {
    let isActive = true;
    const refreshStatus = async () => {
      try {
        const [statusResponse, infoResponse] = await Promise.all([
          fetch(`${BACKEND_URL}/call/status`),
          fetch(BACKEND_URL),
        ]);
        if (!statusResponse.ok || !infoResponse.ok) return;
        const status = await statusResponse.json();
        const info = await infoResponse.json();
        if (isActive) {
          setCallStatus(status);
          setLocalAddresses(info.local_addresses || []);
          setActionError('');
        }
      } catch {
        if (isActive) setActionError('Python backend is not reachable at localhost:8000.');
      }
    };

    const fetchKeys = async () => {
      try {
        const res = await fetch(`${BACKEND_URL}/api/qkd/keys`);
        if (res.ok) {
          const data = await res.json();
          if (data?.keys?.length && isActive) {
            setKeys(data.keys);
            if (!selectedKeyId || !data.keys.some(k => k.id === selectedKeyId)) {
              setSelectedKeyId(data.keys[0].id);
            }
          }
        }
      } catch {}
    };

    refreshStatus();
    fetchKeys();
    const timer = window.setInterval(refreshStatus, 1000);
    return () => {
      isActive = false;
      window.clearInterval(timer);
    };
  }, []);

  const handleDragStart = (e) => {
    if (e.button !== 0) return; // only left click
    if (!stageRef.current || !pipRef.current) return;

    const stageRect = stageRef.current.getBoundingClientRect();
    const pipRect = pipRef.current.getBoundingClientRect();

    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      startX: pipRect.left - stageRect.left,
      startY: pipRect.top - stageRect.top,
      stageWidth: stageRect.width,
      stageHeight: stageRect.height,
      pipWidth: pipRect.width,
      pipHeight: pipRect.height,
    };

    hasDraggedRef.current = false;
    setIsDragging(true);

    const handleMouseMove = (moveEvent) => {
      const deltaX = moveEvent.clientX - dragStartRef.current.mouseX;
      const deltaY = moveEvent.clientY - dragStartRef.current.mouseY;

      if (Math.hypot(deltaX, deltaY) > 4) {
        hasDraggedRef.current = true;
      }

      const minX = 8;
      const maxX = Math.max(minX, dragStartRef.current.stageWidth - dragStartRef.current.pipWidth - 8);
      const minY = 8;
      const maxY = Math.max(minY, dragStartRef.current.stageHeight - dragStartRef.current.pipHeight - 8);

      const newX = Math.max(minX, Math.min(maxX, dragStartRef.current.startX + deltaX));
      const newY = Math.max(minY, Math.min(maxY, dragStartRef.current.startY + deltaY));

      setPipPosition({ x: newX, y: newY, corner: 'custom' });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  const snapCorner = (corner) => {
    setPipPosition({ x: null, y: null, corner });
  };

  const startCall = async (endpoint, body) => {
    setActionError('');
    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: body ? JSON.stringify(body) : undefined,
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.detail || 'Could not start the call.');
      setCallStatus(result);
    } catch (error) {
      setActionError(error.message || 'Could not reach the Python backend.');
    }
  };

  const endCall = () => startCall('/call/end');
  const isInCall = ['starting', 'waiting', 'connecting', 'connected'].includes(callStatus.status);

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), sender: `You (${targetNodeName})`, text: inputMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputMsg('');
  };

  const cornerClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4',
  }[pipPosition.corner] || 'top-4 right-4';

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Breadcrumb Header */}
      <BreadcrumbHeader onBack={onBack} title={`Video Call — ${targetNodeName}`} />

      {/* Google Meet Top Navigation Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs backdrop-blur-md flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full border font-bold font-mono ${callStatus.status === 'connected' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-slate-800 text-slate-300 border-slate-700'}`}>
            <Wifi className="w-3.5 h-3.5" />
            <span>{callStatusLabel}</span>
          </div>
          <span className="text-slate-600">|</span>
          <span className="text-slate-300 font-semibold flex items-center gap-2">
            <span>SELECTED PEER: <strong className="text-indigo-400">{targetNodeName} ({targetNodeIp})</strong></span>
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* QKD Key Selector */}
          <div className="flex items-center gap-1.5 bg-slate-800/80 px-2.5 py-1 rounded-full border border-slate-700/80">
            <Key className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[10px] text-slate-400 font-bold uppercase">QKD Key:</span>
            <select
              value={selectedKeyId}
              onChange={(e) => {
                const kid = Number(e.target.value);
                setSelectedKeyId(kid);
                sessionStorage.setItem('selectedKeyId', kid);
              }}
              className="bg-transparent text-cyan-300 font-bold text-xs focus:outline-none cursor-pointer"
            >
              {keys.length > 0 ? (
                keys.map((k) => (
                  <option key={k.id} value={k.id} className="bg-slate-900 text-slate-200">
                    Key #{k.id} ({k.bit_length}b)
                  </option>
                ))
              ) : (
                <option value={1} className="bg-slate-900 text-slate-200">Key #1 (256b)</option>
              )}
            </select>
          </div>

          <button 
            onClick={() => setShowNetworkModal(!showNetworkModal)}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Wifi className={`w-3.5 h-3.5 ${callStatus.status === 'connected' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>LAN Call Setup</span>
          </button>

          <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30 font-bold flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            {callStatus.encrypted ? `AES-256-GCM (KEY #${callStatus.key_id || selectedKeyId})` : `QKD READY (KEY #${selectedKeyId})`}
          </span>
        </div>
      </div>

      {/* Network Setup Dropdown / Modal */}
      {showNetworkModal && (
        <div className="bg-slate-900 border-b border-slate-800 p-4 px-6 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn flex-shrink-0">
          <div className="flex items-center gap-3 flex-1 flex-wrap w-full sm:w-auto">
            <button
              type="button"
              onClick={() => startCall('/call/host', { key_id: Number(selectedKeyId) })}
              disabled={isInCall}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Phone className="w-3.5 h-3.5" /> Host P2P Call (Key #{selectedKeyId})
            </button>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                startCall('/call/join', { host: hostAddress.trim(), key_id: Number(selectedKeyId) });
              }}
              className="flex items-center gap-2 flex-1 max-w-md"
            >
              <input 
                type="text" 
                value={hostAddress}
                onChange={(e) => setHostAddress(e.target.value)}
                placeholder="Enter Remote Host IP (e.g. 192.168.43.50)"
                className="bg-slate-950 border border-slate-700 text-xs text-slate-200 px-3 py-2 rounded-xl flex-1 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button 
                type="submit"
                disabled={isInCall || !hostAddress.trim()}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                Join
              </button>
            </form>

            {targetNodeIp && (
              <button
                type="button"
                onClick={() => setHostAddress(targetNodeIp)}
                className="text-[11px] text-indigo-400 hover:text-indigo-300 underline font-mono cursor-pointer"
              >
                Use {targetNodeName} IP ({targetNodeIp})
              </button>
            )}
          </div>

          <div className="text-[11px] text-slate-400 font-mono flex items-center gap-3">
            <span>Your IP: <strong className="text-indigo-300">{localAddresses.join(', ') || 'localhost'}</strong></span>
          </div>
        </div>
      )}

      {(actionError || callStatus.error) && (
        <div className="flex items-center gap-2 border-b border-red-900/50 bg-red-950/40 px-6 py-2 text-xs text-red-200 flex-shrink-0">
          <AlertCircle className="h-4 w-4 shrink-0" /> {actionError || callStatus.error}
        </div>
      )}

      {/* Main Google Meet Video Canvas */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Stage Video Section */}
        <div className="flex-1 p-4 flex flex-col bg-slate-950 overflow-hidden min-h-0 justify-between">
          
          {/* Main Stage Video Canvas Container */}
          <div 
            ref={stageRef} 
            className="relative flex-1 w-full min-h-0 rounded-3xl overflow-hidden bg-slate-900/90 border border-slate-800 shadow-2xl flex items-center justify-center"
          >
            {(() => {
              const isRemoteConnected = callStatus.status === 'connected';

              const renderLocalTile = (isSmall = false, onTileClick = null) => {
                if (isSmall) {
                  return (
                    <div 
                      ref={pipRef}
                      style={pipPosition.x !== null ? { left: `${pipPosition.x}px`, top: `${pipPosition.y}px` } : undefined}
                      className={`absolute z-30 aspect-video w-52 sm:w-64 md:w-72 border-2 border-indigo-500/80 hover:border-indigo-400 bg-slate-950/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/90 overflow-hidden group select-none transition-shadow ${
                        pipPosition.x !== null ? '' : cornerClasses
                      } ${isDragging ? 'ring-2 ring-indigo-400 opacity-95' : ''}`}
                      onClick={() => {
                        if (hasDraggedRef.current) {
                          hasDraggedRef.current = false;
                          return;
                        }
                        if (onTileClick) onTileClick();
                      }}
                      title="Drag from header to move anywhere · Click to enlarge"
                    >
                      {/* Top PiP Header with Drag Handle & Clean Enlarge Button */}
                      <div 
                        onMouseDown={handleDragStart}
                        className="absolute top-0 inset-x-0 z-40 bg-gradient-to-b from-slate-950/85 to-transparent p-2 px-2.5 flex items-center justify-between cursor-grab active:cursor-grabbing text-slate-200 text-[10px] font-bold"
                      >
                        <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                          <Move className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="font-semibold tracking-tight">You</span>
                        </div>

                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onTileClick) onTileClick();
                          }}
                          className="p-1 rounded-md bg-slate-900/80 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          title="Click to enlarge"
                        >
                          <Maximize2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Video Stream Frame */}
                      <div className="w-full h-full flex items-center justify-center bg-black/90 relative overflow-hidden">
                        {camActive ? (
                          <img 
                            src={`${BACKEND_URL}/video`} 
                            alt="Your live webcam stream" 
                            draggable={false}
                            className={`w-full h-full select-none pointer-events-none transition-all duration-200 ${
                              fitMode === 'contain' ? 'object-contain' : 'object-cover'
                            }`}
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center space-y-2 bg-slate-900 w-full h-full p-2">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-lg">
                              IR
                            </div>
                            <span className="text-[10px] font-bold text-slate-400">Camera Off</span>
                          </div>
                        )}
                      </div>

                      {/* Bottom Info Pill */}
                      <div className="absolute bottom-2 left-2 z-20 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] font-bold text-slate-200 flex items-center gap-1 border border-white/10 pointer-events-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>You</span>
                        {!micActive && <MicOff className="w-2.5 h-2.5 text-red-400 ml-0.5" />}
                      </div>
                    </div>
                  );
                }

                // Full Main Stage Local Tile
                return (
                  <div className="w-full h-full relative rounded-3xl overflow-hidden bg-black/90 flex items-center justify-center">
                    {camActive ? (
                      <img 
                        src={`${BACKEND_URL}/video`} 
                        alt="Your live webcam stream" 
                        draggable={false}
                        className={`w-full h-full select-none transition-all duration-200 ${
                          fitMode === 'contain' ? 'object-contain' : 'object-cover'
                        }`}
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center space-y-3 bg-slate-900/90 w-full h-full p-4">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-2xl border-2 border-slate-700">
                          IR
                        </div>
                        <span className="text-xs font-bold text-slate-300">Camera Off</span>
                      </div>
                    )}

                    {/* Bottom Left Overlay Tag */}
                    <div className="absolute bottom-4 left-4 z-20 bg-slate-950/85 backdrop-blur-md border border-slate-800 text-slate-200 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>You ({targetNodeName} Gateway)</span>
                      <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30 ml-1">
                        {callStatus.encrypted ? `AES-256-GCM (KEY #${callStatus.key_id || selectedKeyId})` : `Webcam Feed (Key #${selectedKeyId})`}
                      </span>
                      {!micActive && (
                        <MicOff className="w-3.5 h-3.5 text-red-400 ml-1" />
                      )}
                    </div>
                  </div>
                );
              };

              const renderRemoteTile = (isSmall = false, onTileClick = null) => {
                if (isSmall) {
                  return (
                    <div 
                      ref={pipRef}
                      style={pipPosition.x !== null ? { left: `${pipPosition.x}px`, top: `${pipPosition.y}px` } : undefined}
                      className={`absolute z-30 aspect-video w-52 sm:w-64 md:w-72 border-2 border-indigo-500/80 hover:border-indigo-400 bg-slate-950/95 backdrop-blur-md rounded-2xl shadow-2xl shadow-black/90 overflow-hidden group select-none transition-shadow ${
                        pipPosition.x !== null ? '' : cornerClasses
                      } ${isDragging ? 'ring-2 ring-indigo-400 opacity-95' : ''}`}
                      onClick={() => {
                        if (hasDraggedRef.current) {
                          hasDraggedRef.current = false;
                          return;
                        }
                        if (onTileClick) onTileClick();
                      }}
                      title="Drag from header to move anywhere · Click to enlarge"
                    >
                      {/* Top PiP Header with Drag Handle & Clean Enlarge Button */}
                      <div 
                        onMouseDown={handleDragStart}
                        className="absolute top-0 inset-x-0 z-40 bg-gradient-to-b from-slate-950/85 to-transparent p-2 px-2.5 flex items-center justify-between cursor-grab active:cursor-grabbing text-slate-200 text-[10px] font-bold"
                      >
                        <div className="flex items-center gap-1.5 opacity-90 group-hover:opacity-100">
                          <Move className="w-3.5 h-3.5 text-indigo-400" />
                          <span className="font-semibold tracking-tight">Remote</span>
                        </div>

                        <button 
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onTileClick) onTileClick();
                          }}
                          className="p-1 rounded-md bg-slate-900/80 hover:bg-indigo-600 text-slate-300 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                          title="Click to enlarge"
                        >
                          <Maximize2 className="w-3 h-3" />
                        </button>
                      </div>

                      {/* Video Stream Frame */}
                      <div className="w-full h-full flex items-center justify-center bg-black/90 relative overflow-hidden">
                        <img 
                          src={`${BACKEND_URL}/remote-video`} 
                          alt="Remote Participant Feed" 
                          draggable={false}
                          className={`w-full h-full select-none pointer-events-none transition-all duration-200 ${
                            fitMode === 'contain' ? 'object-contain' : 'object-cover'
                          }`}
                        />
                      </div>

                      {/* Bottom Info Pill */}
                      <div className="absolute bottom-2 left-2 z-20 bg-slate-950/80 backdrop-blur-md px-2 py-0.5 rounded-lg text-[9px] font-bold text-slate-200 flex items-center gap-1 border border-white/10 pointer-events-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        <span>Remote</span>
                      </div>
                    </div>
                  );
                }

                // Full Main Stage Remote Tile
                return (
                  <div className="w-full h-full relative rounded-3xl overflow-hidden bg-black/90 flex items-center justify-center">
                    <img 
                      src={`${BACKEND_URL}/remote-video`} 
                      alt="Remote Participant Feed" 
                      draggable={false}
                      className={`w-full h-full select-none transition-all duration-200 ${
                        fitMode === 'contain' ? 'object-contain' : 'object-cover'
                      }`}
                    />

                    {/* Bottom Left Overlay Tag */}
                    <div className="absolute bottom-4 left-4 z-20 bg-slate-950/85 backdrop-blur-md border border-slate-800 text-slate-200 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                      <span>Remote · {callStatus.peer || targetNodeName}</span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30 ml-1">
                        {callStatus.encrypted ? `DECRYPTED (KEY #${callStatus.key_id || selectedKeyId})` : 'Connected'}
                      </span>
                    </div>
                  </div>
                );
              };

              // CASE 1: Remote is NOT connected (alone, waiting, or remote left) -> Only Local feed rendered full screen
              if (!isRemoteConnected) {
                return (
                  <div className="relative w-full h-full flex items-center justify-center overflow-hidden">
                    {renderLocalTile(false)}

                    {/* Clean status overlay pill when waiting */}
                    {callStatus.status === 'waiting' && (
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 backdrop-blur-md border border-indigo-500/30 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                        <span className="text-xs text-slate-200 font-medium">
                          Waiting for participant to join... Host IP: <strong className="text-indigo-400 font-mono">{localAddresses[0] || 'localhost'}</strong>
                        </span>
                      </div>
                    )}

                    {/* Clean status overlay pill when connecting */}
                    {callStatus.status === 'connecting' && (
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 backdrop-blur-md border border-indigo-500/30 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-pulse">
                        <Activity className="w-4 h-4 text-indigo-400 animate-spin" />
                        <span className="text-xs text-slate-200 font-medium">
                          Connecting to <strong className="text-indigo-400 font-mono">{hostAddress || targetNodeIp}</strong>...
                        </span>
                      </div>
                    )}

                    {/* Clean status overlay pill when remote left/disconnected */}
                    {callStatus.status === 'disconnected' && (
                      <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 bg-slate-900/95 backdrop-blur-md border border-amber-500/40 px-5 py-2.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-fadeIn">
                        <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                        <span className="text-xs text-slate-200 font-medium">
                          Remote participant left the meeting
                        </span>
                        <button 
                          onClick={() => setShowNetworkModal(true)}
                          className="px-2.5 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-all ml-1"
                        >
                          Reconnect
                        </button>
                      </div>
                    )}
                  </div>
                );
              }

              // CASE 2: Remote IS connected & Grid Mode is ON -> Both tiles side-by-side
              if (gridMode) {
                return (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full h-full p-2">
                    {renderRemoteTile(false)}
                    {renderLocalTile(false)}
                  </div>
                );
              }

              // CASE 3: Remote IS connected & Speaker Mode (Default) -> Main stage + Draggable PiP
              return (
                <div className="relative w-full h-full overflow-hidden">
                  {focusedTile === 'remote' ? (
                    <>
                      {/* Remote is Main Stage */}
                      {renderRemoteTile(false)}
                      {/* Local is Draggable PiP: Clicking swaps focus to Local */}
                      {renderLocalTile(true, () => setFocusedTile('local'))}
                    </>
                  ) : (
                    <>
                      {/* Local is Main Stage */}
                      {renderLocalTile(false)}
                      {/* Remote is Draggable PiP: Clicking swaps focus to Remote */}
                      {renderRemoteTile(true, () => setFocusedTile('remote'))}
                    </>
                  )}
                </div>
              );
            })()}
          </div>

          {/* Floating Google Meet Bottom Control Pill Bar */}
          <div className="mt-3 bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl p-2.5 flex items-center justify-between shadow-2xl max-w-2xl mx-auto w-full px-6 flex-shrink-0">
            <div className="flex items-center gap-2.5">
              <button 
                onClick={() => setMicActive(!micActive)}
                className={`p-3 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
                  micActive ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-red-600 text-white'
                }`}
                title={micActive ? 'Mute Microphone' : 'Unmute Microphone'}
              >
                {micActive ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
              </button>

              <button 
                onClick={() => setCamActive(!camActive)}
                className={`p-3 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
                  camActive ? 'bg-slate-800 hover:bg-slate-700 text-slate-200' : 'bg-red-600 text-white'
                }`}
                title={camActive ? 'Stop Video' : 'Start Video'}
              >
                {camActive ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
              </button>

              <button 
                onClick={() => setRaisedHand(!raisedHand)}
                className={`p-3 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
                  raisedHand ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title="Raise Hand"
              >
                <Hand className="w-5 h-5" />
              </button>

              <button 
                onClick={() => setGridMode(!gridMode)}
                className={`p-3 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
                  gridMode ? 'bg-indigo-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                }`}
                title="Toggle Grid View"
              >
                <Grid className="w-5 h-5" />
              </button>

              {/* Fit vs Fill / Zoom Toggle */}
              <button 
                onClick={() => setFitMode(fitMode === 'contain' ? 'cover' : 'contain')}
                className={`p-3 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer ${
                  fitMode === 'contain' 
                    ? 'bg-slate-800 hover:bg-slate-700 text-indigo-400 border border-indigo-500/30' 
                    : 'bg-indigo-600 text-white'
                }`}
                title={fitMode === 'contain' ? 'Current: Full View (Fit - not cropped). Click to Fill/Zoom' : 'Current: Fill/Zoom. Click for Full View (Fit)'}
              >
                {fitMode === 'contain' ? <Shrink className="w-5 h-5" /> : <Expand className="w-5 h-5" />}
              </button>

              {/* Reset PiP Position Button */}
              {callStatus.status === 'connected' && !gridMode && (
                <button 
                  onClick={() => snapCorner('top-right')}
                  className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-full text-xs font-bold transition-all shadow-md cursor-pointer"
                  title="Reset Small Window Position to Top-Right"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              )}

              <button 
                onClick={() => setShowNetworkModal(!showNetworkModal)}
                className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer"
                title="P2P Network Setup"
              >
                <Wifi className="w-5 h-5 text-indigo-400" />
              </button>
            </div>

            <button 
              onClick={endCall}
              className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
              <span>Leave Call</span>
            </button>
          </div>
        </div>

        {/* Right Google Meet Chat & Participants Panel */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col justify-between">
          <div className="p-4 border-b border-slate-800 font-bold text-slate-200 text-xs flex items-center justify-between bg-slate-950">
            <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-indigo-400" /> Meeting Chat</span>
            <span className="text-[10px] text-slate-400 bg-slate-800 border border-slate-700 px-2 py-0.5 rounded-full font-mono font-bold">Local only</span>
          </div>

          <div className="flex-1 p-4 overflow-y-auto space-y-3">
            {messages.map((m) => (
              <div key={m.id} className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800/80 space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-slate-200">{m.sender}</span>
                  <span className="text-slate-500">{m.time}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{m.text}</p>
              </div>
            ))}
          </div>

          <form onSubmit={handleSend} className="p-4 border-t border-slate-800 bg-slate-950">
            <div className="border border-slate-800 rounded-2xl p-2 flex items-center justify-between bg-slate-900">
              <input 
                type="text" 
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder="Send message to call"
                className="w-full text-xs text-slate-200 focus:outline-none bg-transparent px-2 placeholder:text-slate-500"
              />
              <button type="submit" className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl cursor-pointer">
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

