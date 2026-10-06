import { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  Monitor, 
  PhoneOff, 
  MessageSquare
} from 'lucide-react';
import BreadcrumbHeader from '../BreadcrumbHeader';

const participants = [
  { id: 1, name: 'Dr. Sarah Connor', role: 'Host', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80' },
  { id: 2, name: 'Alex Morgan', role: 'Participant', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80' },
  { id: 3, name: 'Lisa Dawson', role: 'Participant', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80' },
  { id: 4, name: 'Michael Chen', role: 'Participant', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80' },
];

export default function VideoConfModule({ onBack }) {
  const [micActive, setMicActive] = useState(true);
  const [camActive, setCamActive] = useState(true);
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Alex Morgan', text: 'Screen sharing looks very clear.', time: '10:45 AM' },
    { id: 2, sender: 'Lisa Dawson', text: 'Shall we proceed with section 2?', time: '10:46 AM' },
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages([
      ...messages,
      { id: Date.now(), sender: 'You', text: inputMsg, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
    ]);
    setInputMsg('');
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Breadcrumb Header */}
      <BreadcrumbHeader onBack={onBack} title="Video Conferencing Room" />

      {/* Main Conference View */}
      <div className="flex-1 flex overflow-hidden">
        {/* Active Main Speaker View */}
        <div className="flex-1 p-6 flex flex-col justify-between bg-slate-900/60 overflow-y-auto">
          <div className="relative w-full h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-slate-950 border border-slate-800">
            {camActive ? (
              <img 
                src={participants[0].avatar} 
                alt="Main Speaker" 
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-500 gap-2">
                <VideoOff className="w-12 h-12 text-slate-600" />
                <span className="text-xs font-semibold">Camera Off</span>
              </div>
            )}

            <div className="absolute bottom-4 left-4 bg-slate-950/80 backdrop-blur-md border border-slate-800 text-slate-200 px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              {participants[0].name} ({participants[0].role})
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 my-4">
            {participants.map((p) => (
              <div key={p.id} className="relative h-24 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
                <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
                <div className="absolute bottom-2 left-2 bg-slate-900/90 border border-slate-800 px-2 py-0.5 rounded-lg text-[10px] text-slate-200 font-semibold truncate max-w-[90%]">
                  {p.name}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-3 flex items-center justify-center gap-4 shadow-xl max-w-xl mx-auto">
            <button 
              onClick={() => setMicActive(!micActive)}
              className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-colors ${
                micActive ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-red-600 text-white'
              }`}
            >
              {micActive ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
              <span>{micActive ? 'Mute' : 'Unmute'}</span>
            </button>

            <button 
              onClick={() => setCamActive(!camActive)}
              className={`p-3 rounded-2xl text-xs font-bold flex items-center gap-2 transition-colors ${
                camActive ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-red-600 text-white'
              }`}
            >
              {camActive ? <VideoIcon className="w-4 h-4" /> : <VideoOff className="w-4 h-4" />}
              <span>{camActive ? 'Stop Video' : 'Start Video'}</span>
            </button>

            <button className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl text-xs font-bold flex items-center gap-2">
              <Monitor className="w-4 h-4" />
              <span>Share Screen</span>
            </button>

            <button className="p-3 bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30">
              <PhoneOff className="w-4 h-4" />
              <span>End Call</span>
            </button>
          </div>
        </div>

        {/* Right Meeting Chat */}
        <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col justify-between">
          <div className="p-4 border-b border-slate-800 font-bold text-slate-200 text-xs flex items-center justify-between">
            <span>In-Meeting Chat</span>
            <span className="text-[10px] text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{messages.length} messages</span>
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
                placeholder="Send a message"
                className="w-full text-xs text-slate-200 focus:outline-none bg-transparent px-2 placeholder:text-slate-500"
              />
              <button type="submit" className="p-1.5 bg-indigo-600 text-white rounded-xl">
                <MessageSquare className="w-3.5 h-3.5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
