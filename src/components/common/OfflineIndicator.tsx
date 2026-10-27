import React from 'react';
import { WifiOff, CheckCircle2, CloudDownload, HardDrive } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { offlineCacheService } from '../../services/offlineCacheService';

interface OfflineIndicatorProps {
  onOpenOfflineLibrary?: () => void;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ onOpenOfflineLibrary }) => {
  const { isOnline, isSimulatedOffline, toggleSimulateOffline } = useOnlineStatus();
  const cachedCount = offlineCacheService.getAllCachedChapters().length;

  if (isOnline && !isSimulatedOffline) return null;

  return (
    <div className="fixed bottom-16 sm:bottom-6 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] animate-bounce-subtle pointer-events-auto">
      <div className="flex items-center justify-between gap-3 p-3 bg-slate-900/95 text-white rounded-2xl border border-amber-500/40 shadow-2xl backdrop-blur-md">
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <WifiOff className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{isSimulatedOffline ? 'Simulated Offline Mode' : 'You are Offline'}</span>
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              {cachedCount} chapter{cachedCount === 1 ? '' : 's'} available offline with study materials & MCQs
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {onOpenOfflineLibrary && (
            <button
              onClick={onOpenOfflineLibrary}
              className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[11px] transition-colors cursor-pointer flex items-center gap-1"
            >
              <HardDrive className="w-3 h-3" />
              <span>Library</span>
            </button>
          )}

          {isSimulatedOffline && (
            <button
              onClick={toggleSimulateOffline}
              className="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-slate-300 text-[10px] font-medium"
              title="Return to Online Mode"
            >
              Exit
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
