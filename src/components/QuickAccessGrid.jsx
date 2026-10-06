import { useState } from 'react';
import { 
  Cpu,
  MessageSquare, 
  Mail, 
  Video, 
  PlaySquare, 
  Send, 
  HardDrive,
  Search,
  FileText
} from 'lucide-react';

const mainModules = [
  { id: 'chat', label: 'Chat', icon: MessageSquare, bg: 'bg-indigo-600 hover:bg-indigo-500', desc: 'Team communication & channels' },
  { id: 'email', label: 'Email', icon: Mail, bg: 'bg-blue-600 hover:bg-blue-500', desc: 'Dispatches & mail client' },
  { id: 'videoConf', label: 'Video Call', icon: Video, bg: 'bg-cyan-600 hover:bg-cyan-500', desc: 'Live teleconference studio' },
  { id: 'videoPlayer', label: 'Video Player', icon: PlaySquare, bg: 'bg-purple-600 hover:bg-purple-500', desc: 'Media stream & visualizer' },
  { id: 'fileTransfer', label: 'File Transfer', icon: Send, bg: 'bg-teal-600 hover:bg-teal-500', desc: 'P2P SHAREit style transfer' },
  { id: 'cloudStorage', label: 'Cloud Storage', icon: HardDrive, bg: 'bg-slate-800 hover:bg-slate-700', desc: 'Distributed vault storage' },
];

const recentFiles = [
  { name: 'project_proposal.pdf', size: '12 MB', type: 'PDF Document' },
  { name: 'session_recording.mp4', size: '320 MB', type: 'Video' },
  { name: 'system_log.txt', size: '45 KB', type: 'Text File' },
];

export default function QuickAccessGrid({ onModuleSelect }) {
  const [searchVal, setSearchVal] = useState('');

  const handleSystemInterfaceClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onModuleSelect) {
      onModuleSelect('systemInterface');
    }
  };

  return (
    <div className="h-full w-full p-8 overflow-y-auto bg-slate-950 flex flex-col justify-between max-w-6xl mx-auto">
      {/* Top Search Bar */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Welcome Back</h1>
          <p className="text-xs text-slate-400 mt-1">Select an application module to begin</p>
        </div>
        <div className="relative w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="Search applications or files..."
            className="w-full bg-slate-900 border border-slate-800 text-slate-200 text-xs rounded-xl pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-500"
          />
        </div>
      </div>

      {/* SYSTEM INTERFACE HERO TILE - Cleaned Subtitle */}
      <div className="mb-8">
        <div
          role="button"
          tabIndex={0}
          onClick={handleSystemInterfaceClick}
          onKeyDown={(e) => e.key === 'Enter' && handleSystemInterfaceClick(e)}
          className="w-full p-6 rounded-3xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 hover:from-indigo-500 hover:to-purple-600 transition-all transform hover:-translate-y-1 shadow-2xl shadow-indigo-600/30 text-left text-white flex items-center justify-between cursor-pointer group select-none"
        >
          <div className="flex items-center gap-5 pointer-events-none">
            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md group-hover:scale-110 transition-transform">
              <Cpu className="w-7 h-7 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-wide text-white">System Interface</h2>
              
            </div>
          </div>
          <span className="px-4 py-2 rounded-xl bg-white/10 border border-white/20 text-xs font-bold tracking-wider uppercase group-hover:bg-white text-white group-hover:text-indigo-900 transition-all pointer-events-none flex-shrink-0 ml-4">
            Launch Workflow →
          </span>
        </div>
      </div>

      {/* 6 Application Launcher Tiles */}
      <div className="mb-10">
        <h2 className="text-lg font-bold text-slate-100 mb-4">Application Modules</h2>
        <div className="grid grid-cols-3 gap-6">
          {mainModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <button
                key={mod.id}
                type="button"
                onClick={() => onModuleSelect && onModuleSelect(mod.id)}
                className={`p-6 rounded-2xl ${mod.bg} transition-all transform hover:-translate-y-1 shadow-xl text-left text-white group cursor-pointer flex flex-col justify-between h-40`}
              >
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white tracking-wide">{mod.label}</h3>
                  <p className="text-xs text-white/80 mt-1">{mod.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Quick Recent Files Preview */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base font-bold text-slate-100">Recent Files</h2>
          <button 
            type="button"
            onClick={() => onModuleSelect && onModuleSelect('cloudStorage')}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-medium"
          >
            Open Storage Vault →
          </button>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {recentFiles.map((file, idx) => (
            <div 
              key={idx}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex items-center gap-4 hover:border-slate-700 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-indigo-400 flex-shrink-0">
                <FileText className="w-5 h-5" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-semibold text-slate-200 truncate">{file.name}</h4>
                <div className="flex items-center justify-between mt-1 text-[11px] text-slate-400">
                  <span>{file.type}</span>
                  <span>{file.size}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
