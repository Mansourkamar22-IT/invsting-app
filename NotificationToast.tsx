import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notification, setNotification } = useApp();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  if (!notification) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-400 shrink-0" />,
    info: <Info className="w-5 h-5 text-cyan-400 shrink-0" />
  };

  const borders = {
    success: 'border-emerald-500/40 bg-slate-900/95',
    warning: 'border-amber-500/40 bg-slate-900/95',
    error: 'border-rose-500/40 bg-slate-900/95',
    info: 'border-cyan-500/40 bg-slate-900/95'
  };

  return (
    <div className="fixed top-16 sm:top-5 right-4 left-4 sm:left-auto sm:max-w-md z-50 animate-in slide-in-from-top-4 duration-300">
      <div className={`p-4 rounded-2xl border shadow-2xl backdrop-blur-xl flex items-start gap-3 ${borders[notification.type]}`}>
        {icons[notification.type]}
        <div className="flex-1 pr-2">
          <h4 className="text-xs font-bold text-white tracking-tight">{notification.title}</h4>
          <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">{notification.message}</p>
        </div>
        <button
          onClick={() => setNotification(null)}
          className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
