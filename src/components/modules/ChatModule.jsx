import { useState } from 'react';
import { 
  Plus, 
  Smile, 
  Paperclip, 
  Send, 
  ChevronDown,
  X,
  Copy,
  Hash,
  Server,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import BreadcrumbHeader from '../BreadcrumbHeader';

const quantumNodes = [
  { id: 'iiser-bhopal', name: 'IISER Bhopal', channel: '#iiser-bhopal', ip: '192.168.1.104', status: 'Active Link' },
  { id: 'iit-roorkee', name: 'IIT Roorkee', channel: '#iit-roorkee', ip: '192.168.1.101', status: 'Connected' },
  { id: 'iisc-bangalore', name: 'IISc Bangalore', channel: '#iisc-bangalore', ip: '192.168.1.105', status: 'Idle' },
  { id: 'iit-delhi', name: 'IIT Delhi', channel: '#iit-delhi', ip: '192.168.1.108', status: 'Idle' },
  { id: 'iit-jammu', name: 'IIT Jammu', channel: '#iit-jammu', ip: '192.168.1.112', status: 'Idle' },
];

export default function ChatModule({ onBack }) {
  const [activeNode, setActiveNode] = useState(quantumNodes[0]);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'IISER Bhopal Quantum Node',
      badge: 'QKD NODE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: "SimulaQron BB84 key exchange complete with 256-bit secret key. Channel QBER is 2.18%.",
      card: { title: 'DB Key #2 Generated', subtitle: 'Protocol: BB84 | Bits: 256' },
      reactions: ['🔐 Active Key', '✅ Verified'],
      time: '10:32 AM',
      repliesCount: 3
    },
    {
      id: 2,
      sender: 'IIT Roorkee Gateway',
      badge: 'GATEWAY',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      text: 'Encrypted P2P channel established. Ready for OpenCV video conference stream.',
      repliesAvatars: [
        'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
      ],
      time: '11:15 AM',
      repliesCount: 3
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');

  const handleSend = (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        sender: 'You (Local Node)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
        text: inputMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        repliesCount: 0
      }
    ]);
    setInputMsg('');
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Breadcrumb Header */}
      <BreadcrumbHeader onBack={onBack} title="Quantum Nodes Chat & Messaging" />

      {/* Main Slack-style Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Quantum Channels Sidebar */}
        <div className="w-64 bg-slate-950 border-r border-slate-800 p-4 space-y-4">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">Quantum Nodes Channels</span>
            <div className="space-y-1">
              {quantumNodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => setActiveNode(node)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-bold transition-all ${
                    activeNode.id === node.id 
                      ? 'bg-indigo-600/30 border border-indigo-500/50 text-indigo-300' 
                      : 'text-slate-400 hover:bg-slate-900 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <Hash className="w-4 h-4 text-indigo-400" />
                    <span>{node.id}</span>
                  </div>
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Middle Main Chat Panel */}
        <div className="flex-1 flex flex-col border-r border-slate-800 bg-slate-900/50">
          <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between flex-shrink-0 bg-slate-950">
            <div className="flex items-center gap-3 font-bold text-slate-100 text-base">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Server className="w-4 h-4" /> {activeNode.channel}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> CONNECTED: {activeNode.name} ({activeNode.ip})
              </span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => (
              <div key={msg.id} className="flex gap-4 group">
                <img 
                  src={msg.avatar} 
                  alt={msg.sender}
                  className="w-10 h-10 rounded-xl object-cover flex-shrink-0 mt-0.5"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-slate-100 text-sm">{msg.sender}</span>
                    {msg.badge && (
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/30 font-mono">
                        {msg.badge}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400">{msg.time}</span>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed mb-2">{msg.text}</p>

                  {msg.card && (
                    <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl flex items-center gap-3 w-72 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                        <ShieldCheck className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200 text-xs">{msg.card.title}</h4>
                        <span className="text-[11px] text-slate-400 font-mono">{msg.card.subtitle}</span>
                      </div>
                    </div>
                  )}

                  {msg.reactions && (
                    <div className="flex items-center gap-1.5 mb-2">
                      {msg.reactions.map((r, i) => (
                        <button key={i} className="px-2 py-1 bg-slate-800 border border-slate-700 text-slate-300 rounded-full text-xs hover:bg-slate-700 transition-colors">
                          {r}
                        </button>
                      ))}
                    </div>
                  )}

                  {msg.repliesCount > 0 && (
                    <div className="flex items-center gap-2 mt-2 cursor-pointer">
                      <div className="flex -space-x-1">
                        {msg.repliesAvatars?.map((url, i) => (
                          <img key={i} src={url} alt="reply" className="w-5 h-5 rounded-full border border-slate-900 object-cover" />
                        ))}
                      </div>
                      <span className="text-xs font-bold text-indigo-400 hover:underline">
                        {msg.repliesCount} node replies
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-slate-800 bg-slate-950/60">
            <form onSubmit={handleSend} className="border border-slate-800 rounded-2xl p-2 bg-slate-900">
              <input 
                type="text" 
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder={`Send encrypted message to ${activeNode.name}...`}
                className="w-full px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none bg-transparent"
              />
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 px-2 text-slate-400">
                <div className="flex items-center gap-3">
                  <button type="button" className="hover:text-slate-200"><Plus className="w-4 h-4" /></button>
                  <button type="button" className="hover:text-slate-200"><Smile className="w-4 h-4" /></button>
                  <button type="button" className="hover:text-slate-200"><Paperclip className="w-4 h-4" /></button>
                </div>
                <button type="submit" className="p-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg">
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Thread Side Panel */}
        <div className="w-80 flex flex-col bg-slate-900/80 border-l border-slate-800">
          <div className="h-14 border-b border-slate-800 px-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm">Node Thread</h3>
            <div className="flex items-center gap-2 text-slate-400">
              <button className="hover:text-slate-200"><Copy className="w-4 h-4" /></button>
              <button className="hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="p-4 border-b border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Active Quantum Peers</span>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="flex gap-3 items-center">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                IB
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">IISER Bhopal Node</h4>
                <span className="text-[10px] text-emerald-400 font-mono">SimulaQron Connected</span>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                IR
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">IIT Roorkee Node</h4>
                <span className="text-[10px] text-emerald-400 font-mono">OpenCV Feed Active</span>
              </div>
            </div>

            <div className="flex gap-3 items-center">
              <div className="w-9 h-9 rounded-xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold text-xs border border-indigo-500/30">
                ID
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">IIT Delhi Node</h4>
                <span className="text-[10px] text-slate-400 font-mono">Standby Mode</span>
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-slate-800 bg-slate-950">
            <div className="border border-slate-800 rounded-xl p-2 flex items-center justify-between bg-slate-900">
              <input type="text" placeholder="Message node thread..." className="w-full text-xs focus:outline-none text-slate-200 bg-transparent placeholder:text-slate-500" />
              <button className="p-1 text-slate-400"><Send className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

