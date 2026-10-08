import { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Monitor, 
  PhoneOff, 
  MessageSquare,
  ShieldCheck,
  Lock,
  Hand,
  Grid,
  Server,
  Activity,
  Radio,
  Cpu
} from 'lucide-react';
import BreadcrumbHeader from '../BreadcrumbHeader';

const nodeParticipants = [
  { id: 1, name: 'You (Local OpenCV Feed)', node: 'IIT Roorkee Gateway', status: 'Live Webcam Stream', isLocal: true, code: 'IR' },
  { id: 2, name: 'IISER Bhopal Node', node: 'SimulaQron Connected', status: 'BB84 Key Active', isLocal: false, code: 'IB' },
  { id: 3, name: 'IISc Bangalore Node', node: 'QKD Channel Sync', status: '256-Bit Encrypted', isLocal: false, avatar: false, code: 'IS' },
  { id: 4, name: 'IIT Delhi Node', node: 'Quantum Gateway', status: 'Signal 0.4ms', isLocal: false, avatar: false, code: 'ID' },
];

export default function VideoConfModule({ connectedNode, onBack }) {
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [raisedHand, setRaisedHand] = useState(false);
  const [gridMode, setGridMode] = useState(false);
  const targetNodeName = connectedNode?.name || 'IIT Roorkee';
  const targetNodeIp = connectedNode?.ip || '192.168.1.101';
  
  const [messages, setMessages] = useState([
    { id: 1, sender: `${targetNodeName} Node`, text: 'Quantum channel encryption key exchange (BB84) completed successfully.', time: '10:45 AM' },
    { id: 2, sender: 'Local OpenCV Gateway', text: 'Live OpenCV camera stream resolution is optimal.', time: '10:46 AM' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

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
      <BreadcrumbHeader onBack={onBack} title={`Quantum Encrypted Video Meeting — ${targetNodeName}`} />

      {/* Google Meet Top Bar Info */}
      <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-2.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-bold font-mono">
            <Lock className="w-3.5 h-3.5" />
            <span>256-BIT QKD ENCRYPTED STREAM</span>
          </div>
          <span className="text-slate-400">|</span>
          <span className="text-slate-300 font-semibold">SESSION CONNECTED PEER: <strong className="text-indigo-400">{targetNodeName} ({targetNodeIp})</strong></span>
        </div>

        <div className="flex items-center gap-2">
          <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30 font-bold flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" /> SIMULAQRON BACKEND ACTIVE
          </span>
        </div>
      </div>

      {/* Main Conference View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Main Video Section */}
        <div className="flex-1 p-5 flex flex-col justify-between bg-slate-950 overflow-y-auto">
          
          {/* Main Speaker / Grid Container */}
          {!gridMode ? (
            <div className="relative w-full flex-1 rounded-3xl overflow-hidden shadow-2xl bg-slate-900 border border-slate-800 min-h-[360px] flex items-center justify-center">
              {camActive ? (
                <img 
                  src="http://localhost:8000/video" 
                  alt="OpenCV Camera Feed" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-3 bg-slate-900/90">
                  <div className="w-20 h-20 rounded-3xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center border border-indigo-500/30 font-bold text-2xl shadow-xl">
                    <Server className="w-10 h-10" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-sm font-bold text-slate-200">Local Camera Standby</h3>
                    <span className="text-xs text-slate-500 font-mono">OpenCV Stream Offline</span>
                  </div>
                </div>
              )}

              {/* Floating Google Meet Participant Tag */}
              <div className="absolute bottom-4 left-4 bg-slate-950/85 backdrop-blur-md border border-slate-800 text-slate-200 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>{nodeParticipants[0].name}</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30 ml-2">
                  OpenCV Live Stream
                </span>
              </div>

              {/* Picture-in-Picture Quantum Node Cards (No Static Photos) */}
              <div className="absolute top-4 right-4 flex flex-col gap-2">
                {nodeParticipants.slice(1).map((p) => (
                  <div key={p.id} className="relative w-44 h-24 rounded-2xl overflow-hidden border border-slate-700/80 bg-slate-950/90 shadow-2xl p-3 flex flex-col justify-between group">
                    <div className="flex items-center justify-between">
                      <div className="w-7 h-7 rounded-lg bg-indigo-600/30 text-indigo-300 flex items-center justify-center font-black text-xs border border-indigo-500/30">
                        {p.code}
                      </div>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-mono font-bold flex items-center gap-1 border border-emerald-500/20">
                        <Radio className="w-2.5 h-2.5 animate-pulse" /> LIVE
                      </span>
                    </div>

                    <div>
                      <h4 className="text-[11px] font-bold text-slate-100 truncate">{p.name}</h4>
                      <span className="text-[9px] text-slate-400 font-mono block">{p.node}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            /* Google Meet Grid View (No Static Photos) */
            <div className="grid grid-cols-2 gap-4 flex-1">
              {nodeParticipants.map((p) => (
                <div key={p.id} className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-xl flex items-center justify-center p-6">
                  {p.isLocal && camActive ? (
                    <img 
                      src="http://localhost:8000/video" 
                      alt="OpenCV Feed" 
                      className="w-full h-full object-cover absolute inset-0"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center space-y-3">
                      <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-900 to-slate-900 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-black text-xl shadow-xl">
                        <Cpu className="w-8 h-8 text-indigo-400" />
                      </div>
                      <div>
                        <h3 className="font-bold text-slate-100 text-sm">{p.name}</h3>
                        <span className="text-xs text-indigo-400 font-mono">{p.node}</span>
                      </div>
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-mono font-bold border border-emerald-500/20 flex items-center gap-1">
                        <Activity className="w-3 h-3 animate-pulse" /> {p.status}
                      </span>
                    </div>
                  )}

                  <div className="absolute bottom-3 left-3 bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                    <span>{p.name}</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Google Meet Bottom Floating Control Toolbar */}
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

              <button className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-full text-xs font-bold transition-all shadow-md cursor-pointer" title="Share Screen">
                <Monitor className="w-5 h-5" />
              </button>
            </div>

            <button className="px-6 py-3 bg-red-600 hover:bg-red-500 text-white rounded-full font-bold text-xs flex items-center gap-2 shadow-lg shadow-red-600/30 cursor-pointer">
              <PhoneOff className="w-4 h-4" />
              <span>Leave Meeting</span>
            </button>
          </div>
        </div>

        {/* Right Meeting Chat Panel */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col justify-between">
          <div className="p-4 border-b border-slate-800 font-bold text-slate-200 text-xs flex items-center justify-between bg-slate-950">
            <span className="flex items-center gap-1.5"><MessageSquare className="w-4 h-4 text-indigo-400" /> In-Meeting Chat</span>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-mono font-bold">QKD Encrypted</span>
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
                placeholder="Send a message to meeting"
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
