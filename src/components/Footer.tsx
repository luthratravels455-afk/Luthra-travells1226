import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, ShieldCheck, Award, Clock, ArrowUpRight, Instagram, Facebook, Linkedin, MessageCircle } from 'lucide-react';
import { useCMS } from '../contexts/CMSContext';

export const Footer: React.FC = () => {
  const { settings } = useCMS();

  const phonePrimary = settings.phone_primary || '+91 99589 56593';
  const emailPrimary = settings.email_primary || 'luthratravel455@gmail.com';
  const whatsappNum = settings.whatsapp_number || '919958956593';

  return (
    <footer className="bg-zinc-950 text-zinc-400 border-t border-[#C9A227]/20 relative overflow-hidden pt-16 pb-12">
      {/* Background Ambient Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-[#C9A227]/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-8 relative z-10 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-zinc-900">
          
          {/* Brand & Mission Column */}
          <div className="lg:col-span-2 space-y-5">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-[#C9A227] to-amber-700 p-0.5 shadow-lg shadow-[#C9A227]/20">
                <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                  <span className="font-serif font-black text-xl text-[#C9A227]">LT</span>
                </div>
              </div>
              <div>
                <span className="font-serif text-2xl font-bold tracking-wide text-white block">
                  LUTHRA <span className="text-[#C9A227] font-light">TRAVELS</span>
                </span>
                <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-mono block">
                  Premier Chauffeur Mobility
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm leading-relaxed text-zinc-400 pr-4">
              Redefining executive chauffeur travel and corporate fleet rentals in Delhi NCR, Agra, Jaipur, and Chandigarh. Spotless company-owned fleet, verified master chauffeurs, and 100% transparent flat billing.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs text-[#C9A227]">
                <Award className="w-4 h-4 text-[#C9A227]" /> Government Licensed
              </div>
              <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg text-xs text-emerald-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> Insured Fleet
              </div>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href={`https://wa.me/${whatsappNum}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#C9A227] text-zinc-300 hover:text-[#C9A227] flex items-center justify-center transition-colors"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#C9A227] text-zinc-300 hover:text-[#C9A227] flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#C9A227] text-zinc-300 hover:text-[#C9A227] flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-zinc-900 border border-zinc-800 hover:border-[#C9A227] text-zinc-300 hover:text-[#C9A227] flex items-center justify-center transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Services Links */}
          <div className="space-y-4">
            <h4 className="font-serif text-white text-base font-semibold tracking-wide border-l-2 border-[#C9A227] pl-2.5">
              Services
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/airport-transfers" className="hover:text-[#C9A227] transition-colors flex items-center gap-1 group">
                  <span>Airport Transfers</span> <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/outstation-taxi" className="hover:text-[#C9A227] transition-colors flex items-center gap-1 group">
                  <span>Outstation Taxi</span> <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/local-taxi" className="hover:text-[#C9A227] transition-colors flex items-center gap-1 group">
                  <span>Local Hourly Rentals</span> <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/corporate-travel" className="hover:text-[#C9A227] transition-colors flex items-center gap-1 group">
                  <span>Corporate Travel</span> <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
              <li>
                <Link to="/fleet" className="hover:text-[#C9A227] transition-colors flex items-center gap-1 group">
                  <span>Luxury Fleet Catalog</span> <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Company Pages */}
          <div className="space-y-4">
            <h4 className="font-serif text-white text-base font-semibold tracking-wide border-l-2 border-[#C9A227] pl-2.5">
              Company
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link to="/about" className="hover:text-[#C9A227] transition-colors">About Luthra Travels</Link>
              </li>
              <li>
                <Link to="/blog" className="hover:text-[#C9A227] transition-colors">Travel Blog &amp; Guides</Link>
              </li>
              <li>
                <Link to="/gallery" className="hover:text-[#C9A227] transition-colors">Fleet Photo Gallery</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#C9A227] transition-colors">Frequently Asked Questions</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#C9A227] transition-colors">Contact Support</Link>
              </li>
            </ul>
          </div>

          {/* 24/7 Concierge Contact */}
          <div className="space-y-4">
            <h4 className="font-serif text-white text-base font-semibold tracking-wide border-l-2 border-[#C9A227] pl-2.5">
              24/7 Concierge Desk
            </h4>
            <ul className="space-y-3 text-xs sm:text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-[#C9A227] shrink-0 mt-0.5" />
                <span className="text-zinc-300">{settings.address || 'Suite 402, Signature Towers, South City 1, Gurgaon, Delhi NCR - 122001'}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-[#C9A227] shrink-0" />
                <a href={`tel:${phonePrimary}`} className="text-zinc-100 hover:text-[#C9A227] font-mono">
                  {phonePrimary}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-[#C9A227] shrink-0" />
                <a href={`mailto:${emailPrimary}`} className="text-zinc-100 hover:text-[#C9A227]">
                  {emailPrimary}
                </a>
              </li>
              <li className="flex items-center gap-3 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-500/20 p-2 rounded-lg">
                <Clock className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>24 Hours / 7 Days Active Support</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Google Maps Location Preview Section */}
        <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[#C9A227] shrink-0" />
            <div>
              <span className="font-serif font-bold text-white block">Main Operations Depot &amp; Fleet Garage</span>
              <span>Signature Towers Sector, South City 1, Gurgaon, Delhi NCR</span>
            </div>
          </div>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 bg-zinc-800 hover:bg-[#C9A227] hover:text-zinc-950 text-zinc-200 px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors"
          >
            <span>Open in Google Maps</span> <ArrowUpRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {/* Copyright & Legal Bar */}
        <div className="pt-4 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-zinc-500">
          <div>
            © {new Date().getFullYear()} Luthra Travels. All Rights Reserved. GSTIN: {settings.gst_number || '07AAAAA0000A1Z5'}.
          </div>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <Link to="/terms-conditions" className="hover:text-zinc-300 transition-colors">Terms &amp; Conditions</Link>
            <Link to="/admin" className="text-[#C9A227]/80 hover:text-[#C9A227] transition-colors font-mono">
              CMS Admin Panel
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
