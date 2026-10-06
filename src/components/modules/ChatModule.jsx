import { useState } from 'react';
import { 
  Plus, 
  Smile, 
  Paperclip, 
  Send, 
  ChevronDown,
  X,
  Copy
} from 'lucide-react';
import BreadcrumbHeader from '../BreadcrumbHeader';

export default function ChatModule({ onBack }) {
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'Matt Brewer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      text: "Here is a look at our team's priorities for the year:",
      card: { title: 'Sales team goals', subtitle: 'FY26' },
      reactions: ['👏 4', '➕'],
      time: '10:32 AM',
      repliesCount: 3
    },
    {
      id: 2,
      sender: 'Weekly team check-in',
      badge: 'WORKFLOW',
      text: 'Please post your weekly update in thread 🧵',
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
        sender: 'You',
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
      <BreadcrumbHeader onBack={onBack} title="Team Chat & Messaging" />

      {/* Main Slack-style Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Middle Main Chat Panel */}
        <div className="flex-1 flex flex-col border-r border-slate-800 bg-slate-900/50">
          <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2 cursor-pointer font-bold text-slate-100 text-base">
              <span># project-acme</span>
              <ChevronDown className="w-4 h-4 text-slate-400" />
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
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                        {msg.badge}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400">{msg.time}</span>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed mb-2">{msg.text}</p>

                  {msg.card && (
                    <div className="p-3 bg-slate-800/80 border border-slate-700/80 rounded-xl flex items-center gap-3 w-64 mb-3">
                      <div className="w-10 h-10 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                        📋
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-200 text-xs">{msg.card.title}</h4>
                        <span className="text-[11px] text-slate-400">{msg.card.subtitle}</span>
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
                        {msg.repliesCount} replies
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
                placeholder="Message #project-acme"
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
            <h3 className="font-bold text-slate-100 text-sm">Thread</h3>
            <div className="flex items-center gap-2 text-slate-400">
              <button className="hover:text-slate-200"><Copy className="w-4 h-4" /></button>
              <button className="hover:text-slate-200"><X className="w-4 h-4" /></button>
            </div>
          </div>

          <div className="p-4 border-b border-slate-800">
            <span className="text-xs text-slate-400 font-medium">3 replies</span>
          </div>

          <div className="flex-1 p-4 space-y-4 overflow-y-auto">
            <div className="flex gap-3">
              <img src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80" alt="Lisa" className="w-8 h-8 rounded-xl object-cover" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Lisa Dawson</h4>
                <div className="w-40 h-2 bg-slate-800 rounded mt-2"></div>
                <div className="w-24 h-2 bg-slate-800 rounded mt-1"></div>
              </div>
            </div>

            <div className="flex gap-3">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80" alt="Sara" className="w-8 h-8 rounded-xl object-cover" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Sara Parras</h4>
                <div className="w-44 h-2 bg-slate-800 rounded mt-2"></div>
                <div className="w-28 h-2 bg-slate-800 rounded mt-1"></div>
              </div>
            </div>

            <div className="flex gap-3">
              <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80" alt="Lee" className="w-8 h-8 rounded-xl object-cover" />
              <div>
                <h4 className="text-xs font-bold text-slate-200">Lee Hao</h4>
                <div className="w-36 h-2 bg-slate-800 rounded mt-2"></div>
                <div className="w-20 h-2 bg-slate-800 rounded mt-1"></div>
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-slate-800 bg-slate-950">
            <div className="border border-slate-800 rounded-xl p-2 flex items-center justify-between bg-slate-900">
              <input type="text" placeholder="Message thread" className="w-full text-xs focus:outline-none text-slate-200 bg-transparent placeholder:text-slate-500" />
              <button className="p-1 text-slate-400"><Send className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
