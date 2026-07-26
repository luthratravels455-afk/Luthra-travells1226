import React, { useState } from 'react';
import { ShieldCheck, Users, History, BarChart3, Database, Lock, Key, RefreshCw, Download, Upload } from 'lucide-react';
import { Button } from '../ui/Button';

export const AdminUsersAndLogs: React.FC<{ activeSubTab: 'users' | 'logs' | 'analytics' | 'backup' }> = ({
  activeSubTab,
}) => {
  const [gaId, setGaId] = useState('G-LUTHRA2025');
  const [searchConsoleVerified, setSearchConsoleVerified] = useState(true);

  const mockUsers = [
    { name: 'Admin Luthra', email: 'admin@luthratravels.com', role: 'Admin', status: 'Active' },
    { name: 'Operations Dispatcher', email: 'dispatch@luthratravels.com', role: 'Manager', status: 'Active' },
    { name: 'Content Editor', email: 'editor@luthratravels.com', role: 'Editor', status: 'Active' },
  ];

  const logs = [
    { id: 1, user: 'Admin Luthra', action: 'Pricing Updated', desc: 'Set default per-km rate to ₹14/km', timestamp: 'Today, 10:15 AM' },
    { id: 2, user: 'Admin Luthra', action: 'Booking Status Updated', desc: 'Marked LT-982145 as CONFIRMED', timestamp: 'Today, 09:30 AM' },
    { id: 3, user: 'System', action: 'Backup Generated', desc: 'Automated CSV backup exported', timestamp: 'Yesterday, 11:59 PM' },
    { id: 4, user: 'Dispatch', action: 'Booking Created', desc: 'Log LT-847291 created for Delhi → Agra', timestamp: 'Yesterday, 04:20 PM' },
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      {activeSubTab === 'users' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">Role Based Access Control</h2>
            <p className="text-xs text-zinc-400">Manage administrator, manager, and content editor permissions.</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-[#C9A227] font-mono uppercase border-b border-zinc-800">
                <tr>
                  <th className="p-3.5">User</th>
                  <th className="p-3.5">Role</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Permissions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {mockUsers.map((u, i) => (
                  <tr key={i}>
                    <td className="p-3.5 font-bold text-white">
                      {u.name}
                      <span className="block font-mono text-[10px] text-zinc-400 font-normal">{u.email}</span>
                    </td>
                    <td className="p-3.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30">
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3.5 text-emerald-400 font-mono text-[11px]">{u.status}</td>
                    <td className="p-3.5 text-zinc-400">
                      {u.role === 'Admin' ? 'Full Control' : u.role === 'Manager' ? 'CRM + Fleet' : 'CMS Pages'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeSubTab === 'logs' && (
        <div className="space-y-6">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">System Activity Logs</h2>
            <p className="text-xs text-zinc-400">Audit trail tracking login events, content edits, and pricing updates.</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
            {logs.map((log) => (
              <div key={log.id} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 flex justify-between items-center text-xs">
                <div className="space-y-0.5">
                  <span className="font-bold text-[#C9A227] block">{log.action}</span>
                  <span className="text-zinc-300 block">{log.desc}</span>
                  <span className="text-[10px] text-zinc-500 font-mono">By {log.user}</span>
                </div>
                <span className="text-[10px] text-zinc-400 font-mono">{log.timestamp}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeSubTab === 'analytics' && (
        <div className="space-y-6 max-w-3xl">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">Analytics Placeholders</h2>
            <p className="text-xs text-zinc-400">Configure Google Analytics 4, Meta Pixel, and WhatsApp click tracking IDs.</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">Google Analytics 4 Measurement ID</label>
              <input
                type="text"
                value={gaId}
                onChange={(e) => setGaId(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
              />
            </div>

            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
              <span className="font-bold text-white block text-sm">Active Analytics Integrations</span>
              <ul className="space-y-1.5 text-zinc-400 font-mono">
                <li className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" /> Google Search Console Verified
                </li>
                <li className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" /> Meta Pixel Ready
                </li>
                <li className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-4 h-4" /> WhatsApp Click Tracking Active
                </li>
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'backup' && (
        <div className="space-y-6 max-w-3xl">
          <div>
            <h2 className="font-serif text-2xl font-bold text-white">Cloud Backup &amp; Data Restore</h2>
            <p className="text-xs text-zinc-400">Export database backups or restore system settings state.</p>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6 text-xs">
            <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800 space-y-2">
              <h3 className="font-bold text-white text-sm">Database State Snapshot</h3>
              <p className="text-zinc-400">Download full JSON snapshot including Bookings, Fleet, and Site Settings.</p>
              <Button variant="gold" size="sm" leftIcon={<Download className="w-4 h-4" />}>
                Export Full Backup JSON
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
