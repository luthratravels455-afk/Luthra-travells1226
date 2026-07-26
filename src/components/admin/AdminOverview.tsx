import React from 'react';
import { Booking, AdminStats } from '../../types';
import {
  Calendar,
  DollarSign,
  Car,
  Compass,
  TrendingUp,
  Activity,
  Clock,
  Plus,
  Download,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { AdminStatCard } from './AdminStatCard';
import { AdminBadge } from './AdminBadge';

interface AdminOverviewProps {
  stats: AdminStats | null;
  bookings: Booking[];
  onNavigateTab: (tab: any) => void;
  onExportCSV: () => void;
  onUpdateStatus: (id: number, status: any) => void;
}

export const AdminOverview: React.FC<AdminOverviewProps> = ({
  stats,
  bookings,
  onNavigateTab,
  onExportCSV,
  onUpdateStatus,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const todaysBookings = bookings.filter((b) => b.travel_date === todayStr);

  const activities = [
    { time: '10 mins ago', title: 'New Reservation Logged', desc: 'Customer booked Toyota Innova Crysta for Delhi → Agra.', type: 'booking' },
    { time: '35 mins ago', title: 'Per-KM Fare Verified', desc: 'Base fare rate active at ₹14/km across platform.', type: 'pricing' },
    { time: '2 hours ago', title: 'Status Confirmed', desc: 'Booking LT-982145 marked as CONFIRMED by Admin.', type: 'system' },
    { time: '4 hours ago', title: 'SEO Engine Synced', desc: 'Page meta descriptions synchronized for Airport Transfers.', type: 'seo' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* SaaS Welcome Banner */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-mono text-[#C9A227] uppercase tracking-widest">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> Executive CRM Control Room
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-wide">
            Luthra Travels Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400">
            Real-time reservation metrics, today's dispatches, active fleet, and recent activity telemetry.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Button
            variant="secondary"
            size="sm"
            onClick={onExportCSV}
            leftIcon={<Download className="w-3.5 h-3.5" />}
          >
            CSV Backup
          </Button>
          <Button
            variant="gold"
            size="sm"
            onClick={() => onNavigateTab('bookings')}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Manage CRM
          </Button>
        </div>
      </div>

      {/* Modern SaaS Stat Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <AdminStatCard
          title="Today's Dispatches"
          value={todaysBookings.length}
          change="+12%"
          isPositive={true}
          icon={<Calendar className="w-4 h-4" />}
          subtitle="Scheduled for today"
        />

        <AdminStatCard
          title="Total Reservations"
          value={stats?.totalBookings || bookings.length}
          change={`${stats?.pendingBookings || 0} Pending`}
          isPositive={true}
          icon={<Activity className="w-4 h-4" />}
          subtitle="All-time logged"
        />

        <AdminStatCard
          title="Pipeline Revenue"
          value={`₹${(stats?.totalRevenue || 0).toLocaleString()}`}
          change="+18%"
          isPositive={true}
          icon={<DollarSign className="w-4 h-4" />}
          subtitle="Estimated total fares"
        />

        <AdminStatCard
          title="Active Fleet"
          value="4 / 4"
          change="100% Ready"
          isPositive={true}
          icon={<Car className="w-4 h-4" />}
          subtitle="Innova • Ertiga • Dzire • Amaze"
        />
      </div>

      {/* Summary Insights & Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Demand Metrics Card */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
            <Compass className="w-4 h-4 text-[#C9A227]" /> Demand Metrics
          </h3>

          <div className="space-y-3 text-xs text-zinc-300 font-mono">
            <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="text-zinc-400">Most Popular Vehicle:</span>
              <span className="text-[#C9A227] font-bold">Toyota Innova Crysta</span>
            </div>

            <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="text-zinc-400">Top Outstation Route:</span>
              <span className="text-white font-bold">Delhi → Agra</span>
            </div>

            <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="text-zinc-400">Base Fare Rate:</span>
              <span className="text-emerald-400 font-bold">₹14 / kilometer</span>
            </div>

            <div className="flex justify-between items-center bg-zinc-950 p-3 rounded-xl border border-zinc-800">
              <span className="text-zinc-400">24/7 Helpline:</span>
              <span className="text-zinc-200 font-bold">+91 99589 56593</span>
            </div>
          </div>
        </div>

        {/* System Activity Timeline */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-serif text-base font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#C9A227]" /> Recent System Activity Log
            </h3>
            <button
              onClick={() => onNavigateTab('logs')}
              className="text-xs text-[#C9A227] font-semibold hover:underline font-mono"
            >
              Full Logs →
            </button>
          </div>

          <div className="space-y-3">
            {activities.map((act, i) => (
              <div key={i} className="flex items-start justify-between bg-zinc-950 p-3.5 rounded-xl border border-zinc-800/80 text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-white block">{act.title}</span>
                  <span className="text-zinc-400 block">{act.desc}</span>
                </div>
                <span className="text-[10px] text-zinc-500 font-mono shrink-0">{act.time}</span>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Today's Dispatches Quick Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="font-serif text-lg font-bold text-white">Today's Scheduled Dispatches</h3>
            <p className="text-xs text-zinc-400">Status updates for reservations scheduled for today's date.</p>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onNavigateTab('bookings')}
          >
            Open Full CRM →
          </Button>
        </div>

        {todaysBookings.length === 0 ? (
          <div className="text-center py-8 text-xs text-zinc-500 font-mono bg-zinc-950 rounded-xl border border-zinc-800">
            No specific dispatches scheduled for today's date yet.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-zinc-800">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-[#C9A227] font-mono uppercase border-b border-zinc-800">
                <tr>
                  <th className="p-3">Ref</th>
                  <th className="p-3">Customer</th>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Pickup → Drop</th>
                  <th className="p-3">Pickup Time</th>
                  <th className="p-3">Fare</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                {todaysBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-zinc-800/40">
                    <td className="p-3 font-mono font-bold text-[#C9A227]">{b.booking_ref}</td>
                    <td className="p-3 font-semibold text-white">{b.customer_name} ({b.customer_phone})</td>
                    <td className="p-3">{b.vehicle}</td>
                    <td className="p-3">{b.pickup} → {b.drop_location}</td>
                    <td className="p-3 font-mono">{b.pickup_time}</td>
                    <td className="p-3 font-mono text-[#C9A227]">₹{b.estimated_amount}</td>
                    <td className="p-3">
                      <select
                        value={b.status}
                        onChange={(e) => b.id && onUpdateStatus(b.id, e.target.value)}
                        className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[11px] text-white"
                      >
                        <option value="NEW">NEW</option>
                        <option value="PENDING">PENDING</option>
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
