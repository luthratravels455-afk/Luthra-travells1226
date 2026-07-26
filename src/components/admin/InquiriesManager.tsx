import React, { useState } from 'react';
import { Booking } from '../../types';
import { Search, Eye, Trash2, CheckCircle, XCircle, Phone, Mail, MessageSquare, Send, Clock, ShieldCheck, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { useToast } from '../../contexts/ToastContext';

interface InquiriesManagerProps {
  inquiries: Booking[];
  onUpdateStatus: (id: number, status: string, notes?: string) => void;
  onDeleteInquiry: (id: number) => void;
}

export const InquiriesManager: React.FC<InquiriesManagerProps> = ({
  inquiries,
  onUpdateStatus,
  onDeleteInquiry,
}) => {
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [selectedInquiry, setSelectedInquiry] = useState<Booking | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const [internalNotes, setInternalNotes] = useState('');

  // Filter inquiry bookings
  const filtered = inquiries.filter((b) => {
    const isInquiry = b.trip_type === 'CORPORATE' || b.trip_type === 'LOCAL' || b.status === 'NEW' || b.message;
    const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (b.customer_name && b.customer_name.toLowerCase().includes(q)) ||
      (b.customer_phone && b.customer_phone.includes(q)) ||
      (b.customer_email && b.customer_email.toLowerCase().includes(q)) ||
      (b.pickup && b.pickup.toLowerCase().includes(q));

    return isInquiry && matchesStatus && matchesSearch;
  });

  const handleOpenDetailModal = (inq: Booking) => {
    setSelectedInquiry(inq);
    setInternalNotes(inq.admin_notes || '');
  };

  const handleStatusChange = (status: string) => {
    if (!selectedInquiry || !selectedInquiry.id) return;
    onUpdateStatus(selectedInquiry.id, status, internalNotes);
    showToast(`Inquiry status updated to ${status}`, 'success');
    setSelectedInquiry(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Inquiry &amp; Contact Desk</h2>
          <p className="text-xs text-zinc-400">
            Direct web inquiries, corporate custom fleet requests, and contact messages.
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex flex-wrap gap-1.5">
          {['ALL', 'NEW', 'CONTACTED', 'CONFIRMED', 'COMPLETED', 'REJECTED'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all uppercase ${
                filterStatus === st
                  ? 'bg-[#C9A227] text-zinc-950 font-extrabold shadow-md shadow-[#C9A227]/20'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search Name, Phone, Email, Pickup..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-[#C9A227] font-mono uppercase border-b border-zinc-800">
              <tr>
                <th className="p-3.5">Date</th>
                <th className="p-3.5">Customer Info</th>
                <th className="p-3.5">Source / Trip</th>
                <th className="p-3.5">Pickup → Drop</th>
                <th className="p-3.5">Inquiry Message</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-zinc-500 font-mono">
                    No web inquiries recorded matching current filters.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => (
                  <tr key={item.id} className="hover:bg-zinc-800/50 transition-colors">
                    <td className="p-3.5 font-mono text-zinc-400">{item.travel_date || 'Today'}</td>
                    <td className="p-3.5">
                      <span className="font-bold text-white block">{item.customer_name}</span>
                      <a href={`tel:${item.customer_phone}`} className="text-[11px] font-mono text-[#C9A227]">
                        {item.customer_phone}
                      </a>
                    </td>
                    <td className="p-3.5 font-mono uppercase text-[10px] text-zinc-400">
                      {item.trip_type || 'Website Contact'}
                    </td>
                    <td className="p-3.5 max-w-xs truncate">
                      <span className="text-zinc-200 block">{item.pickup}</span>
                      <span className="text-zinc-500 block text-[10px]">→ {item.drop_location || 'N/A'}</span>
                    </td>
                    <td className="p-3.5 max-w-xs truncate text-zinc-400 italic">
                      "{item.message || 'No additional message'}"
                    </td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-[#C9A227]/10 text-[#C9A227] border border-[#C9A227]/30">
                        {item.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => handleOpenDetailModal(item)}
                        className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg"
                        title="View Inquiry"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => item.id && setDeleteConfirmId(item.id)}
                        className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg"
                        title="Delete Inquiry"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Inquiry Detail Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-[#C9A227]/30 rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <h3 className="font-serif text-lg font-bold text-white">Inquiry Details</h3>
              <button onClick={() => setSelectedInquiry(null)} className="text-zinc-400 hover:text-white">
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-zinc-300">
              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <span className="text-zinc-500 block text-[10px]">Customer:</span>
                <span className="text-white font-bold text-sm block">{selectedInquiry.customer_name}</span>
                <a href={`tel:${selectedInquiry.customer_phone}`} className="text-[#C9A227] font-mono font-bold block pt-0.5">
                  Phone: {selectedInquiry.customer_phone}
                </a>
              </div>

              <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 space-y-1">
                <span className="text-zinc-500 block text-[10px]">Message Content:</span>
                <p className="text-zinc-200 italic leading-relaxed">"{selectedInquiry.message || 'General inquiry'}"</p>
              </div>

              <div className="space-y-1">
                <label className="text-zinc-400 font-medium">Internal Admin Notes</label>
                <textarea
                  rows={2}
                  value={internalNotes}
                  onChange={(e) => setInternalNotes(e.target.value)}
                  placeholder="Record follow-up actions..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-zinc-800">
              <Button variant="secondary" size="sm" onClick={() => handleStatusChange('CONTACTED')}>
                Mark Contacted
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleStatusChange('CONFIRMED')}>
                Confirm
              </Button>
              <Button variant="gold" size="sm" onClick={() => handleStatusChange('COMPLETED')}>
                Mark Completed
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteConfirmId !== null}
        title="Delete Inquiry?"
        message="Are you sure you want to delete this customer inquiry?"
        onConfirm={() => {
          if (deleteConfirmId !== null) {
            onDeleteInquiry(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />
    </div>
  );
};
