import { useState } from 'react';
import { 
  HardDrive, 
  Folder, 
  FileText, 
  Image as ImageIcon, 
  Film, 
  Music, 
  UploadCloud, 
  Download
} from 'lucide-react';
import BreadcrumbHeader from '../BreadcrumbHeader';

const filesList = [
  { name: 'Project_Design_Mockups.fig', category: 'Design', size: '142 MB', updated: '2 hours ago', icon: ImageIcon },
  { name: 'Quarterly_Financial_Report.xlsx', category: 'Documents', size: '14 MB', updated: 'Yesterday', icon: FileText },
  { name: 'App_Demo_Video_Final.mp4', category: 'Videos', size: '1.2 GB', updated: 'Sep 24', icon: Film },
  { name: 'Background_Audio_Track.wav', category: 'Audio', size: '45 MB', updated: 'Sep 20', icon: Music },
];

export default function CloudStorageModule({ onBack }) {
  const [files] = useState(filesList);

  return (
    <div className="w-full h-full flex flex-col bg-slate-950 text-slate-100 font-sans overflow-hidden">
      {/* Breadcrumb Header */}
      <BreadcrumbHeader onBack={onBack} title="Cloud Storage Vault" />

      <div className="flex-1 p-8 overflow-y-auto">
        <div className="flex items-center justify-between mb-8 pb-6 border-b border-slate-800">
          <div>
            <h1 className="text-2xl font-bold text-slate-100">Cloud Storage Vault</h1>
            <p className="text-xs text-slate-400 mt-1">Encrypted personal & team file drive</p>
          </div>

          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-xs font-bold shadow-lg shadow-indigo-600/30 flex items-center gap-2">
            <UploadCloud className="w-4 h-4" /> Upload New File
          </button>
        </div>

        <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-bold">
              <HardDrive className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-200 text-sm">Storage Consumption</h3>
              <span className="text-xs text-slate-400 font-mono">1.41 GB of 100 GB used (1.41%)</span>
            </div>
          </div>

          <div className="w-72 bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full w-[2%]"></div>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center gap-3">
            <Folder className="w-8 h-8 text-blue-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-200">Documents</h4>
              <span className="text-[11px] text-slate-400">140 Files</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center gap-3">
            <Folder className="w-8 h-8 text-purple-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-200">Images & Assets</h4>
              <span className="text-[11px] text-slate-400">820 Files</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center gap-3">
            <Folder className="w-8 h-8 text-cyan-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-200">Videos & Media</h4>
              <span className="text-[11px] text-slate-400">45 Files</span>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center gap-3">
            <Folder className="w-8 h-8 text-emerald-500" />
            <div>
              <h4 className="text-xs font-bold text-slate-200">Archives</h4>
              <span className="text-[11px] text-slate-400">12 Files</span>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 rounded-3xl border border-slate-800 overflow-hidden flex flex-col">
          <div className="px-6 py-4 border-b border-slate-800 text-xs font-bold text-slate-400 grid grid-cols-12">
            <span className="col-span-6">FILE NAME</span>
            <span className="col-span-2">CATEGORY</span>
            <span className="col-span-2">SIZE</span>
            <span className="col-span-2 text-right">ACTION</span>
          </div>

          <div className="divide-y divide-slate-800/60 overflow-y-auto">
            {files.map((file, idx) => {
              const Icon = file.icon;
              return (
                <div key={idx} className="px-6 py-4 hover:bg-slate-800/30 text-xs grid grid-cols-12 items-center transition-colors">
                  <div className="col-span-6 flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-slate-950 text-indigo-400">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="font-bold text-slate-200 block">{file.name}</span>
                      <span className="text-[10px] text-slate-500">{file.updated}</span>
                    </div>
                  </div>
                  <span className="col-span-2 text-slate-400 font-medium">{file.category}</span>
                  <span className="col-span-2 text-slate-400 font-mono">{file.size}</span>
                  <div className="col-span-2 text-right flex items-center justify-end gap-3">
                    <button className="text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1">
                      <Download className="w-3.5 h-3.5" /> Download
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
