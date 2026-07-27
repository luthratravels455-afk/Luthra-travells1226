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
  Settings,
  BarChart3,
  LogOut,
  Plus,
  Trash2,
  Edit3,
  RefreshCw,
  Download,
  Save,
  ShieldCheck,
  X,
  Phone,
  Globe,
  Tag,
  Bell,
  Lock,
  Database,
  Sliders,
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
    | 'faqs'
    | 'gallery'
    | 'homepage'
    | 'settings'
    | 'seo'
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
  const [newBookingModal, setNewBookingModal] = useState<Partial<Booking> | null>(null);

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
      console.error('Error loading admin data:', err);
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

  // BOOKING CRUD
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
    if (!window.confirm('Delete this booking permanently from database?')) return;
    try {
      await bookingService.deleteBooking(id);
      showToast('Booking deleted from CRM', 'info');
      loadAllAdminData();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleCreateBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBookingModal || !newBookingModal.customer_name || !newBookingModal.customer_phone) return;
    try {
      await bookingService.createBooking(newBookingModal);
      showToast('New booking added to CRM database', 'success');
      setNewBookingModal(null);
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
        showToast('Vehicle updated in Fleet CMS', 'success');
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
        showToast('FAQ updated', 'success');
      } else {
        await cmsService.createFaq(editingFaq);
        showToast('FAQ added', 'success');
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

  // SERVICES CRUD
  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      if (editingService.id) {
        await cmsService.updateService(editingService.id, editingService);
        showToast('Service page updated', 'success');
      } else {
        await cmsService.createService(editingService);
        showToast('New service page created', 'success');
      }
      setEditingService(null);
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
      showToast('Global settings saved and persisted!', 'success');
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

  // Extracted Customers list from bookings
  const customerMap: Record<string, { name: string; phone: string; email: string; trips: number; totalSpent: number; lastTrip: string }> = {};
  bookings.forEach((b) => {
    const key = b.customer_phone || b.customer_name;
    if (!key) return;
    if (!customerMap[key]) {
      customerMap[key] = {
        name: b.customer_name || 'Passenger',
        phone: b.customer_phone || 'N/A',
        email: b.customer_email || 'N/A',
        trips: 0,
        totalSpent: 0,
        lastTrip: b.travel_date,
      };
    }
    customerMap[key].trips += 1;
    customerMap[key].totalSpent += Number(b.estimated_amount) || 0;
    if (b.travel_date > customerMap[key].lastTrip) {
      customerMap[key].lastTrip = b.travel_date;
    }
  });
  const customersList = Object.values(customerMap);

  interface SidebarTabItem {
    id: AdminTab;
    label: string;
    icon: React.ReactNode;
    badge?: number;
  }

  const sidebarTabs: SidebarTabItem[] = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'bookings', label: 'Bookings CRM', icon: <Calendar className="w-4 h-4" />, badge: stats?.pendingBookings },
    { id: 'customers', label: 'Customers Directory', icon: <Users className="w-4 h-4" /> },
    { id: 'fleet', label: 'Fleet Vehicles', icon: <Car className="w-4 h-4" /> },
    { id: 'routes', label: 'Routes & Cities', icon: <Compass className="w-4 h-4" /> },
    { id: 'taxi-packages', label: 'Taxi Categories', icon: <Briefcase className="w-4 h-4" /> },
    { id: 'services', label: 'Services CMS', icon: <Sliders className="w-4 h-4" /> },
    { id: 'blogs', label: 'Blogs & Articles', icon: <FileText className="w-4 h-4" /> },
    { id: 'testimonials', label: 'Reviews & Ratings', icon: <Star className="w-4 h-4" /> },
    { id: 'faqs', label: 'Support FAQs', icon: <HelpCircle className="w-4 h-4" /> },
    { id: 'gallery', label: 'Gallery & Media', icon: <ImageIcon className="w-4 h-4" /> },
    { id: 'homepage', label: 'Homepage & Hero', icon: <HomeIcon className="w-4 h-4" /> },
    { id: 'settings', label: 'Business Details', icon: <Phone className="w-4 h-4" /> },
    { id: 'seo', label: 'SEO & Meta', icon: <Globe className="w-4 h-4" /> },
    { id: 'pricing', label: 'Pricing Config', icon: <Tag className="w-4 h-4" /> },
    { id: 'notifications', label: 'Activity Logs', icon: <Bell className="w-4 h-4" /> },
    { id: 'users', label: 'Users & Roles', icon: <Lock className="w-4 h-4" /> },
    { id: 'backup', label: 'Security & Backup', icon: <Database className="w-4 h-4" /> },
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
              <span className="text-[11px] text-[#C9A227] uppercase font-mono block">Pending Actions</span>
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

        {/* 1. OVERVIEW DASHBOARD */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Chauffeur Operations Overview</h2>
                <p className="text-xs text-zinc-400">Live feed of active reservation requests and fleet dispatches.</p>
              </div>
              <Button variant="gold" size="sm" onClick={() => setActiveTab('bookings')}>
                Open Full CRM →
              </Button>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-[#C9A227] font-mono uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Ref</th>
                    <th className="p-3">Customer</th>
                    <th className="p-3">Vehicle</th>
                    <th className="p-3">Trip</th>
                    <th className="p-3">Date &amp; Time</th>
                    <th className="p-3">Fare</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {bookings.slice(0, 8).map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-mono font-bold text-[#C9A227]">{b.booking_ref}</td>
                      <td className="p-3 font-medium text-white">
                        {b.customer_name}
                        <span className="block text-[10px] text-zinc-400 font-mono">{b.customer_phone}</span>
                      </td>
                      <td className="p-3">{b.vehicle}</td>
                      <td className="p-3 uppercase text-[10px] font-mono">{b.trip_type}</td>
                      <td className="p-3">{b.travel_date} at {b.pickup_time}</td>
                      <td className="p-3 font-mono font-bold text-[#C9A227]">₹{b.estimated_amount}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                          b.status === 'CONFIRMED' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          b.status === 'PENDING' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
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

        {/* 2. BOOKINGS CRM */}
        {activeTab === 'bookings' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Bookings CRM Desk</h2>
                <p className="text-xs text-zinc-400">Search, filter, status edit, and manage all taxi orders.</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="gold"
                  size="sm"
                  onClick={() => setNewBookingModal({
                    customer_name: '', customer_phone: '', vehicle: 'Toyota Innova Crysta',
                    trip_type: 'OUTSTATION', pickup: 'Delhi', drop_location: 'Agra',
                    travel_date: new Date().toISOString().split('T')[0], pickup_time: '09:00',
                    estimated_amount: 3200, status: 'PENDING'
                  })}
                  leftIcon={<Plus className="w-4 h-4" />}
                >
                  Create Booking
                </Button>
                <Button variant="secondary" size="sm" onClick={handleExportFullBackup} leftIcon={<Download className="w-4 h-4" />}>
                  Export CSV
                </Button>
              </div>
            </div>

            {/* Create Booking Modal */}
            {newBookingModal && (
              <form onSubmit={handleCreateBooking} className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#C9A227]">Create New Reservation in Database</h3>
                  <button type="button" onClick={() => setNewBookingModal(null)}><X className="w-5 h-5 text-zinc-400" /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-zinc-300 font-medium block">Customer Name *</label>
                    <input type="text" required value={newBookingModal.customer_name || ''} onChange={e => setNewBookingModal({...newBookingModal, customer_name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Customer Phone *</label>
                    <input type="tel" required value={newBookingModal.customer_phone || ''} onChange={e => setNewBookingModal({...newBookingModal, customer_phone: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Vehicle</label>
                    <select value={newBookingModal.vehicle || 'Toyota Innova Crysta'} onChange={e => setNewBookingModal({...newBookingModal, vehicle: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white">
                      <option value="Toyota Innova Crysta">Toyota Innova Crysta</option>
                      <option value="Maruti Ertiga">Maruti Ertiga</option>
                      <option value="Maruti Dzire">Maruti Dzire</option>
                      <option value="Honda Amaze">Honda Amaze</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Pickup Location *</label>
                    <input type="text" required value={newBookingModal.pickup || ''} onChange={e => setNewBookingModal({...newBookingModal, pickup: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Drop Destination *</label>
                    <input type="text" required value={newBookingModal.drop_location || ''} onChange={e => setNewBookingModal({...newBookingModal, drop_location: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Estimated Fare (₹)</label>
                    <input type="number" value={newBookingModal.estimated_amount || 0} onChange={e => setNewBookingModal({...newBookingModal, estimated_amount: parseFloat(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setNewBookingModal(null)}>Cancel</Button>
                  <Button type="submit" variant="gold" size="sm">Save Booking</Button>
                </div>
              </form>
            )}

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
                    <th className="p-3">Est. Fare</th>
                    <th className="p-3">Status</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {bookings.map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-mono font-bold text-[#C9A227]">{b.booking_ref}</td>
                      <td className="p-3 font-medium text-white">
                        {b.customer_name}
                        <span className="block text-[10px] text-zinc-400 font-mono">{b.customer_phone}</span>
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

        {/* 3. CUSTOMERS DIRECTORY */}
        {activeTab === 'customers' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">Customer Directory</h2>
              <p className="text-xs text-zinc-400">Extracted passenger contact history, completed trips, and total spend.</p>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-[#C9A227] font-mono uppercase border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Customer Name</th>
                    <th className="p-3">Phone Number</th>
                    <th className="p-3">Total Trips</th>
                    <th className="p-3">Total Spent</th>
                    <th className="p-3">Last Trip Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {customersList.map((c, i) => (
                    <tr key={i} className="hover:bg-zinc-800/40">
                      <td className="p-3 font-semibold text-white">{c.name}</td>
                      <td className="p-3 font-mono text-[#C9A227]">{c.phone}</td>
                      <td className="p-3 font-mono">{c.trips} Trips</td>
                      <td className="p-3 font-mono font-bold text-emerald-400">₹{c.totalSpent}</td>
                      <td className="p-3 font-mono">{c.lastTrip}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 4. FLEET VEHICLES */}
        {activeTab === 'fleet' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Fleet CMS Catalog</h2>
                <p className="text-xs text-zinc-400">Manage vehicle models, rates, passenger capacities, and display order.</p>
              </div>
              <Button
                variant="gold"
                size="sm"
                onClick={() => setEditingVehicle({
                  title: '', category: 'Executive MPV', capacity_passengers: 7, luggage_count: 4,
                  rate_per_km: 14, base_price: 2200, features: ['Air Conditioning', 'Bottled Water', 'Clean Cabin'],
                  image_url: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=1200&auto=format&fit=crop',
                  description: 'Clean company-owned taxi.', is_active: true, sorting_order: fleetList.length + 1
                })}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Vehicle
              </Button>
            </div>

            {editingVehicle && (
              <form onSubmit={handleSaveVehicle} className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-2xl space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
                  <h3 className="font-serif text-lg font-bold text-[#C9A227]">
                    {editingVehicle.id ? 'Edit Vehicle Specs' : 'Add New Vehicle'}
                  </h3>
                  <button type="button" onClick={() => setEditingVehicle(null)}><X className="w-5 h-5 text-zinc-400" /></button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-zinc-300 font-medium block">Vehicle Title *</label>
                    <input type="text" required value={editingVehicle.title || ''} onChange={e => setEditingVehicle({...editingVehicle, title: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Category</label>
                    <input type="text" value={editingVehicle.category || ''} onChange={e => setEditingVehicle({...editingVehicle, category: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Rate / KM (₹)</label>
                    <input type="number" value={editingVehicle.rate_per_km || 14} onChange={e => setEditingVehicle({...editingVehicle, rate_per_km: parseFloat(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Passenger Capacity</label>
                    <input type="number" value={editingVehicle.capacity_passengers || 4} onChange={e => setEditingVehicle({...editingVehicle, capacity_passengers: parseInt(e.target.value, 10)})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Luggage Capacity</label>
                    <input type="number" value={editingVehicle.luggage_count || 2} onChange={e => setEditingVehicle({...editingVehicle, luggage_count: parseInt(e.target.value, 10)})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Image URL</label>
                    <input type="text" value={editingVehicle.image_url || ''} onChange={e => setEditingVehicle({...editingVehicle, image_url: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setEditingVehicle(null)}>Cancel</Button>
                  <Button type="submit" variant="gold" size="sm">Save Vehicle</Button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {fleetList.map((veh) => (
                <div key={veh.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-3">
                  <img src={veh.image_url} alt={veh.title} className="w-full h-36 object-cover rounded-xl" />
                  <div>
                    <h4 className="font-serif font-bold text-white text-base">{veh.title}</h4>
                    <span className="text-xs text-[#C9A227] font-mono">₹{veh.rate_per_km}/km • {veh.capacity_passengers} Seats</span>
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

        {/* 5. ROUTES & CITIES */}
        {activeTab === 'routes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Intercity Popular Routes CMS</h2>
                <p className="text-xs text-zinc-400">Manage outstation routes, distances, and flat rates.</p>
              </div>
              <Button
                variant="gold"
                size="sm"
                onClick={() => setEditingRoute({ origin: 'Delhi NCR', destination: 'Agra', distance_km: 230, estimated_time: '3.5 hours', price: 3200, vehicle_type: 'Maruti Ertiga', is_popular: true })}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add Route
              </Button>
            </div>

            {editingRoute && (
              <form onSubmit={handleSaveRoute} className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-2xl space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="text-zinc-300 font-medium block">Origin</label>
                    <input type="text" value={editingRoute.origin || ''} onChange={e => setEditingRoute({...editingRoute, origin: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Destination</label>
                    <input type="text" value={editingRoute.destination || ''} onChange={e => setEditingRoute({...editingRoute, destination: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Flat Fare (₹)</label>
                    <input type="number" value={editingRoute.price || 0} onChange={e => setEditingRoute({...editingRoute, price: parseFloat(e.target.value)})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setEditingRoute(null)}>Cancel</Button>
                  <Button type="submit" variant="gold" size="sm">Save Route</Button>
                </div>
              </form>
            )}

            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-zinc-950 text-[#C9A227] border-b border-zinc-800">
                  <tr>
                    <th className="p-3">Route</th>
                    <th className="p-3">Distance &amp; Duration</th>
                    <th className="p-3">Recommended Vehicle</th>
                    <th className="p-3">Flat Fare</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800 text-zinc-300">
                  {routesList.map((r) => (
                    <tr key={r.id}>
                      <td className="p-3 font-bold text-white">{r.origin} → {r.destination}</td>
                      <td className="p-3">{r.distance_km} KM ({r.estimated_time})</td>
                      <td className="p-3">{r.vehicle_type}</td>
                      <td className="p-3 font-mono font-bold text-[#C9A227]">₹{r.price}</td>
                      <td className="p-3 text-right">
                        <button onClick={() => handleDeleteRoute(r.id)} className="text-rose-400 p-1"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 6. TAXI CATEGORIES */}
        {activeTab === 'taxi-packages' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-serif text-2xl font-bold text-white">Taxi Categories &amp; Fare Rules</h2>
              <p className="text-xs text-zinc-400">Configure inclusions and rules for Airport, Local, Outstation, and Corporate taxis.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
                <h3 className="font-serif font-bold text-lg text-[#C9A227]">Airport Taxi Rules</h3>
                <p className="text-zinc-400">IGI Airport T1, T2 &amp; T3 transfers include 60 minutes free waiting time post flight landing and real-time IATA radar flight tracking.</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
                <h3 className="font-serif font-bold text-lg text-[#C9A227]">Local Taxi Packages</h3>
                <p className="text-zinc-400">Hourly packages available: 4hr/40km, 8hr/80km, and 12hr/120km with transparent overage fees.</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
                <h3 className="font-serif font-bold text-lg text-[#C9A227]">Outstation Taxi Rules</h3>
                <p className="text-zinc-400">Minimum 250 KM daily billing for outstation round trips. State tolls and parking fees are charged at actual government receipts.</p>
              </div>

              <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-2xl space-y-3">
                <h3 className="font-serif font-bold text-lg text-[#C9A227]">Corporate Executive Mobility</h3>
                <p className="text-zinc-400">Consolidated monthly GST invoicing and dedicated account manager for corporate accounts.</p>
              </div>
            </div>
          </div>
        )}

        {/* 7. SERVICES CMS */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Website Services CMS</h2>
                <p className="text-xs text-zinc-400">Manage content for Airport Transfers, Outstation Taxi, Local Taxi, and Corporate Travel pages.</p>
              </div>
              <Button variant="gold" size="sm" onClick={() => setEditingService({ title: '', slug: '', short_desc: '', full_desc: '', cover_image: '' })} leftIcon={<Plus className="w-4 h-4" />}>
                Add Service
              </Button>
            </div>

            {editingService && (
              <form onSubmit={handleSaveService} className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-2xl space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-300 font-medium block">Title *</label>
                    <input type="text" required value={editingService.title || ''} onChange={e => setEditingService({...editingService, title: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Cover Image URL</label>
                    <input type="text" value={editingService.cover_image || ''} onChange={e => setEditingService({...editingService, cover_image: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-zinc-300 font-medium block">Short Description</label>
                    <input type="text" value={editingService.short_desc || ''} onChange={e => setEditingService({...editingService, short_desc: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setEditingService(null)}>Cancel</Button>
                  <Button type="submit" variant="gold" size="sm">Save Service</Button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {servicesList.map((svc) => (
                <div key={svc.id} className="bg-zinc-900 border border-zinc-800 p-5 rounded-2xl space-y-2">
                  <h4 className="font-serif font-bold text-white text-lg">{svc.title}</h4>
                  <p className="text-xs text-zinc-400">{svc.short_desc}</p>
                  <div className="flex justify-end gap-2 pt-2">
                    <button onClick={() => setEditingService(svc)} className="p-1.5 bg-zinc-800 text-amber-300 rounded"><Edit3 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 8. BLOGS */}
        {activeTab === 'blogs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Travel Journal &amp; Blogs CMS</h2>
                <p className="text-xs text-zinc-400">Publish guides, route tips, and executive travel articles.</p>
              </div>
              <Button variant="gold" size="sm" onClick={() => setEditingBlog({ title: '', excerpt: '', content: '', author: 'Vikram Luthra', category: 'Travel Guide', cover_image: '' })} leftIcon={<Plus className="w-4 h-4" />}>
                Write Article
              </Button>
            </div>

            {editingBlog && (
              <form onSubmit={handleSaveBlog} className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-2xl space-y-4 text-xs">
                <div>
                  <label className="text-zinc-300 font-medium block">Title *</label>
                  <input type="text" required value={editingBlog.title || ''} onChange={e => setEditingBlog({...editingBlog, title: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block">Cover Image URL</label>
                  <input type="text" value={editingBlog.cover_image || ''} onChange={e => setEditingBlog({...editingBlog, cover_image: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block">Excerpt</label>
                  <input type="text" value={editingBlog.excerpt || ''} onChange={e => setEditingBlog({...editingBlog, excerpt: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block">Full Content</label>
                  <textarea rows={5} value={editingBlog.content || ''} onChange={e => setEditingBlog({...editingBlog, content: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setEditingBlog(null)}>Cancel</Button>
                  <Button type="submit" variant="gold" size="sm">Save Article</Button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {blogsList.map((b) => (
                <div key={b.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
                  <img src={b.cover_image} alt={b.title} className="w-full h-36 object-cover rounded-xl" />
                  <h4 className="font-serif font-bold text-white text-sm line-clamp-1">{b.title}</h4>
                  <p className="text-xs text-zinc-400 line-clamp-2">{b.excerpt}</p>
                  <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                    <button onClick={() => setEditingBlog(b)} className="p-1.5 bg-zinc-800 text-amber-300 rounded"><Edit3 className="w-4 h-4" /></button>
                    <button onClick={() => handleDeleteBlog(b.id)} className="p-1.5 bg-rose-950/60 text-rose-300 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 9. TESTIMONIALS */}
        {activeTab === 'testimonials' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Reviews &amp; Testimonials CMS</h2>
                <p className="text-xs text-zinc-400">Manage client reviews, ratings, and avatars.</p>
              </div>
              <Button variant="gold" size="sm" onClick={() => setEditingTestimonial({ name: '', title_role: 'Corporate Executive', rating: 5, comment: '', city: 'Delhi' })} leftIcon={<Plus className="w-4 h-4" />}>
                Add Review
              </Button>
            </div>

            {editingTestimonial && (
              <form onSubmit={handleSaveTestimonial} className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-2xl space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-zinc-300 font-medium block">Client Name *</label>
                    <input type="text" required value={editingTestimonial.name || ''} onChange={e => setEditingTestimonial({...editingTestimonial, name: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                  <div>
                    <label className="text-zinc-300 font-medium block">Rating (1-5)</label>
                    <input type="number" min={1} max={5} value={editingTestimonial.rating || 5} onChange={e => setEditingTestimonial({...editingTestimonial, rating: parseInt(e.target.value, 10)})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-zinc-300 font-medium block">Review Comment *</label>
                    <textarea rows={3} required value={editingTestimonial.comment || ''} onChange={e => setEditingTestimonial({...editingTestimonial, comment: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setEditingTestimonial(null)}>Cancel</Button>
                  <Button type="submit" variant="gold" size="sm">Save Review</Button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {testimonialsList.map((t) => (
                <div key={t.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-4 space-y-2">
                  <h4 className="font-serif font-bold text-white text-sm">{t.name} ({t.rating}★)</h4>
                  <p className="text-xs text-zinc-300 italic">"{t.comment}"</p>
                  <div className="flex justify-end gap-2 pt-2 border-t border-zinc-800">
                    <button onClick={() => handleDeleteTestimonial(t.id)} className="p-1.5 bg-rose-950/60 text-rose-300 rounded"><Trash2 className="w-4 h-4" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 10. FAQS */}
        {activeTab === 'faqs' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-serif text-2xl font-bold text-white">Support FAQs CMS</h2>
                <p className="text-xs text-zinc-400">Manage support questions and answers.</p>
              </div>
              <Button variant="gold" size="sm" onClick={() => setEditingFaq({ question: '', answer: '', category: 'General' })} leftIcon={<Plus className="w-4 h-4" />}>
                Add FAQ
              </Button>
            </div>

            {editingFaq && (
              <form onSubmit={handleSaveFaq} className="bg-zinc-900 border border-[#C9A227]/40 p-6 rounded-2xl space-y-4 text-xs">
                <div>
                  <label className="text-zinc-300 font-medium block">Question *</label>
                  <input type="text" required value={editingFaq.question || ''} onChange={e => setEditingFaq({...editingFaq, question: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                </div>
                <div>
                  <label className="text-zinc-300 font-medium block">Answer *</label>
                  <textarea rows={3} required value={editingFaq.answer || ''} onChange={e => setEditingFaq({...editingFaq, answer: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded p-2 text-white" />
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={() => setEditingFaq(null)}>Cancel</Button>
                  <Button type="submit" variant="gold" size="sm">Save FAQ</Button>
                </div>
              </form>
            )}

            <div className="space-y-3">
              {faqsList.map((f) => (
                <div key={f.id} className="bg-zinc-900 border border-zinc-800 p-4 rounded-xl flex justify-between items-start">
                  <div>
                    <h4 className="font-serif font-bold text-white text-sm">{f.question}</h4>
                    <p className="text-xs text-zinc-400 mt-1">{f.answer}</p>
                  </div>
                  <button onClick={() => handleDeleteFaq(f.id)} className="text-rose-400 p-1"><Trash2 className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 11. GALLERY */}
        {activeTab === 'gallery' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl font-bold text-white">Gallery &amp; Media Library</h2>
            <form onSubmit={handleAddGalleryItem} className="bg-zinc-900 border border border-zinc-800 p-4 rounded-2xl flex flex-col sm:flex-row gap-3 text-xs">
              <input type="text" required placeholder="Image Title" value={newGalleryItem.title} onChange={e => setNewGalleryItem({...newGalleryItem, title: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded p-2 text-white flex-1" />
              <input type="text" required placeholder="Image URL" value={newGalleryItem.image_url} onChange={e => setNewGalleryItem({...newGalleryItem, image_url: e.target.value})} className="bg-zinc-950 border border-zinc-800 rounded p-2 text-white flex-1" />
              <Button type="submit" variant="gold" size="sm">Upload Image</Button>
            </form>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {galleryList.map((g) => (
                <div key={g.id} className="relative group bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 h-40">
                  <img src={g.image_url} alt={g.title} className="w-full h-full object-cover" />
                  <button onClick={() => handleDeleteGalleryItem(g.id)} className="absolute top-2 right-2 bg-rose-600 text-white p-1 rounded-full"><X className="w-4 h-4" /></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 12. HOMEPAGE & HERO CMS */}
        {activeTab === 'homepage' && (
          <form onSubmit={handleSaveSettings} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6 text-xs">
            <h2 className="font-serif text-2xl font-bold text-[#C9A227]">Homepage &amp; Hero CMS Controls</h2>
            <div className="space-y-4">
              <div>
                <label className="text-zinc-300 font-medium block">Main Hero Title</label>
                <input type="text" value={settingsForm.hero_title || 'Premium Taxi Services Across India'} onChange={e => setSettingsForm({...settingsForm, hero_title: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="text-zinc-300 font-medium block">Hero Subtitle</label>
                <input type="text" value={settingsForm.hero_subtitle || 'Airport Transfers • Outstation Trips • Local Taxi • Corporate Travel'} onChange={e => setSettingsForm({...settingsForm, hero_subtitle: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="text-zinc-300 font-medium block">Why Choose Us Section Title</label>
                <input type="text" value={settingsForm.why_choose_title || 'Why Choose Luthra Travels?'} onChange={e => setSettingsForm({...settingsForm, why_choose_title: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="text-zinc-300 font-medium block">Why Choose Us Subtitle</label>
                <input type="text" value={settingsForm.why_choose_subtitle || 'Experience safe, comfortable and reliable taxi services with professional drivers and transparent pricing.'} onChange={e => setSettingsForm({...settingsForm, why_choose_subtitle: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white" />
              </div>
            </div>
            <Button type="submit" variant="gold" size="sm" leftIcon={<Save className="w-4 h-4" />}>Save Homepage Settings</Button>
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
            </div>
            <Button type="submit" variant="gold" size="sm" leftIcon={<Save className="w-4 h-4" />}>Save Business Details</Button>
          </form>
        )}

        {/* 14. SEO SETTINGS */}
        {activeTab === 'seo' && (
          <form onSubmit={handleSaveSettings} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6 text-xs">
            <h2 className="font-serif text-2xl font-bold text-[#C9A227]">SEO &amp; Meta Settings</h2>
            <div className="space-y-4">
              <div>
                <label className="text-zinc-300 font-medium block">Default Page Title</label>
                <input type="text" value={settingsForm.seo_title || 'Luthra Travels | Premium Taxi Services Across India'} onChange={e => setSettingsForm({...settingsForm, seo_title: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white" />
              </div>
              <div>
                <label className="text-zinc-300 font-medium block">Meta Description</label>
                <textarea rows={3} value={settingsForm.seo_description || 'Book executive taxi rentals across Delhi NCR, Agra, Jaipur, and Chandigarh.'} onChange={e => setSettingsForm({...settingsForm, seo_description: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white" />
              </div>
            </div>
            <Button type="submit" variant="gold" size="sm" leftIcon={<Save className="w-4 h-4" />}>Save SEO Configuration</Button>
          </form>
        )}

        {/* 15. PRICING */}
        {activeTab === 'pricing' && (
          <form onSubmit={handleSaveSettings} className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6 text-xs">
            <h2 className="font-serif text-2xl font-bold text-[#C9A227]">Pricing Rules &amp; Per-KM Configuration</h2>
            <div className="space-y-4 max-w-md">
              <div>
                <label className="text-zinc-300 font-medium block">Default Rate Per KM (₹/KM)</label>
                <input type="number" value={settingsForm.default_rate_per_km || '14'} onChange={e => setSettingsForm({...settingsForm, default_rate_per_km: e.target.value})} className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-[#C9A227] font-bold font-mono text-lg" />
              </div>
            </div>
            <Button type="submit" variant="gold" size="sm" leftIcon={<Save className="w-4 h-4" />}>Save Pricing Config</Button>
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
