import { useEffect, useState } from 'react';
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
  AlertCircle
} from 'lucide-react';
import BreadcrumbHeader from '../BreadcrumbHeader';

const BACKEND_URL = 'http://localhost:8000';

export default function VideoConfModule({ connectedNode, onBack }) {
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [raisedHand, setRaisedHand] = useState(false);
  const [gridMode, setGridMode] = useState(false);
  const [showNetworkModal, setShowNetworkModal] = useState(false);

  const [callStatus, setCallStatus] = useState({ status: 'idle' });
  const [hostAddress, setHostAddress] = useState('');
  const [localAddresses, setLocalAddresses] = useState([]);
  const [actionError, setActionError] = useState('');

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

    refreshStatus();
    const timer = window.setInterval(refreshStatus, 1000);
    return () => {
      isActive = false;
      window.clearInterval(timer);
    };
  }, []);

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

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Breadcrumb Header */}
      <BreadcrumbHeader onBack={onBack} title={`Video Call — ${targetNodeName}`} />

      {/* Google Meet Top Navigation Bar */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs backdrop-blur-md">
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
          <button 
            onClick={() => setShowNetworkModal(!showNetworkModal)}
            className="px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Wifi className={`w-3.5 h-3.5 ${callStatus.status === 'connected' ? 'text-emerald-400' : 'text-slate-400'}`} />
            <span>LAN Call Setup</span>
          </button>

          <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> PYTHON VIDEO
          </span>
        </div>
      </div>

      {/* Network Setup Dropdown / Modal */}
      {showNetworkModal && (
        <div className="bg-slate-900 border-b border-slate-800 p-4 px-6 flex items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-3 flex-1">
            <button
              type="button"
              onClick={() => startCall('/call/host')}
              disabled={isInCall}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg"
            >
              <Phone className="w-3.5 h-3.5" /> Host P2P Call
            </button>

            <form 
              onSubmit={(e) => {
                e.preventDefault();
                startCall('/call/join', { host: hostAddress });
              }}
              className="flex items-center gap-2 flex-1 max-w-md"
            >
              <input 
                type="text"
                value={hostAddress}
                onChange={(e) => setHostAddress(e.target.value)}
                placeholder="Enter Remote Host IP (e.g. 192.168.1.20)"
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
          </div>

          <div className="text-[11px] text-slate-400 font-mono">
            <span>Your IP: <strong className="text-indigo-300">{localAddresses.join(', ') || 'localhost'}</strong></span>
          </div>
        </div>
      )}

      {(actionError || callStatus.error) && (
        <div className="flex items-center gap-2 border-b border-red-900/50 bg-red-950/40 px-6 py-2 text-xs text-red-200">
          <AlertCircle className="h-4 w-4 shrink-0" /> {actionError || callStatus.error}
        </div>
      )}

      {/* Main Google Meet Video Canvas */}
      <div className="flex-1 flex overflow-hidden">
        {/* Stage Video Section */}
        <div className="flex-1 p-5 flex flex-col justify-between bg-slate-950 overflow-y-auto">
          
          {/* Speaker view by default; the grid control switches to equal participant tiles. */}
          <div className={`relative flex-1 min-h-[340px] ${gridMode ? 'grid grid-cols-2 gap-4' : ''}`}>
            
            {/* Local Speaker Tile (You / OpenCV Feed) */}
            <div className={`relative rounded-2xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-700 flex items-center justify-center ${gridMode ? 'min-h-[340px]' : 'absolute right-4 top-4 z-10 aspect-video w-40 sm:w-52 xl:w-64 border-2'}`}>
              {camActive ? (
                <img 
                  src={`${BACKEND_URL}/video`} 
                  alt="Your live webcam stream" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-3 bg-slate-900/90 w-full h-full">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-black text-2xl shadow-2xl border-2 border-slate-700">
                    IR
                  </div>
                  <span className="text-xs font-bold text-slate-300">Local Camera Turn Off</span>
                </div>
              )}

              {/* Bottom Left Google Meet Name Overlay Tag */}
              <div className="absolute bottom-4 left-4 bg-slate-950/85 backdrop-blur-md border border-slate-800 text-slate-200 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>You ({targetNodeName} Gateway)</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30 ml-2">
                  OpenCV Feed
                </span>
              </div>
            </div>

            {/* Remote Participant Tile (P2P Remote Node Stream) */}
            <div className={`relative rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 flex items-center justify-center ${gridMode ? 'min-h-[340px]' : 'h-full min-h-[340px]'}`}>
              {callStatus.status === 'connected' ? (
                <img 
                  src={`${BACKEND_URL}/remote-video`}
                  alt="Remote Participant Feed" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-center space-y-3 p-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-900 to-slate-900 border border-indigo-500/30 flex items-center justify-center text-indigo-300 font-black text-2xl shadow-xl">
                    IB
                  </div>
                  <div>
                      <h3 className="font-bold text-slate-200 text-base">Remote participant</h3>
                    <p className="text-xs text-slate-400 mt-1 font-mono">
                      {callStatus.status === 'waiting' ? 'Waiting for the other computer to join...' : callStatus.status === 'connecting' ? 'Connecting to host...' : 'Start a call or join by IP address'}
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-300 text-[10px] font-mono font-bold border border-indigo-500/20 flex items-center gap-1.5">
                    <Activity className="w-3 h-3 animate-pulse text-emerald-400" /> {callStatusLabel}
                  </span>
                </div>
              )}

              <div className="absolute bottom-4 left-4 bg-slate-950/85 backdrop-blur-md border border-slate-800 text-slate-200 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-xl">
                <span className={`w-2.5 h-2.5 rounded-full ${callStatus.status === 'connected' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
                <span>{callStatus.status === 'connected' ? `Remote · ${callStatus.peer || hostAddress}` : 'Remote participant'}</span>
              </div>
            </div>

          </div>

          {/* Floating Google Meet Bottom Control Pill Bar */}
          <div className="mt-4 bg-slate-900/90 border border-slate-800 backdrop-blur-xl rounded-2xl p-3 flex items-center justify-between shadow-2xl max-w-2xl mx-auto w-full px-6">
            <div className="flex items-center gap-3">
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

