import React from 'react';
import { BarChart3, TrendingUp, Users, Phone, MessageCircle, Globe, MapPin, Eye, ExternalLink, ShieldCheck } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { Button } from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

export const AnalyticsDashboard: React.FC = () => {
  const { showToast } = useToast();

  const trafficSources = [
    { source: 'Direct / Bookmark', visitors: '12,450', percentage: '42%' },
    { source: 'Google Organic Search', visitors: '9,800', percentage: '33%' },
    { source: 'WhatsApp Referrals', visitors: '4,100', percentage: '14%' },
    { source: 'Google Maps Business Profile', visitors: '3,200', percentage: '11%' },
  ];

  const popularRoutes = [
    { route: 'Delhi IGI Airport T3 Transfer', bookings: '1,420', revenue: '₹3,55,000' },
    { route: 'Delhi to Agra (Taj Mahal)', bookings: '850', revenue: '₹2,72,000' },
    { route: 'Delhi to Jaipur (Pink City)', bookings: '620', revenue: '₹2,35,600' },
    { route: 'Delhi NCR Local 8hr/80km', bookings: '1,100', revenue: '₹2,42,000' },
  ];

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-[#C9A227]" /> Traffic &amp; Booking Analytics
          </h2>
          <p className="text-xs text-zinc-400">Track website visitors, conversion rates, WhatsApp clicks, and popular routes.</p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => showToast('Analytics data synced with Google Analytics 4', 'success')}
          leftIcon={<TrendingUp className="w-3.5 h-3.5 text-[#C9A227]" />}
        >
          Sync GA4 Metrics
        </Button>
      </div>

      {/* Primary Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Total Visitors</span>
            <Users className="w-4 h-4 text-[#C9A227]" />
          </div>
          <span className="font-serif text-3xl font-extrabold text-white font-mono block">29,550</span>
          <span className="text-[10px] text-emerald-400 font-mono block">↑ +18% from last month</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>WhatsApp Clicks</span>
            <MessageCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-serif text-3xl font-extrabold text-emerald-300 font-mono block">4,100</span>
          <span className="text-[10px] text-emerald-400 font-mono block">↑ High conversion rate</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Phone Call Taps</span>
            <Phone className="w-4 h-4 text-[#C9A227]" />
          </div>
          <span className="font-serif text-3xl font-extrabold text-[#C9A227] font-mono block">2,840</span>
          <span className="text-[10px] text-zinc-400 font-mono block">Direct hotline connections</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-1">
          <div className="flex items-center justify-between text-xs text-zinc-400">
            <span>Booking Conversion Rate</span>
            <TrendingUp className="w-4 h-4 text-emerald-400" />
          </div>
          <span className="font-serif text-3xl font-extrabold text-white font-mono block">14.2%</span>
          <span className="text-[10px] text-emerald-400 font-mono block">Industry leading benchmark</span>
        </div>
      </div>

      {/* Traffic Sources & Popular Routes Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-white flex items-center justify-between">
            <span>Traffic Channels</span>
            <Badge variant="gold">30 Days</Badge>
          </h3>

          <div className="space-y-3">
            {trafficSources.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-zinc-200">
                  <span>{item.source}</span>
                  <span className="font-mono text-[#C9A227]">{item.visitors} ({item.percentage})</span>
                </div>
                <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden">
                  <div className="bg-[#C9A227] h-full rounded-full" style={{ width: item.percentage }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Routes Demand */}
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-white flex items-center justify-between">
            <span>Top Performing Routes</span>
            <Badge variant="emerald">High Demand</Badge>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-[#C9A227] font-mono border-b border-zinc-800">
                <tr>
                  <th className="p-2.5">Route Destination</th>
                  <th className="p-2.5">Completed Trips</th>
                  <th className="p-2.5 text-right">Revenue Generated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
                {popularRoutes.map((r, idx) => (
                  <tr key={idx}>
                    <td className="p-2.5 font-semibold text-white">{r.route}</td>
                    <td className="p-2.5 font-mono">{r.bookings}</td>
                    <td className="p-2.5 font-mono font-bold text-[#C9A227] text-right">{r.revenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Integration Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-white text-sm">Google Analytics 4</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs text-zinc-400">G-TAG tracking script injected on all public booking routes.</p>
          <span className="text-[10px] text-emerald-400 font-mono block">Status: Connected</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-white text-sm">Google Search Console</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-xs text-zinc-400">Automatic sitemap submission &amp; indexing audit active.</p>
          <span className="text-[10px] text-emerald-400 font-mono block">Status: Active Indexing</span>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-serif font-bold text-white text-sm">Google Ads Tag</span>
            <Badge variant="gold">Configured</Badge>
          </div>
          <p className="text-xs text-zinc-400">Conversion event fired upon booking reservation completion.</p>
          <span className="text-[10px] text-[#C9A227] font-mono block">Status: Event Firing Active</span>
        </div>
      </div>
    </div>
  );
};
