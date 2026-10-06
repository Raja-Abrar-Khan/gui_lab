import { useState } from 'react';
import { 
  Inbox, 
  Send, 
  FileText, 
  Trash2, 
  Plus, 
  X,
  Minimize2,
  Maximize2
} from 'lucide-react';
import BreadcrumbHeader from '../BreadcrumbHeader';

const emails = [
  { id: 1, sender: 'Team Updates', subject: 'Weekly Project Sync', snippet: 'Here are the notes from the last sync session...', date: '10:30 AM', read: false },
  { id: 2, sender: 'Client Service', subject: 'Invoice #4023', snippet: 'Please find attached invoice for review...', date: 'Yesterday', read: true },
  { id: 3, sender: 'Newsletter', subject: 'Top Design Trends', snippet: 'Check out what is new in modern web design...', date: 'Oct 24', read: true },
];

export default function EmailModule({ onBack }) {
  const [selectedMail, setSelectedMail] = useState(emails[0]);
  const [showComposeModal, setShowComposeModal] = useState(true);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans relative overflow-hidden">
      {/* Breadcrumb Header */}
      <BreadcrumbHeader onBack={onBack} title="Email & Dispatches" />

      {/* Main Mail layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar */}
        <div className="w-56 border-r border-slate-800 bg-slate-900/60 p-4 flex flex-col justify-between">
          <div className="space-y-4">
            <button 
              onClick={() => setShowComposeModal(true)}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 font-bold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 text-white transition-all"
            >
              <Plus className="w-4 h-4 text-white" /> Compose
            </button>

            <div className="space-y-1 text-xs font-semibold">
              <button className="w-full flex items-center justify-between px-3 py-2 bg-indigo-600/20 text-indigo-300 rounded-lg border border-indigo-500/30">
                <span className="flex items-center gap-2.5"><Inbox className="w-4 h-4" /> Inbox</span>
                <span className="text-[10px] bg-indigo-600 text-white px-1.5 py-0.5 rounded-full">1</span>
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 rounded-lg">
                <Send className="w-4 h-4 text-slate-400" /> Sent
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 rounded-lg">
                <FileText className="w-4 h-4 text-slate-400" /> Drafts
              </button>
              <button className="w-full flex items-center gap-2.5 px-3 py-2 text-slate-400 hover:bg-slate-800/60 hover:text-slate-200 rounded-lg">
                <Trash2 className="w-4 h-4 text-slate-400" /> Trash
              </button>
            </div>
          </div>
        </div>

        {/* Email List */}
        <div className="w-80 border-r border-slate-800 bg-slate-900/40 flex flex-col">
          <div className="p-4 border-b border-slate-800 font-bold text-slate-200 text-sm">
            Inbox Dispatches
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {emails.map((mail) => (
              <button
                key={mail.id}
                onClick={() => setSelectedMail(mail)}
                className={`w-full text-left p-4 transition-colors ${
                  selectedMail?.id === mail.id ? 'bg-indigo-600/15 border-l-4 border-indigo-500' : 'hover:bg-slate-800/30'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-bold text-slate-200">{mail.sender}</span>
                  <span className="text-[10px] text-slate-400 font-medium">{mail.date}</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-300 truncate mb-1">{mail.subject}</h4>
                <p className="text-[11px] text-slate-400 line-clamp-2">{mail.snippet}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Mail Viewer */}
        <div className="flex-1 bg-slate-950 p-8 overflow-y-auto">
          {selectedMail && (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-sm space-y-4">
              <h2 className="text-xl font-bold text-slate-100">{selectedMail.subject}</h2>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800 text-xs text-slate-400">
                <span>From: <strong className="text-slate-200">{selectedMail.sender}</strong></span>
                <span>{selectedMail.date}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{selectedMail.snippet}</p>
            </div>
          )}
        </div>
      </div>

      {/* Floatable Compose Modal */}
      {showComposeModal && (
        <div className="absolute bottom-6 right-12 w-[480px] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden z-40">
          <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-800">
            <span className="font-bold text-xs text-slate-200">New Dispatch</span>
            <div className="flex items-center gap-2 text-slate-400">
              <button className="hover:text-slate-200"><Minimize2 className="w-3.5 h-3.5" /></button>
              <button className="hover:text-slate-200"><Maximize2 className="w-3.5 h-3.5" /></button>
              <button onClick={() => setShowComposeModal(false)} className="hover:text-slate-200"><X className="w-3.5 h-3.5" /></button>
            </div>
          </div>

          <div className="p-4 space-y-3">
            <div className="flex items-center border-b border-slate-800 pb-2 text-xs">
              <span className="w-12 text-slate-400">To</span>
              <span className="bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-semibold px-2 py-0.5 rounded-full text-xs">Jane Doe</span>
            </div>
            <div className="flex items-center border-b border-slate-800 pb-2 text-xs">
              <span className="w-12 text-slate-400">Subject</span>
              <input type="text" defaultValue="Project Proposal Review" className="flex-1 font-semibold text-slate-200 bg-transparent focus:outline-none" />
            </div>
            <textarea 
              rows="5"
              defaultValue={`Hi Jane,\n\nPlease find attached the latest revision of the project proposal for the upcoming quarter.`}
              className="w-full text-xs text-slate-300 bg-transparent focus:outline-none resize-none leading-relaxed"
            ></textarea>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-md">
                Send
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
