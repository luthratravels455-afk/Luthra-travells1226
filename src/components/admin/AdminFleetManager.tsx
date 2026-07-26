import React, { useState } from 'react';
import { FleetVehicle } from '../../types';
import { Plus, Edit3, Trash2, X, Search, Copy } from 'lucide-react';
import { Button } from '../ui/Button';
import { ConfirmationModal } from '../ui/ConfirmationModal';
import { ImageUploader } from '../ImageUploader';

interface AdminFleetManagerProps {
  fleet: FleetVehicle[];
  onSaveVehicle: (vehicle: Partial<FleetVehicle>) => Promise<void>;
  onDeleteVehicle: (id: number) => Promise<void>;
}

export const AdminFleetManager: React.FC<AdminFleetManagerProps> = ({
  fleet,
  onSaveVehicle,
  onDeleteVehicle,
}) => {
  const [editingVehicle, setEditingVehicle] = useState<Partial<FleetVehicle> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [bulkDeleteModalOpen, setBulkDeleteModalOpen] = useState(false);

  const allowedVehicles = [
    'Toyota Innova Crysta',
    'Maruti Ertiga',
    'Maruti Dzire',
    'Honda Amaze',
  ];

  const filteredFleet = fleet.filter((v) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      v.title.toLowerCase().includes(q) ||
      (v.category && v.category.toLowerCase().includes(q))
    );
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;
    await onSaveVehicle(editingVehicle);
    setEditingVehicle(null);
  };

  const handleDuplicate = async (veh: FleetVehicle) => {
    const copy = {
      ...veh,
      id: undefined,
      title: `${veh.title} (Copy)`,
    };
    await onSaveVehicle(copy);
  };

  const handleToggleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(filteredFleet.map((v) => v.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleToggleSelectRow = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleBulkEnable = async (enable: boolean) => {
    for (const id of selectedIds) {
      const v = fleet.find((f) => f.id === id);
      if (v) {
        await onSaveVehicle({ ...v, is_active: enable });
      }
    }
    setSelectedIds([]);
  };

  const handleExecuteBulkDelete = async () => {
    for (const id of selectedIds) {
      await onDeleteVehicle(id);
    }
    setSelectedIds([]);
    setBulkDeleteModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Fleet Manager Module</h2>
          <p className="text-xs text-zinc-400">
            Manage, duplicate, enable/disable fleet models with file upload and image drag &amp; drop.
          </p>
        </div>

        <Button
          variant="gold"
          size="sm"
          onClick={() =>
            setEditingVehicle({
              title: 'Toyota Innova Crysta',
              category: 'Executive MPV',
              capacity_passengers: 7,
              luggage_count: 4,
              features: ['Dual Air Conditioning', 'Bottled Water', 'Clean Interiors'],
              image_url:
                'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
              description: 'Comfortable executive vehicle.',
              is_active: true,
              sorting_order: fleet.length + 1,
            })
          }
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add Fleet Vehicle
        </Button>
      </div>

      {/* Filter and Bulk Bar */}
      <div className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search Vehicle Title, Category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder-zinc-500 focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <input
              type="checkbox"
              checked={
                filteredFleet.length > 0 && selectedIds.length === filteredFleet.length
              }
              onChange={(e) => handleToggleSelectAll(e.target.checked)}
              className="accent-[#C9A227] rounded cursor-pointer"
            />
            <span>Select All ({filteredFleet.length})</span>
          </div>
        </div>

        {selectedIds.length > 0 && (
          <div className="bg-zinc-950 p-3 rounded-xl border border-[#C9A227]/30 flex flex-wrap items-center justify-between gap-3 text-xs">
            <span className="text-[#C9A227] font-mono font-bold">
              {selectedIds.length} vehicle(s) selected
            </span>
            <div className="flex items-center gap-2">
              <Button variant="secondary" size="sm" onClick={() => handleBulkEnable(true)}>
                Bulk Enable
              </Button>
              <Button variant="secondary" size="sm" onClick={() => handleBulkEnable(false)}>
                Bulk Disable
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setBulkDeleteModalOpen(true)}
                className="!border-rose-500/40 !text-rose-400 hover:!bg-rose-950/60"
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              >
                Bulk Delete
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Edit Form Modal */}
      {editingVehicle && (
        <form
          onSubmit={handleSave}
          className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-2xl space-y-4 shadow-2xl"
        >
          <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
            <h3 className="font-serif text-lg font-bold text-[#C9A227]">
              {editingVehicle.id ? 'Edit Vehicle' : 'Add Vehicle to Fleet'}
            </h3>
            <button type="button" onClick={() => setEditingVehicle(null)}>
              <X className="w-5 h-5 text-zinc-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Vehicle Model *</label>
              <select
                value={editingVehicle.title || allowedVehicles[0]}
                onChange={(e) =>
                  setEditingVehicle({ ...editingVehicle, title: e.target.value })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
              >
                {allowedVehicles.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Category Tag</label>
              <input
                type="text"
                value={editingVehicle.category || ''}
                onChange={(e) =>
                  setEditingVehicle({ ...editingVehicle, category: e.target.value })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Passengers Capacity</label>
              <input
                type="number"
                value={editingVehicle.capacity_passengers || 4}
                onChange={(e) =>
                  setEditingVehicle({
                    ...editingVehicle,
                    capacity_passengers: parseInt(e.target.value, 10),
                  })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Luggage Capacity</label>
              <input
                type="number"
                value={editingVehicle.luggage_count || 2}
                onChange={(e) =>
                  setEditingVehicle({
                    ...editingVehicle,
                    luggage_count: parseInt(e.target.value, 10),
                  })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-medium">Availability</label>
              <select
                value={editingVehicle.is_active !== false ? 'true' : 'false'}
                onChange={(e) =>
                  setEditingVehicle({
                    ...editingVehicle,
                    is_active: e.target.value === 'true',
                  })
                }
                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
              >
                <option value="true">Enabled / Available</option>
                <option value="false">Disabled / Maintenance</option>
              </select>
            </div>

            <div className="space-y-1 sm:col-span-3">
              <ImageUploader
                value={editingVehicle.image_url || ''}
                onChange={(url) => setEditingVehicle({ ...editingVehicle, image_url: url })}
                label="Vehicle Asset Image"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
            <Button
              variant="secondary"
              size="sm"
              type="button"
              onClick={() => setEditingVehicle(null)}
            >
              Cancel
            </Button>
            <Button variant="gold" size="sm" type="submit">
              Save Vehicle Specs
            </Button>
          </div>
        </form>
      )}

      {/* Vehicles Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredFleet.map((veh) => {
          const isSelected = selectedIds.includes(veh.id);
          return (
            <div
              key={veh.id}
              className={`bg-zinc-900 border rounded-2xl p-5 space-y-3 relative transition-all ${
                isSelected ? 'border-[#C9A227] bg-[#C9A227]/5' : 'border-zinc-800'
              }`}
            >
              <input
                type="checkbox"
                checked={isSelected}
                onChange={() => handleToggleSelectRow(veh.id)}
                className="absolute top-3 left-3 z-10 accent-[#C9A227] rounded cursor-pointer"
              />

              <img
                src={veh.image_url}
                alt={veh.title}
                className="w-full h-40 object-cover rounded-xl bg-zinc-950"
              />

              <div>
                <span className="text-[10px] text-[#C9A227] uppercase font-mono block">
                  {veh.category}
                </span>
                <h4 className="font-serif font-bold text-white text-base">{veh.title}</h4>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-zinc-800 text-xs text-zinc-400">
                <span className="font-mono text-[11px]">
                  {veh.capacity_passengers} Seats • {veh.luggage_count} Bags
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => handleDuplicate(veh)}
                    className="p-1.5 bg-zinc-800 text-zinc-300 rounded-lg hover:bg-zinc-700"
                    title="Duplicate Vehicle"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setEditingVehicle(veh)}
                    className="p-1.5 bg-zinc-800 text-[#C9A227] rounded-lg hover:bg-zinc-700"
                    title="Edit Vehicle"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirmId(veh.id)}
                    className="p-1.5 bg-rose-950/60 text-rose-300 rounded-lg hover:bg-rose-900"
                    title="Delete Vehicle"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Confirmation Modals */}
      <ConfirmationModal
        isOpen={deleteConfirmId !== null}
        title="Delete Vehicle Record?"
        message="Are you sure you want to delete this vehicle from the active fleet?"
        onConfirm={async () => {
          if (deleteConfirmId !== null) {
            await onDeleteVehicle(deleteConfirmId);
            setDeleteConfirmId(null);
          }
        }}
        onCancel={() => setDeleteConfirmId(null)}
      />

      <ConfirmationModal
        isOpen={bulkDeleteModalOpen}
        title={`Bulk Delete ${selectedIds.length} Vehicles?`}
        message={`Are you sure you want to delete these ${selectedIds.length} selected fleet vehicles?`}
        onConfirm={handleExecuteBulkDelete}
        onCancel={() => setBulkDeleteModalOpen(false)}
      />
    </div>
  );
};
