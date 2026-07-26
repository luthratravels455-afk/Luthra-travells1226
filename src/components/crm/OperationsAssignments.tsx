import React, { useState, useEffect } from 'react';
import { ShieldCheck, UserCheck, Car, Plus, X } from 'lucide-react';
import { crmService, DriverProfile } from '../../services/crmService';
import { Button } from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

export const OperationsAssignments: React.FC = () => {
  const [drivers, setDrivers] = useState<DriverProfile[]>([]);
  const [showAddDriverModal, setShowAddDriverModal] = useState(false);
  const { showToast } = useToast();

  const [newDriver, setNewDriver] = useState({
    name: '',
    phone: '',
    license_number: '',
    status: 'AVAILABLE' as const,
    notes: '',
  });

  const loadDrivers = async () => {
    try {
      const data = await crmService.getAllDrivers();
      setDrivers(data);
    } catch (err: any) {
      console.error('Error loading drivers:', err);
    }
  };

  useEffect(() => {
    loadDrivers();
  }, []);

  const handleCreateDriver = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await crmService.createDriver(newDriver);
      showToast('Driver profile registered', 'success');
      setShowAddDriverModal(false);
      setNewDriver({ name: '', phone: '', license_number: '', status: 'AVAILABLE', notes: '' });
      loadDrivers();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <UserCheck className="w-6 h-6 text-[#C9A227]" />
          <div>
            <h3 className="font-serif text-xl font-bold text-white">Chauffeur &amp; Fleet Operations</h3>
            <p className="text-xs text-zinc-400">Driver roster and vehicle assignment dispatch</p>
          </div>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() => setShowAddDriverModal(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Driver
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((d) => (
          <div key={d.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-2xl space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <span className="font-bold text-white text-sm">{d.name}</span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                d.status === 'AVAILABLE' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'
              }`}>
                {d.status}
              </span>
            </div>
            <div className="text-zinc-400 font-mono">License: <span className="text-zinc-200">{d.license_number}</span></div>
            <div className="text-zinc-400 font-mono">Phone: <span className="text-zinc-200">{d.phone}</span></div>
            <div className="pt-2 border-t border-zinc-800/80 text-[11px] text-zinc-400 italic">
              {d.notes || 'Experienced chauffeur'}
            </div>
          </div>
        ))}
      </div>

      {showAddDriverModal && (
        <form onSubmit={handleCreateDriver} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-[#C9A227]/30 rounded-3xl max-w-md w-full p-6 space-y-4 text-xs">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h4 className="font-serif text-lg font-bold text-white">Register Chauffeur</h4>
              <button type="button" onClick={() => setShowAddDriverModal(false)}><X className="w-5 h-5 text-zinc-400" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <label className="text-zinc-300 block font-medium">Chauffeur Name *</label>
                <input type="text" required value={newDriver.name} onChange={e => setNewDriver({...newDriver, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white" />
              </div>
              <div>
                <label className="text-zinc-300 block font-medium">Phone Number *</label>
                <input type="tel" required value={newDriver.phone} onChange={e => setNewDriver({...newDriver, phone: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white" />
              </div>
              <div>
                <label className="text-zinc-300 block font-medium">Commercial License No *</label>
                <input type="text" required value={newDriver.license_number} onChange={e => setNewDriver({...newDriver, license_number: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white" />
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowAddDriverModal(false)} className="px-4 py-2 bg-zinc-800 rounded-xl text-zinc-300">Cancel</button>
              <Button type="submit" variant="gold" size="sm">Register</Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};
