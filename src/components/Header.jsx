import { Search, Menu, ChevronLeft } from 'lucide-react';

export default function Header({ searchVal, setSearchVal, activeTab, setActiveTab }) {
  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-900/90 px-6 flex items-center justify-between gap-4">
      {/* Menu / Back button and Search bar exactly like the image */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        {activeTab !== 'dashboard' ? (
          <button 
            onClick={() => setActiveTab('dashboard')}
            className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors flex items-center gap-1 text-xs font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>
        ) : (
          <button className="p-2 text-slate-400 hover:text-white bg-slate-800/60 rounded-xl transition-colors">
            <Menu className="w-5 h-5" />
          </button>
        )}

        <div className="relative flex-1">
          <input
            type="text"
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)}
            placeholder="e.g. files.doc"
            className="w-full bg-slate-950/80 border border-slate-800 text-slate-200 text-sm rounded-xl pl-4 pr-10 py-2 focus:outline-none focus:border-indigo-500/80 transition-colors placeholder:text-slate-500"
          />
          <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        </div>
      </div>

      {/* Navigation Quick Pills */}
      <div className="flex items-center gap-2">
        <button 
          onClick={() => setActiveTab('dashboard')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Home
        </button>
        <button 
          onClick={() => setActiveTab('chat')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'chat' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Chat
        </button>
        <button 
          onClick={() => setActiveTab('email')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'email' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Email
        </button>
        <button 
          onClick={() => setActiveTab('videoConf')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'videoConf' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Video Call
        </button>
        <button 
          onClick={() => setActiveTab('fileTransfer')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            activeTab === 'fileTransfer' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          Transfers
        </button>
      </div>
    </header>
  );
}
