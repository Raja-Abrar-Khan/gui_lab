import { useState, useRef } from 'react';
import { 
  Play, 
  Pause, 
  Heart, 
  Share2, 
  Send,
  Volume2,
  VolumeX,
  Maximize
} from 'lucide-react';
import BreadcrumbHeader from '../BreadcrumbHeader';

const chatComments = [
  { id: 1, user: 'Wilmot Scott', text: 'Great explanation of quantum key distribution principles!', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80' },
  { id: 2, user: 'Jonny White', text: 'The video stream playback is very smooth.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80' },
  { id: 3, user: 'Iseli Maxim', text: 'Looking forward to more lab simulation videos.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80' },
];

const relatedVideos = [
  { id: 1, title: 'Quantum Teleportation Lab Demonstration', channel: 'Lab Media Stream', views: '45,005 views', thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&auto=format&fit=crop&q=80' },
  { id: 2, title: 'BB84 Protocol Hardware Architecture', channel: 'Lab Media Stream', views: '28,110 views', thumbnail: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=400&auto=format&fit=crop&q=80' },
];

export default function VideoPlayerModule({ onBack }) {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [liked, setLiked] = useState(true);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleFullscreen = () => {
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Breadcrumb Header */}
      <BreadcrumbHeader onBack={onBack} title="Video Stream Player" />

      <div className="flex-1 p-6 overflow-y-auto">
        <div className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-6">
          
          <div className="col-span-8 flex flex-col gap-6">
            {/* Real HTML5 Playing Video Element */}
            <div className="relative w-full h-[400px] rounded-3xl overflow-hidden bg-slate-900 border border-slate-800 shadow-2xl group flex items-center justify-center">
              <video
                ref={videoRef}
                src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                onClick={togglePlay}
                className="w-full h-full object-cover cursor-pointer"
              />

              {/* Center Play/Pause Overlay Button */}
              <button 
                onClick={togglePlay}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-indigo-600/90 hover:bg-indigo-500 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6 ml-1" />}
              </button>

              {/* Bottom Video Controls Bar Overlay */}
              <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex items-center gap-3">
                  <button onClick={togglePlay} className="text-white hover:text-indigo-400 cursor-pointer">
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button onClick={toggleMute} className="text-white hover:text-indigo-400 cursor-pointer">
                    {isMuted ? <VolumeX className="w-5 h-5 text-rose-400" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <span className="text-xs font-mono text-slate-300">Live Playing</span>
                </div>

                <button onClick={handleFullscreen} className="text-white hover:text-indigo-400 cursor-pointer">
                  <Maximize className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80" 
                  alt="Dr. Sarah"
                  className="w-12 h-12 rounded-2xl object-cover border border-slate-700" 
                />
                <div>
                  <h3 className="font-bold text-slate-100 text-base">Lab Stream Operations</h3>
                  <span className="text-xs text-slate-400">1,245,001 Subscribers</span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-bold text-slate-200 flex items-center gap-2 cursor-pointer">
                  <Share2 className="w-4 h-4" /> Share
                </button>
                <button 
                  onClick={() => setLiked(!liked)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                    liked ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-300'
                  }`}
                >
                  <Heart className="w-4 h-4 fill-current" /> Liked
                </button>
              </div>
            </div>

            <div className="p-6 bg-slate-900/60 border border-slate-800 rounded-3xl space-y-3">
              <h1 className="text-lg font-bold text-slate-100">
                Quantum Simulation & Video Telemetry Stream
              </h1>
              <p className="text-xs text-slate-400 leading-relaxed">
                Live stream demo showing real-time video playback with interactive pause, mute, and fullscreen video controls.
              </p>
            </div>
          </div>

          <div className="col-span-4 flex flex-col gap-6">
            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-3xl flex flex-col justify-between h-[360px]">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="font-bold text-slate-100 text-sm">Live Chat</span>
                <span className="text-xs text-slate-400">11,560 people</span>
              </div>

              <div className="flex-1 overflow-y-auto my-3 space-y-3 pr-1">
                {chatComments.map((c) => (
                  <div key={c.id} className="flex items-start gap-3 text-xs">
                    <img src={c.avatar} alt={c.user} className="w-7 h-7 rounded-full object-cover flex-shrink-0" />
                    <div>
                      <h4 className="font-bold text-slate-200 text-[11px]">{c.user}</h4>
                      <p className="text-slate-400 text-[11px] leading-tight">{c.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border border-slate-800 bg-slate-950 rounded-2xl p-2 flex items-center justify-between">
                <input type="text" placeholder="Tell us your message" className="w-full text-xs text-slate-200 focus:outline-none bg-transparent px-2 placeholder:text-slate-500" />
                <button className="p-2 bg-indigo-600 text-white rounded-xl cursor-pointer"><Send className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-3xl space-y-4">
              <h3 className="font-bold text-slate-100 text-sm">Related Videos</h3>
              <div className="space-y-3">
                {relatedVideos.map((vid) => (
                  <div key={vid.id} className="flex gap-3 items-center group cursor-pointer">
                    <img src={vid.thumbnail} alt={vid.title} className="w-24 h-16 rounded-xl object-cover flex-shrink-0 border border-slate-800" />
                    <div>
                      <h4 className="text-xs font-bold text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-2">{vid.title}</h4>
                      <span className="text-[10px] text-slate-400 block mt-1">{vid.channel}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{vid.views}</span>
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
