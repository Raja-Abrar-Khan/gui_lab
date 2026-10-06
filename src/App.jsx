import { useState } from 'react';
import { 
  Home, 
  Cpu,
  MessageSquare, 
  Mail, 
  Video, 
  PlaySquare, 
  Send, 
  HardDrive 
} from 'lucide-react';

import QuickAccessGrid from './components/QuickAccessGrid';
import SystemInterfaceModule from './components/modules/SystemInterfaceModule';
import ChatModule from './components/modules/ChatModule';
import EmailModule from './components/modules/EmailModule';
import VideoConfModule from './components/modules/VideoConfModule';
import VideoPlayerModule from './components/modules/VideoPlayerModule';
import FileTransferModule from './components/modules/FileTransferModule';
import CloudStorageModule from './components/modules/CloudStorageModule';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'systemInterface', label: 'System Interface', icon: Cpu },
    { id: 'chat', label: 'Chat', icon: MessageSquare },
    { id: 'email', label: 'Email', icon: Mail },
    { id: 'videoConf', label: 'Video Call', icon: Video },
    { id: 'videoPlayer', label: 'Video Player', icon: PlaySquare },
    { id: 'fileTransfer', label: 'File Transfer', icon: Send },
    { id: 'cloudStorage', label: 'Cloud Storage', icon: HardDrive },
  ];

  const renderActiveModule = () => {
    switch (activeTab) {
      case 'home':
        return <QuickAccessGrid onModuleSelect={(id) => setActiveTab(id)} />;
      case 'systemInterface':
        return <SystemInterfaceModule onBack={() => setActiveTab('home')} />;
      case 'chat':
        return <ChatModule onBack={() => setActiveTab('home')} />;
      case 'email':
        return <EmailModule onBack={() => setActiveTab('home')} />;
      case 'videoConf':
        return <VideoConfModule onBack={() => setActiveTab('home')} />;
      case 'videoPlayer':
        return <VideoPlayerModule onBack={() => setActiveTab('home')} />;
      case 'fileTransfer':
        return <FileTransferModule onBack={() => setActiveTab('home')} />;
      case 'cloudStorage':
        return <CloudStorageModule onBack={() => setActiveTab('home')} />;
      default:
        return <QuickAccessGrid onModuleSelect={(id) => setActiveTab(id)} />;
    }
  };

  return (
    <div className="w-screen h-screen bg-slate-950 text-slate-100 flex overflow-hidden font-sans select-none">
      {/* Left Navigation Icon Rail */}
      <aside className="w-20 bg-slate-900 border-r border-slate-800/80 flex flex-col items-center py-5 justify-between z-30 flex-shrink-0">
        <div className="flex flex-col items-center gap-5 w-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                title={item.label}
                className={`relative group p-3 rounded-2xl transition-all duration-200 flex flex-col items-center gap-1 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-[9px] font-medium leading-none tracking-tight">{item.label}</span>
                {isActive && (
                  <span className="absolute -right-1 top-1/2 -translate-y-1/2 w-1.5 h-5 bg-indigo-400 rounded-l-full"></span>
                )}
              </button>
            );
          })}
        </div>

        {/* User Profile Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-white shadow-md text-xs cursor-pointer">
          US
        </div>
      </aside>

      {/* Main App Canvas */}
      <main className="flex-1 h-full overflow-hidden relative bg-slate-950">
        {renderActiveModule()}
      </main>
    </div>
  );
}
