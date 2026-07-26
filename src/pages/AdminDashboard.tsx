import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useCMS } from '../contexts/CMSContext';
import { bookingService } from '../services/bookingService';
import { fleetService } from '../services/fleetService';
import { routesService } from '../services/routesService';
import { blogService } from '../services/blogService';
import { cmsService } from '../services/cmsService';
import { MediaPicker } from '../components/MediaPicker';
import { MediaLibraryModal } from '../components/MediaLibraryModal';
import { Button } from '../components/ui/Button';
import {
  Booking,
  FleetVehicle,
  PopularRoute,
  BlogPost,
  Testimonial,
  FAQItem,
  GalleryItem,
  AdminStats,
  SiteSettings,
} from '../types';
import {
  LayoutDashboard,
  Calendar,
  Car,
  Compass,
  FileText,
  Star,
  HelpCircle,
  Image as ImageIcon,
  Settings,
  BarChart3,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  CheckCircle,
  Search,
  RefreshCw,
  Download,
  Save,
  ShieldCheck,
  X,
  Upload,
  Layers,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { logout } = useAuth();
  const { showToast } = useToast();
  const { settings, refreshSettings } = useCMS();

  const [activeTab, setActiveTab] = useState<
    'dashboard' | 'bookings' | 'fleet' | 'routes' | 'blogs' | 'testimonials' | 'faqs' | 'gallery' | 'media' | 'settings' | 'backup'
  >('dashboard');

  // CRM Data States
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('ALL');
  const [bookingSearch, setBookingFilterSearch] = useState<string>('');

  const [fleetList, setFleetList] = useState<FleetVehicle[]>([]);
  const [routesList, setRoutesList] = useState<PopularRoute[]>([]);
  const [routeSearch, setRouteSearch] = useState<string>('');
  const [routeFilterStatus, setRouteFilterStatus] = useState<string>('ALL');
  const [selectedRouteIds, setSelectedRouteIds] = useState<number[]>([]);

  const [blogsList, setBlogsList] = useState<BlogPost[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);
  const [faqsList, setFaqsList] = useState<FAQItem[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);

  const [loadingData, setLoadingData] = useState(false);

  // Modal / Form States
  const [editingVehicle, setEditingVehicle] = useState<Partial<FleetVehicle> | null>(null);
  const [editingRoute, setEditingRoute] = useState<Partial<PopularRoute> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQItem> | null>(null);
  const [newGalleryItem, setNewGalleryItem] = useState<{ title: string; category: string; image_url: string }>({
    title: '',
    category: 'Fleet',
    image_url: '',
  });
  const [newBooking, setNewBooking] = useState<Partial<Booking> | null>(null);

  // Site Settings Form State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({});

  // Media Library Standalone Modal State
  const [globalMediaModalOpen, setGlobalMediaModalOpen] = useState(false);

  const loadAllAdminData = async () => {
    setLoadingData(true);
    try {
      const [st, bData, fData, rData, blData, tData, faqData, gData] = await Promise.all([
        cmsService.getStats(),
        bookingService.getAllBookings(bookingFilterStatus, bookingSearch),
        fleetService.getAllFleet(),
        routesService.getAllRoutes(),
        blogService.getAllBlogs(),
        cmsService.getTestimonials(),
        cmsService.getFaqs(),
        cmsService.getGallery(),
      ]);

      setStats(st);
      setBookings(bData);
      setFleetList(fData);
      setRoutesList(rData);
      setBlogsList(blData);
      setTestimonialsList(tData);
      setFaqsList(faqData);
      setGalleryList(gData);
      setSettingsForm(settings);
    } catch (err: any) {
      console.error('Error loading admin dashboard:', err);
      showToast('Error syncing CMS data: ' + err.message, 'error');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    loadAllAdminData();
  }, [bookingFilterStatus]);

  useEffect(() => {
    setSettingsForm(settings);
  }, [settings]);

  // BOOKING ACTIONS
  const handleUpdateBookingStatus = async (id: number, status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED') => {
    try {
      await bookingService.updateBooking(id, { status });
      showToast(`Booking status updated to ${status}`, 'success');
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteBooking = async (id: number) => {
    if (!window.confirm('Delete this booking record?')) return;
    try {
      await bookingService.deleteBooking(id);
      showToast('Booking record deleted', 'info');
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // FLEET ACTIONS
  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle || !editingVehicle.title) return;
    try {
      if (editingVehicle.id) {
        await fleetService.updateVehicle(editingVehicle.id, editingVehicle);
        showToast('Vehicle specification updated', 'success');
      } else {
        await fleetService.createVehicle(editingVehicle);
        showToast('New vehicle added to CMS fleet', 'success');
      }
      setEditingVehicle(null);
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    if (!window.confirm('Delete vehicle from CMS?')) return;
    try {
      await fleetService.deleteVehicle(id);
      showToast('Vehicle removed from fleet', 'info');
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // ROUTE ACTIONS
  const handleSaveRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoute || !editingRoute.origin || !editingRoute.destination) {
      showToast('Origin and Destination are required.', 'error');
      return;
    }
    try {
      if (editingRoute.id) {
        await routesService.updateRoute(editingRoute.id, editingRoute);
        showToast('Outstation Route updated in CMS', 'success');
      } else {
        await routesService.createRoute({
          ...editingRoute,
          is_active: editingRoute.is_active ?? true,
          is_featured: editingRoute.is_featured ?? false,
          is_popular: editingRoute.is_popular ?? false,
        });
        showToast('New Outstation Route created', 'success');
      }
      setEditingRoute(null);
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteRoute = async (id: number) => {
    if (!window.confirm('Delete this outstation route?')) return;
    try {
      await routesService.deleteRoute(id);
      showToast('Route deleted', 'info');
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleRouteActive = async (route: PopularRoute) => {
    try {
      await routesService.updateRoute(route.id, { is_active: !(route.is_active ?? true) });
      showToast(`Route status toggled for ${route.origin} → ${route.destination}`, 'success');
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleToggleRouteFeatured = async (route: PopularRoute) => {
    try {
      await routesService.updateRoute(route.id, { is_featured: !(route.is_featured ?? false) });
      showToast(`Featured toggle updated for ${route.origin} → ${route.destination}`, 'success');
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleBulkDeleteRoutes = async () => {
    if (selectedRouteIds.length === 0) return;
    if (!window.confirm(`Delete ${selectedRouteIds.length} selected route(s)?`)) return;
    try {
      await Promise.all(selectedRouteIds.map((id) => routesService.deleteRoute(id)));
      showToast(`${selectedRouteIds.length} route(s) deleted`, 'info');
      setSelectedRouteIds([]);
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleBulkStatusChangeRoutes = async (setActive: boolean) => {
    if (selectedRouteIds.length === 0) return;
    try {
      await Promise.all(
        selectedRouteIds.map((id) => routesService.updateRoute(id, { is_active: setActive }))
      );
      showToast(`Marked ${selectedRouteIds.length} route(s) as ${setActive ? 'Active' : 'Disabled'}`, 'success');
      setSelectedRouteIds([]);
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // BLOG ACTIONS
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog || !editingBlog.title) return;
    try {
      if (editingBlog.id) {
        await blogService.updateBlog(editingBlog.id, editingBlog);
        showToast('Article updated', 'success');
      } else {
        await blogService.createBlog(editingBlog);
        showToast('New article published', 'success');
      }
      setEditingBlog(null);
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteBlog = async (id: number) => {
    if (!window.confirm('Delete article?')) return;
    try {
      await blogService.deleteBlog(id);
      showToast('Article removed', 'info');
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // GALLERY ACTIONS
  const handleSaveGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.title || !newGalleryItem.image_url) {
      showToast('Please provide a title and select/upload an image.', 'error');
      return;
    }
    try {
      await cmsService.createGalleryItem(newGalleryItem);
      showToast('Gallery item added!', 'success');
      setNewGalleryItem({ title: '', category: 'Fleet', image_url: '' });
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteGalleryItem = async (id: number) => {
    if (!window.confirm('Delete gallery asset?')) return;
    try {
      await cmsService.deleteGalleryItem(id);
      showToast('Gallery item deleted', 'info');
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // SETTINGS SAVE
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await cmsService.updateSettings(settingsForm);
      await refreshSettings();
      showToast('Site Settings & Media persisted globally!', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // EXPORT CSV / BACKUP
  const handleExportCSV = () => {
    const headers = ['Ref', 'Customer', 'Phone', 'Vehicle', 'TripType', 'Pickup', 'Drop', 'Date', 'Time', 'Amount', 'Status'];
    const rows = bookings.map((b) => [
      b.booking_ref,
      b.customer_name,
      b.customer_phone,
      b.vehicle,
      b.trip_type,
      `"${b.pickup}"`,
      `"${b.drop_location}"`,
      b.travel_date,
      b.pickup_time,
      b.estimated_amount,
      b.status,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Luthra_Travels_Bookings_Backup_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-24 pb-16 flex flex-col md:flex-row">
      {/* CMS SIDEBAR */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-[#C9A227] flex items-center justify-center font-bold text-zinc-950 text-base font-serif">
              LT
            </div>
            <div>
              <span className="font-serif font-bold text-white text-base block leading-tight">Admin CMS Panel</span>
              <span className="text-[10px] text-[#C9A227] font-mono block">Luthra Control Center</span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-medium">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'dashboard' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" /> Overview
            </button>

            <button
              onClick={() => setActiveTab('bookings')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'bookings' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <span className="flex items-center gap-3"><Calendar className="w-4 h-4" /> Bookings CRM</span>
              {stats?.pendingBookings ? (
                <span className="bg-[#C9A227] text-zinc-950 text-[10px] font-extrabold font-mono px-2 py-0.5 rounded-full">
                  {stats.pendingBookings}
                </span>
              ) : null}
            </button>

            <button
              onClick={() => setActiveTab('fleet')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'fleet' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <Car className="w-4 h-4" /> Fleet CMS
            </button>

            <button
              onClick={() => setActiveTab('media')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'media' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-[#C9A227]" /> Media Library
            </button>

            <button
              onClick={() => setActiveTab('routes')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'routes' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <Compass className="w-4 h-4" /> Popular Routes
            </button>

            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'blogs' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <FileText className="w-4 h-4" /> Articles
            </button>

            <button
              onClick={() => setActiveTab('gallery')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'gallery' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <Layers className="w-4 h-4" /> Gallery Showcase
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'settings' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <Settings className="w-4 h-4" /> Site Settings
            </button>

            <button
              onClick={() => setActiveTab('backup')}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                activeTab === 'backup' ? 'bg-[#C9A227] text-zinc-950 font-bold' : 'text-zinc-300 hover:bg-zinc-800'
              }`}
            >
              <BarChart3 className="w-4 h-4" /> Analytics &amp; CSV
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-zinc-800 space-y-3">
          <button
            onClick={loadAllAdminData}
            className="w-full flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white text-xs py-2 rounded-xl transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#C9A227]" /> Refresh Data
          </button>
          <button
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 bg-rose-950/60 border border-rose-500/30 text-rose-300 text-xs py-2 rounded-xl hover:bg-rose-900/60 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" /> Logout CMS
          </button>
        </div>
      </aside>

      {/* MAIN WORKSPACE CONTENT */}
      <main className="flex-1 p-6 md:p-10 overflow-x-hidden space-y-8">
        
        {/* TOP METRICS */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800">
              <span className="text-[11px] text-zinc-400 uppercase font-mono block">Total Bookings</span>
              <span className="font-serif text-3xl font-bold text-white font-mono">{stats.totalBookings}</span>
            </div>
            <div className="bg-zinc-900/80 p-5 rounded-2xl border border-[#C9A227]/30">
              <span className="text-[11px] text-[#C9A227] uppercase font-mono block">Pending CRM</span>
              <span className="font-serif text-3xl font-bold text-[#C9A227] font-mono">{stats.pendingBookings}</span>
            </div>
            <div className="bg-zinc-900/80 p-5 rounded-2xl border border-emerald-500/30">
              <span className="text-[11px] text-emerald-400 uppercase font-mono block">Confirmed Trips</span>
              <span className="font-serif text-3xl font-bold text-emerald-300 font-mono">{stats.confirmedBookings}</span>
            </div>
            <div className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800">
              <span className="text-[11px] text-zinc-400 uppercase font-mono block">Pipeline Revenue</span>
              <span className="font-serif text-3xl font-bold text-[#C9A227] font-mono">₹{stats.totalRevenue.toLocaleString()}</span>
            </div>
          </div>
        )}

        {/* TAB 1: DASHBOARD OVERVIEW */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-2xl font-bold text-white">Recent Reservations Log</h2>
              <Button variant="ghost" size="sm" onClick={() => setActiveTab('bookings')}>
                View Full Bookings CRM →
              </Button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-[#C9A227] font-mono uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Ref</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Pickup / Drop</th>
                    <th className="p-3">Date</th>
                    <th className="p-3">Est. Fare</th>
                    <th className="p-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-mono font-bold text-[#C9A227]">{b.booking_ref}</td>
                      <td className="p-3 font-medium text-white">{b.customer_name}<span className="block text-[10px] text-zinc-400">{b.customer_phone}</span></td>
                      <td className="p-3">{b.vehicle}</td>
                      <td className="p-3 max-w-xs truncate">{b.pickup} → {b.drop_location}</td>
                      <td className="p-3">{b.travel_date}</td>
                      <td className="p-3 font-mono font-bold text-[#C9A227]">₹{b.estimated_amount}</td>
                      <td className="p-3">
                        <select
                          value={b.status}
                          onChange={(e) => b.id && handleUpdateBookingStatus(b.id, e.target.value as any)}
                          className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[11px] text-white"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: BOOKINGS CRM */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Bookings CRM Desk</h2>
                <p className="text-xs text-zinc-400">Manage incoming reservation logs, customer details, and dispatch statuses.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleExportCSV} leftIcon={<Download className="w-4 h-4" />}>
                Export CSV Backup
              </Button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-[#C9A227] font-mono uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Ref</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Pickup / Drop</th>
                    <th className="p-3">Date &amp; Time</th>
                    <th className="p-3">Fare</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-mono font-bold text-[#C9A227]">{b.booking_ref}</td>
                      <td className="p-3 font-medium text-white">{b.customer_name}<span className="block text-[10px] text-zinc-400">{b.customer_phone}</span></td>
                      <td className="p-3">{b.vehicle}</td>
                      <td className="p-3 max-w-xs truncate">{b.pickup} → {b.drop_location}</td>
                      <td className="p-3">{b.travel_date} at {b.pickup_time}</td>
                      <td className="p-3 font-mono font-bold text-[#C9A227]">₹{b.estimated_amount}</td>
                      <td className="p-3">
                        <select
                          value={b.status}
                          onChange={(e) => b.id && handleUpdateBookingStatus(b.id, e.target.value as any)}
                          className="bg-zinc-950 border border-zinc-800 rounded px-2 py-1 text-[11px] text-white"
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="CONFIRMED">CONFIRMED</option>
                          <option value="COMPLETED">COMPLETED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                      <td className="p-3 text-right">
                        <button onClick={() => b.id && handleDeleteBooking(b.id)} className="text-rose-400 hover:text-rose-300 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: FLEET CMS WITH MEDIA PICKER */}
        {activeTab === 'fleet' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Fleet CMS Catalog</h2>
                <p className="text-xs text-zinc-400">Manage fleet models, capacity specs, pricing rates, and media asset images.</p>
              </div>
              <Button
                variant="gold"
                size="sm"
                onClick={() =>
                  setEditingVehicle({
                    title: '',
                    category: 'Luxury MPV',
                    capacity_passengers: 7,
                    luggage_count: 4,
                    rate_per_km: 18,
                    base_price: 2800,
                    features: ['Captain Leather Seats', 'Dual AC Vents', 'Sanitized'],
                    image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
                    description: 'Premium chauffeur vehicle.',
                    is_active: true,
                    sorting_order: fleetList.length + 1,
                  })
                }
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Vehicle
              </Button>
            </div>

            {/* Editing Vehicle Modal with MediaPicker */}
            {editingVehicle && (
              <form onSubmit={handleSaveVehicle} className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#C9A227]">
                    {editingVehicle.id ? 'Edit Vehicle Specs & Image' : 'Add Vehicle to CMS'}
                  </h3>
                  <button type="button" onClick={() => setEditingVehicle(null)}><X className="w-5 h-5 text-zinc-400" /></button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-zinc-300 font-semibold block">Vehicle Name *</label>
                    <input
                      type="text"
                      required
                      value={editingVehicle.title || ''}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, title: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 font-semibold block">Category</label>
                    <input
                      type="text"
                      value={editingVehicle.category || ''}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, category: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 font-semibold block">Rate per KM (₹)</label>
                    <input
                      type="number"
                      value={editingVehicle.rate_per_km || 14}
                      onChange={(e) => setEditingVehicle({ ...editingVehicle, rate_per_km: parseFloat(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-[#C9A227] font-bold font-mono"
                    />
                  </div>

                  {/* MediaPicker Integration for Vehicle Image */}
                  <div className="sm:col-span-3">
                    <MediaPicker
                      label="Vehicle Photo Asset"
                      value={editingVehicle.image_url || ''}
                      onChange={(url) => setEditingVehicle({ ...editingVehicle, image_url: url })}
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                  <Button variant="secondary" size="sm" onClick={() => setEditingVehicle(null)}>Cancel</Button>
                  <Button variant="gold" size="sm" type="submit">Save Vehicle</Button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {fleetList.map((veh) => (
                <div key={veh.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
                  <img src={veh.image_url} alt={veh.title} className="w-full h-36 object-cover rounded-xl border border-zinc-800" />
                  <div>
                    <h4 className="font-serif font-bold text-white text-base">{veh.title}</h4>
                    <span className="text-xs text-[#C9A227] font-mono block font-bold">₹{veh.rate_per_km}/km</span>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                    <button onClick={() => setEditingVehicle(veh)} className="p-1.5 bg-zinc-800 text-[#C9A227] rounded-lg"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteVehicle(veh.id)} className="p-1.5 bg-rose-950/60 text-rose-300 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3.5: ROUTES CMS MODULE */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Outstation Route CMS</h2>
                <p className="text-xs text-zinc-400">Manage outstation routes, one-way fares, status toggles, and featured tags.</p>
              </div>
              <Button
                variant="gold"
                size="sm"
                onClick={() =>
                  setEditingRoute({
                    origin: '',
                    destination: '',
                    price: 4200,
                    vehicle_type: 'Maruti Ertiga / Sedan',
                    distance_km: 245,
                    estimated_time: '4.0 hours',
                    is_active: true,
                    is_featured: false,
                    is_popular: false,
                  })
                }
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Outstation Route
              </Button>
            </div>

            {/* Filter & Search Bar */}
            <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-mono text-zinc-400">Filter:</span>
                {(['ALL', 'ACTIVE', 'INACTIVE', 'FEATURED'] as const).map((st) => (
                  <button
                    key={st}
                    onClick={() => setRouteFilterStatus(st)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold font-mono transition-all ${
                      routeFilterStatus === st ? 'bg-[#C9A227] text-zinc-950' : 'text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search routes..."
                  value={routeSearch}
                  onChange={(e) => setRouteSearch(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white focus:outline-none focus:border-[#C9A227]"
                />
              </div>
            </div>

            {/* Bulk Actions Bar */}
            {selectedRouteIds.length > 0 && (
              <div className="bg-[#C9A227]/10 border border-[#C9A227]/30 p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 text-xs">
                <span className="text-[#C9A227] font-semibold font-mono">
                  {selectedRouteIds.length} route(s) selected
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleBulkStatusChangeRoutes(true)}>
                    Mark Active
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => handleBulkStatusChangeRoutes(false)}>
                    Mark Disabled
                  </Button>
                  <Button variant="secondary" size="sm" onClick={handleBulkDeleteRoutes} className="text-rose-400 border-rose-500/30">
                    Delete Selected
                  </Button>
                </div>
              </div>
            )}

            {/* Route Add/Edit Modal */}
            {editingRoute && (
              <form onSubmit={handleSaveRoute} className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#C9A227]">
                    {editingRoute.id ? 'Edit Outstation Route' : 'Create New Outstation Route'}
                  </h3>
                  <button type="button" onClick={() => setEditingRoute(null)}><X className="w-5 h-5 text-zinc-400" /></button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-zinc-300 font-semibold block">Origin City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chandigarh"
                      value={editingRoute.origin || ''}
                      onChange={(e) => setEditingRoute({ ...editingRoute, origin: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-semibold block">Destination City *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Delhi"
                      value={editingRoute.destination || ''}
                      onChange={(e) => setEditingRoute({ ...editingRoute, destination: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-semibold block">One-Way Fare (₹) <span className="text-zinc-500 font-normal">(Leave blank for "Contact for Price")</span></label>
                    <input
                      type="number"
                      placeholder="e.g. 4200 (Leave empty if price varies)"
                      value={editingRoute.price ?? ''}
                      onChange={(e) => setEditingRoute({ ...editingRoute, price: e.target.value === '' ? null : parseFloat(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-[#C9A227] font-bold font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-semibold block">Recommended Vehicle</label>
                    <input
                      type="text"
                      placeholder="e.g. Maruti Ertiga / Sedan"
                      value={editingRoute.vehicle_type || ''}
                      onChange={(e) => setEditingRoute({ ...editingRoute, vehicle_type: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-semibold block">Distance (KM)</label>
                    <input
                      type="number"
                      value={editingRoute.distance_km ?? ''}
                      onChange={(e) => setEditingRoute({ ...editingRoute, distance_km: parseFloat(e.target.value) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-semibold block">Est. Duration</label>
                    <input
                      type="text"
                      placeholder="e.g. 4.0 hours"
                      value={editingRoute.estimated_time || ''}
                      onChange={(e) => setEditingRoute({ ...editingRoute, estimated_time: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div className="sm:col-span-3 flex flex-wrap gap-6 pt-2 border-t border-zinc-800">
                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={editingRoute.is_active ?? true}
                        onChange={(e) => setEditingRoute({ ...editingRoute, is_active: e.target.checked })}
                        className="w-4 h-4 accent-[#C9A227]"
                      />
                      <span>Active / Available</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={editingRoute.is_featured ?? false}
                        onChange={(e) => setEditingRoute({ ...editingRoute, is_featured: e.target.checked })}
                        className="w-4 h-4 accent-[#C9A227]"
                      />
                      <span>Featured Route Badge</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-300">
                      <input
                        type="checkbox"
                        checked={editingRoute.is_popular ?? false}
                        onChange={(e) => setEditingRoute({ ...editingRoute, is_popular: e.target.checked })}
                        className="w-4 h-4 accent-[#C9A227]"
                      />
                      <span>Popular Route Tag</span>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                  <Button variant="secondary" size="sm" onClick={() => setEditingRoute(null)}>Cancel</Button>
                  <Button variant="gold" size="sm" type="submit">Save Route</Button>
                </div>
              </form>
            )}

            {/* Routes Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-[#C9A227] font-mono uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3 w-10">
                      <input
                        type="checkbox"
                        checked={selectedRouteIds.length > 0 && selectedRouteIds.length === routesList.length}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedRouteIds(routesList.map((r) => r.id));
                          } else {
                            setSelectedRouteIds([]);
                          }
                        }}
                        className="w-4 h-4 accent-[#C9A227]"
                      />
                    </th>
                    <th className="p-3">Route (Origin → Destination)</th>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Distance &amp; Time</th>
                    <th className="p-3">One-Way Fare</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Featured</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {routesList
                    .filter((rt) => {
                      if (routeFilterStatus === 'ACTIVE') return rt.is_active !== false;
                      if (routeFilterStatus === 'INACTIVE') return rt.is_active === false;
                      if (routeFilterStatus === 'FEATURED') return rt.is_featured === true;
                      return true;
                    })
                    .filter((rt) => {
                      if (!routeSearch.trim()) return true;
                      const q = routeSearch.toLowerCase();
                      return (
                        rt.origin.toLowerCase().includes(q) ||
                        rt.destination.toLowerCase().includes(q) ||
                        (rt.vehicle_type && rt.vehicle_type.toLowerCase().includes(q))
                      );
                    })
                    .map((rt) => {
                      const isSelected = selectedRouteIds.includes(rt.id);
                      const isContactPrice = rt.price === null || rt.price === undefined || rt.price === 0;

                      return (
                        <tr key={rt.id} className={`hover:bg-zinc-800/40 ${isSelected ? 'bg-zinc-800/60' : ''}`}>
                          <td className="p-3">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedRouteIds([...selectedRouteIds, rt.id]);
                                } else {
                                  setSelectedRouteIds(selectedRouteIds.filter((id) => id !== rt.id));
                                }
                              }}
                              className="w-4 h-4 accent-[#C9A227]"
                            />
                          </td>
                          <td className="p-3 font-serif font-bold text-white">
                            {rt.origin} <span className="text-[#C9A227] font-mono font-normal">→</span> {rt.destination}
                          </td>
                          <td className="p-3">{rt.vehicle_type || 'Sedan / MPV'}</td>
                          <td className="p-3 font-mono">
                            {rt.distance_km ? `${rt.distance_km} KM` : 'N/A'} {rt.estimated_time ? `(${rt.estimated_time})` : ''}
                          </td>
                          <td className="p-3 font-mono font-bold">
                            {isContactPrice ? (
                              <span className="text-amber-400 text-[11px]">Contact for Price</span>
                            ) : (
                              <span className="text-[#C9A227]">₹{rt.price?.toLocaleString()}</span>
                            )}
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleRouteActive(rt)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                                rt.is_active !== false ? 'bg-emerald-500/20 text-emerald-300' : 'bg-rose-500/20 text-rose-300'
                              }`}
                            >
                              {rt.is_active !== false ? 'Active' : 'Disabled'}
                            </button>
                          </td>
                          <td className="p-3">
                            <button
                              onClick={() => handleToggleRouteFeatured(rt)}
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                                rt.is_featured ? 'bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/30' : 'bg-zinc-800 text-zinc-400'
                              }`}
                            >
                              {rt.is_featured ? 'Featured' : 'Normal'}
                            </button>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button onClick={() => setEditingRoute(rt)} className="p-1.5 bg-zinc-800 text-[#C9A227] rounded-lg">
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button onClick={() => handleDeleteRoute(rt.id)} className="p-1.5 bg-rose-950/60 text-rose-300 rounded-lg">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 4: STANDALONE MEDIA LIBRARY MANAGER */}
        {activeTab === 'media' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Media Library &amp; Asset Management</h2>
                <p className="text-xs text-zinc-400">Upload, drag-and-drop, filter, and manage persistent storage images across the website.</p>
              </div>
              <Button variant="gold" size="sm" onClick={() => setGlobalMediaModalOpen(true)} leftIcon={<Upload className="w-4 h-4" />}>
                Open Media Manager
              </Button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
              <MediaLibraryModal
                isOpen={true}
                onClose={() => setActiveTab('dashboard')}
                title="Admin Media Asset Library"
              />
            </div>
          </div>
        )}

        {/* TAB 5: ARTICLES / BLOGS CMS WITH MEDIA PICKER */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Articles &amp; Travel Journal CMS</h2>
                <p className="text-xs text-zinc-400">Publish travel guides and corporate mobility news with cover media.</p>
              </div>
              <Button
                variant="gold"
                size="sm"
                onClick={() => setEditingBlog({ title: '', excerpt: '', content: '', cover_image: '', category: 'Travel Guide', author: 'Vikram Luthra', is_published: true })}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Create Article
              </Button>
            </div>

            {editingBlog && (
              <form onSubmit={handleSaveBlog} className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#C9A227]">
                    {editingBlog.id ? 'Edit Article' : 'New Article Entry'}
                  </h3>
                  <button type="button" onClick={() => setEditingBlog(null)}><X className="w-5 h-5 text-zinc-400" /></button>
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-zinc-300 font-semibold block">Title *</label>
                    <input
                      type="text"
                      required
                      value={editingBlog.title || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, title: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <MediaPicker
                    label="Article Cover Image Asset"
                    value={editingBlog.cover_image || ''}
                    onChange={(url) => setEditingBlog({ ...editingBlog, cover_image: url })}
                  />

                  <div>
                    <label className="text-zinc-300 font-semibold block">Excerpt</label>
                    <textarea
                      rows={2}
                      value={editingBlog.excerpt || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                    />
                  </div>

                  <div>
                    <label className="text-zinc-300 font-semibold block">Body Content</label>
                    <textarea
                      rows={5}
                      value={editingBlog.content || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                  <Button variant="secondary" size="sm" onClick={() => setEditingBlog(null)}>Cancel</Button>
                  <Button variant="gold" size="sm" type="submit">Save Article</Button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {blogsList.map((post) => (
                <div key={post.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden p-4 space-y-3">
                  <img src={post.cover_image} alt={post.title} className="w-full h-36 object-cover rounded-xl border border-zinc-800" />
                  <h4 className="font-serif font-bold text-white text-base">{post.title}</h4>
                  <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                    <button onClick={() => setEditingBlog(post)} className="p-1.5 bg-zinc-800 text-[#C9A227] rounded-lg"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteBlog(post.id)} className="p-1.5 bg-rose-950/60 text-rose-300 rounded-lg"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 6: GALLERY SHOWCASE WITH MEDIA PICKER */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Gallery Showcase CMS</h2>
                <p className="text-xs text-zinc-400">Add portfolio images for luxury transfers, airport pickups, and outstation trips.</p>
              </div>
            </div>

            <form onSubmit={handleSaveGalleryItem} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#C9A227]">Add New Gallery Asset</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <input
                  type="text"
                  required
                  placeholder="Asset Title e.g. IGI Terminal 3 Pickup"
                  value={newGalleryItem.title}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                />

                <select
                  value={newGalleryItem.category}
                  onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                  className="bg-zinc-950 border border-zinc-800 rounded-xl p-2.5 text-xs text-white"
                >
                  <option value="Fleet">Fleet</option>
                  <option value="Airport">Airport</option>
                  <option value="Outstation">Outstation</option>
                  <option value="Weddings">Weddings</option>
                </select>

                <div className="sm:col-span-2">
                  <MediaPicker
                    label="Gallery Image URL"
                    value={newGalleryItem.image_url}
                    onChange={(url) => setNewGalleryItem({ ...newGalleryItem, image_url: url })}
                  />
                </div>
              </div>

              <Button variant="gold" size="sm" type="submit" leftIcon={<Plus className="w-4 h-4" />}>
                Add to Gallery
              </Button>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {galleryList.map((g) => (
                <div key={g.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-3 space-y-2 relative group">
                  <img src={g.image_url} alt={g.title} className="w-full h-32 object-cover rounded-xl border border-zinc-800" />
                  <span className="text-xs font-semibold text-white block truncate">{g.title}</span>
                  <button
                    onClick={() => handleDeleteGalleryItem(g.id)}
                    className="absolute top-4 right-4 p-1.5 bg-rose-950/80 text-rose-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 7: SITE CONFIGURATION WITH SEO OG MEDIA PICKER */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6">
            <h2 className="font-serif text-2xl font-bold text-[#C9A227]">Global CMS Site &amp; Media Configuration</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Company Name</label>
                <input
                  type="text"
                  value={settingsForm.company_name || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, company_name: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Primary Hotline</label>
                <input
                  type="text"
                  value={settingsForm.phone_primary || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone_primary: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Base Per-KM Rate (₹/KM)</label>
                <input
                  type="number"
                  value={settingsForm.default_rate_per_km || '14'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, default_rate_per_km: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[#C9A227] font-bold font-mono"
                />
              </div>

              {/* Why Choose Us Controls */}
              <div className="sm:col-span-2 pt-4 border-t border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#C9A227]">"Why Choose Us" CMS Section Settings</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-zinc-300">Show Section</span>
                    <input
                      type="checkbox"
                      checked={settingsForm.why_choose_visible !== 'false'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, why_choose_visible: e.target.checked ? 'true' : 'false' })}
                      className="w-4 h-4 accent-[#C9A227]"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-300 font-medium">Section Title</label>
                    <input
                      type="text"
                      value={settingsForm.why_choose_title || 'Why Choose Luthra Travels?'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, why_choose_title: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-300 font-medium">Section Subtitle</label>
                    <input
                      type="text"
                      value={settingsForm.why_choose_subtitle || 'Experience safe, comfortable and reliable taxi services with professional drivers and transparent pricing.'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, why_choose_subtitle: e.target.value })}
                      className="w-full bg-zinc-950 border border-slate-800 rounded-xl p-3 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Happy Customers Stat</label>
                    <input
                      type="text"
                      value={settingsForm.stat_happy_customers || '5000+'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, stat_happy_customers: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[#C9A227] font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Successful Trips Stat</label>
                    <input
                      type="text"
                      value={settingsForm.stat_successful_trips || '10000+'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, stat_successful_trips: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[#C9A227] font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Vehicles Available Stat</label>
                    <input
                      type="text"
                      value={settingsForm.stat_vehicles_available || '4'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, stat_vehicles_available: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[#C9A227] font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Customer Support Stat</label>
                    <input
                      type="text"
                      value={settingsForm.stat_customer_support || '24×7'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, stat_customer_support: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[#C9A227] font-mono"
                    />
                  </div>
                </div>
              </div>

              {/* Featured Tour Package CMS Controls (Manali Tour) */}
              <div className="sm:col-span-2 pt-4 border-t border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#C9A227]">Featured Tour Package CMS Settings</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-zinc-300">Show Tour Section</span>
                    <input
                      type="checkbox"
                      checked={settingsForm.outstation_tour_visible !== 'false'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, outstation_tour_visible: e.target.checked ? 'true' : 'false' })}
                      className="w-4 h-4 accent-[#C9A227]"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-300 font-medium">Tour Title</label>
                    <input
                      type="text"
                      value={settingsForm.outstation_tour_title || 'Manali Tour Package Available'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, outstation_tour_title: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-300 font-medium">Tour Description</label>
                    <textarea
                      rows={2}
                      value={settingsForm.outstation_tour_desc || 'Book comfortable and reliable taxi service for your Manali trip with professional drivers and well-maintained vehicles.'}
                      onChange={(e) => setSettingsForm({ ...settingsForm, outstation_tour_desc: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <MediaPicker
                      label="Tour Cover Image Asset"
                      value={settingsForm.outstation_tour_image || 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=1200&auto=format&fit=crop'}
                      onChange={(url) => setSettingsForm({ ...settingsForm, outstation_tour_image: url })}
                    />
                  </div>
                </div>
              </div>

              <div className="sm:col-span-2">
                <MediaPicker
                  label="SEO OpenGraph Brand Banner Image"
                  value={settingsForm.og_image || 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop'}
                  onChange={(url) => setSettingsForm({ ...settingsForm, og_image: url })}
                />
              </div>
            </div>

            <Button variant="gold" size="md" type="submit" leftIcon={<Save className="w-4 h-4" />}>
              Save Site Settings
            </Button>
          </form>
        )}

      </main>

      {/* Global Media Library Standalone Modal */}
      <MediaLibraryModal
        isOpen={globalMediaModalOpen}
        onClose={() => setGlobalMediaModalOpen(false)}
        title="Admin Media Library Manager"
      />
    </div>
  );
};
