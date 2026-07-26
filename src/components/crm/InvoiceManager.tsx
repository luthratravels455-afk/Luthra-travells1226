import React, { useState, useEffect } from 'react';
import { FileText, Download, Printer, CheckCircle, Clock } from 'lucide-react';
import { crmService, GSTInvoice } from '../../services/crmService';
import { Button } from '../ui/Button';
import { useToast } from '../../contexts/ToastContext';

export const InvoiceManager: React.FC = () => {
  const [invoices, setInvoices] = useState<GSTInvoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<GSTInvoice | null>(null);
  const { showToast } = useToast();

  const loadInvoices = async () => {
    try {
      const data = await crmService.getAllInvoices();
      setInvoices(data);
    } catch (err: any) {
      console.error('Error fetching invoices:', err);
    }
  };

  useEffect(() => {
    loadInvoices();
  }, []);

  const handleStatusChange = async (id: number, status: 'Pending' | 'Paid' | 'Refunded' | 'Cancelled') => {
    try {
      await crmService.updateInvoiceStatus(id, status);
      showToast(`Invoice status updated to ${status}`, 'success');
      loadInvoices();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handlePrintInvoice = () => {
    window.print();
  };

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <FileText className="w-6 h-6 text-[#C9A227]" />
          <div>
            <h3 className="font-serif text-xl font-bold text-white">GST Invoicing &amp; Billing</h3>
            <p className="text-xs text-zinc-400">GST compliant tax invoice breakdown and audit logs</p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-zinc-900/80 text-[#C9A227] font-mono uppercase border-b border-zinc-800">
            <tr>
              <th className="p-3">Invoice #</th>
              <th className="p-3">Booking Ref</th>
              <th className="p-3">Customer</th>
              <th className="p-3">GSTIN</th>
              <th className="p-3">Subtotal</th>
              <th className="p-3">5% GST</th>
              <th className="p-3">Total Fare</th>
              <th className="p-3">Status</th>
              <th className="p-3 text-right">Invoice View</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800 text-zinc-300 font-mono">
            {invoices.map((inv) => (
              <tr key={inv.id} className="hover:bg-zinc-900/50">
                <td className="p-3 font-bold text-white">{inv.invoice_number}</td>
                <td className="p-3 text-[#C9A227]">{inv.booking_ref}</td>
                <td className="p-3 font-sans font-medium text-white">{inv.customer_name}</td>
                <td className="p-3 text-zinc-400">{inv.customer_gst || '07AAAAA0000A1Z5'}</td>
                <td className="p-3">₹{inv.subtotal}</td>
                <td className="p-3 text-amber-400">₹{inv.gst_amount}</td>
                <td className="p-3 font-bold text-emerald-400">₹{inv.total_amount}</td>
                <td className="p-3">
                  <select
                    value={inv.payment_status}
                    onChange={(e) => inv.id && handleStatusChange(inv.id, e.target.value as any)}
                    className="bg-zinc-900 border border-zinc-800 rounded px-2 py-1 text-[11px] text-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Paid">Paid</option>
                    <option value="Refunded">Refunded</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
                <td className="p-3 text-right">
                  <button
                    onClick={() => setSelectedInvoice(inv)}
                    className="text-xs text-[#C9A227] underline"
                  >
                    Print PDF
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Printable Invoice Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/80 backdrop-blur-md">
          <div className="bg-zinc-900 border border-[#C9A227]/30 rounded-3xl max-w-xl w-full p-8 space-y-6 text-xs text-zinc-300">
            <div className="flex justify-between items-start border-b border-zinc-800 pb-4">
              <div>
                <h2 className="font-serif text-xl font-bold text-white">LUTHRA TRAVELS</h2>
                <span className="text-[10px] text-[#C9A227] font-mono block">TAX INVOICE #{selectedInvoice.invoice_number}</span>
                <span className="text-[10px] text-zinc-400 block">GSTIN: 07AAAAA0000A1Z5</span>
              </div>
              <div className="text-right">
                <Button variant="gold" size="sm" onClick={handlePrintInvoice} leftIcon={<Printer className="w-4 h-4" />}>
                  Print
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-b border-zinc-800 pb-4">
              <div>
                <span className="text-zinc-500 uppercase font-mono block text-[10px]">Billed To</span>
                <strong className="text-white text-sm block">{selectedInvoice.customer_name}</strong>
                <span>Phone: {selectedInvoice.customer_phone}</span>
              </div>
              <div>
                <span className="text-zinc-500 uppercase font-mono block text-[10px]">Booking Ref</span>
                <strong className="text-[#C9A227] text-sm font-mono block">{selectedInvoice.booking_ref}</strong>
                <span>Status: {selectedInvoice.payment_status}</span>
              </div>
            </div>

            <div className="space-y-2 font-mono">
              <div className="flex justify-between border-b border-zinc-800 pb-1">
                <span>Chauffeur Service Fare Subtotal</span>
                <span>₹{selectedInvoice.subtotal}</span>
              </div>
              <div className="flex justify-between border-b border-zinc-800 pb-1 text-amber-400">
                <span>CGST + SGST (5%)</span>
                <span>₹{selectedInvoice.gst_amount}</span>
              </div>
              <div className="flex justify-between pt-2 text-sm font-bold text-white">
                <span>Total Amount Billed</span>
                <span className="text-emerald-400">₹{selectedInvoice.total_amount}</span>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button onClick={() => setSelectedInvoice(null)} className="px-4 py-2 bg-zinc-800 rounded-xl text-zinc-300">
                Close Invoice View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
