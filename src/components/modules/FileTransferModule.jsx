import { useState, useRef } from 'react';
import { 
  Send, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Upload, 
  RefreshCw,
  FolderOpen
} from 'lucide-react';
import BreadcrumbHeader from '../BreadcrumbHeader';

const initialTransfers = [
  { id: 1, name: 'Project_Data_Matrix_v4.bin', size: '2.4 GB', speed: '45 MB/s', progress: 74, peer: 'Node Alpha (Desk-01)', direction: 'send' },
  { id: 2, name: 'Design_System_Export.zip', size: '320 MB', speed: 'Completed', progress: 100, peer: 'Node Bravo (Desk-03)', direction: 'receive' },
];

export default function FileTransferModule({ onBack }) {
  const [transfers, setTransfers] = useState(initialTransfers);
  const fileInputRef = useRef(null);

  const handleSelectFiles = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setTransfers([
        {
          id: Date.now(),
          name: file.name,
          size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
          speed: '12 MB/s',
          progress: 25,
          peer: 'Nearby Receiver',
          direction: 'send'
        },
        ...transfers
      ]);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Breadcrumb Header */}
      <BreadcrumbHeader onBack={onBack} title="File Transfer Hub" />

      {/* Hidden Native File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleSelectFiles} 
        className="hidden" 
      />

      <div className="flex-1 p-8 overflow-y-auto flex flex-col gap-6">
        {/* Header Stat Area */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Direct File Transfer Hub</h1>
            <p className="text-xs text-slate-400 mt-1">P2P file transfer inspired by wireless sharing</p>
          </div>

          <button 
            onClick={() => fileInputRef.current?.click()}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
          >
            <FolderOpen className="w-4 h-4" /> Select Files to Send
          </button>
        </div>

        {/* Action Panel Cards: Send & Receive */}
        <div className="grid grid-cols-2 gap-6">
          {/* Send Box */}
          <div 
            onClick={() => fileInputRef.current?.click()}
            className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-500/30 hover:border-indigo-500 cursor-pointer transition-all group flex flex-col items-center justify-center text-center gap-3 shadow-xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-indigo-600/40">
              <Send className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Send Files</h3>
              <p className="text-xs text-slate-400 mt-1">Click to browse local system folder</p>
            </div>
          </div>

          {/* Receive Box */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-900/30 via-slate-900 to-slate-900 border border-emerald-500/30 hover:border-emerald-500 cursor-pointer transition-all group flex flex-col items-center justify-center text-center gap-3 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-emerald-600/40">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Receive Files</h3>
              <p className="text-xs text-slate-400 mt-1">Listening on local network "ch_js"</p>
            </div>
          </div>
        </div>

        {/* Active Transfers List */}
        <div className="flex-1 bg-slate-900/80 rounded-3xl border border-slate-800 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" /> Transfer Queue
            </h2>
            <span className="text-xs text-slate-400">{transfers.length} Active Items</span>
          </div>

          <div className="space-y-4 overflow-y-auto flex-1">
            {transfers.map((item) => (
              <div key={item.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2.5 rounded-xl ${
                      item.direction === 'send' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-emerald-600/20 text-emerald-400'
                    }`}>
                      {item.direction === 'send' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-200">{item.name}</h4>
                      <span className="text-[11px] text-slate-400">{item.peer} • {item.size}</span>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-mono font-bold text-indigo-400 block">{item.speed}</span>
                    <span className="text-[10px] text-slate-500">{item.progress}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                  <div 
                    className={`h-full transition-all duration-300 ${
                      item.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'
                    }`} 
                    style={{ width: `${item.progress}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
