import React from 'react';
import { Search, Bell, Sparkles, User, RefreshCw, Plus, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminHeaderProps {
  activeTabTitle: string;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onRefresh: () => void;
  onQuickAction?: (action: string) => void;
  pendingCount?: number;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({
  activeTabTitle,
  searchQuery,
  onSearchChange,
  onRefresh,
  onQuickAction,
  pendingCount = 0,
}) => {
  const formattedTitle = (activeTabTitle || 'Overview').toUpperCase();

  return (
    <header className="bg-zinc-950 border-b border-zinc-800/80 px-6 py-4 sticky top-0 z-30 flex flex-col md:flex-row items-center justify-between gap-4">
      {/* Page Title & Breadcrumb */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500 uppercase tracking-widest">
            <span>Console</span>
            <span>/</span>
            <span className="text-[#C9A227] font-semibold">{formattedTitle}</span>
          </div>
          <h1 className="font-serif text-xl font-bold text-white tracking-wide capitalize">
            {activeTabTitle.replace('_', ' ')} Control
          </h1>
        </div>

        {pendingCount > 0 && (
          <span className="md:hidden bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold">
            {pendingCount} Pending
          </span>
        )}
      </div>

      {/* Global Search & Right Controls */}
      <div className="flex items-center gap-3 w-full md:w-auto justify-end">
        {/* Global Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Search CRM records, refs, names..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#C9A227] rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-zinc-500 focus:outline-none transition-colors"
          />
        </div>

        {/* Sync Button */}
        <button
          onClick={onRefresh}
          className="p-2 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white rounded-lg transition-colors"
          title="Refresh Data"
        >
          <RefreshCw className="w-4 h-4 text-[#C9A227]" />
        </button>

        {/* Notifications Bell */}
        <div className="relative">
          <button className="p-2 bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white rounded-lg transition-colors">
            <Bell className="w-4 h-4" />
          </button>
          {pendingCount > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 text-zinc-950 font-mono font-bold text-[9px] rounded-full flex items-center justify-center">
              {pendingCount}
            </span>
          )}
        </div>

        {/* Quick New Reservation CTA */}
        {onQuickAction && (
          <Button
            variant="gold"
            size="sm"
            onClick={() => onQuickAction('new_booking')}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            New Booking
          </Button>
        )}

        {/* Admin Avatar Badge */}
        <div className="hidden sm:flex items-center gap-2 pl-2 border-l border-zinc-800">
          <div className="w-7 h-7 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-xs font-bold text-[#C9A227]">
            <User className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-mono font-medium text-zinc-300 hidden xl:inline">Admin</span>
        </div>
      </div>
    </header>
  );
};
