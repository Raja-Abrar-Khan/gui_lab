import { useState, useEffect, useRef } from 'react';
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
  CheckCircle2,
  Key,
  Lock,
  RefreshCw,
  Eye,
  EyeOff,
  Terminal,
  Activity
} from 'lucide-react';
import BreadcrumbHeader from '../BreadcrumbHeader';

const quantumNodes = [
  { id: 'iiser-bhopal', name: 'IISER Bhopal', channel: '#iiser-bhopal', ip: '192.168.1.104', status: 'Active Link' },
  { id: 'iit-roorkee', name: 'IIT Roorkee', channel: '#iit-roorkee', ip: '192.168.1.101', status: 'Connected' },
  { id: 'iisc-bangalore', name: 'IISc Bangalore', channel: '#iisc-bangalore', ip: '192.168.1.105', status: 'Idle' },
  { id: 'iit-delhi', name: 'IIT Delhi', channel: '#iit-delhi', ip: '192.168.1.108', status: 'Idle' },
  { id: 'iit-jammu', name: 'IIT Jammu', channel: '#iit-jammu', ip: '192.168.1.112', status: 'Idle' },
];

export default function ChatModule({ connectedNode, onBack }) {
  const [activeNode, setActiveNode] = useState(() => {
    if (connectedNode?.name) {
      return {
        id: connectedNode.id || 'custom-node',
        name: connectedNode.name,
        channel: `#${connectedNode.name.toLowerCase().replace(/\s+/g, '-')}`,
        ip: connectedNode.ip || '127.0.0.1',
        status: 'Active Link'
      };
    }
    return quantumNodes[0];
  });
  const [messages, setMessages] = useState([]);
  const [inputMsg, setInputMsg] = useState('');
  const [qkdKeys, setQkdKeys] = useState([]);
  const [selectedKeyId, setSelectedKeyId] = useState(() => Number(sessionStorage.getItem('selectedKeyId')) || 1);
  const [backendOnline, setBackendOnline] = useState(false);
  const [sending, setSending] = useState(false);
  const [expandedTelemetry, setExpandedTelemetry] = useState({});
  const [verificationResult, setVerificationResult] = useState({});
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Fetch available QKD keys from backend
  const fetchQkdKeys = async () => {
    try {
      const res = await fetch('http://localhost:8000/api/qkd/keys');
      if (res.ok) {
        const data = await res.json();
        if (data.keys && data.keys.length > 0) {
          setQkdKeys(data.keys);
          setBackendOnline(true);
          // Default to first active key if not yet set
          if (!selectedKeyId || !data.keys.some(k => k.id === selectedKeyId)) {
            setSelectedKeyId(data.keys[0].id);
          }
        }
      } else {
        setBackendOnline(false);
      }
    } catch (err) {
      setBackendOnline(false);
    }
  };

  // 2. Fetch messages for active channel
  const fetchMessages = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/chat/messages?channel=${encodeURIComponent(activeNode.channel)}`);
      if (res.ok) {
        const data = await res.json();
        if (data.messages) {
          setMessages(data.messages);
          setBackendOnline(true);
        }
      }
    } catch (err) {
      // Keep existing messages on network error
    }
  };

  useEffect(() => {
    fetchQkdKeys();
    fetchMessages();

    // Poll messages every 2.5 seconds for real-time multi-window / multi-PC sync
    const interval = setInterval(() => {
      fetchMessages();
    }, 2500);

    return () => clearInterval(interval);
  }, [activeNode]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle Send Encrypted Message
  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const textToSend = inputMsg.trim();
    setInputMsg('');
    setSending(true);

    try {
      const res = await fetch('http://localhost:8000/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sender: `Alice (${activeNode.name} Link)`,
          channel: activeNode.channel,
          text: textToSend,
          key_id: selectedKeyId
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.message) {
          setMessages(prev => [...prev, data.message]);
        }
      } else {
        // Fallback local append if backend is offline
        setMessages(prev => [
          ...prev,
          {
            id: Date.now(),
            sender: 'You (Local Fallback)',
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
            text: textToSend,
            badge: `KEY #${selectedKeyId}`,
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            channel: activeNode.channel
          }
        ]);
      }
    } catch (err) {
      console.error("Failed to send encrypted message:", err);
    } finally {
      setSending(false);
    }
  };

  // Verify Decryption (Zero-Knowledge proof)
  const handleVerifyDecryption = async (msgId, keyId, ivHex, ciphertextHex) => {
    try {
      const res = await fetch('http://localhost:8000/api/chat/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key_id: keyId,
          iv_hex: ivHex,
          ciphertext_hex: ciphertextHex
        })
      });
      if (res.ok) {
        const data = await res.json();
        setVerificationResult(prev => ({
          ...prev,
          [msgId]: data
        }));
      }
    } catch (err) {
      setVerificationResult(prev => ({
        ...prev,
        [msgId]: { status: 'ERROR', detail: 'Could not connect to QKMS' }
      }));
    }
  };

  const toggleTelemetry = (msgId) => {
    setExpandedTelemetry(prev => ({
      ...prev,
      [msgId]: !prev[msgId]
    }));
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans">
      {/* Breadcrumb Header */}
      <BreadcrumbHeader onBack={onBack} title="Quantum Nodes Chat & Messaging" />

      {/* Main Slack-style Layout */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Quantum Channels Sidebar */}
        <div className="w-64 bg-slate-950 border-r border-slate-800 p-4 space-y-4 flex flex-col">
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

          {/* QKD Key Selection Sidebar Box */}
          <div className="mt-auto p-3 bg-slate-900/90 border border-indigo-500/30 rounded-xl">
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold mb-2">
              <Key className="w-4 h-4" />
              <span>Active QKD Key</span>
            </div>
            <select
              value={selectedKeyId}
              onChange={(e) => setSelectedKeyId(Number(e.target.value))}
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1.5 focus:outline-none focus:border-indigo-500 font-mono"
            >
              {qkdKeys.length > 0 ? (
                qkdKeys.map((k) => (
                  <option key={k.id} value={k.id}>
                    Key #{k.id} ({k.protocol} - {k.length}b)
                  </option>
                ))
              ) : (
                <option value={1}>Key #1 (Default BB84)</option>
              )}
            </select>
            <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between font-mono">
              <span>Status:</span>
              <span className="text-emerald-400">ACTIVE (AES-256)</span>
            </div>
          </div>
        </div>

        {/* Middle Main Chat Panel */}
        <div className="flex-1 flex flex-col border-r border-slate-800 bg-slate-900/50">
          {/* Top Channel Header */}
          <div className="h-14 border-b border-slate-800 px-6 flex items-center justify-between flex-shrink-0 bg-slate-950">
            <div className="flex items-center gap-3 font-bold text-slate-100 text-base">
              <span className="flex items-center gap-1.5 text-indigo-400">
                <Server className="w-4 h-4" /> {activeNode.channel}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" /> CONNECTED: {activeNode.name} ({activeNode.ip})
              </span>
            </div>

            {/* QKD Status Pill */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 px-3 py-1 bg-indigo-950/60 border border-indigo-500/40 rounded-full text-xs font-mono text-indigo-300">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>QKD Key #{selectedKeyId} Active</span>
              </div>
              <span className={`w-2.5 h-2.5 rounded-full ${backendOnline ? 'bg-emerald-400 animate-pulse' : 'bg-amber-500'}`} title={backendOnline ? "QKMS Backend Online" : "Backend Offline"} />
            </div>
          </div>

          {/* Messages Feed */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 text-xs">
                <Lock className="w-8 h-8 text-slate-600 mb-2 animate-bounce" />
                <p>No messages yet in {activeNode.channel}.</p>
                <p className="text-[11px] text-slate-600">Send a message to encrypt it with QKD Key #{selectedKeyId}!</p>
              </div>
            ) : (
              messages.map((msg) => (
                <div key={msg.id} className="flex gap-4 group">
                  <img 
                    src={msg.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80"} 
                    alt={msg.sender}
                    className="w-10 h-10 rounded-xl object-cover flex-shrink-0 mt-0.5 border border-slate-700"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-slate-100 text-sm">{msg.sender}</span>
                      {msg.badge && (
                        <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.5 rounded border border-indigo-500/30 font-mono flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          {msg.badge}
                        </span>
                      )}
                      <span className="text-[11px] text-slate-400">{msg.time}</span>
                    </div>

                    {/* Decrypted Plaintext message */}
                    <p className="text-sm text-slate-200 leading-relaxed mb-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80">
                      {msg.text}
                    </p>

                    {/* Cryptographic Telemetry Box */}
                    {msg.ciphertext_hex && (
                      <div className="mb-2">
                        <button
                          onClick={() => toggleTelemetry(msg.id)}
                          className="text-[11px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1.5 transition-colors"
                        >
                          {expandedTelemetry[msg.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          <span>{expandedTelemetry[msg.id] ? "Hide Quantum Ciphertext" : "View Quantum Ciphertext & Telemetry"}</span>
                        </button>

                        {expandedTelemetry[msg.id] && (
                          <div className="mt-2 p-3 bg-slate-950/90 border border-indigo-500/30 rounded-xl font-mono text-[11px] text-slate-300 space-y-1.5 animate-in fade-in duration-200">
                            <div className="flex justify-between items-center text-slate-400 border-b border-slate-800 pb-1">
                              <span>ENCRYPTION: AES-256-CBC</span>
                              <span className="text-emerald-400">QKD KEY #{msg.key_id}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">IV (16 bytes): </span>
                              <span className="text-amber-400 break-all">{msg.iv_hex}</span>
                            </div>
                            <div>
                              <span className="text-slate-500">Ciphertext: </span>
                              <span className="text-indigo-300 break-all">{msg.ciphertext_hex}</span>
                            </div>

                            {/* Verify Decryption Button */}
                            <div className="pt-2 flex items-center justify-between border-t border-slate-800">
                              <button
                                onClick={() => handleVerifyDecryption(msg.id, msg.key_id, msg.iv_hex, msg.ciphertext_hex)}
                                className="px-2.5 py-1 bg-indigo-600/30 hover:bg-indigo-600/50 border border-indigo-500/50 rounded text-[10px] text-indigo-300 flex items-center gap-1 transition-colors"
                              >
                                <Terminal className="w-3 h-3" />
                                <span>Verify Peer Decryption (Bob QKMS)</span>
                              </button>

                              {verificationResult[msg.id] && (
                                <span className={`text-[10px] ${verificationResult[msg.id].status === 'SUCCESS' ? 'text-emerald-400' : 'text-red-400'} flex items-center gap-1`}>
                                  <CheckCircle2 className="w-3 h-3" />
                                  {verificationResult[msg.id].status === 'SUCCESS' ? 'Verified Match' : 'Decrypt Failed'}
                                </span>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Reactions Pill */}
                    {msg.reactions && (
                      <div className="flex items-center gap-1.5 mb-2">
                        {msg.reactions.map((r, i) => (
                          <button key={i} className="px-2 py-0.5 bg-slate-800/80 border border-slate-700/80 text-slate-300 rounded-full text-[11px] font-mono">
                            {r}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <div className="p-4 border-t border-slate-800 bg-slate-950/60">
            <form onSubmit={handleSend} className="border border-slate-800 focus-within:border-indigo-500/60 rounded-2xl p-2 bg-slate-900 transition-colors">
              <input 
                type="text" 
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                placeholder={`Type message to encrypt with QKD Key #${selectedKeyId} and send to ${activeNode.name}...`}
                className="w-full px-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none bg-transparent"
                disabled={sending}
              />
              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 px-2 text-slate-400">
                <div className="flex items-center gap-2 text-[11px] font-mono text-slate-400">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Secured via QKMS Key #{selectedKeyId}</span>
                </div>
                <button 
                  type="submit" 
                  disabled={sending || !inputMsg.trim()}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  {sending ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                  <span>Send</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right Thread Side Panel */}
        <div className="w-80 flex flex-col bg-slate-900/80 border-l border-slate-800">
          <div className="h-14 border-b border-slate-800 px-4 flex items-center justify-between">
            <h3 className="font-bold text-slate-100 text-sm flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-indigo-400" />
              <span>QKD Peer Telemetry</span>
            </h3>
            <button onClick={fetchQkdKeys} className="p-1 hover:text-slate-200 text-slate-400" title="Refresh Keys">
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="p-4 border-b border-slate-800">
            <span className="text-xs text-slate-400 font-medium">Available QKMS Keys ({qkdKeys.length})</span>
          </div>

          {/* List of Keys in Side Panel */}
          <div className="flex-1 p-3 space-y-2 overflow-y-auto font-mono text-xs">
            {qkdKeys.slice(0, 8).map((k) => (
              <div
                key={k.id}
                onClick={() => setSelectedKeyId(k.id)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all ${
                  selectedKeyId === k.id
                    ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                    : 'bg-slate-950/50 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-slate-200">Key ID #{k.id}</span>
                  <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 text-[10px] rounded border border-emerald-500/30">
                    {k.status}
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 flex justify-between">
                  <span>{k.protocol} ({k.length} bits)</span>
                  <span>{k.owner}</span>
                </div>
                <div className="text-[9px] text-slate-600 truncate mt-1">
                  Bits: {k.preview}
                </div>
              </div>
            ))}
          </div>

          {/* QKD Security Guarantee Footer */}
          <div className="p-3 border-t border-slate-800 bg-slate-950 text-[11px] text-slate-400 flex items-center gap-2">
            <Lock className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>Zero raw key bits sent over wire. Synchronized via Key IDs only.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
