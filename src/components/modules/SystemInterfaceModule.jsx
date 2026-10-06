import { useState } from 'react';
import { 
  Users, 
  Cpu, 
  ShieldCheck, 
  Play, 
  CheckCircle2, 
  RefreshCw, 
  Server,
  Database,
  Key,
  ShieldAlert,
  XCircle
} from 'lucide-react';
import BreadcrumbHeader from '../BreadcrumbHeader';
import keyDatabaseRaw from '../../../key_database.txt?raw';

function parseKeyDatabase(rawText) {
  if (!rawText) return [];
  const lines = rawText.trim().split('\n');
  const keys = [];
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    const parts = trimmed.split('\t');
    if (parts.length >= 9) {
      keys.push({
        id: parts[0],
        protocol: parts[1],
        bitLength: parseInt(parts[2], 10) || 256,
        status: parts[3],
        pair: parts[4],
        timestamp: parts[5],
        expiry: parts[6],
        qber: parts[7],
        binaryKey: parts[8].trim()
      });
    } else {
      const spaceParts = trimmed.split(/\s+/);
      if (spaceParts.length >= 9) {
        keys.push({
          id: spaceParts[0],
          protocol: spaceParts[1],
          bitLength: parseInt(spaceParts[2], 10) || 256,
          status: spaceParts[3],
          pair: spaceParts[4],
          timestamp: `${spaceParts[5]} ${spaceParts[6]}`,
          expiry: spaceParts[7],
          qber: spaceParts[8],
          binaryKey: spaceParts[spaceParts.length - 1].trim()
        });
      }
    }
  }
  return keys;
}

function binaryToHex(binStr) {
  if (!binStr) return '';
  let hex = '0x';
  for (let i = 0; i < binStr.length; i += 4) {
    const chunk = binStr.substring(i, i + 4);
    if (chunk.length === 4) {
      hex += parseInt(chunk, 2).toString(16).toUpperCase();
    }
  }
  return hex;
}

const onlineUsers = [
  { id: 'iit-roorkee', name: 'IIT Roorkee', ip: '192.168.1.101', status: 'Online', latency: '0.4 ms' },
  { id: 'iiser-bhopal', name: 'IISER Bhopal', ip: '192.168.1.104', status: 'Online', latency: '0.9 ms' },
  { id: 'iisc-bangalore', name: 'IISc Bangalore', ip: '192.168.1.105', status: 'Online', latency: '1.2 ms' },
  { id: 'iit-delhi', name: 'IIT Delhi', ip: '192.168.1.108', status: 'Online', latency: '0.6 ms' },
  { id: 'iit-jammu', name: 'IIT Jammu', ip: '192.168.1.112', status: 'Online', latency: '1.5 ms' },
];

const simTools = [
  { id: 'simulaqron', name: 'SimulaQron', desc: 'Application-level quantum network simulator' },
  { id: 'squanch', name: 'SQUANCH', desc: 'Simulator for Quantum Networks and Channels' },
  { id: 'qunetsim', name: 'QuNetSim', desc: 'Quantum network simulator framework' },
  { id: 'qkdnetsim', name: 'QKDNetSim', desc: 'QKD network simulation module' },
];

const protocols = [
  { id: 'bb84', name: 'BB84', type: 'Prepare-and-Measure', desc: 'First quantum key distribution protocol based on 4 polarization states' },
  { id: 'e91', name: 'E91', type: 'Entanglement-Based', desc: 'Ekert protocol utilizing EPR entangled photon pairs and Bell inequality test' },
  { id: 'e92', name: 'E92', type: 'Entanglement-Based', desc: 'Simplified 3-state entanglement protocol' },
  { id: 'cvqkd', name: 'CV-QKD', type: 'Continuous Variable', desc: 'Continuous-variable QKD utilizing coherent light states' },
];

export default function SystemInterfaceModule({ onBack }) {
  // Step State: 1 = Select User, 2 = Select Tool, 3 = Select Protocol, 4 = Configure & Generate Key
  const [step, setStep] = useState(1);

  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedTool, setSelectedTool] = useState(null);
  const [selectedProtocol, setSelectedProtocol] = useState(null);

  // Parameters Configuration
  const [numBits, setNumBits] = useState(256);
  const [fiberDistance, setFiberDistance] = useState(25); // km
  const [noiseRate, setNoiseRate] = useState(0.02); // 2%

  // Simulation execution state
  const [isSimulating, setIsSimulating] = useState(false);
  const [generatedKey, setGeneratedKey] = useState(null);
  const [simMetrics, setSimMetrics] = useState(null);

  // Remaining active keys and deactivated keys from database
  const [otherActiveKeys, setOtherActiveKeys] = useState([]);
  const [deactivatedKeys, setDeactivatedKeys] = useState([]);

  const handleRunSimulation = () => {
    setIsSimulating(true);
    setGeneratedKey(null);
    setSimMetrics(null);
    setOtherActiveKeys([]);
    setDeactivatedKeys([]);

    setTimeout(() => {
      const dbKeys = parseKeyDatabase(keyDatabaseRaw);
      
      // Filter keys by status
      const activeKeys = dbKeys.filter(k => k.status.toUpperCase() === 'ACTIVE');
      const expiredOrDeactivatedKeys = dbKeys.filter(k => k.status.toUpperCase() !== 'ACTIVE');

      let selectedRecord = null;
      if (activeKeys.length > 0) {
        const randomIndex = Math.floor(Math.random() * activeKeys.length);
        selectedRecord = activeKeys[randomIndex];
      }

      // Remaining active keys excluding the randomly selected one
      const remainingActive = activeKeys.filter(k => k.id !== selectedRecord?.id);

      setOtherActiveKeys(remainingActive);
      setDeactivatedKeys(expiredOrDeactivatedKeys);

      let binKey = '';
      let hexKey = '0x';

      if (selectedRecord) {
        binKey = selectedRecord.binaryKey;
        hexKey = binaryToHex(selectedRecord.binaryKey);
      } else {
        const hexChars = '0123456789ABCDEF';
        for (let i = 0; i < 64; i++) {
          hexKey += hexChars[Math.floor(Math.random() * 16)];
        }
        for (let i = 0; i < 256; i++) {
          binKey += Math.random() > 0.5 ? '1' : '0';
        }
      }

      setGeneratedKey({
        keyId: selectedRecord ? selectedRecord.id : null,
        hex: hexKey,
        binarySample: binKey,
        length: selectedRecord ? selectedRecord.bitLength : numBits,
        status: 'KEY_EXCHANGED_SECURE',
        dbStatus: selectedRecord ? selectedRecord.status : 'ACTIVE',
        timestamp: selectedRecord ? selectedRecord.timestamp : new Date().toISOString(),
        pair: selectedRecord ? selectedRecord.pair : `${selectedUser?.name || 'Node'}-Local`,
        protocol: selectedRecord ? selectedRecord.protocol : (selectedProtocol?.name || 'BB84')
      });

      setSimMetrics({
        qber: selectedRecord && selectedRecord.qber !== undefined && selectedRecord.qber !== '0'
          ? selectedRecord.qber + '%' 
          : (noiseRate * 100 + (Math.random() * 0.5)).toFixed(2) + '%',
        siftedKeyLength: selectedRecord ? Math.floor(selectedRecord.bitLength * 0.5) : Math.floor(numBits * 0.5),
        finalKeyLength: selectedRecord ? selectedRecord.bitLength : Math.floor(numBits * 0.25),
        transmissionTime: (fiberDistance * 0.05 + 0.12).toFixed(2) + ' ms'
      });

      setIsSimulating(false);
    }, 1200);
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Breadcrumb Header */}
      <BreadcrumbHeader onBack={onBack} title="System Interface — Quantum Simulation Workflow" />

      {/* Stepper Progress Bar */}
      <div className="bg-slate-900 border-b border-slate-800 px-8 py-3 flex items-center justify-between text-xs">
        <div className={`flex items-center gap-2 font-bold cursor-pointer ${step >= 1 ? 'text-indigo-400' : 'text-slate-500'}`} onClick={() => setStep(1)}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>1</span>
          <span>1. Select User / Node</span>
        </div>

        <span className="text-slate-700">→</span>

        <div className={`flex items-center gap-2 font-bold cursor-pointer ${step >= 2 ? 'text-indigo-400' : 'text-slate-500'}`} onClick={() => selectedUser && setStep(2)}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>2</span>
          <span>2. Simulation Tool</span>
        </div>

        <span className="text-slate-700">→</span>

        <div className={`flex items-center gap-2 font-bold cursor-pointer ${step >= 3 ? 'text-indigo-400' : 'text-slate-500'}`} onClick={() => selectedTool && setStep(3)}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>3</span>
          <span>3. Select Protocol</span>
        </div>

        <span className="text-slate-700">→</span>

        <div className={`flex items-center gap-2 font-bold cursor-pointer ${step >= 4 ? 'text-indigo-400' : 'text-slate-500'}`} onClick={() => selectedProtocol && setStep(4)}>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 4 ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400'}`}>4</span>
          <span>4. Config & Key Exchange</span>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="flex-1 p-8 overflow-y-auto">
        {/* STEP 1: ONLINE USERS */}
        {step === 1 && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-5 h-5 text-indigo-400" /> Select Remote User / Node
              </h2>
              <p className="text-xs text-slate-400 mt-1">Select an active user node to initiate key distribution workflow</p>
            </div>

            <div className="grid grid-cols-3 gap-6">
              {onlineUsers.map((user) => (
                <div
                  key={user.id}
                  onClick={() => {
                    setSelectedUser(user);
                    setStep(2);
                  }}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between h-52 relative group ${
                    selectedUser?.id === user.id 
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-xl shadow-indigo-600/20' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
                      <Server className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold">
                      {user.status} ({user.latency})
                    </span>
                  </div>

                  <div>
                    <h3 className="font-bold text-slate-100 text-base group-hover:text-indigo-300 transition-colors">{user.name}</h3>
                    <p className="text-xs text-slate-400 font-mono mt-1">{user.ip}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: SIMULATION TOOLS */}
        {step === 2 && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Connected Target: {selectedUser?.name}</span>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mt-1">
                <Cpu className="w-5 h-5 text-indigo-400" /> Select Simulator
              </h2>
              <p className="text-xs text-slate-400 mt-1">Select quantum networking simulation backend tool</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {simTools.map((tool) => (
                <div
                  key={tool.id}
                  onClick={() => {
                    setSelectedTool(tool);
                    setStep(3);
                  }}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer flex items-center gap-5 ${
                    selectedTool?.id === tool.id 
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-xl' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50'
                  }`}
                >
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black text-lg flex-shrink-0 shadow-lg shadow-indigo-600/30">
                    {tool.name[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-100 text-lg">{tool.name}</h3>
                    <p className="text-xs text-slate-400 mt-1 leading-relaxed">{tool.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 3: PROTOCOLS */}
        {step === 3 && (
          <div className="space-y-6 max-w-5xl mx-auto">
            <div>
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-wider">Target: {selectedUser?.name} | Tool: {selectedTool?.name}</span>
              <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2 mt-1">
                <ShieldCheck className="w-5 h-5 text-indigo-400" /> Select Protocol
              </h2>
              <p className="text-xs text-slate-400 mt-1">Choose key exchange protocol for the simulation</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              {protocols.map((proto) => (
                <div
                  key={proto.id}
                  onClick={() => {
                    setSelectedProtocol(proto);
                    setStep(4);
                  }}
                  className={`p-6 rounded-3xl border transition-all cursor-pointer space-y-3 ${
                    selectedProtocol?.id === proto.id 
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-xl' 
                      : 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-black text-slate-100 text-xl tracking-wide">{proto.name}</h3>
                    <span className="px-3 py-1 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800 text-[10px] font-bold">
                      {proto.type}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{proto.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 4: CONFIGURATION & KEY GENERATION */}
        {step === 4 && (
          <div className="space-y-8 max-w-5xl mx-auto">
            <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">Selected Configuration</span>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-sm font-bold text-slate-200">Target: <strong className="text-indigo-400">{selectedUser?.name}</strong></span>
                  <span className="text-slate-600">|</span>
                  <span className="text-sm font-bold text-slate-200">Tool: <strong className="text-indigo-400">{selectedTool?.name}</strong></span>
                  <span className="text-slate-600">|</span>
                  <span className="text-sm font-bold text-slate-200">Protocol: <strong className="text-indigo-400">{selectedProtocol?.name}</strong></span>
                </div>
              </div>

              <button 
                onClick={handleRunSimulation}
                disabled={isSimulating}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 text-white font-bold text-xs rounded-2xl shadow-xl shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-105 cursor-pointer"
              >
                {isSimulating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-white" />
                    <span>Executing Protocol...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>Run Protocol & Generate Key</span>
                  </>
                )}
              </button>
            </div>

            {/* Parameters Slider Form */}
            <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 grid grid-cols-3 gap-6">
              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between mb-2">
                  <span>Key Length (Bits)</span>
                  <span className="text-indigo-400 font-mono">{numBits} Bits</span>
                </label>
                <input 
                  type="range" 
                  min="128" 
                  max="1024" 
                  step="128" 
                  value={numBits} 
                  onChange={(e) => setNumBits(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between mb-2">
                  <span>Fiber Channel Distance</span>
                  <span className="text-indigo-400 font-mono">{fiberDistance} km</span>
                </label>
                <input 
                  type="range" 
                  min="5" 
                  max="100" 
                  step="5" 
                  value={fiberDistance} 
                  onChange={(e) => setFiberDistance(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 flex items-center justify-between mb-2">
                  <span>Channel Noise Rate (QBER)</span>
                  <span className="text-indigo-400 font-mono">{(noiseRate * 100).toFixed(1)}%</span>
                </label>
                <input 
                  type="range" 
                  min="0.005" 
                  max="0.08" 
                  step="0.005" 
                  value={noiseRate} 
                  onChange={(e) => setNoiseRate(Number(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Result Sections Container */}
            {generatedKey && (
              <div className="space-y-8 animate-fadeIn">
                {/* SECTION 1: GENERATED KEY */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                      <Key className="w-5 h-5 text-indigo-400" /> Generated Key
                    </h3>
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                      SELECTED RANDOM ACTIVE KEY
                    </span>
                  </div>

                  <div className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/40 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                        <CheckCircle2 className="w-5 h-5" /> Key Exchange Successfully Completed
                      </div>
                      <div className="flex items-center gap-2">
                        {generatedKey.keyId !== null && (
                          <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-xs font-mono font-bold flex items-center gap-1">
                            <Database className="w-3.5 h-3.5 text-indigo-400" /> DB Key #{generatedKey.keyId}
                          </span>
                        )}
                        <span className="text-xs font-mono text-slate-400">STATUS: {generatedKey.status}</span>
                      </div>
                    </div>

                    {/* Key Metadata from key_database.txt */}
                    <div className="grid grid-cols-4 gap-3 text-xs font-mono bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">DB Node Pair</span>
                        <strong className="text-indigo-300">{generatedKey.pair}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">DB Protocol</span>
                        <strong className="text-indigo-300">{generatedKey.protocol}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">DB Key Status</span>
                        <strong className="text-emerald-400">{generatedKey.dbStatus}</strong>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[10px] uppercase font-bold">Created Timestamp</span>
                        <strong className="text-slate-300">{generatedKey.timestamp}</strong>
                      </div>
                    </div>

                    {/* Generated Key Stream - Hexadecimal */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between mb-1">
                        <span>Selected Secret Key (Hexadecimal)</span>
                        <span className="text-indigo-400 font-mono text-[10px]">{generatedKey.length} Bits</span>
                      </label>
                      <div className="p-4 rounded-2xl bg-slate-950 font-mono text-xs text-indigo-300 border border-slate-800 break-all select-all">
                        {generatedKey.hex}
                      </div>
                    </div>

                    {/* Generated Key Stream - Binary */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between mb-1">
                        <span>Full Raw Binary Stream (from key_database.txt)</span>
                        <span className="text-emerald-400 font-mono text-[10px]">{generatedKey.binarySample.length} Bits</span>
                      </label>
                      <div className="p-4 rounded-2xl bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800 break-all select-all max-h-28 overflow-y-auto leading-relaxed">
                        {generatedKey.binarySample}
                      </div>
                    </div>

                    {/* Simulation Telemetry Metrics */}
                    {simMetrics && (
                      <div className="grid grid-cols-4 gap-4 pt-2">
                        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 uppercase block font-bold">Estimated QBER</span>
                          <span className="text-sm font-bold text-emerald-400 font-mono">{simMetrics.qber}</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 uppercase block font-bold">Sifted Bits</span>
                          <span className="text-sm font-bold text-indigo-400 font-mono">{simMetrics.siftedKeyLength} bits</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 uppercase block font-bold">Final Secret Bits</span>
                          <span className="text-sm font-bold text-cyan-400 font-mono">{simMetrics.finalKeyLength} bits</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                          <span className="text-[10px] text-slate-400 uppercase block font-bold">Exchange Latency</span>
                          <span className="text-sm font-bold text-slate-200 font-mono">{simMetrics.transmissionTime}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* SECTION 2: AVAILABLE KEYS */}
                {otherActiveKeys.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-emerald-400 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Available Keys ({otherActiveKeys.length})
                      </h3>
                      <span className="text-xs font-mono text-emerald-400/80 font-bold bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">
                        ACTIVE DATABASE KEYS
                      </span>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      {otherActiveKeys.map((key) => (
                        <div key={key.id} className="p-6 rounded-3xl bg-slate-900 border border-emerald-500/30 shadow-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1">
                              <Database className="w-3.5 h-3.5 text-emerald-400" /> DB Key #{key.id}
                            </span>
                            <span className="text-xs font-mono text-emerald-400 font-bold">STATUS: ACTIVE</span>
                          </div>

                          <div className="grid grid-cols-4 gap-3 text-xs font-mono bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                            <div>
                              <span className="text-slate-500 block text-[10px] uppercase font-bold">DB Node Pair</span>
                              <strong className="text-indigo-300">{key.pair}</strong>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px] uppercase font-bold">DB Protocol</span>
                              <strong className="text-indigo-300">{key.protocol}</strong>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px] uppercase font-bold">Key Length</span>
                              <strong className="text-slate-300">{key.bitLength} Bits</strong>
                            </div>
                            <div>
                              <span className="text-slate-500 block text-[10px] uppercase font-bold">Created Timestamp</span>
                              <strong className="text-slate-300">{key.timestamp}</strong>
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Secret Key (Hexadecimal)</label>
                            <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-indigo-300 border border-slate-800 break-all select-all">
                              {binaryToHex(key.binaryKey)}
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">Raw Binary Stream</label>
                            <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800 break-all select-all max-h-24 overflow-y-auto leading-relaxed">
                              {key.binaryKey}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* SECTION 3: DEACTIVATED KEYS */}
                {deactivatedKeys.length > 0 && (
                  <div className="space-y-4 pt-4 border-t border-slate-800">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-bold text-red-400 flex items-center gap-2">
                        <XCircle className="w-5 h-5 text-red-400" /> Deactivated Keys ({deactivatedKeys.length})
                      </h3>
                      <span className="text-xs font-mono text-red-400 font-bold bg-red-500/10 px-3 py-1 rounded-full border border-red-500/20">
                        STATUS: EXPIRED / DEACTIVATED
                      </span>
                    </div>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-1">
                      {deactivatedKeys.map((key) => (
                        <div key={key.id} className="p-6 rounded-3xl bg-red-950/20 border border-red-500/40 shadow-lg space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-mono font-bold flex items-center gap-1">
                              <Database className="w-3.5 h-3.5 text-red-400" /> DB Key #{key.id}
                            </span>
                            <span className="text-xs font-mono text-red-400 font-bold">STATUS: EXPIRED</span>
                          </div>

                          <div className="grid grid-cols-4 gap-3 text-xs font-mono bg-slate-950/80 p-3 rounded-2xl border border-red-900/40">
                            <div>
                              <span className="text-red-400/60 block text-[10px] uppercase font-bold">DB Node Pair</span>
                              <strong className="text-red-200">{key.pair}</strong>
                            </div>
                            <div>
                              <span className="text-red-400/60 block text-[10px] uppercase font-bold">DB Protocol</span>
                              <strong className="text-red-200">{key.protocol}</strong>
                            </div>
                            <div>
                              <span className="text-red-400/60 block text-[10px] uppercase font-bold">Key Length</span>
                              <strong className="text-red-300">{key.bitLength} Bits</strong>
                            </div>
                            <div>
                              <span className="text-red-400/60 block text-[10px] uppercase font-bold">Created Timestamp</span>
                              <strong className="text-red-300">{key.timestamp}</strong>
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-red-400/70 uppercase tracking-wider block mb-1">Secret Key (Hexadecimal)</label>
                            <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-red-400 border border-red-900/40 break-all select-all opacity-80">
                              {binaryToHex(key.binaryKey)}
                            </div>
                          </div>

                          <div>
                            <label className="text-[11px] font-bold text-red-400/70 uppercase tracking-wider block mb-1">Raw Binary Stream</label>
                            <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-red-400 border border-red-900/40 break-all select-all max-h-24 overflow-y-auto leading-relaxed opacity-80">
                              {key.binaryKey}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
