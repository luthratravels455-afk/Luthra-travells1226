import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Key,
  Edit3,
  Trash2,
  CheckCircle,
  XCircle,
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../../contexts/ToastContext';

export interface StaffUser {
  id: number;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Editor';
  status: 'Active' | 'Suspended';
  lastLogin: string;
}

export const UserManager: React.FC = () => {
  const { showToast } = useToast();

  const [users, setUsers] = useState<StaffUser[]>([
    { id: 1, name: 'Vikram Luthra', email: 'admin@luthratravels.com', role: 'Admin', status: 'Active', lastLogin: 'Today, 10:30 AM' },
    { id: 2, name: 'Ananya Sharma', email: 'ananya@luthratravels.com', role: 'Manager', status: 'Active', lastLogin: 'Yesterday, 04:15 PM' },
    { id: 3, name: 'Rajesh Dispatcher', email: 'ops@luthratravels.com', role: 'Editor', status: 'Active', lastLogin: 'Feb 20, 2025' },
  ]);

  const [editingUser, setEditingUser] = useState<Partial<StaffUser> | null>(null);

  const handleSaveUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser?.name || !editingUser?.email) {
      showToast('Name and Email are required.', 'error');
      return;
    }

    if (editingUser.id) {
      setUsers(
        users.map((u) => (u.id === editingUser.id ? ({ ...u, ...editingUser } as StaffUser) : u))
      );
      showToast('User profile updated', 'success');
    } else {
      const newUser: StaffUser = {
        id: Date.now(),
        name: editingUser.name,
        email: editingUser.email,
        role: editingUser.role || 'Editor',
        status: editingUser.status || 'Active',
        lastLogin: 'Never',
      };
      setUsers([...users, newUser]);
      showToast('New team member invited to CMS', 'success');
    }

    setEditingUser(null);
  };

  const handleDeleteUser = (id: number) => {
    if (id === 1) {
      showToast('Cannot delete primary Admin root account.', 'error');
      return;
    }
    if (!window.confirm('Revoke staff access for this user?')) return;
    setUsers(users.filter((u) => u.id !== id));
    showToast('User access revoked', 'info');
  };

  const handleToggleStatus = (user: StaffUser) => {
    if (user.id === 1) return;
    const newStatus = user.status === 'Active' ? 'Suspended' : 'Active';
    setUsers(
      users.map((u) => (u.id === user.id ? { ...u, status: newStatus } : u))
    );
    showToast(`User ${user.name} is now ${newStatus}`, 'info');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6 text-[#C9A227]" /> User &amp; Role Management
          </h2>
          <p className="text-xs text-zinc-400">Control staff permissions, role assignments, and authentication access.</p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() =>
            setEditingUser({ name: '', email: '', role: 'Editor', status: 'Active' })
          }
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Add Team Member
        </Button>
      </div>

      {/* User Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-950 text-[#C9A227] font-mono border-b border-zinc-800">
            <tr>
              <th className="p-3">Staff Member</th>
              <th className="p-3">Email Address</th>
              <th className="p-3">Role Level</th>
              <th className="p-3">Status</th>
              <th className="p-3">Last Active</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300">
            {users.map((u) => (
              <tr key={u.id} className="hover:bg-zinc-800/40">
                <td className="p-3 font-semibold text-white flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center font-bold text-[#C9A227] text-xs">
                    {u.name.charAt(0)}
                  </div>
                  <span>{u.name}</span>
                </td>
                <td className="p-3 font-mono text-zinc-300">{u.email}</td>
                <td className="p-3 font-mono">
                  <Badge variant={u.role === 'Admin' ? 'gold' : u.role === 'Manager' ? 'emerald' : 'dark'}>
                    {u.role}
                  </Badge>
                </td>
                <td className="p-3">
                  <button
                    onClick={() => handleToggleStatus(u)}
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold border transition-colors ${
                      u.status === 'Active'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-950/80 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {u.status}
                  </button>
                </td>
                <td className="p-3 font-mono text-zinc-400">{u.lastLogin}</td>
                <td className="p-3 text-right space-x-2">
                  <button
                    onClick={() => setEditingUser(u)}
                    className="p-1.5 bg-zinc-800 text-amber-300 hover:text-white rounded-lg"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDeleteUser(u.id)}
                    className="p-1.5 bg-rose-950/60 text-rose-300 rounded-lg disabled:opacity-40"
                    disabled={u.id === 1}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Permissions Matrix Reference */}
      <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
        <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-[#C9A227]" /> Role Access Control Matrix
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
            <span className="font-bold text-[#C9A227] font-mono block">Root Admin</span>
            <ul className="text-zinc-400 space-y-1 text-[11px] list-disc list-inside">
              <li>Full database access &amp; deletion</li>
              <li>CMS global settings configuration</li>
              <li>User role assignments</li>
              <li>Financial backup exports</li>
            </ul>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
            <span className="font-bold text-emerald-400 font-mono block">Operations Manager</span>
            <ul className="text-zinc-400 space-y-1 text-[11px] list-disc list-inside">
              <li>Manage booking CRM statuses</li>
              <li>Assign chauffeurs to trips</li>
              <li>Edit fleet vehicle pricing</li>
              <li>Generate GST invoices</li>
            </ul>
          </div>

          <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
            <span className="font-bold text-zinc-300 font-mono block">Content Editor</span>
            <ul className="text-zinc-400 space-y-1 text-[11px] list-disc list-inside">
              <li>Create &amp; edit travel blog articles</li>
              <li>Upload gallery photo assets</li>
              <li>Update FAQ support answers</li>
              <li>View customer inquiry messages</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Add / Edit Modal */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md animate-fadeIn">
          <form
            onSubmit={handleSaveUser}
            className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-3xl max-w-md w-full space-y-4 shadow-2xl"
          >
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-[#C9A227]">
                {editingUser.id ? 'Edit User Permissions' : 'Invite New Team Member'}
              </h3>
              <button type="button" onClick={() => setEditingUser(null)}>
                <X className="w-5 h-5 text-zinc-400" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vikram Malhotra"
                  value={editingUser.name || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Email Address *</label>
                <input
                  type="email"
                  required
                  placeholder="staff@luthratravels.com"
                  value={editingUser.email || ''}
                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Role Level</label>
                <select
                  value={editingUser.role || 'Editor'}
                  onChange={(e) => setEditingUser({ ...editingUser, role: e.target.value as any })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Admin">Admin (Full Access)</option>
                  <option value="Manager">Manager (CRM &amp; Operations)</option>
                  <option value="Editor">Editor (Content &amp; Blogs)</option>
                </select>
              </div>

              <div>
                <label className="text-zinc-300 font-semibold block mb-1">Account Status</label>
                <select
                  value={editingUser.status || 'Active'}
                  onChange={(e) => setEditingUser({ ...editingUser, status: e.target.value as any })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                >
                  <option value="Active">Active</option>
                  <option value="Suspended">Suspended</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
              <Button type="button" variant="secondary" size="sm" onClick={() => setEditingUser(null)}>
                Cancel
              </Button>
              <Button type="submit" variant="gold" size="sm">
                Save User
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
