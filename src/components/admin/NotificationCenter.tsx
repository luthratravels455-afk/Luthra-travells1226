import React, { useState } from 'react';
import { Bell, CheckCircle, AlertTriangle, Info, Calendar, RefreshCw, Trash2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../../contexts/ToastContext';

export interface AdminNotification {
  id: number;
  title: string;
  message: string;
  type: 'BOOKING' | 'SYSTEM' | 'SEO' | 'CONTENT';
  time: string;
  read: boolean;
}

export const NotificationCenter: React.FC = () => {
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<AdminNotification[]>([
    {
      id: 1,
      title: 'New Booking Reservation',
      message: 'Vikram Malhotra reserved Toyota Innova Crysta for Delhi IGI Airport transfer on 2025-02-25.',
      type: 'BOOKING',
      time: '10 mins ago',
      read: false,
    },
    {
      id: 2,
      title: 'Database Auto-Resilience Wakeup',
      message: 'Supabase database client health check verified. Zero downtime recorded.',
      type: 'SYSTEM',
      time: '1 hour ago',
      read: true,
    },
    {
      id: 3,
      title: 'Sitemap.xml Auto-Regenerated',
      message: 'Updated sitemap submitted to Google Search Console for instant indexing.',
      type: 'SEO',
      time: '3 hours ago',
      read: true,
    },
    {
      id: 4,
      title: 'Website Settings Saved',
      message: 'Global per-kilometer pricing rate confirmed at ₹14/KM.',
      type: 'CONTENT',
      time: 'Yesterday',
      read: true,
    },
  ]);

  const handleMarkAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'success');
  };

  const handleDeleteNotification = (id: number) => {
    setNotifications(notifications.filter((n) => n.id !== id));
    showToast('Notification cleared', 'info');
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="space-y-6 animate-fadeIn max-w-4xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Bell className="w-6 h-6 text-[#C9A227]" /> CMS Notification Center
          </h2>
          <p className="text-xs text-zinc-400">Real-time alerts for incoming bookings, system resilience, and SEO updates.</p>
        </div>

        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>
              Mark All Read ({unreadCount})
            </Button>
          )}
        </div>
      </div>

      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
              !n.read
                ? 'bg-zinc-900 border-[#C9A227]/40 shadow-lg shadow-[#C9A227]/5'
                : 'bg-zinc-900/60 border-zinc-800/80 opacity-80'
            }`}
          >
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    n.type === 'BOOKING'
                      ? 'emerald'
                      : n.type === 'SYSTEM'
                      ? 'gold'
                      : n.type === 'SEO'
                      ? 'dark'
                      : 'outline'
                  }
                  dot={!n.read}
                >
                  {n.type} ALERT
                </Badge>
                <span className="text-[10px] text-zinc-400 font-mono">{n.time}</span>
              </div>

              <h4 className="font-serif font-bold text-white text-base">{n.title}</h4>
              <p className="text-xs text-zinc-300 leading-relaxed">{n.message}</p>
            </div>

            <button
              onClick={() => handleDeleteNotification(n.id)}
              className="text-zinc-500 hover:text-rose-400 p-1 rounded-lg transition-colors"
              title="Dismiss Alert"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
