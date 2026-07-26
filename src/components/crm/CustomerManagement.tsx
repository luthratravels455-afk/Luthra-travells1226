import React, { useState, useEffect } from 'react';
import { Users, Search, Plus, Phone, Mail, Award, FileText, X } from 'lucide-react';
import { crmService, CustomerProfile } from '../../services/crmService';
import { Button } from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

export const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<CustomerProfile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerProfile | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const { showToast } = useToast();

  const [newCustomer, setNewCustomer] = useState({
    name: '',
    phone: '',
    email: '',
    favourite_vehicle: 'Toyota Innova Crysta',
    notes: '',
  });

  const loadCustomers = async () => {
    setLoading(true);
    try {
      const data = await crmService.getAllCustomers(search);
      setCustomers(data);
    } catch (err: any) {
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, [search]);

  const handleCreateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await crmService.createCustomer({
        ...newCustomer,
        total_trips: 1,
        total_spent: 0,
        last_booking_date: new Date().toISOString().split('T')[0],
      });
      showToast('Customer profile created', 'success');
      setShowAddModal(false);
      setNewCustomer({ name: '', phone: '', email: '', favourite_vehicle: 'Toyota Innova Crysta', notes: '' });
      loadCustomers();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-[#C9A227]" />
          <div>
            <h3 className="font-serif text-xl font-bold text-white">Customer Profiles CRM</h3>
            <p className="text-xs text-zinc-400">Track trip histories, preferences, and client notes</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:w-64">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search name or phone..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-4 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227]"
            />
          </div>

          <Button
            variant="gold"
            size="sm"
            onClick={() => setShowAddModal(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            New Client
          </Button>
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/80 text-[#C9A227] font-mono uppercase border-b border-zinc-800">
            <tr>
              <th className="p-3">Customer</th>
              <th className="p-3">Contact Details</th>
              <th className="p-3">Total Trips</th>
              <th className="p-3">Total Spent</th>
              <th className="p-3">Fav Vehicle</th>
              <th className="p-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800/80 text-zinc-300">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-zinc-900/50 transition-colors">
                <td className="p-3 font-bold text-white">{c.name}</td>
                <td className="p-3 font-mono">
                  <div>{c.phone}</div>
                  <div className="text-[10px] text-zinc-500">{c.email || 'N/A'}</div>
                </td>
                <td className="p-3 font-mono font-bold text-[#C9A227]">{c.total_trips || 0}</td>
                <td className="p-3 font-mono font-bold text-emerald-400">₹{c.total_spent || 0}</td>
                <td className="p-3">{c.favourite_vehicle || 'Toyota Innova Crysta'}</td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => setSelectedCustomer(c)}
                    className="text-xs text-[#C9A227] hover:underline font-mono"
                  >
                    View History
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Customer Profile View Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-[#C9A227]/30 rounded-3xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h4 className="font-serif text-lg font-bold text-white">{selectedCustomer.name} Profile</h4>
              <button onClick={() => setSelectedCustomer(null)}><X className="w-5 h-5 text-zinc-400" /></button>
            </div>
            <div className="space-y-2 text-zinc-300">
              <div>Phone: <span className="font-mono text-white font-bold">{selectedCustomer.phone}</span></div>
              <div>Email: <span className="text-white">{selectedCustomer.email || 'N/A'}</span></div>
              <div>Total Completed Trips: <span className="font-mono text-[#C9A227] font-bold">{selectedCustomer.total_trips}</span></div>
              <div>Total Billing Volume: <span className="font-mono text-emerald-400 font-bold">₹{selectedCustomer.total_spent}</span></div>
              <div>Favorite Vehicle: <span className="text-white">{selectedCustomer.favourite_vehicle}</span></div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800">
                <span className="text-[10px] text-zinc-500 uppercase block font-mono">Special Notes</span>
                <span className="text-zinc-300 italic">{selectedCustomer.notes || 'No notes added.'}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add New Customer Modal */}
      {showAddModal && (
        <form onSubmit={handleCreateCustomer} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-[#C9A227]/30 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h4 className="font-serif text-lg font-bold text-white">New Customer Profile</h4>
              <button type="button" onClick={() => setShowAddModal(false)}><X className="w-5 h-5 text-zinc-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-zinc-300 font-medium block">Name *</label>
                <input
                  type="text" required value={newCustomer.name}
                  onChange={e => setNewCustomer({...newCustomer, name: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-zinc-300 font-medium block">Phone *</label>
                <input
                  type="tel" required value={newCustomer.phone}
                  onChange={e => setNewCustomer({...newCustomer, phone: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-zinc-300 font-medium block">Email</label>
                <input
                  type="email" value={newCustomer.email}
                  onChange={e => setNewCustomer({...newCustomer, email: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div>
                <label className="text-zinc-300 font-medium block">Notes</label>
                <input
                  type="text" value={newCustomer.notes}
                  onChange={e => setNewCustomer({...newCustomer, notes: e.target.value})}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-zinc-800 rounded-xl text-zinc-300">Cancel</button>
              <Button type="submit" variant="gold" size="sm">Save Profile</Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
