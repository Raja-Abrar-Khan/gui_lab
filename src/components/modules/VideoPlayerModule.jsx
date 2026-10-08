import { useState, useRef } from 'react';
import { 
  Play, 
  Heart, 
  Share2, 
  Maximize,
  Tv,
  Film,
  CheckCircle2,
  Lock
} from 'lucide-react';
import BreadcrumbHeader from '../BreadcrumbHeader';

const quantumVideoPlaylist = [
  { 
    id: 'HGRQmHkRtZU', 
    title: 'Quantum Networking & QKD Principles', 
    channel: 'Quantum Lab Stream', 
    views: '124,500 views', 
    embedUrl: 'https://www.youtube.com/embed/HGRQmHkRtZU?autoplay=1&rel=0',
    description: 'Comprehensive overview of Quantum Key Distribution (QKD), photon polarization state encoding, BB84 protocol fundamentals, and secure quantum repeaters.'
  },
  { 
    id: 'qkd-hardware', 
    title: 'Quantum Key Distribution Physics & Hardware', 
    channel: 'QuTech Media', 
    views: '88,200 views', 
    embedUrl: 'https://www.youtube.com/embed/1u_S2u1w6O8?autoplay=1&rel=0',
    description: 'Experimental photonics implementation, single-photon sources, beam splitters, and quantum noise estimation.'
  },
  { 
    id: 'quantum-entanglement', 
    title: 'Quantum Entanglement & Information Networks', 
    channel: 'CYQT Lab Research', 
    views: '54,110 views', 
    embedUrl: 'https://www.youtube.com/embed/9lV-jTf00_s?autoplay=1&rel=0',
    description: 'Entangled photon pair distribution, E91 Bell inequality testing, and long-distance quantum network architectures.'
  }
];

export default function VideoPlayerModule({ onBack }) {
  const [activeVideo, setActiveVideo] = useState(quantumVideoPlaylist[0]);
  const [liked, setLiked] = useState(true);
  const iframeContainerRef = useRef(null);

  const handleFullscreen = () => {
    if (iframeContainerRef.current) {
      if (iframeContainerRef.current.requestFullscreen) {
        iframeContainerRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Breadcrumb Header */}
      <BreadcrumbHeader onBack={onBack} title="Quantum Media & Video Player Stream" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-6">
          
          {/* Main Video Stream Container */}
          <div className="col-span-8 flex flex-col gap-6">
            
            {/* Embedded YouTube Video Container */}
            <div 
              ref={iframeContainerRef}
              className="relative w-full h-[440px] rounded-3xl overflow-hidden bg-black border border-slate-800 shadow-2xl group"
            >
              <iframe
                key={activeVideo.id}
                src={activeVideo.embedUrl}
                title={activeVideo.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>

              {/* Top Floating Overlay Badge */}
              <div className="absolute top-4 left-4 pointer-events-none bg-slate-950/80 backdrop-blur-md border border-slate-800 px-3 py-1.5 rounded-2xl text-xs font-bold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                <span>QUANTUM VIDEO STREAM</span>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-mono border border-indigo-500/30">
                  HD 1080p
                </span>
              </div>

              {/* Fullscreen Quick Button Overlay */}
              <button 
                onClick={handleFullscreen}
                className="absolute top-4 right-4 bg-slate-950/80 hover:bg-slate-900 border border-slate-800 text-slate-200 p-2.5 rounded-2xl text-xs font-bold flex items-center gap-1.5 opacity-90 hover:opacity-100 transition-all cursor-pointer shadow-lg"
                title="Toggle Fullscreen"
              >
                <Maximize className="w-4 h-4 text-indigo-400" />
                <span>Fullscreen</span>
              </button>
            </div>

            {/* Video Author & Actions Bar */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center font-bold text-lg">
                  <Tv className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-100 text-base">{activeVideo.channel}</h3>
                  <span className="text-xs text-slate-400 font-mono">Quantum Networking Research Series • {activeVideo.views}</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer transition-colors">
                  <Share2 className="w-4 h-4" /> Share Video
                </button>
                <button 
                  onClick={() => setLiked(!liked)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    liked ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current" /> {liked ? 'Liked' : 'Like'}
                </button>
              </div>
            </div>

            {/* Video Description Box */}
            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
              <h1 className="text-lg font-extrabold text-slate-100 flex items-center gap-2">
                <Film className="w-5 h-5 text-indigo-400" /> {activeVideo.title}
              </h1>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {activeVideo.description}
              </p>
              <div className="pt-2 flex items-center gap-3 text-[11px] font-mono text-emerald-400 font-bold">
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> VERIFIED MEDIA SOURCE
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> 256-BIT ENCRYPTED PLAYBACK
                </span>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Quantum Video Library & Playlist */}
          <div className="col-span-4 flex flex-col gap-6">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4 shadow-xl">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2 font-bold text-slate-100 text-sm">
                  <Film className="w-4 h-4 text-indigo-400" />
                  <span>Quantum Video Library</span>
                </div>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">{quantumVideoPlaylist.length} videos</span>
              </div>

              {/* Playlist Video Items */}
              <div className="space-y-3">
                {quantumVideoPlaylist.map((vid) => (
                  <div 
                    key={vid.id} 
                    onClick={() => setActiveVideo(vid)}
                    className={`p-3 rounded-2xl border transition-all cursor-pointer flex gap-3 items-center group ${
                      activeVideo.id === vid.id 
                        ? 'bg-indigo-600/20 border-indigo-500/50 shadow-lg' 
                        : 'bg-slate-950/60 border-slate-800 hover:border-indigo-500/30'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-center flex-shrink-0 text-indigo-400 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-slate-100 group-hover:text-indigo-300 transition-colors line-clamp-2 leading-snug">
                        {vid.title}
                      </h4>
                      <span className="text-[10px] text-slate-400 font-mono mt-0.5 block">{vid.channel}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
