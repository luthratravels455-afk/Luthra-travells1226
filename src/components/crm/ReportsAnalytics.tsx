import React from 'react';
import { BarChart3, TrendingUp, Users, Car, Download } from 'lucide-react';
import { Booking } from '../../types';

export interface ReportsAnalyticsProps {
  bookings: Booking[];
}

export const ReportsAnalytics: React.FC<ReportsAnalyticsProps> = ({ bookings }) => {
  const totalRevenue = bookings.reduce((sum, b) => sum + (Number(b.estimated_amount) || 0), 0);
  const totalCompleted = bookings.filter(b => b.status === 'COMPLETED').length;
  const totalConfirmed = bookings.filter(b => b.status === 'CONFIRMED').length;

  const handleExportCSV = () => {
    const headers = ['Ref', 'Customer', 'Phone', 'Vehicle', 'TripType', 'Pickup', 'Drop', 'Date', 'Time', 'Amount', 'Status'];
    const rows = bookings.map(b => [
      b.booking_ref, b.customer_name, b.customer_phone, b.vehicle, b.trip_type,
      `"${b.pickup}"`, `"${b.drop_location}"`, b.travel_date, b.pickup_time, b.estimated_amount, b.status
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Luthra_Travels_Audit_Report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-[#C9A227]" />
          <div>
            <h3 className="font-serif text-xl font-bold text-white">Operations &amp; Revenue Analytics</h3>
            <p className="text-xs text-zinc-400">Real-time performance reports and CSV audit exports</p>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          className="bg-[#C9A227] text-zinc-950 font-bold text-xs px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-[#b8911d] transition-colors"
        >
          <Download className="w-4 h-4" /> Export CSV Audit Report
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase">Gross Revenue Volume</span>
          <div className="text-2xl font-bold text-[#C9A227] font-mono">₹{totalRevenue.toLocaleString()}</div>
        </div>
        <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase">Completed Dispatches</span>
          <div className="text-2xl font-bold text-emerald-400 font-mono">{totalCompleted} Trips</div>
        </div>
        <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-1">
          <span className="text-[10px] font-mono text-zinc-400 uppercase">Active Confirmed Pipeline</span>
          <div className="text-2xl font-bold text-amber-300 font-mono">{totalConfirmed} Trips</div>
        </div>
      </div>
    </div>
  );
};
