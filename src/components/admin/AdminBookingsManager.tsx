import React, { useState } from 'react';
import { Booking } from '../../types';
import {
  Search,
  Download,
  Trash2,
  CheckCircle,
  Eye,
  X,
  UserCheck,
  Car,
  FileText,
  Clock,
  Send,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { useToast } from '../../contexts/ToastContext';

interface AdminBookingsManagerProps {
  bookings: Booking[];
  onUpdateStatus: (id: number, status: string, additionalData?: Partial<Booking>) => void;
  onDeleteBooking: (id: number) => void;
  onExportCSV: () => void;
}

export const AdminBookingsManager: React.FC<AdminBookingsManagerProps> = ({
  bookings,
  onUpdateStatus,
  onDeleteBooking,
  onExportCSV,
}) => {
  const { showToast } = useToast();

  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 10;

  // Confirmation Modal State
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [bulkDeleteConfirmOpen, setBulkDeleteConfirmOpen] = useState<boolean>(false);

  // Modal Assignments State
  const [assignedDriver, setAssignedDriver] = useState<string>('');
  const [assignedVehicle, setAssignedVehicle] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');

  const statuses = [
    'ALL',
    'NEW',
    'PENDING',
    'CONFIRMED',
    'DRIVER_ASSIGNED',
    'ON_TRIP',
    'COMPLETED',
    'CANCELLED',
    'REJECTED',
  ];

  // Filtering
  const filteredBookings = bookings.filter((b) => {
    const matchesStatus = filterStatus === 'ALL' || b.status === filterStatus;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      (b.booking_ref && b.booking_ref.toLowerCase().includes(q)) ||
      (b.customer_name && b.customer_name.toLowerCase().includes(q)) ||
      (b.customer_phone && b.customer_phone.includes(q)) ||
      (b.pickup && b.pickup.toLowerCase().includes(q)) ||
      (b.drop_location && b.drop_location.toLowerCase().includes(q)) ||
      (b.vehicle && b.vehicle.toLowerCase().includes(q));

    return matchesStatus && matchesSearch;
  });

  // Pagination Math
  const totalPages = Math.ceil(filteredBookings.length / itemsPerPage) || 1;
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Bulk Handlers
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(paginatedBookings.map((b) => b.id!).filter(Boolean));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkStatus = (status: string) => {
    if (selectedIds.length === 0) return;
    selectedIds.forEach((id) => onUpdateStatus(id, status));
    showToast(`Bulk updated ${selectedIds.length} bookings to ${status}`, 'success');
    setSelectedIds([]);
  };

  const handleExecuteBulkDelete = () => {
    selectedIds.forEach((id) => onDeleteBooking(id));
    showToast(`Bulk deleted ${selectedIds.length} bookings`, 'info');
    setSelectedIds([]);
    setBulkDeleteConfirmOpen(false);
  };

  const handleOpenDetailModal = (b: Booking) => {
    setSelectedBooking(b);
    setAssignedDriver(b.admin_notes || '');
    setAssignedVehicle(b.vehicle || '');
    setAdminNotes(b.admin_notes || '');
  };

  const handleSaveModalUpdates = () => {
    if (!selectedBooking || !selectedBooking.id) return;
    onUpdateStatus(selectedBooking.id, selectedBooking.status, {
      vehicle: assignedVehicle,
      admin_notes: `Driver: ${assignedDriver} | Note: ${adminNotes}`,
    });
    showToast(`Updates saved for booking ${selectedBooking.booking_ref}`, 'success');
    setSelectedBooking(null);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Booking Manager &amp; CRM</h2>
          <p className="text-xs text-zinc-400">
            Real-time reservations, driver dispatch, status updates, bulk operations, and CSV backups.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={onExportCSV} leftIcon={<Download className="w-4 h-4" />}>
          Export CSV Backup
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-1.5">
            {statuses.map((st) => (
              <button
                key={st}
                onClick={() => {
                  setFilterStatus(st);
                  setCurrentPage(1);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold font-mono transition-all uppercase ${
                  filterStatus === st
                    ? 'bg-[#C9A227] text-zinc-950 shadow-md shadow-[#C9A227]/20 font-extrabold'
                    : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Ref, Name, Phone, City..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Bulk Action Controls */}
        {selectedIds.length > 0 && (
          <div className="bg-zinc-950 p-3 rounded-xl border border-[#C9A227]/30 flex flex-wrap items-center justify-between gap-3 text-xs animate-fadeIn">
            <span className="text-[#C9A227] font-mono font-bold">
              {selectedIds.length} item(s) selected
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => handleBulkStatus('CONFIRMED')}>
                Mark Confirmed
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleBulkStatus('COMPLETED')}>
                Mark Completed
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleBulkStatus('CANCELLED')}>
                Mark Cancelled
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkDeleteConfirmOpen(true)}
                className="!border-rose-500/40 !text-rose-400 hover:!bg-rose-950/60"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Bulk Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bookings Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-zinc-950 text-[#C9A227] font-mono uppercase border-b border-zinc-800">
              <tr>
                <th className="p-3.5 w-10">
                  <input
                    type="checkbox"
                    checked={
                      paginatedBookings.length > 0 &&
                      selectedIds.length === paginatedBookings.length
                    }
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="accent-[#C9A227] rounded cursor-pointer"
                  />
                </th>
                <th className="p-3.5">Ref ID</th>
                <th className="p-3.5">Customer Name &amp; Phone</th>
                <th className="p-3.5">Vehicle Choice</th>
                <th className="p-3.5">Pickup → Drop</th>
                <th className="p-3.5">Travel Date &amp; Time</th>
                <th className="p-3.5">Est. Fare</th>
                <th className="p-3.5">Status</th>
                <th className="p-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800 text-zinc-300">
              {paginatedBookings.length === 0 ? (
                <tr>
                  <td colSpan={9} className="p-8 text-center text-zinc-500 font-mono">
                    No bookings found matching current filters.
                  </td>
                </tr>
              ) : (
                paginatedBookings.map((b) => {
                  const isChecked = selectedIds.includes(b.id!);
                  return (
                    <tr
                      key={b.id}
                      className={`hover:bg-zinc-800/50 transition-colors ${
                        isChecked ? 'bg-[#C9A227]/5' : ''
                      }`}
                    >
                      <td className="p-3.5">
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => b.id && handleToggleRow(b.id)}
                          className="accent-[#C9A227] rounded cursor-pointer"
                        />
                      </td>
                      <td className="p-3.5 font-mono font-bold text-[#C9A227]">
                        {b.booking_ref}
                      </td>
                      <td className="p-3.5 font-semibold text-white">
                        {b.customer_name}
                        <a
                          href={`tel:${b.customer_phone}`}
                          className="block text-[11px] text-zinc-400 font-mono hover:text-[#C9A227]"
                        >
                          {b.customer_phone}
                        </a>
                      </td>
                      <td className="p-3.5">{b.vehicle}</td>
                      <td className="p-3.5 max-w-xs truncate">
                        <span className="text-zinc-200 block">{b.pickup}</span>
                        <span className="text-zinc-500 block text-[10px]">
                          → {b.drop_location}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono">
                        {b.travel_date} <span className="text-zinc-500">at {b.pickup_time}</span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-[#C9A227]">
                        ₹{b.estimated_amount}
                      </td>
                      <td className="p-3.5">
                        <select
                          value={b.status}
                          onChange={(e) => b.id && onUpdateStatus(b.id, e.target.value)}
                          className="bg-zinc-950 border border-zinc-800 rounded-lg px-2 py-1 text-[11px] text-white font-mono"
                        >
                          {statuses
                            .filter((s) => s !== 'ALL')
                            .map((st) => (
                              <option key={st} value={st}>
                                {st}
                              </option>
                            ))}
                        </select>
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => handleOpenDetailModal(b)}
                          className="p-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg"
                          title="View Details / Assign"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => b.id && setDeleteConfirmId(b.id)}
                          className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="p-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between text-xs text-zinc-400 font-mono">
            <span>
              Page {currentPage} of {totalPages} ({filteredBookings.length} total)
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Prev
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Booking Detail Modal with Driver & Vehicle Assignment */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-[#C9A227]/30 rounded-3xl max-w-xl w-full p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div>
                <span className="text-xs font-mono text-[#C9A227]">Booking Reference</span>
                <h3 className="font-serif text-xl font-bold text-white">
                  {selectedBooking.booking_ref}
                </h3>
              </div>
              <button
                onClick={() => setSelectedBooking(null)}
                className="text-zinc-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-zinc-300">
              <div className="grid grid-cols-2 gap-3 bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                <div>
                  <span className="text-zinc-500 block text-[10px]">Customer Name:</span>
                  <span className="font-bold text-white text-sm">
                    {selectedBooking.customer_name}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 block text-[10px]">Phone Number:</span>
                  <a
                    href={`tel:${selectedBooking.customer_phone}`}
                    className="font-mono text-[#C9A227] font-bold"
                  >
                    {selectedBooking.customer_phone}
                  </a>
                </div>
              </div>

              <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-2">
                <span className="text-zinc-500 block text-[10px] font-mono uppercase">
                  Route Details
                </span>
                <div>
                  <span className="text-zinc-400 text-[10px]">Pickup:</span>
                  <p className="text-white font-medium">{selectedBooking.pickup}</p>
                </div>
                <div>
                  <span className="text-zinc-400 text-[10px]">Drop Destination:</span>
                  <p className="text-white font-medium">{selectedBooking.drop_location}</p>
                </div>
              </div>

              {/* Assignment Controls */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-950 p-3.5 rounded-xl border border-zinc-800">
                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium flex items-center gap-1">
                    <Car className="w-3.5 h-3.5 text-[#C9A227]" /> Assigned Vehicle
                  </label>
                  <select
                    value={assignedVehicle}
                    onChange={(e) => setAssignedVehicle(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white"
                  >
                    <option value="Toyota Innova Crysta">Toyota Innova Crysta</option>
                    <option value="Maruti Ertiga">Maruti Ertiga</option>
                    <option value="Maruti Dzire">Maruti Dzire</option>
                    <option value="Honda Amaze">Honda Amaze</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-400 font-medium flex items-center gap-1">
                    <UserCheck className="w-3.5 h-3.5 text-[#C9A227]" /> Assign Chauffeur / Driver
                  </label>
                  <input
                    type="text"
                    placeholder="Chauffeur Name (e.g. Suresh Kumar)"
                    value={assignedDriver}
                    onChange={(e) => setAssignedDriver(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-zinc-400 font-medium flex items-center gap-1">
                  <FileText className="w-3.5 h-3.5 text-[#C9A227]" /> Admin Notes
                </label>
                <textarea
                  rows={2}
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  placeholder="Internal dispatch notes..."
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white text-xs"
                />
              </div>

              {/* Timeline */}
              <div className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-800/80 space-y-1 text-[11px] text-zinc-400">
                <div className="flex items-center gap-1.5 font-mono text-zinc-300">
                  <Clock className="w-3.5 h-3.5 text-[#C9A227]" /> Audit Timeline:
                </div>
                <p>• Reservation Created: {selectedBooking.created_at || 'Recently'}</p>
                <p>• Current Status: <strong className="text-[#C9A227]">{selectedBooking.status}</strong></p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-zinc-800">
              <Button variant="secondary" size="sm" onClick={() => setSelectedBooking(null)}>
                Close
              </Button>
              <Button variant="gold" size="sm" onClick={handleSaveModalUpdates}>
                Save Assignments &amp; Notes
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={deleteConfirmId !== null}
        title="Delete Booking Record?"
        message="Are you sure you want to delete this booking permanently from CRM?"
        onConfirm={() => {
          if (deleteConfirmId !== null) {
            onDeleteBooking(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />

      <ConfirmationModal
        isOpen={bulkDeleteConfirmOpen}
        title={`Bulk Delete ${selectedIds.length} Bookings?`}
        message={`Are you sure you want to permanently delete these ${selectedIds.length} selected bookings?`}
        onConfirm={handleExecuteBulkDelete}
        onCancel={() => setBulkDeleteConfirmOpen(false)}
      />
    </div>
  );
};
