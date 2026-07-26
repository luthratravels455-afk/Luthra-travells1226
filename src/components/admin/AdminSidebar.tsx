import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  MessageSquare,
  CalendarDays,
  Users,
  UserCheck,
  Printer,
  BarChart3,
  Car,
  Tag,
  Activity,
  FileText,
  Image as ImageIcon,
  Globe,
  TrendingUp,
  Bell,
  MapPin,
  Settings,
  ShieldCheck,
  Database,
  RefreshCw,
  LogOut,
  Sparkles,
  HelpCircle,
  Star,
} from 'lucide-react';

export type AdminTab =
  | 'dashboard'
  | 'overview'
  | 'bookings'
  | 'inquiries'
  | 'calendar'
  | 'customers'
  | 'operations'
  | 'invoices'
  | 'reports'
  | 'fleet'
  | 'pricing'
  | 'locations'
  | 'content'
  | 'blogs'
  | 'media'
  | 'seo'
  | 'analytics'
  | 'integrations'
  | 'settings'
  | 'notifications'
  | 'security'
  | 'users'
  | 'backup';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  pendingCount: number;
  onRefresh: () => void;
  onLogout: () => void;
}

interface NavGroup {
  title: string;
  items: { id: AdminTab; label: string; icon: React.ReactNode; badge?: number }[];
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  pendingCount,
  onRefresh,
  onLogout,
}) => {
  const groups: NavGroup[] = [
    {
      title: 'CORE CRM',
      items: [
        { id: 'dashboard', label: 'Overview Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
        { id: 'bookings', label: 'Bookings CRM', icon: <Calendar className="w-4 h-4" />, badge: pendingCount },
        { id: 'inquiries', label: 'Inquiries Log', icon: <MessageSquare className="w-4 h-4" /> },
        { id: 'calendar', label: 'Dispatch Calendar', icon: <CalendarDays className="w-4 h-4" /> },
      ],
    },
    {
      title: 'FLEET & LOCATIONS',
      items: [
        { id: 'fleet', label: 'Fleet CMS', icon: <Car className="w-4 h-4" /> },
        { id: 'pricing', label: 'Pricing Engine', icon: <Tag className="w-4 h-4" /> },
        { id: 'locations', label: 'Locations & Services', icon: <MapPin className="w-4 h-4" /> },
        { id: 'operations', label: 'Chauffeur Roster', icon: <UserCheck className="w-4 h-4" /> },
        { id: 'customers', label: 'Customer Profiles', icon: <Users className="w-4 h-4" /> },
      ],
    },
    {
      title: 'CONTENT & MARKETING',
      items: [
        { id: 'content', label: 'Website Content', icon: <Sparkles className="w-4 h-4" /> },
        { id: 'blogs', label: 'Blog Manager', icon: <FileText className="w-4 h-4" /> },
        { id: 'media', label: 'Media Library', icon: <ImageIcon className="w-4 h-4" /> },
        { id: 'seo', label: 'SEO Engine', icon: <Globe className="w-4 h-4" /> },
        { id: 'analytics', label: 'Analytics', icon: <TrendingUp className="w-4 h-4" /> },
      ],
    },
    {
      title: 'SYSTEM & SETTINGS',
      items: [
        { id: 'settings', label: 'Site Settings', icon: <Settings className="w-4 h-4" /> },
        { id: 'integrations', label: 'Integrations', icon: <Activity className="w-4 h-4 text-[#C9A227]" /> },
        { id: 'notifications', label: 'Notifications', icon: <Bell className="w-4 h-4" /> },
        { id: 'security', label: 'Security', icon: <ShieldCheck className="w-4 h-4 text-emerald-400" /> },
        { id: 'backup', label: 'Database Backup', icon: <Database className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <aside className="w-full md:w-64 bg-zinc-950 border-r border-zinc-800/80 p-4 flex flex-col justify-between shrink-0 sticky top-0 h-auto md:h-screen overflow-y-auto">
      <div className="space-y-6">
        
        {/* Branding */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80 px-1">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#C9A227] flex items-center justify-center font-bold text-zinc-950 font-serif text-sm shadow-md shadow-[#C9A227]/20">
              LT
            </div>
            <div>
              <span className="font-serif font-bold text-white text-sm block leading-tight tracking-wide">
                Luthra Console
              </span>
              <span className="text-[10px] text-zinc-500 font-mono block">Enterprise CMS</span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" title="System Active" />
        </div>

        {/* Navigation Group */}
        <div className="space-y-5">
          {groups.map((group, idx) => (
            <div key={idx} className="space-y-1.5">
              <h4 className="text-[10px] font-mono font-bold text-zinc-500 tracking-widest uppercase px-3">
                {group.title}
              </h4>
              <nav className="space-y-0.5">
                {group.items.map((item) => {
                  const isActive =
                    activeTab === item.id ||
                    (item.id === 'dashboard' && activeTab === 'overview') ||
                    (item.id === 'overview' && activeTab === 'dashboard');

                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-zinc-800 text-[#C9A227] font-semibold border border-[#C9A227]/30 shadow-sm'
                          : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/80'
                      }`}
                    >
                      <span className="flex items-center gap-2.5">
                        <span className={isActive ? 'text-[#C9A227]' : 'text-zinc-400'}>{item.icon}</span>
                        <span>{item.label}</span>
                      </span>
                      {item.badge && item.badge > 0 ? (
                        <span className="text-[10px] font-mono font-extrabold px-1.5 py-0.2 rounded-full bg-[#C9A227] text-zinc-950">
                          {item.badge}
                        </span>
                      ) : null}
                    </button>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

      </div>

      {/* System Actions */}
      <div className="pt-4 mt-6 border-t border-zinc-800/80 space-y-2">
        <button
          onClick={onRefresh}
          className="w-full flex items-center justify-center gap-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs py-2 rounded-lg transition-colors font-mono"
        >
          <RefreshCw className="w-3.5 h-3.5 text-[#C9A227]" /> Sync CMS
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center justify-center gap-2 bg-rose-950/30 border border-rose-500/20 text-rose-300 text-xs py-2 rounded-lg hover:bg-rose-900/40 transition-colors font-mono"
        >
          <LogOut className="w-3.5 h-3.5" /> Logout Admin
        </button>
      </div>
    </aside>
  );
};
