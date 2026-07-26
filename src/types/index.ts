export interface Booking {
  id?: number;
  booking_ref?: string;
  trip_type: 'AIRPORT' | 'OUTSTATION' | 'LOCAL' | 'CORPORATE' | string;
  trip_mode?: 'ONE_WAY' | 'ROUND_TRIP' | string;
  pickup: string;
  drop_location: string;
  travel_date: string;
  pickup_time: string;
  return_date?: string;
  return_time?: string;
  round_trip_notes?: string;
  vehicle: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string;
  passengers?: number;
  message?: string;
  status: 'NEW' | 'PENDING' | 'CONFIRMED' | 'DRIVER_ASSIGNED' | 'ON_TRIP' | 'COMPLETED' | 'CANCELLED' | 'REJECTED' | string;
  estimated_amount?: number;
  admin_notes?: string;
  created_at?: string;
}

export interface FleetVehicle {
  id: number;
  title: string;
  category: string;
  tag?: string;
  capacity_passengers: number;
  luggage_count: number;
  rate_per_km: number;
  base_price: number;
  features: string[];
  image_url: string;
  description: string;
  transmission?: string;
  fuel_type?: string;
  is_active: boolean;
  sorting_order: number;
}

export interface PopularRoute {
  id: number;
  origin: string;
  destination: string;
  one_way_price?: number | null;
  round_trip_price?: number | null;
  price?: number | null;
  distance_km?: number | null;
  estimated_time?: string;
  vehicle_type?: string;
  hero_image?: string;
  gallery_images?: string[];
  description?: string;
  seo_title?: string;
  seo_description?: string;
  meta_keywords?: string;
  faqs?: { question: string; answer: string }[];
  slug?: string;
  is_active?: boolean;
  is_featured?: boolean;
  is_popular?: boolean;
  sorting_order?: number;
}

export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  category: string;
  publish_date: string;
  author: string;
  read_time: string;
  is_published: boolean;
}

export interface Testimonial {
  id: number;
  name: string;
  title_role: string;
  rating: number;
  comment: string;
  avatar_url: string;
  city?: string;
  date?: string;
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
  category: string;
  is_active: boolean;
  sorting_order: number;
}

export interface GalleryItem {
  id: number;
  title: string;
  category: string;
  image_url: string;
  created_at?: string;
}

export interface ServiceItem {
  id: number;
  title: string;
  slug: string;
  short_desc: string;
  full_desc: string;
  icon_name: string;
  cover_image: string;
  features: string[];
}

export interface SiteSettings {
  company_name?: string;
  company_tagline?: string;
  phone_primary?: string;
  phone_secondary?: string;
  whatsapp_number?: string;
  email_primary?: string;
  address?: string;
  hero_title?: string;
  hero_subtitle?: string;
  gst_number?: string;
  currency?: string;
  years_in_business?: string;
  trips_completed?: string;
  satisfied_clients?: string;
  fleet_size?: string;
  [key: string]: string | undefined;
}

export interface AdminStats {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  totalRevenue: number;
  totalFleet: number;
  activeFleet: number;
  totalRoutes: number;
  totalBlogs: number;
}
