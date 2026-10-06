import { ArrowLeft, ChevronRight } from 'lucide-react';

export default function BreadcrumbHeader({ onBack, title }) {
  return (
    <div className="h-14 border-b border-slate-800 bg-slate-900/90 px-6 flex items-center gap-3 text-xs flex-shrink-0">
      <button 
        onClick={onBack}
        className="w-8 h-8 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-colors shadow-sm"
        title="Go back to Home"
      >
        <ArrowLeft className="w-4 h-4" />
      </button>

      <div className="flex items-center gap-2 font-medium">
        <button 
          onClick={onBack}
          className="text-slate-400 hover:text-slate-200 transition-colors"
        >
          Home
        </button>
        <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
        <span className="font-bold text-slate-100">{title}</span>
      </div>
    </div>
  );
}
