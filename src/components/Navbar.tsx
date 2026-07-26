import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Phone, MessageCircle, ShieldCheck, Menu, X, ChevronRight, UserCheck, Calendar } from 'lucide-react';
import { useCMS } from '../contexts/CMSContext';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/Button';

export const Navbar: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { settings } = useCMS();
  const { isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const phonePrimary = settings.phone_primary || '+91 99589 56593';
  const whatsappNum = settings.whatsapp_number || '919958956593';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Fleet', path: '/fleet' },
    { name: 'Airport Transfers', path: '/airport-transfers' },
    { name: 'Outstation', path: '/outstation-taxi' },
    { name: 'Local Taxi', path: '/local-taxi' },
    { name: 'Corporate', path: '/corporate-travel' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
  ];

  const whatsappUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent('Hello Luthra Travels, I would like to inquire about a luxury chauffeur booking.')}`;

  const handleBookNowClick = (e: React.MouseEvent) => {
    e.preventDefault();
    if (location.pathname === '/') {
      const element = document.getElementById('booking-engine');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      } else {
        window.scrollTo({ top: 500, behavior: 'smooth' });
      }
    } else {
      navigate('/#booking-engine');
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      {/* Top Utility Bar */}
      <div className="bg-zinc-950 text-zinc-300 text-xs py-2 px-4 sm:px-8 border-b border-[#C9A227]/15 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-[#C9A227] font-medium">
              <ShieldCheck className="w-4 h-4" /> 24/7 VIP Concierge &amp; Live Flight Radar
            </span>
            <span className="text-zinc-700">|</span>
            <a href={`tel:${phonePrimary}`} className="flex items-center gap-1.5 hover:text-[#C9A227] transition-colors font-mono">
              <Phone className="w-3.5 h-3.5 text-[#C9A227]" /> {phonePrimary}
            </a>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-emerald-400 hover:text-emerald-300 font-medium transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-emerald-400/20" /> WhatsApp Concierge
            </a>

            {isAdmin ? (
              <Link
                to="/admin"
                className="flex items-center gap-1.5 text-[#C9A227] bg-[#C9A227]/10 border border-[#C9A227]/30 px-3 py-0.5 rounded-full font-semibold hover:bg-[#C9A227]/20 transition-colors"
              >
                <UserCheck className="w-3.5 h-3.5" /> CMS Admin Panel
              </Link>
            ) : (
              <Link to="/admin" className="text-zinc-400 hover:text-zinc-200 transition-colors text-[11px] font-mono">
                CMS Admin
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Main Glass Navbar */}
      <nav
        className={`transition-all duration-300 ${
          scrolled
            ? 'glass-navbar py-3 shadow-2xl shadow-black/80'
            : 'bg-gradient-to-b from-zinc-950/90 to-zinc-950/40 backdrop-blur-md py-4 border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-[#C9A227]/50 rounded-xl p-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-[#C9A227] to-amber-700 p-0.5 shadow-lg shadow-[#C9A227]/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-zinc-950 rounded-[10px] flex items-center justify-center">
                <span className="font-serif font-black text-xl text-[#C9A227] tracking-tighter">LT</span>
              </div>
            </div>
            <div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-wide text-white block leading-tight">
                LUTHRA <span className="text-[#C9A227] font-light">TRAVELS</span>
              </span>
              <span className="text-[10px] tracking-widest text-zinc-400 uppercase font-mono block">
                Luxury Chauffeur Mobility
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden xl:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'text-[#C9A227] bg-[#C9A227]/10 border border-[#C9A227]/30 shadow-sm'
                      : 'text-zinc-300 hover:text-white hover:bg-zinc-800/60'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          {/* Action CTAs */}
          <div className="hidden lg:flex items-center gap-3">
            <Button
              variant="primary"
              size="sm"
              onClick={handleBookNowClick}
              leftIcon={<Calendar className="w-3.5 h-3.5" />}
              rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
            >
              Book Now
            </Button>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden text-zinc-300 hover:text-[#C9A227] p-2 rounded-xl bg-zinc-900 border border-zinc-800 transition-colors"
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      {/* Animated Full-Screen Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="xl:hidden fixed inset-0 top-[60px] bg-zinc-950/98 backdrop-blur-2xl border-t border-[#C9A227]/20 z-40 p-6 flex flex-col justify-between overflow-y-auto animate-fadeIn">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`px-4 py-3 rounded-xl text-base font-semibold transition-all flex items-center justify-between ${
                    isActive
                      ? 'text-[#C9A227] bg-[#C9A227]/10 border border-[#C9A227]/30'
                      : 'text-zinc-200 hover:bg-zinc-900'
                  }`}
                >
                  <span>{link.name}</span>
                  <ChevronRight className="w-4 h-4 text-zinc-500" />
                </Link>
              );
            })}
          </div>

          <div className="mt-8 pt-6 border-t border-zinc-800 space-y-3">
            <Button
              variant="primary"
              fullWidth
              size="md"
              onClick={(e) => {
                setMobileMenuOpen(false);
                handleBookNowClick(e);
              }}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              Reserve Chauffeur Taxi
            </Button>

            <a
              href={`tel:${phonePrimary}`}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 border border-zinc-800 text-[#C9A227] py-3 rounded-xl font-mono text-sm font-semibold"
            >
              <Phone className="w-4 h-4" /> Call: {phonePrimary}
            </a>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 text-white py-3 rounded-xl font-semibold text-sm shadow-lg shadow-emerald-600/20"
            >
              <MessageCircle className="w-4 h-4" /> WhatsApp Booking
            </a>

            <div className="text-center pt-2">
              <Link to="/admin" className="text-xs text-zinc-400 hover:text-[#C9A227] underline font-mono">
                Admin Panel Access (/admin)
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
