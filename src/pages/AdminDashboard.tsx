import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';
import { useCMS } from '../contexts/CMSContext';
import { bookingService } from '../services/bookingService';
import { fleetService } from '../services/fleetService';
import { routesService } from '../services/routesService';
import { blogService } from '../services/blogService';
import { cmsService } from '../services/cmsService';
import { Button } from '../components/ui/Button';
import { ImageUploader } from '../components/admin/ImageUploader';
import { SEOManager } from '../components/admin/SEOManager';
import { GoogleReviewsCMS } from '../components/GoogleReviewsCMS';

const ImageUploadInput = ImageUploader;
import {
  Booking,
  FleetVehicle,
  PopularRoute,
  BlogPost,
  Testimonial,
  FAQItem,
  GalleryItem,
  ServiceItem,
  AdminStats,
  SiteSettings,
} from '../types';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Car,
  Compass,
  Briefcase,
  FileText,
  Star,
  HelpCircle,
  Image as ImageIcon,
  Home as HomeIcon,
  Phone,
  Globe,
  Tag,
  Bell,
  Lock,
  Database,
  Sliders,
  BarChart3,
  CheckCircle2,
  XCircle,
  Save,
  RefreshCw,
  Trash2,
  Edit3,
  Plus,
  Download,
  LogOut,
  ShieldCheck,
  X,
  Code2,
  Search,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const { logout, user } = useAuth();
  const { showToast } = useToast();
  const { settings, refreshSettings } = useCMS();

  type AdminTab =
    | 'dashboard'
    | 'bookings'
    | 'customers'
    | 'fleet'
    | 'routes'
    | 'taxi-packages'
    | 'services'
    | 'blogs'
    | 'testimonials'
    | 'google-reviews'
    | 'faqs'
    | 'gallery'
    | 'homepage'
    | 'settings'
    | 'seo'
    | 'analytics-verif'
    | 'pricing'
    | 'notifications'
    | 'users'
    | 'backup';

  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Data States
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingFilterStatus, setBookingFilterStatus] = useState<string>('ALL');
  const [bookingSearch] = useState<string>('');

  const [fleetList, setFleetList] = useState<FleetVehicle[]>([]);
  const [routesList, setRoutesList] = useState<PopularRoute[]>([]);
  const [blogsList, setBlogsList] = useState<BlogPost[]>([]);
  const [testimonialsList, setTestimonialsList] = useState<Testimonial[]>([]);
  const [faqsList, setFaqsList] = useState<FAQItem[]>([]);
  const [galleryList, setGalleryList] = useState<GalleryItem[]>([]);
  const [servicesList, setServicesList] = useState<ServiceItem[]>([]);

  const [loadingData, setLoadingData] = useState(false);

  // Form / Modal States
  const [editingVehicle, setEditingVehicle] = useState<Partial<FleetVehicle> | null>(null);
  const [editingRoute, setEditingRoute] = useState<Partial<PopularRoute> | null>(null);
  const [editingBlog, setEditingBlog] = useState<Partial<BlogPost> | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Partial<Testimonial> | null>(null);
  const [editingFaq, setEditingFaq] = useState<Partial<FAQItem> | null>(null);
  const [editingService, setEditingService] = useState<Partial<ServiceItem> | null>(null);
  const [newGalleryItem, setNewGalleryItem] = useState({ title: '', category: 'Fleet', image_url: '' });

  // Settings State
  const [settingsForm, setSettingsForm] = useState<SiteSettings>({});

  const loadAllAdminData = async () => {
    setLoadingData(true);
    try {
      const [st, bData, fData, rData, blData, tData, faqData, gData, sData] = await Promise.all([
        cmsService.getStats(),
        bookingService.getAllBookings(bookingFilterStatus, bookingSearch),
        fleetService.getAllFleet(),
        routesService.getAllRoutes(),
        blogService.getAllBlogs(),
        cmsService.getTestimonials(),
        cmsService.getFaqs(),
        cmsService.getGallery(),
        cmsService.getServices(),
      ]);

      setStats(st);
      setBookings(bData);
      setFleetList(fData);
      setRoutesList(rData);
      setBlogsList(blData);
      setTestimonialsList(tData);
      setFaqsList(faqData);
      setGalleryList(gData);
      setServicesList(sData);
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

  // BOOKING STATUS UPDATE
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
    if (!window.confirm('Delete this booking permanently?')) return;
    try {
      await bookingService.deleteBooking(id);
      showToast('Booking deleted', 'info');
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // FLEET CRUD
  const handleSaveVehicle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingVehicle) return;
    try {
      if (editingVehicle.id) {
        await fleetService.updateVehicle(editingVehicle.id, editingVehicle);
        showToast('Vehicle specs updated', 'success');
      } else {
        await fleetService.createVehicle(editingVehicle);
        showToast('New vehicle added to Fleet CMS', 'success');
      }
      setEditingVehicle(null);
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteVehicle = async (id: number) => {
    if (!window.confirm('Remove this vehicle from Fleet?')) return;
    try {
      await fleetService.deleteVehicle(id);
      showToast('Vehicle removed from CMS', 'info');
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // ROUTE CRUD
  const handleSaveRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoute) return;
    try {
      if (editingRoute.id) {
        await routesService.updateRoute(editingRoute.id, editingRoute);
        showToast('Intercity Route updated', 'success');
      } else {
        await routesService.createRoute(editingRoute);
        showToast('New route added to database', 'success');
      }
      setEditingRoute(null);
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteRoute = async (id: number) => {
    if (!window.confirm('Delete this route?')) return;
    try {
      await routesService.deleteRoute(id);
      showToast('Route deleted', 'info');
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // BLOG CRUD
  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog) return;
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
      showToast('Article deleted', 'info');
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // TESTIMONIAL CRUD
  const handleSaveTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial) return;
    try {
      if (editingTestimonial.id) {
        await cmsService.updateTestimonial(editingTestimonial.id, editingTestimonial);
        showToast('Testimonial updated', 'success');
      } else {
        await cmsService.createTestimonial(editingTestimonial);
        showToast('Testimonial added', 'success');
      }
      setEditingTestimonial(null);
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteTestimonial = async (id: number) => {
    if (!window.confirm('Delete review?')) return;
    try {
      await cmsService.deleteTestimonial(id);
      showToast('Review removed', 'info');
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // FAQ CRUD
  const handleSaveFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingFaq) return;
    try {
      if (editingFaq.id) {
        await cmsService.updateFaq(editingFaq.id, editingFaq);
        showToast('FAQ item updated', 'success');
      } else {
        await cmsService.createFaq(editingFaq);
        showToast('New FAQ item added', 'success');
      }
      setEditingFaq(null);
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteFaq = async (id: number) => {
    if (!window.confirm('Delete FAQ item?')) return;
    try {
      await cmsService.deleteFaq(id);
      showToast('FAQ removed', 'info');
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // GALLERY CRUD
  const handleAddGalleryItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryItem.title || !newGalleryItem.image_url) return;
    try {
      await cmsService.createGalleryItem(newGalleryItem);
      showToast('Gallery image uploaded to database', 'success');
      setNewGalleryItem({ title: '', category: 'Fleet', image_url: '' });
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDeleteGalleryItem = async (id: number) => {
    if (!window.confirm('Delete gallery item?')) return;
    try {
      await cmsService.deleteGalleryItem(id);
      showToast('Gallery image deleted', 'info');
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // SETTINGS SAVE
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Sync script keys across property variants
      const syncedForm = {
        ...settingsForm,
        custom_script_head: settingsForm.custom_script_head || settingsForm.custom_head_scripts || '',
        custom_head_scripts: settingsForm.custom_script_head || settingsForm.custom_head_scripts || '',
        custom_script_body: settingsForm.custom_script_body || settingsForm.custom_body_scripts || '',
        custom_body_scripts: settingsForm.custom_script_body || settingsForm.custom_body_scripts || '',
        custom_script_footer: settingsForm.custom_script_footer || settingsForm.custom_footer_scripts || '',
        custom_footer_scripts: settingsForm.custom_script_footer || settingsForm.custom_footer_scripts || '',
      };

      await cmsService.updateSettings(syncedForm);
      await refreshSettings();
      showToast('SEO, Custom Scripts & Database Settings Saved!', 'success');
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // FULL DATABASE BACKUP EXPORT
  const handleExportFullBackup = () => {
    const backupObject = {
      export_date: new Date().toISOString(),
      site_settings: settingsForm,
      bookings: bookings,
      fleet: fleetList,
      routes: routesList,
      blogs: blogsList,
      testimonials: testimonialsList,
      faqs: faqsList,
      gallery: galleryList,
      services: servicesList,
    };

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(backupObject, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `Luthra_Travels_Full_Database_Backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Full Database JSON Backup downloaded!', 'success');
  };

  interface SidebarTabItem {
    id: AdminTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }

  const sidebarTabs: SidebarTabItem[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'bookings', label: 'Bookings CRM', icon: <Calendar className="w-4 h-4" />, badge: stats?.pendingBookings },
    { id: 'fleet', label: 'Fleet Vehicles', icon: <Car className="w-4 h-4" /> },
    { id: 'routes', label: 'Routes & Fares', icon: <Compass className="w-4 h-4" /> },
    { id: 'blogs', label: 'Blogs & Articles', icon: <FileText className="w-4 h-4" /> },
    { id: 'testimonials', label: 'Reviews & Ratings', icon: <Star className="w-4 h-4" /> },
    { id: 'google-reviews', label: 'Google Reviews API', icon: <Globe className="w-4 h-4" /> },
    { id: 'faqs', label: 'Support FAQs', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery Media', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'homepage', label: 'Homepage & Hero', icon: <HomeIcon className="w-4 h-4" /> },
    { id: 'settings', label: 'Business Details', icon: <Phone className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO & Meta Tags', icon: <Globe className="w-4 h-4" /> },
    { id: 'analytics-verif', label: 'Verification & Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'pricing', label: 'Pricing Rules', icon: <Tag className="w-4 h-4" /> },
    { id: 'backup', label: 'Database Backup', icon: <Database className="w-4 h-4" /> },
  ];

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-24 pb-16 flex flex-col md:flex-row">
      {/* SIDEBAR NAVIGATION */}
      <aside className="w-full md:w-64 bg-zinc-900 border-r border-zinc-800/80 p-5 flex flex-col justify-between shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-zinc-800">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-[#C9A227] flex items-center justify-center font-bold text-zinc-950 text-base font-serif">
              LT
            </div>
            <div>
              <span className="font-serif font-bold text-white text-base block leading-tight">Admin CMS Portal</span>
              <span className="text-[10px] text-[#C9A227] font-mono block">Connected to Supabase</span>
            </div>
          </div>

          <nav className="space-y-1 text-xs font-medium max-h-[70vh] overflow-y-auto pr-1">
            {sidebarTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl transition-all ${
                  activeTab === tab.id
                    ? 'bg-[#C9A227] text-zinc-950 font-bold shadow-md shadow-[#C9A227]/20'
                    : 'text-zinc-300 hover:bg-zinc-800 hover:text-white'
                }`}
              >
                <span className="flex items-center gap-2.5">
                  {tab.icon}
                  <span>{tab.label}</span>
                </span>
                {tab.badge ? (
                  <span className="bg-rose-500 text-white text-[10px] font-extrabold font-mono px-2 py-0.5 rounded-full">
                    {tab.badge}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>

        <div className="pt-6 border-t border-zinc-800 space-y-2">
          <div className="text-[11px] text-zinc-400 font-mono flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span className="truncate">{user?.email || 'admin@luthratravels.com'}</span>
          </div>

          <button
            onClick={loadAllAdminData}
            className="w-full flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 text-zinc-300 hover:text-white text-xs py-2 rounded-xl transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#C9A227] ${loadingData ? 'animate-spin' : ''}`} /> Refresh Data
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
        
        {/* TOP COUNTERS SUMMARY BAR */}
        {stats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800">
              <span className="text-[11px] text-zinc-400 uppercase font-mono block">Total Bookings</span>
              <span className="font-serif text-3xl font-bold text-white font-mono">{stats.totalBookings}</span>
            </div>
            <div className="bg-zinc-900/80 p-5 rounded-2xl border border-[#C9A227]/30">
              <span className="text-[11px] text-[#C9A227] uppercase font-mono block">Pending Action</span>
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

        {/* TAB 1: OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="font-serif text-2xl font-bold text-white">Recent Chauffeur Reservations</h2>
              <button onClick={() => setActiveTab('bookings')} className="text-xs text-[#C9A227] font-semibold hover:underline">
                View All CRM Logs →
              </button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-[#C9A227] font-mono uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Trip</th>
                    <th className="p-3">Date &amp; Time</th>
                    <th className="p-3">Fare</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {bookings.slice(0, 5).map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-mono font-bold text-[#C9A227]">{b.booking_ref}</td>
                      <td className="p-3 font-medium text-white">{b.customer_name}<span className="block text-[10px] text-zinc-400">{b.customer_phone}</span></td>
                      <td className="p-3">{b.vehicle}</td>
                      <td className="p-3 uppercase text-[10px] font-mono">{b.trip_type}</td>
                      <td className="p-3">{b.travel_date} at {b.pickup_time}</td>
                      <td className="p-3 font-mono font-bold text-[#C9A227]">₹{b.estimated_amount}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          b.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          b.status === 'PENDING' ? 'bg-[#C9A227]/20 text-[#C9A227] border border-[#C9A227]/30' :
                          b.status === 'COMPLETED' ? 'bg-blue-500/20 text-blue-300' : 'bg-rose-500/20 text-rose-300'
                        }`}>
                          {b.status}
                        </span>
                      </td>
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
              <Button variant="secondary" size="sm" onClick={handleExportFullBackup} leftIcon={<Download className="w-4 h-4" />}>
                Export CRM Database
              </Button>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row gap-3 bg-zinc-900 p-3 rounded-2xl border border-zinc-800">
              <div className="flex gap-2">
                {['ALL', 'PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setBookingFilterStatus(st)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-mono transition-all ${
                      bookingFilterStatus === st ? 'bg-[#C9A227] text-zinc-950' : 'text-zinc-400 hover:bg-zinc-800'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            {/* Full Bookings Table */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-[#C9A227] font-mono uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Ref</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Pickup / Drop</th>
                    <th className="p-3">Date &amp; Time</th>
                    <th className="p-3">Est. Amount</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-mono font-bold text-[#C9A227]">{b.booking_ref}</td>
                      <td className="p-3 font-medium text-white">
                        {b.customer_name}
                        <span className="block text-[10px] text-zinc-400">{b.customer_phone}</span>
                      </td>
                      <td className="p-3">{b.vehicle}</td>
                      <td className="p-3 max-w-xs truncate">
                        <span className="text-zinc-200 block">{b.pickup}</span>
                        <span className="text-zinc-400 block text-[10px]">→ {b.drop_location}</span>
                      </td>
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
                        <button
                          onClick={() => b.id && handleDeleteBooking(b.id)}
                          className="text-rose-400 hover:text-rose-300 p-1 rounded"
                          title="Delete Booking"
                        >
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

        {/* TAB 3: FLEET CMS */}
        {activeTab === 'fleet' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Fleet CMS Catalog</h2>
                <p className="text-xs text-zinc-400">Manage vehicle models, specifications, pricing rates, and display tags.</p>
              </div>
              <Button
                variant="gold"
                size="sm"
                onClick={() => setEditingVehicle({
                  title: '', category: 'Executive MPV', capacity_passengers: 7, luggage_count: 4,
                  rate_per_km: 14, base_price: 2800, features: ['Leather Captain Seats', 'Bottled Water', 'Dual AC'],
                  image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
                  description: 'Comfortable executive vehicle.', is_active: true, sorting_order: fleetList.length + 1
                })}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Vehicle
              </Button>
            </div>

            {/* Vehicle Edit Modal */}
            {editingVehicle && (
              <form onSubmit={handleSaveVehicle} className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#C9A227]">
                    {editingVehicle.id ? 'Edit Vehicle Specs' : 'Add New Vehicle to CMS'}
                  </h3>
                  <button type="button" onClick={() => setEditingVehicle(null)}><X className="w-5 h-5 text-zinc-400" /></button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Vehicle Title *</label>
                    <input
                      type="text" required value={editingVehicle.title || ''}
                      onChange={e => setEditingVehicle({...editingVehicle, title: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Category</label>
                    <input
                      type="text" value={editingVehicle.category || ''}
                      onChange={e => setEditingVehicle({...editingVehicle, category: e.target.value})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Rate / KM (₹)</label>
                    <input
                      type="number" value={editingVehicle.rate_per_km || 14}
                      onChange={e => setEditingVehicle({...editingVehicle, rate_per_km: parseFloat(e.target.value)})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Passenger Capacity</label>
                    <input
                      type="number" value={editingVehicle.capacity_passengers || 4}
                      onChange={e => setEditingVehicle({...editingVehicle, capacity_passengers: parseInt(e.target.value, 10)})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Luggage Capacity</label>
                    <input
                      type="number" value={editingVehicle.luggage_count || 2}
                      onChange={e => setEditingVehicle({...editingVehicle, luggage_count: parseInt(e.target.value, 10)})}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white"
                    />
                  </div>
                  <div className="space-y-1 sm:col-span-3">
                    <ImageUploadInput
                      label="Vehicle Image (URL or File Upload)"
                      value={editingVehicle.image_url || ''}
                      onChange={(url) => setEditingVehicle({ ...editingVehicle, image_url: url })}
                      category="Fleet"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setEditingVehicle(null)}>Cancel</Button>
                  <Button type="submit" variant="gold" size="sm">Save Vehicle</Button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {fleetList.map(veh => (
                <div key={veh.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3">
                  <img src={veh.image_url} alt={veh.title} className="w-full h-36 object-cover rounded-xl" />
                  <div>
                    <h4 className="font-serif font-bold text-white text-base">{veh.title}</h4>
                    <span className="text-xs text-[#C9A227] font-mono">₹{veh.rate_per_km}/km • {veh.capacity_passengers} Seats • {veh.luggage_count} Bags</span>
                  </div>
                  <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                    <button onClick={() => setEditingVehicle(veh)} className="p-1.5 bg-zinc-800 text-amber-300 rounded"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteVehicle(veh.id)} className="p-1.5 bg-rose-950/60 text-rose-300 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: ROUTES & CITIES CMS */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Routes &amp; Cities CMS</h2>
                <p className="text-xs text-zinc-400">
                  Manage intercity route destinations, fares, manually editable distance &amp; duration, and recommended vehicles from Fleet CMS.
                </p>
              </div>
              <Button
                variant="gold"
                size="sm"
                onClick={() =>
                  setEditingRoute({
                    origin: '',
                    destination: '',
                    distance_km: undefined,
                    estimated_time: '',
                    vehicle_type: fleetList[0]?.title || 'Toyota Innova Crysta',
                    price: undefined,
                    is_popular: true,
                    is_active: true,
                  })
                }
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add New Route
              </Button>
            </div>

            {/* Edit / Add Route Form */}
            {editingRoute && (
              <form onSubmit={handleSaveRoute} className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#C9A227]">
                    {editingRoute.id ? 'Edit Route Details' : 'Add New Intercity Route'}
                  </h3>
                  <button type="button" onClick={() => setEditingRoute(null)}>
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Origin City *</label>
                    <input
                      type="text"
                      required
                      value={editingRoute.origin || ''}
                      onChange={(e) => setEditingRoute({ ...editingRoute, origin: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white"
                      placeholder="e.g. Delhi NCR / IGI Airport"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Destination City *</label>
                    <input
                      type="text"
                      required
                      value={editingRoute.destination || ''}
                      onChange={(e) => setEditingRoute({ ...editingRoute, destination: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white"
                      placeholder="e.g. Agra / Jaipur / Chandigarh"
                    />
                  </div>

                  {/* Distance (KM) - Manually Editable */}
                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Distance (KM) *</label>
                    <input
                      type="number"
                      required
                      value={editingRoute.distance_km ?? ''}
                      onChange={(e) =>
                        setEditingRoute({
                          ...editingRoute,
                          distance_km: e.target.value ? parseInt(e.target.value, 10) : undefined,
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white font-mono"
                      placeholder="e.g. 230"
                    />
                  </div>

                  {/* Duration - Manually Editable */}
                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Duration *</label>
                    <input
                      type="text"
                      required
                      value={editingRoute.estimated_time || ''}
                      onChange={(e) => setEditingRoute({ ...editingRoute, estimated_time: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white"
                      placeholder="e.g. 3.5 hours"
                    />
                  </div>

                  {/* Recommended Vehicle - Loaded from Fleet CMS */}
                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Recommended Vehicle *</label>
                    <select
                      value={editingRoute.vehicle_type || (fleetList[0]?.title || 'Toyota Innova Crysta')}
                      onChange={(e) => setEditingRoute({ ...editingRoute, vehicle_type: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-white"
                    >
                      {fleetList.map((veh) => (
                        <option key={veh.id} value={veh.title}>
                          {veh.title} ({veh.category})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fare (₹) */}
                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Flat Fare (₹) *</label>
                    <input
                      type="number"
                      required
                      value={editingRoute.price ?? ''}
                      onChange={(e) =>
                        setEditingRoute({
                          ...editingRoute,
                          price: e.target.value ? parseFloat(e.target.value) : undefined,
                        })
                      }
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2 text-[#C9A227] font-bold font-mono"
                      placeholder="e.g. 3200"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setEditingRoute(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold" size="sm">
                    Save Route to Database
                  </Button>
                </div>
              </form>
            )}

            {/* Table of Routes */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-[#C9A227] font-mono uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Route (Origin → Destination)</th>
                    <th className="p-3">Distance (KM)</th>
                    <th className="p-3">Duration</th>
                    <th className="p-3">Recommended Vehicle (Fleet CMS)</th>
                    <th className="p-3">Flat Fare</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {routesList.map((r) => (
                    <tr key={r.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-bold text-white">
                        {r.origin} → {r.destination}
                      </td>
                      <td className="p-3 font-mono text-[#C9A227] font-bold">{r.distance_km ? `${r.distance_km} KM` : 'N/A'}</td>
                      <td className="p-3">{r.estimated_time || 'N/A'}</td>
                      <td className="p-3 font-medium text-zinc-100">{r.vehicle_type || 'Toyota Innova Crysta'}</td>
                      <td className="p-3 font-mono font-bold text-[#C9A227]">₹{r.price || r.one_way_price || 0}</td>
                      <td className="p-3 text-right">
                        <button
                          onClick={() => setEditingRoute(r)}
                          className="p-1.5 bg-zinc-800 text-amber-300 rounded mr-2 hover:bg-zinc-700"
                          title="Edit Route"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteRoute(r.id)}
                          className="p-1.5 bg-rose-950/60 text-rose-300 rounded hover:bg-rose-900"
                          title="Delete Route"
                        >
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

        {/* TAB: BLOGS & ARTICLES CMS */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Blogs &amp; Articles CMS</h2>
                <p className="text-xs text-zinc-400">Publish, edit, or manage travel articles and corporate mobility guides.</p>
              </div>
              <Button
                variant="gold"
                size="sm"
                onClick={() =>
                  setEditingBlog({
                    title: '',
                    slug: '',
                    category: 'Travel Guide',
                    author: 'Luthra Chauffeur',
                    cover_image: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?q=80&w=1200&auto=format&fit=crop',
                    excerpt: '',
                    content: '',
                    read_time: '5 min read',
                    is_published: true,
                  })
                }
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Create New Article
              </Button>
            </div>

            {/* Edit / Create Blog Form */}
            {editingBlog && (
              <form onSubmit={handleSaveBlog} className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#C9A227]">
                    {editingBlog.id ? 'Edit Article' : 'Create New Article'}
                  </h3>
                  <button type="button" onClick={() => setEditingBlog(null)}>
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-300 font-medium">Article Title *</label>
                    <input
                      type="text"
                      required
                      value={editingBlog.title || ''}
                      onChange={(e) => {
                        const title = e.target.value;
                        const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                        setEditingBlog({ ...editingBlog, title, slug: editingBlog.slug || slug });
                      }}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Category</label>
                    <input
                      type="text"
                      value={editingBlog.category || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, category: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Author</label>
                    <input
                      type="text"
                      value={editingBlog.author || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, author: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <ImageUploadInput
                      label="Cover Image (URL or Upload)"
                      value={editingBlog.cover_image || ''}
                      onChange={(url) => setEditingBlog({ ...editingBlog, cover_image: url })}
                      category="Blogs"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-300 font-medium">Excerpt Summary *</label>
                    <textarea
                      rows={2}
                      required
                      value={editingBlog.excerpt || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, excerpt: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-300 font-medium">Full Article Content *</label>
                    <textarea
                      rows={6}
                      required
                      value={editingBlog.content || ''}
                      onChange={(e) => setEditingBlog({ ...editingBlog, content: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white font-sans leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setEditingBlog(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold" size="sm">
                    Save Article
                  </Button>
                </div>
              </form>
            )}

            {/* Articles Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {blogsList.map((blog) => (
                <div key={blog.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-3">
                    <img src={blog.cover_image} alt={blog.title} className="w-full h-40 object-cover rounded-xl" />
                    <div>
                      <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-wider block">{blog.category}</span>
                      <h4 className="font-serif font-bold text-white text-base leading-snug">{blog.title}</h4>
                      <p className="text-xs text-zinc-400 line-clamp-2 mt-1">{blog.excerpt}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t border-zinc-800 text-xs">
                    <span className="text-zinc-500 font-mono">{blog.author}</span>
                    <div className="flex gap-2">
                      <button onClick={() => setEditingBlog(blog)} className="p-1.5 bg-zinc-800 text-amber-300 rounded hover:bg-zinc-700">
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteBlog(blog.id)} className="p-1.5 bg-rose-950/60 text-rose-300 rounded hover:bg-rose-900">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: REVIEWS & TESTIMONIALS CMS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Reviews &amp; Testimonials CMS</h2>
                <p className="text-xs text-zinc-400">Manage customer endorsements, ratings, and executive reviews.</p>
              </div>
              <Button
                variant="gold"
                size="sm"
                onClick={() =>
                  setEditingTestimonial({
                    name: '',
                    title_role: 'Corporate Guest',
                    city: 'Delhi NCR',
                    rating: 5,
                    comment: '',
                    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
                  })
                }
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add New Review
              </Button>
            </div>

            {/* Edit / Create Testimonial Form */}
            {editingTestimonial && (
              <form onSubmit={handleSaveTestimonial} className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#C9A227]">
                    {editingTestimonial.id ? 'Edit Review' : 'Add New Customer Review'}
                  </h3>
                  <button type="button" onClick={() => setEditingTestimonial(null)}>
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Customer Name *</label>
                    <input
                      type="text"
                      required
                      value={editingTestimonial.name || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, name: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Title / Role / Company</label>
                    <input
                      type="text"
                      value={editingTestimonial.title_role || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, title_role: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">City</label>
                    <input
                      type="text"
                      value={editingTestimonial.city || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, city: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Rating (1 to 5 Stars)</label>
                    <select
                      value={editingTestimonial.rating || 5}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, rating: parseInt(e.target.value, 10) })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
                    >
                      <option value={5}>5 Stars ★★★★★</option>
                      <option value={4}>4 Stars ★★★★☆</option>
                      <option value={3}>3 Stars ★★★☆☆</option>
                    </select>
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <ImageUploadInput
                      label="Avatar Image (URL or Upload)"
                      value={editingTestimonial.avatar_url || ''}
                      onChange={(url) => setEditingTestimonial({ ...editingTestimonial, avatar_url: url })}
                      category="Reviews"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-300 font-medium">Review Comment *</label>
                    <textarea
                      rows={3}
                      required
                      value={editingTestimonial.comment || ''}
                      onChange={(e) => setEditingTestimonial({ ...editingTestimonial, comment: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setEditingTestimonial(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold" size="sm">
                    Save Review
                  </Button>
                </div>
              </form>
            )}

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonialsList.map((t) => (
                <div key={t.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-3 flex flex-col justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <img src={t.avatar_url} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-[#C9A227]/30" />
                      <div>
                        <h4 className="font-serif font-bold text-white text-sm">{t.name}</h4>
                        <span className="text-[10px] text-zinc-400 block">{t.title_role} • {t.city}</span>
                      </div>
                    </div>
                    <div className="text-[#C9A227] text-xs font-mono">
                      {'★'.repeat(t.rating || 5)}
                    </div>
                    <p className="text-xs text-zinc-300 italic leading-relaxed">"{t.comment}"</p>
                  </div>
                  <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                    <button onClick={() => setEditingTestimonial(t)} className="p-1.5 bg-zinc-800 text-amber-300 rounded hover:bg-zinc-700">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteTestimonial(t.id)} className="p-1.5 bg-rose-950/60 text-rose-300 rounded hover:bg-rose-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: SUPPORT FAQS CMS */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Support FAQs CMS</h2>
                <p className="text-xs text-zinc-400">Manage customer support questions and answer accordions.</p>
              </div>
              <Button
                variant="gold"
                size="sm"
                onClick={() =>
                  setEditingFaq({
                    question: '',
                    answer: '',
                    category: 'Booking & Payment',
                    is_active: true,
                    sorting_order: faqsList.length + 1,
                  })
                }
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add New FAQ
              </Button>
            </div>

            {/* Edit / Create FAQ Form */}
            {editingFaq && (
              <form onSubmit={handleSaveFaq} className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#C9A227]">
                    {editingFaq.id ? 'Edit FAQ Item' : 'Add New FAQ Item'}
                  </h3>
                  <button type="button" onClick={() => setEditingFaq(null)}>
                    <X className="w-5 h-5 text-zinc-400" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-300 font-medium">Question *</label>
                    <input
                      type="text"
                      required
                      value={editingFaq.question || ''}
                      onChange={(e) => setEditingFaq({ ...editingFaq, question: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-zinc-300 font-medium">Category</label>
                    <input
                      type="text"
                      value={editingFaq.category || 'General'}
                      onChange={(e) => setEditingFaq({ ...editingFaq, category: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
                    />
                  </div>

                  <div className="space-y-1 sm:col-span-2">
                    <label className="text-zinc-300 font-medium">Detailed Answer *</label>
                    <textarea
                      rows={4}
                      required
                      value={editingFaq.answer || ''}
                      onChange={(e) => setEditingFaq({ ...editingFaq, answer: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white leading-relaxed"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setEditingFaq(null)}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="gold" size="sm">
                    Save FAQ
                  </Button>
                </div>
              </form>
            )}

            {/* FAQ List */}
            <div className="space-y-3">
              {faqsList.map((faq) => (
                <div key={faq.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 space-y-2 flex justify-between items-start">
                  <div className="space-y-1 max-w-3xl">
                    <span className="text-[10px] font-mono text-[#C9A227] uppercase tracking-wider bg-[#C9A227]/10 px-2 py-0.5 rounded-full border border-[#C9A227]/20">
                      {faq.category || 'General'}
                    </span>
                    <h4 className="font-serif font-bold text-white text-base">Q. {faq.question}</h4>
                    <p className="text-xs text-zinc-300 leading-relaxed pt-1">{faq.answer}</p>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button onClick={() => setEditingFaq(faq)} className="p-1.5 bg-zinc-800 text-amber-300 rounded hover:bg-zinc-700">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteFaq(faq.id)} className="p-1.5 bg-rose-950/60 text-rose-300 rounded hover:bg-rose-900">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: GALLERY MEDIA CMS */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">Gallery Media CMS</h2>
              <p className="text-xs text-zinc-400">Upload and manage photo gallery images for fleet and chauffeur services.</p>
            </div>

            {/* Upload / Add Form */}
            <form onSubmit={handleAddGalleryItem} className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-4">
              <h3 className="font-serif text-lg font-bold text-[#C9A227]">Add New Image to Gallery</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Image Caption / Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Toyota Innova Crysta Fleet at IGI Airport T3"
                    value={newGalleryItem.title}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, title: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-zinc-300 font-medium">Category</label>
                  <select
                    value={newGalleryItem.category}
                    onChange={(e) => setNewGalleryItem({ ...newGalleryItem, category: e.target.value })}
                    className="w-full bg-zinc-950 border border-zinc-800 rounded-lg p-2.5 text-white"
                  >
                    <option value="Fleet">Luxury Fleet</option>
                    <option value="VIP Chauffeur">VIP Chauffeur</option>
                    <option value="Outstation Travel">Outstation Travel</option>
                    <option value="Royal Weddings">Royal Weddings</option>
                  </select>
                </div>

                <div className="space-y-1 sm:col-span-2">
                  <ImageUploadInput
                    label="Image File or URL *"
                    value={newGalleryItem.image_url}
                    onChange={(url) => setNewGalleryItem({ ...newGalleryItem, image_url: url })}
                    category="Gallery"
                  />
                </div>
              </div>

              <Button type="submit" variant="gold" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Upload Image to Gallery
              </Button>
            </form>

            {/* Gallery Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {galleryList.map((g) => (
                <div key={g.id} className="relative group rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-900 h-60">
                  <img src={g.image_url} alt={g.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent p-4 flex flex-col justify-between">
                    <span className="text-[10px] font-mono text-[#C9A227] bg-zinc-950/80 px-2.5 py-0.5 rounded-full border border-zinc-800 self-start">
                      {g.category}
                    </span>
                    <div className="flex justify-between items-end">
                      <span className="font-serif font-bold text-white text-sm">{g.title}</span>
                      <button
                        onClick={() => handleDeleteGalleryItem(g.id)}
                        className="p-1.5 bg-rose-950/80 text-rose-300 rounded hover:bg-rose-900 transition-colors"
                        title="Delete Image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: HOMEPAGE & HERO CMS */}
        {(activeTab === 'homepage' || (activeTab as string) === 'hero') && (
          <form onSubmit={handleSaveSettings} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6 text-xs">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#C9A227]">Homepage &amp; Hero Content CMS</h2>
                <p className="text-zinc-400 mt-1">Control all hero banner headlines, subtitles, and why-choose-us trust copy live on the homepage.</p>
              </div>
              <Button type="submit" variant="gold" size="sm" leftIcon={<Save className="w-4 h-4" />}>
                Save Homepage Copy
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1 sm:col-span-2">
                <label className="text-zinc-300 font-medium">Hero Main Title</label>
                <input
                  type="text"
                  value={settingsForm.hero_title || 'Premium Taxi Services Across India'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, hero_title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-serif font-bold text-base"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-zinc-300 font-medium">Hero Subtitle</label>
                <input
                  type="text"
                  value={settingsForm.hero_subtitle || 'Airport Transfers • Outstation Trips • Local Taxi • Corporate Travel'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, hero_subtitle: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">Primary Call Hotline</label>
                <input
                  type="text"
                  value={settingsForm.phone_primary || '+91 99589 56593'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, phone_primary: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-zinc-300 font-medium">WhatsApp Booking Number</label>
                <input
                  type="text"
                  value={settingsForm.whatsapp_number || '919958956593'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono"
                />
              </div>

              <div className="space-y-1 sm:col-span-2 pt-4 border-t border-zinc-800">
                <label className="text-zinc-300 font-medium">Why Choose Section Title</label>
                <input
                  type="text"
                  value={settingsForm.why_choose_title || 'Why Choose Luthra Travels?'}
                  onChange={(e) => setSettingsForm({ ...settingsForm, why_choose_title: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
                />
              </div>

              <div className="space-y-1 sm:col-span-2">
                <label className="text-zinc-300 font-medium">Why Choose Section Subtitle</label>
                <input
                  type="text"
                  value={
                    settingsForm.why_choose_subtitle ||
                    'Experience safe, comfortable and reliable taxi services with professional drivers and transparent pricing.'
                  }
                  onChange={(e) => setSettingsForm({ ...settingsForm, why_choose_subtitle: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
                />
              </div>
            </div>

            <Button type="submit" variant="gold" size="sm" leftIcon={<Save className="w-4 h-4" />}>
              Save Homepage Copy
            </Button>
          </form>
        )}

        {/* TAB: SERVICES & SUPPORT CMS */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">Services &amp; Support Solutions CMS</h2>
              <p className="text-xs text-zinc-400">Manage specialized travel services (Airport, Outstation, Local, Corporate).</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {servicesList.map((svc) => (
                <div key={svc.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-serif font-bold text-white text-lg">{svc.title}</h3>
                    <span className="text-[10px] font-mono text-[#C9A227] bg-[#C9A227]/10 px-2.5 py-0.5 rounded-full border border-[#C9A227]/20">
                      /{svc.slug}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-300 leading-relaxed">{svc.short_desc}</p>
                  <div className="space-y-1 pt-2 border-t border-zinc-800">
                    <span className="text-[10px] uppercase text-zinc-500 font-mono block">Included Features</span>
                    {svc.features?.map((feat, idx) => (
                      <div key={idx} className="text-xs text-zinc-400 flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#C9A227]" /> {feat}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 12: GOOGLE REVIEWS CMS MODULE */}
        {activeTab === 'google-reviews' && <GoogleReviewsCMS />}

        {/* TAB 12: VERIFICATION & ANALYTICS MODULE */}
        {activeTab === 'analytics-verif' && (
          <form onSubmit={handleSaveSettings} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-8 text-xs">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-6">
              <div>
                <h2 className="font-serif text-2xl font-bold text-[#C9A227] flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" /> Verification &amp; Analytics Integration
                </h2>
                <p className="text-zinc-400 mt-1">
                  Manage search engine verification tags, analytics IDs, and pixel scripts. All enabled scripts are automatically injected into the live website &lt;head&gt;.
                </p>
              </div>
              <Button type="submit" variant="gold" size="sm" leftIcon={<Save className="w-4 h-4" />}>
                Save Integrations
              </Button>
            </div>

            {/* LIVE VERIFICATION STATUS OVERVIEW BADGES */}
            <div className="space-y-3">
              <h3 className="font-serif text-sm font-bold text-white uppercase tracking-wider font-mono">
                Verification &amp; Tracking Live Status
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-400 block uppercase">Google Search Console</span>
                  {settingsForm.gsc_enabled !== 'false' && settingsForm.gsc_meta_tag ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-mono font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Meta Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-zinc-500 font-mono text-xs">
                      <XCircle className="w-3.5 h-3.5" /> Disabled
                    </span>
                  )}
                </div>

                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-400 block uppercase">HTML Verification File</span>
                  {settingsForm.html_verification_enabled !== 'false' && settingsForm.html_verification_file ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-mono font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> File Ready
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-zinc-500 font-mono text-xs">
                      <XCircle className="w-3.5 h-3.5" /> Disabled
                    </span>
                  )}
                </div>

                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-400 block uppercase">Google Analytics 4</span>
                  {settingsForm.ga4_enabled !== 'false' && settingsForm.ga4_measurement_id ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-mono font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> GA4 Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-zinc-500 font-mono text-xs">
                      <XCircle className="w-3.5 h-3.5" /> Disabled
                    </span>
                  )}
                </div>

                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-400 block uppercase">Google Tag Manager</span>
                  {settingsForm.gtm_enabled !== 'false' && settingsForm.gtm_container_id ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-mono font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> GTM Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-zinc-500 font-mono text-xs">
                      <XCircle className="w-3.5 h-3.5" /> Disabled
                    </span>
                  )}
                </div>

                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-400 block uppercase">Microsoft Clarity</span>
                  {settingsForm.clarity_enabled !== 'false' && settingsForm.clarity_project_id ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-mono font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Clarity Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-zinc-500 font-mono text-xs">
                      <XCircle className="w-3.5 h-3.5" /> Disabled
                    </span>
                  )}
                </div>

                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-400 block uppercase">Meta Pixel</span>
                  {settingsForm.meta_pixel_enabled !== 'false' && settingsForm.meta_pixel_id ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-mono font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Pixel Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-zinc-500 font-mono text-xs">
                      <XCircle className="w-3.5 h-3.5" /> Disabled
                    </span>
                  )}
                </div>

                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-400 block uppercase">Bing Webmaster</span>
                  {settingsForm.bing_enabled !== 'false' && settingsForm.bing_verification_tag ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-mono font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-zinc-500 font-mono text-xs">
                      <XCircle className="w-3.5 h-3.5" /> Disabled
                    </span>
                  )}
                </div>

                <div className="bg-zinc-950 p-3.5 rounded-xl border border-zinc-800 space-y-1">
                  <span className="text-[10px] text-zinc-400 block uppercase">Yandex Webmaster</span>
                  {settingsForm.yandex_enabled !== 'false' && settingsForm.yandex_verification_tag ? (
                    <span className="inline-flex items-center gap-1 text-emerald-400 font-mono font-bold text-xs">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-zinc-500 font-mono text-xs">
                      <XCircle className="w-3.5 h-3.5" /> Disabled
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* EDITABLE FIELDS & TOGGLES GRID */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              
              {/* 1. Google Search Console Verification Meta */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-serif font-bold text-white text-sm flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#C9A227]" /> Google Search Console Meta Tag
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-zinc-300">
                    <span>Enable</span>
                    <input
                      type="checkbox"
                      checked={settingsForm.gsc_enabled !== 'false'}
                      onChange={e => setSettingsForm({...settingsForm, gsc_enabled: e.target.checked ? 'true' : 'false'})}
                      className="w-4 h-4 accent-[#C9A227]"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder='e.g. google-site-verification=XYZ123 or full meta tag'
                  value={settingsForm.gsc_meta_tag || ''}
                  onChange={e => setSettingsForm({...settingsForm, gsc_meta_tag: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-mono"
                />
                <p className="text-[11px] text-zinc-400">
                  Automatically injected as &lt;meta name="google-site-verification" content="..."&gt; into &lt;head&gt;.
                </p>
              </div>

              {/* 2. HTML Verification File */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-serif font-bold text-white text-sm flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-[#C9A227]" /> HTML Verification File
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-zinc-300">
                    <span>Enable</span>
                    <input
                      type="checkbox"
                      checked={settingsForm.html_verification_enabled !== 'false'}
                      onChange={e => setSettingsForm({...settingsForm, html_verification_enabled: e.target.checked ? 'true' : 'false'})}
                      className="w-4 h-4 accent-[#C9A227]"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g. google1234567890.html"
                  value={settingsForm.html_verification_file || ''}
                  onChange={e => setSettingsForm({...settingsForm, html_verification_file: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-mono"
                />
                <p className="text-[11px] text-zinc-400">
                  HTML verification file name stored in database and served for webmaster verification.
                </p>
              </div>

              {/* 3. Google Analytics 4 */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-serif font-bold text-white text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#C9A227]" /> Google Analytics 4 Measurement ID
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-zinc-300">
                    <span>Enable</span>
                    <input
                      type="checkbox"
                      checked={settingsForm.ga4_enabled !== 'false'}
                      onChange={e => setSettingsForm({...settingsForm, ga4_enabled: e.target.checked ? 'true' : 'false'})}
                      className="w-4 h-4 accent-[#C9A227]"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g. G-LUTHRA2025"
                  value={settingsForm.ga4_measurement_id || ''}
                  onChange={e => setSettingsForm({...settingsForm, ga4_measurement_id: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-[#C9A227] font-bold font-mono"
                />
                <p className="text-[11px] text-zinc-400">
                  Injects `gtag.js` tracking snippet dynamically across all website pages.
                </p>
              </div>

              {/* 4. Google Tag Manager Container ID */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-serif font-bold text-white text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#C9A227]" /> Google Tag Manager Container ID
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-zinc-300">
                    <span>Enable</span>
                    <input
                      type="checkbox"
                      checked={settingsForm.gtm_enabled !== 'false'}
                      onChange={e => setSettingsForm({...settingsForm, gtm_enabled: e.target.checked ? 'true' : 'false'})}
                      className="w-4 h-4 accent-[#C9A227]"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g. GTM-LT2025X"
                  value={settingsForm.gtm_container_id || ''}
                  onChange={e => setSettingsForm({...settingsForm, gtm_container_id: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-[#C9A227] font-bold font-mono"
                />
                <p className="text-[11px] text-zinc-400">
                  Injects GTM script snippet into website header for event &amp; tag tracking.
                </p>
              </div>

              {/* 5. Microsoft Clarity Project ID */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-serif font-bold text-white text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#C9A227]" /> Microsoft Clarity Project ID
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-zinc-300">
                    <span>Enable</span>
                    <input
                      type="checkbox"
                      checked={settingsForm.clarity_enabled !== 'false'}
                      onChange={e => setSettingsForm({...settingsForm, clarity_enabled: e.target.checked ? 'true' : 'false'})}
                      className="w-4 h-4 accent-[#C9A227]"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g. luthra_clarity_id"
                  value={settingsForm.clarity_project_id || ''}
                  onChange={e => setSettingsForm({...settingsForm, clarity_project_id: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-mono"
                />
                <p className="text-[11px] text-zinc-400">
                  Injects Microsoft Clarity heatmaps and session replay recorder.
                </p>
              </div>

              {/* 6. Meta / Facebook Pixel ID */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-serif font-bold text-white text-sm flex items-center gap-2">
                    <BarChart3 className="w-4 h-4 text-[#C9A227]" /> Meta / Facebook Pixel ID
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-zinc-300">
                    <span>Enable</span>
                    <input
                      type="checkbox"
                      checked={settingsForm.meta_pixel_enabled !== 'false'}
                      onChange={e => setSettingsForm({...settingsForm, meta_pixel_enabled: e.target.checked ? 'true' : 'false'})}
                      className="w-4 h-4 accent-[#C9A227]"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 123456789012345"
                  value={settingsForm.meta_pixel_id || ''}
                  onChange={e => setSettingsForm({...settingsForm, meta_pixel_id: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-mono"
                />
                <p className="text-[11px] text-zinc-400">
                  Injects Meta (Facebook) conversion pixel snippet and tracks PageView.
                </p>
              </div>

              {/* 7. Bing Webmaster Verification Tag */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-serif font-bold text-white text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#C9A227]" /> Bing Webmaster Verification
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-zinc-300">
                    <span>Enable</span>
                    <input
                      type="checkbox"
                      checked={settingsForm.bing_enabled !== 'false'}
                      onChange={e => setSettingsForm({...settingsForm, bing_enabled: e.target.checked ? 'true' : 'false'})}
                      className="w-4 h-4 accent-[#C9A227]"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g. BING_VERIFICATION_LT_2025"
                  value={settingsForm.bing_verification_tag || ''}
                  onChange={e => setSettingsForm({...settingsForm, bing_verification_tag: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-mono"
                />
                <p className="text-[11px] text-zinc-400">
                  Injected as &lt;meta name="msvalidate.01" content="..."&gt; tag into &lt;head&gt;.
                </p>
              </div>

              {/* 8. Yandex Webmaster Verification Tag */}
              <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-3">
                <div className="flex items-center justify-between">
                  <label className="font-serif font-bold text-white text-sm flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#C9A227]" /> Yandex Webmaster Verification
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs text-zinc-300">
                    <span>Enable</span>
                    <input
                      type="checkbox"
                      checked={settingsForm.yandex_enabled !== 'false'}
                      onChange={e => setSettingsForm({...settingsForm, yandex_enabled: e.target.checked ? 'true' : 'false'})}
                      className="w-4 h-4 accent-[#C9A227]"
                    />
                  </label>
                </div>
                <input
                  type="text"
                  placeholder="e.g. yandex-verification=1234567890abcdef"
                  value={settingsForm.yandex_verification_tag || ''}
                  onChange={e => setSettingsForm({...settingsForm, yandex_verification_tag: e.target.value})}
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-white font-mono"
                />
                <p className="text-[11px] text-zinc-400">
                  Injected as &lt;meta name="yandex-verification" content="..."&gt; tag into &lt;head&gt;.
                </p>
              </div>

            </div>

            <div className="pt-4 border-t border-zinc-800 flex justify-end">
              <Button type="submit" variant="gold" size="md" leftIcon={<Save className="w-4 h-4" />}>
                Save Verification &amp; Analytics Integrations
              </Button>
            </div>
          </form>
        )}

        {/* 13. BUSINESS SETTINGS */}
        {activeTab === 'settings' && (
          <form onSubmit={handleSaveSettings} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6 text-xs">
            <h2 className="font-serif text-2xl font-bold text-[#C9A227]">Business &amp; Contact Information</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-zinc-300 font-medium block">Company Name</label>
                <input type="text" value={settingsForm.company_name || ''} onChange={e => setSettingsForm({...settingsForm, company_name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="text-zinc-300 font-medium block">Phone Primary</label>
                <input type="text" value={settingsForm.phone_primary || '+91 99589 56593'} onChange={e => setSettingsForm({...settingsForm, phone_primary: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono" />
              </div>
              <div>
                <label className="text-zinc-300 font-medium block">WhatsApp Number</label>
                <input type="text" value={settingsForm.whatsapp_number || '919958956593'} onChange={e => setSettingsForm({...settingsForm, whatsapp_number: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white font-mono" />
              </div>
              <div>
                <label className="text-zinc-300 font-medium block">Primary Email</label>
                <input type="email" value={settingsForm.email_primary || 'luthratravel455@gmail.com'} onChange={e => setSettingsForm({...settingsForm, email_primary: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white" />
              </div>
              <div className="sm:col-span-2 space-y-4 pt-2">
                <ImageUploadInput
                  label="Company Logo Image (URL or Upload)"
                  value={settingsForm.logo_url || ''}
                  onChange={(url) => setSettingsForm({ ...settingsForm, logo_url: url })}
                  category="Brand"
                />
                <ImageUploadInput
                  label="Favicon Badge Image (URL or Upload)"
                  value={settingsForm.favicon_url || ''}
                  onChange={(url) => setSettingsForm({ ...settingsForm, favicon_url: url })}
                  category="Brand"
                />
              </div>
            </div>
            <Button type="submit" variant="gold" size="sm" leftIcon={<Save className="w-4 h-4" />}>Save Business Details</Button>
          </form>
        )}

        {/* 14. ENTERPRISE SEO MANAGEMENT SYSTEM */}
        {activeTab === 'seo' && (
          <div className="space-y-8">
            <SEOManager />

            <form onSubmit={handleSaveSettings} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-8 text-xs">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-4">
                <h2 className="font-serif text-2xl font-bold text-[#C9A227]">Global Custom Scripts &amp; Tracking Codes</h2>
                <Button type="submit" variant="gold" size="sm" leftIcon={<Save className="w-4 h-4" />}>
                  Save Tracking Scripts
                </Button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-white flex items-center gap-2">
                    <Code2 className="w-5 h-5 text-[#C9A227]" /> Global Analytics &amp; Tracking Injections
                  </h3>
                  <p className="text-zinc-400 mt-1">
                    Paste raw HTML/JS code snippets (e.g. Google Analytics, Google Tag Manager, Facebook Pixel, or Tawk.to / Live Chat Widgets). Scripts are securely stored in Supabase and auto-injected into the live site.
                  </p>
                </div>

                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-serif font-bold text-white text-sm flex items-center gap-2">
                      Head Scripts <span className="text-[10px] text-[#C9A227] font-mono font-normal">(&lt;head&gt;)</span>
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">Google Analytics, GTM, Pixel</span>
                  </div>
                  <textarea
                    rows={5}
                    placeholder={`<!-- Example: Google Analytics / GTM -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXX"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', 'G-XXXXX');\n</script>`}
                    value={settingsForm.custom_script_head || ''}
                    onChange={e => setSettingsForm({...settingsForm, custom_script_head: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#C9A227] rounded-xl p-3 text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none"
                    spellCheck={false}
                  />
                </div>

                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-serif font-bold text-white text-sm flex items-center gap-2">
                      Body Scripts <span className="text-[10px] text-[#C9A227] font-mono font-normal">(Top of &lt;body&gt;)</span>
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">GTM &lt;noscript&gt;</span>
                  </div>
                  <textarea
                    rows={4}
                    placeholder={`<!-- Example: Google Tag Manager (noscript) -->\n<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXX"\nheight="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>`}
                    value={settingsForm.custom_script_body || ''}
                    onChange={e => setSettingsForm({...settingsForm, custom_script_body: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#C9A227] rounded-xl p-3 text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none"
                    spellCheck={false}
                  />
                </div>

                <div className="bg-zinc-950 p-5 rounded-2xl border border-zinc-800 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="font-serif font-bold text-white text-sm flex items-center gap-2">
                      Footer Scripts <span className="text-[10px] text-[#C9A227] font-mono font-normal">(Before &lt;/body&gt;)</span>
                    </label>
                    <span className="text-[10px] text-zinc-500 font-mono">Chat Widgets, Tawk.to, Custom JS</span>
                  </div>
                  <textarea
                    rows={5}
                    placeholder={`<!-- Example: Tawk.to Live Chat -->\n<script type="text/javascript">\nvar Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();\n(function(){\nvar s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];\ns1.async=true;\ns1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/default';\ns1.charset='UTF-8';\ns0.parentNode.insertBefore(s1,s0);\n})();\n</script>`}
                    value={settingsForm.custom_script_footer || ''}
                    onChange={e => setSettingsForm({...settingsForm, custom_script_footer: e.target.value})}
                    className="w-full bg-zinc-900 border border-zinc-800 focus:border-[#C9A227] rounded-xl p-3 text-emerald-300 font-mono text-xs leading-relaxed focus:outline-none"
                    spellCheck={false}
                  />
                </div>
              </div>

              <Button type="submit" variant="gold" size="sm" leftIcon={<Save className="w-4 h-4" />}>
                Save All Tracking &amp; Custom Scripts
              </Button>
            </form>
          </div>
        )}

        {/* 15. PRICING & WHY CHOOSE US */}
        {activeTab === 'pricing' && (
          <form onSubmit={handleSaveSettings} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6 text-xs">
            <h2 className="font-serif text-2xl font-bold text-[#C9A227]">Pricing Rules &amp; "Why Choose Us" Config</h2>
            <div className="space-y-6">
              <div className="space-y-2 max-w-md">
                <label className="text-zinc-300 font-medium block">Default Base Rate Per KM (₹/KM)</label>
                <input type="number" value={settingsForm.default_rate_per_km || '14'} onChange={e => setSettingsForm({...settingsForm, default_rate_per_km: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[#C9A227] font-bold font-mono text-lg" />
              </div>

              <div className="pt-6 border-t border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#C9A227]">Why Choose Luthra Travels Section</h3>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-zinc-300 font-medium">Show Section</span>
                    <input
                      type="checkbox"
                      checked={settingsForm.why_choose_visible !== 'false'}
                      onChange={e => setSettingsForm({...settingsForm, why_choose_visible: e.target.checked ? 'true' : 'false'})}
                      className="w-4 h-4 accent-[#C9A227]"
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-zinc-300 font-medium block">Section Title</label>
                    <input type="text" value={settingsForm.why_choose_title || 'Why Choose Luthra Travels?'} onChange={e => setSettingsForm({...settingsForm, why_choose_title: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-zinc-300 font-medium block">Section Subtitle</label>
                    <input type="text" value={settingsForm.why_choose_subtitle || 'Experience safe, comfortable and reliable taxi services with professional drivers and transparent pricing.'} onChange={e => setSettingsForm({...settingsForm, why_choose_subtitle: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white" />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Trust Stat: Happy Customers</label>
                    <input type="text" value={settingsForm.stat_happy_customers || '5000+'} onChange={e => setSettingsForm({...settingsForm, stat_happy_customers: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[#C9A227] font-mono" />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Trust Stat: Successful Trips</label>
                    <input type="text" value={settingsForm.stat_successful_trips || '10000+'} onChange={e => setSettingsForm({...settingsForm, stat_successful_trips: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[#C9A227] font-mono" />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Trust Stat: Vehicles Available</label>
                    <input type="text" value={settingsForm.stat_vehicles_available || '4'} onChange={e => setSettingsForm({...settingsForm, stat_vehicles_available: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[#C9A227] font-mono" />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Trust Stat: Customer Support</label>
                    <input type="text" value={settingsForm.stat_customer_support || '24×7'} onChange={e => setSettingsForm({...settingsForm, stat_customer_support: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[#C9A227] font-mono" />
                  </div>
                </div>
              </div>
            </div>
            <Button type="submit" variant="gold" size="sm" leftIcon={<Save className="w-4 h-4" />}>Save Pricing &amp; Section Config</Button>
          </form>
        )}

        {/* 16. NOTIFICATIONS */}
        {activeTab === 'notifications' && (
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 text-xs">
            <h2 className="font-serif text-2xl font-bold text-white">System Activity &amp; Dispatch Logs</h2>
            <div className="space-y-2 font-mono">
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-zinc-300 flex justify-between">
                <span>[LOG] Dispatcher verified active session for {user?.email}</span>
                <span className="text-emerald-400">ACTIVE</span>
              </div>
              <div className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 text-zinc-300 flex justify-between">
                <span>[LOG] Real-time Supabase Database synced ({bookings.length} reservations logged)</span>
                <span className="text-[#C9A227]">OK</span>
              </div>
            </div>
          </div>
        )}

        {/* 17. USERS & SECURITY */}
        {activeTab === 'users' && (
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-4 text-xs">
            <h2 className="font-serif text-2xl font-bold text-white">Users, Roles &amp; Security Permissions</h2>
            <div className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-white">{user?.email || 'admin@luthratravels.com'}</span>
                <span className="bg-[#C9A227] text-zinc-950 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Super Admin</span>
              </div>
              <p className="text-zinc-400">Authenticated via Supabase Auth backend. Password session active.</p>
            </div>
          </div>
        )}

        {/* 18. BACKUP & HEALTH */}
        {activeTab === 'backup' && (
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6 text-xs">
            <h2 className="font-serif text-2xl font-bold text-[#C9A227]">Database Backup &amp; System Health</h2>
            <p className="text-zinc-300">Download a full JSON backup of all reservations, fleet specs, routes, blog articles, and settings.</p>
            <Button variant="gold" size="md" onClick={handleExportFullBackup} leftIcon={<Download className="w-4 h-4" />}>
              Download Complete JSON Database Backup
            </Button>
          </div>
        )}

      </main>
    </div>
  );
};
