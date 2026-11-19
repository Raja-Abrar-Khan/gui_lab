import { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  ArrowUpRight, 
  ArrowDownLeft, 
  Upload, 
  RefreshCw,
  FolderOpen,
  Key,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Download,
  Server,
  FileText
} from 'lucide-react';
import BreadcrumbHeader from '../BreadcrumbHeader';

export default function FileTransferModule({ onBack }) {
  const [transfers, setTransfers] = useState([]);
  const [qkdKeys, setQkdKeys] = useState([]);
  const [selectedKeyId, setSelectedKeyId] = useState(1);
  const [peerIp, setPeerIp] = useState('127.0.0.1');
  const [uploading, setUploading] = useState(false);
  const [statusMessage, setStatusMessage] = useState(null);
  const fileInputRef = useRef(null);

  // 1. Fetch available QKD keys
  const fetchKeys = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/qkd/keys');
      if (res.ok) {
        const data = await res.json();
        if (data.keys && data.keys.length > 0) {
          setQkdKeys(data.keys);
          if (!selectedKeyId || !data.keys.some(k => k.id === selectedKeyId)) {
            setSelectedKeyId(data.keys[0].id);
          }
        }
      }
    } catch (err) {
      console.error("Failed to fetch QKD keys:", err);
    }
  };

  // 2. Fetch transfer history
  const fetchTransfers = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/files/transfers');
      if (res.ok) {
        const data = await res.json();
        if (data.transfers) {
          setTransfers(data.transfers);
        }
      }
    } catch (err) {
      console.error("Failed to fetch transfers:", err);
    }
  };

  useEffect(() => {
    fetchKeys();
    fetchTransfers();

    const interval = setInterval(fetchTransfers, 3000);
    return () => clearInterval(interval);
  }, []);

  // 3. Handle file selection & upload
  const handleSelectFiles = async (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setUploading(true);
      setStatusMessage({ type: 'info', text: `Encrypting ${file.name} with QKD Key #${selectedKeyId}...` });

      const formData = new FormData();
      formData.append('file', file);
      formData.append('peer_ip', peerIp);
      formData.append('key_id', selectedKeyId);

      try {
        const res = await fetch('http://localhost:8000/api/files/send', {
          method: 'POST',
          body: formData
        });

        if (res.ok) {
          const data = await res.json();
          setStatusMessage({ type: 'success', text: `Successfully encrypted and transferred ${file.name} to ${peerIp}!` });
          fetchTransfers();
        } else {
          const errData = await res.json().catch(() => ({ detail: 'Upload error' }));
          setStatusMessage({ type: 'error', text: `Transfer failed: ${errData.detail}` });
        }
      } catch (err) {
        setStatusMessage({ type: 'error', text: `Network error: ${err.message}` });
      } finally {
        setUploading(false);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Breadcrumb Header */}
      <BreadcrumbHeader onBack={onBack} title="Quantum P2P File Transfer Hub" />

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
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Lock className="w-6 h-6 text-indigo-400" />
              <span>Quantum-Encrypted File Transfer Hub</span>
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              End-to-end AES-256-GCM chunked file transmission secured by BB84 quantum keys.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button 
              disabled={uploading}
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              {uploading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <FolderOpen className="w-4 h-4" />}
              <span>{uploading ? "Encrypting & Sending..." : "Select & Send File"}</span>
            </button>
          </div>
        </div>

        {/* QKD Control Bar (Peer IP + Key Selector) */}
        <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Key className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold text-slate-300">QKD Key ID:</span>
              <select
                value={selectedKeyId}
                onChange={(e) => setSelectedKeyId(Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-mono"
              >
                {qkdKeys.map((k) => (
                  <option key={k.id} value={k.id}>
                    Key #{k.id} ({k.protocol} - 256b)
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Server className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-300">Peer Receiver IP:</span>
              <input
                type="text"
                value={peerIp}
                onChange={(e) => setPeerIp(e.target.value)}
                placeholder="e.g. 192.168.1.104"
                className="bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-indigo-500 font-mono w-36"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30">
            <ShieldCheck className="w-4 h-4" />
            <span>TCP Port 6001 Active (Zero Key Exposure)</span>
          </div>
        </div>

        {/* Status Notification Banner */}
        {statusMessage && (
          <div className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${
            statusMessage.type === 'success' 
              ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300' 
              : statusMessage.type === 'error'
              ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
              : 'bg-indigo-950/60 border-indigo-500/40 text-indigo-300'
          }`}>
            <span>{statusMessage.text}</span>
            <button onClick={() => setStatusMessage(null)} className="hover:opacity-75">✕</button>
          </div>
        )}

        {/* Action Panel Cards: Send & Receive */}
        <div className="grid grid-cols-2 gap-6">
          {/* Send Box */}
          <div 
            onClick={() => !uploading && fileInputRef.current?.click()}
            className="p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 via-slate-900 to-slate-900 border border-indigo-500/30 hover:border-indigo-500 cursor-pointer transition-all group flex flex-col items-center justify-center text-center gap-3 shadow-xl"
          >
            <div className="w-16 h-16 rounded-2xl bg-indigo-600 text-white flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg shadow-indigo-600/40">
              <Send className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">Send File with QKD Key #{selectedKeyId}</h3>
              <p className="text-xs text-slate-400 mt-1">Encrypts payload locally and sends to {peerIp}:6001</p>
            </div>
          </div>

          {/* Receive Box */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-emerald-900/30 via-slate-900 to-slate-900 border border-emerald-500/30 transition-all group flex flex-col items-center justify-center text-center gap-3 shadow-xl">
            <div className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/40">
              <Upload className="w-8 h-8" />
            </div>
            <div>
              <h3 className="font-bold text-slate-100 text-base">File Receiver Active</h3>
              <p className="text-xs text-slate-400 mt-1">Listening on TCP Port 6001 (auto-decrypts with local QKMS)</p>
            </div>
          </div>
        </div>

        {/* Active Transfers List */}
        <div className="flex-1 bg-slate-900/80 rounded-3xl border border-slate-800 p-6 flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-slate-200 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-indigo-400" />
              <span>Quantum File Transfer History</span>
            </h2>
            <span className="text-xs text-slate-400 font-mono">{transfers.length} Transferred Files</span>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1">
            {transfers.length === 0 ? (
              <div className="h-40 flex flex-col items-center justify-center text-slate-500 text-xs">
                <FileText className="w-8 h-8 text-slate-600 mb-2" />
                <p>No file transfers recorded yet.</p>
                <p className="text-[11px] text-slate-600">Select a file above to send it with QKD encryption!</p>
              </div>
            ) : (
              transfers.map((item) => (
                <div key={item.id} className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`p-2.5 rounded-xl ${
                        item.direction === 'send' ? 'bg-indigo-600/20 text-indigo-400' : 'bg-emerald-600/20 text-emerald-400'
                      }`}>
                        {item.direction === 'send' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-xs font-bold text-slate-200">{item.name}</h4>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/10 text-indigo-300 border border-indigo-500/30">
                            Key #{item.key_id}
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-400 font-mono">
                          {item.direction === 'send' ? `Sent to ${item.peer}` : `Received from ${item.peer}`} • {item.size} • {item.timestamp}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 justify-end">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {item.status}
                        </span>
                        <span className="text-[10px] font-mono text-slate-500">SHA-256: {item.sha256}</span>
                      </div>

                      {item.direction === 'receive' && (
                        <a
                          href={`http://localhost:8000/api/files/download/${encodeURIComponent(item.name)}`}
                          download={item.name}
                          className="p-2 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 rounded-xl transition-colors flex items-center gap-1 text-xs"
                          title="Download Decrypted File"
                        >
                          <Download className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden border border-slate-800">
                    <div 
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${item.progress || 100}%` }}
                    ></div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
