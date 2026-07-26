import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  MessageCircle,
  Send,
  ShieldCheck,
  AlertTriangle,
  Compass,
  CheckCircle2,
  ExternalLink,
  Instagram,
  Facebook,
  Linkedin,
  AlertCircle,
} from 'lucide-react';
import { useCMS } from '../contexts/CMSContext';
import { useToast } from '../contexts/ToastContext';
import { PageSEO } from '../components/ui/SEO';
import { Container } from '../components/ui/Container';
import { SectionTitle } from '../components/ui/Typography';
import { Button } from '../components/ui/Button';

export const Contact: React.FC = () => {
  const { settings } = useCMS();
  const { showToast } = useToast();

  const phonePrimary = settings.phone_primary || '+91 99589 56593';
  const emailPrimary = settings.email_primary || 'luthratravel455@gmail.com';
  const whatsappNum = settings.whatsapp_number || '919958956593';
  const businessHours = settings.business_hours || '24 Hours / 7 Days a week';
  const emergencyContact = settings.emergency_contact || '+91 99589 56593';
  const address = settings.address || 'Suite 402, Signature Towers, South City 1, Gurgaon, Delhi NCR - 122001';

  const mapEmbedUrl =
    settings.map_embed_url ||
    'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d14030.735820490082!2d77.05051915!3d28.460494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d18e805555555%3A0x123456789!2sSignature%20Towers%2C%20South%20City%20I%2C%20Gurugram%2C%20Haryana%20122001!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin';

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [service, setService] = useState('Airport Transfer');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<{ name?: string; phone?: string; email?: string; message?: string }>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // NAME FIELD VALIDATION RULES
  const validateName = (val: string) => {
    const trimmed = val.trim();
    if (!trimmed) return 'Name is required.';
    const alphabetsAndSpacesRegex = /^[a-zA-Z\s]+$/;
    if (!alphabetsAndSpacesRegex.test(trimmed)) {
      return 'Name must contain alphabets and spaces only (no numbers or symbols).';
    }
    if (trimmed.length < 2) {
      return 'Name must be at least 2 characters.';
    }
    if (trimmed.length > 50) {
      return 'Name cannot exceed 50 characters.';
    }
    return undefined;
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (val === '' || /^[a-zA-Z\s]*$/.test(val)) {
      if (val.length <= 50) {
        setName(val);
        if (touched.name) {
          setErrors((prev) => ({ ...prev, name: validateName(val) }));
        }
      }
    }
  };

  // PHONE NUMBER VALIDATION RULES
  const validatePhone = (val: string) => {
    if (!val) return 'Phone Number is required.';
    if (val.length !== 10) return 'Phone Number must be exactly 10 digits.';
    const tenDigitsRegex = /^\d{10}$/;
    if (!tenDigitsRegex.test(val)) return 'Phone Number must contain numbers only.';
    return undefined;
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value;
    const digitsOnly = rawVal.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
    if (touched.phone) {
      setErrors((prev) => ({ ...prev, phone: validatePhone(digitsOnly) }));
    }
  };

  const handlePhonePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData('text');
    const digitsOnly = pastedText.replace(/\D/g, '').slice(0, 10);
    setPhone(digitsOnly);
    if (touched.phone) {
      setErrors((prev) => ({ ...prev, phone: validatePhone(digitsOnly) }));
    }
  };

  const validateForm = () => {
    const errs: { name?: string; phone?: string; email?: string; message?: string } = {};

    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);

    if (nameErr) errs.name = nameErr;
    if (phoneErr) errs.phone = phoneErr;

    if (email.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = 'Enter a valid email address.';
    }

    if (!message.trim()) {
      errs.message = 'Please enter your inquiry details.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({ name: true, phone: true, email: true, message: true });

    if (!validateForm()) {
      showToast('Please fix the errors in the form.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      setSubmitted(true);
      showToast('Inquiry submitted successfully!', 'success');

      const text =
        `🚖 *New Website Inquiry*\n\n` +
        `👤 *Name:* ${name.trim()}\n` +
        `📞 *Phone:* ${phone}\n` +
        `✉️ *Email:* ${email.trim() || 'N/A'}\n` +
        `🧳 *Service Interest:* ${service}\n` +
        `📝 *Message:* ${message.trim()}`;

      const waUrl = `https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`;
      setTimeout(() => {
        window.open(waUrl, '_blank');
      }, 500);
    } catch (err: any) {
      showToast(err.message || 'Error sending message', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const serviceAreas = [
    { name: 'Delhi NCR Hubs', details: 'IGI Airport T1/T2/T3, Aerocity, Vasant Vihar, Connaught Place, South Delhi' },
    { name: 'Gurgaon Corporate Zone', details: 'Cyber City, Golf Course Road, DLF Phase 1-5, Sohna Road, Udyog Vihar' },
    { name: 'Noida & Ghaziabad', details: 'Noida Sector 18, 62, 128, Greater Noida, Expressway Sector' },
    { name: 'Outstation Circuits', details: 'Agra (Yamuna Expressway), Jaipur, Chandigarh, Dehradun, Mussoorie, Shimla, Rishikesh' },
  ];

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-32 pb-24">
      <PageSEO
        title="Contact Us & 24/7 Concierge"
        description="Contact Luthra Travels 24/7 hotline at +91 99589 56593 or email luthratravel455@gmail.com for instant chauffeur bookings in Delhi NCR."
      />

      <Container size="7xl" className="space-y-16">
        {/* Page Header */}
        <SectionTitle
          tag="24/7 VIP Concierge Desk"
          title="Contact Luthra Travels"
          subtitle="Have a question about an upcoming airport drop, outstation family trip, or corporate fleet account? Our dispatch desk is active 24 hours a day, 7 days a week."
        />

        {/* Emergency Helpline Banner */}
        <div className="bg-gradient-to-r from-[#C9A227]/10 via-zinc-900 to-zinc-950 border border-[#C9A227]/40 rounded-3xl p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#C9A227]/20 border border-[#C9A227]/40 flex items-center justify-center text-[#C9A227] shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">
                Urgent Dispatch &amp; Live Flight Support
              </span>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Emergency Hotline: <span className="font-mono text-[#C9A227]">{emergencyContact}</span>
              </h3>
            </div>
          </div>

          <a href={`tel:${emergencyContact.replace(/\s+/g, '')}`}>
            <Button variant="gold" size="md" leftIcon={<Phone className="w-4 h-4" />}>
              Call Emergency Desk
            </Button>
          </a>
        </div>

        {/* Main Grid: Contact Cards & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Column: Direct Contact Info Cards */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-xl">
              <h3 className="font-serif text-2xl font-bold text-white border-b border-zinc-800 pb-4">
                Operations &amp; Dispatch
              </h3>

              <div className="space-y-5 text-xs sm:text-sm">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227] shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block font-serif text-base">Direct Phone Line</strong>
                    <a
                      href={`tel:${phonePrimary.replace(/\s+/g, '')}`}
                      className="text-[#C9A227] font-mono text-base font-bold hover:underline"
                    >
                      {phonePrimary}
                    </a>
                    <span className="text-zinc-400 text-xs block">24/7 Booking &amp; Dispatch Desk</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 flex items-center justify-center text-[#C9A227] shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block font-serif text-base">Email Reservations</strong>
                    <a href={`mailto:${emailPrimary}`} className="text-zinc-200 hover:text-[#C9A227] font-medium block">
                      {emailPrimary}
                    </a>
                    <span className="text-zinc-400 text-xs block">GST Tax Invoice Requests &amp; Enquiries</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-white block font-serif text-base">WhatsApp Instant Chat</strong>
                    <a
                      href={`https://wa.me/${whatsappNum}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-400 font-mono font-bold hover:underline"
                    >
                      +{whatsappNum}
                    </a>
                    <span className="text-zinc-400 text-xs block">Instant Quote &amp; Driver Location Sharing</span>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0">
                    <Clock className="w-5 h-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <strong className="text-white block font-serif text-base">Business Operating Hours</strong>
                    <span className="text-emerald-400 font-mono font-semibold block">{businessHours}</span>
                    <span className="text-zinc-400 text-xs block">Always Open for Transfers &amp; Dispatches</span>
                  </div>
                </div>

                <div className="flex items-start gap-4 pt-2 border-t border-zinc-800">
                  <div className="w-10 h-10 rounded-xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 shrink-0">
                    <MapPin className="w-5 h-5 text-[#C9A227]" />
                  </div>
                  <div>
                    <strong className="text-white block font-serif text-base">Depot &amp; Registered Office</strong>
                    <span className="text-zinc-300 text-xs leading-relaxed block">{address}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-zinc-800 flex items-center justify-between">
                <span className="text-xs text-zinc-400 font-mono">Follow Luthra Travels:</span>
                <div className="flex items-center gap-2">
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-[#C9A227] transition-colors">
                    <Instagram className="w-4 h-4" />
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-[#C9A227] transition-colors">
                    <Facebook className="w-4 h-4" />
                  </a>
                  <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-zinc-800 text-zinc-300 hover:text-[#C9A227] transition-colors">
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="lg:col-span-7">
            <div className="bg-zinc-900/90 border border-zinc-800 rounded-3xl p-8 space-y-6 shadow-xl relative overflow-hidden">
              <div className="space-y-1">
                <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">
                  Direct Line
                </span>
                <h3 className="font-serif text-2xl font-bold text-white">Send Us a Direct Message</h3>
                <p className="text-xs text-zinc-400">
                  Fill out your request details below. You will receive an immediate response from our dispatch desk.
                </p>
              </div>

              {submitted ? (
                <div className="bg-zinc-950 border border-emerald-500/40 rounded-2xl p-8 text-center space-y-4">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
                  <h4 className="font-serif text-2xl font-bold text-white">Inquiry Received</h4>
                  <p className="text-xs sm:text-sm text-zinc-300 max-w-md mx-auto">
                    Thank you, <span className="text-[#C9A227] font-semibold">{name}</span>! Our concierge team is reviewing your message for <span className="text-white font-semibold">{service}</span>.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSubmitted(false);
                      setName('');
                      setEmail('');
                      setPhone('');
                      setMessage('');
                    }}
                  >
                    Send Another Message
                  </Button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Name */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300">
                        Name <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="text"
                        maxLength={50}
                        value={name}
                        onChange={handleNameChange}
                        onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
                        placeholder="Name"
                        className={`w-full bg-zinc-950 border ${
                          touched.name && errors.name ? 'border-rose-500' : 'border-zinc-800 focus:border-[#C9A227]'
                        } rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors`}
                      />
                      {touched.name && errors.name && (
                        <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" /> {errors.name}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300">
                        Phone Number <span className="text-rose-400">*</span>
                      </label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={handlePhoneChange}
                        onPaste={handlePhonePaste}
                        onBlur={() => setTouched((prev) => ({ ...prev, phone: true }))}
                        placeholder="Phone Number"
                        className={`w-full bg-zinc-950 border ${
                          touched.phone && errors.phone ? 'border-rose-500' : 'border-zinc-800 focus:border-[#C9A227]'
                        } rounded-xl px-4 py-2.5 text-sm text-white font-mono placeholder-zinc-600 focus:outline-none transition-colors`}
                      />
                      {touched.phone && errors.phone && (
                        <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" /> {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300">Email Address</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="vikram@company.com"
                        className={`w-full bg-zinc-950 border ${
                          touched.email && errors.email ? 'border-rose-500' : 'border-zinc-800 focus:border-[#C9A227]'
                        } rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors`}
                      />
                      {touched.email && errors.email && (
                        <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" /> {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Service Interest */}
                    <div className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-300">Service Interest</label>
                      <select
                        value={service}
                        onChange={(e) => setService(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors"
                      >
                        <option value="Airport Transfer">IGI Airport Transfer (T1, T2, T3)</option>
                        <option value="Outstation Taxi">Outstation Intercity Trip</option>
                        <option value="Local Hourly Taxi">Local City Hourly Rental</option>
                        <option value="Corporate Fleet Account">Corporate B2B Account</option>
                        <option value="General Inquiry">General Query</option>
                      </select>
                    </div>

                    {/* Message */}
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-xs font-semibold text-zinc-300">
                        Message / Journey Details <span className="text-rose-400">*</span>
                      </label>
                      <textarea
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Describe your travel itinerary, preferred pickup date, flight details, or specific vehicle requests..."
                        className={`w-full bg-zinc-950 border ${
                          touched.message && errors.message ? 'border-rose-500' : 'border-zinc-800 focus:border-[#C9A227]'
                        } rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors`}
                      />
                      {touched.message && errors.message && (
                        <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pt-0.5">
                          <AlertCircle className="w-3 h-3 shrink-0" /> {errors.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button
                    type="submit"
                    variant="gold"
                    size="md"
                    fullWidth
                    isLoading={submitting}
                    disabled={submitting}
                    rightIcon={<Send className="w-4 h-4" />}
                  >
                    {submitting ? 'Transmitting Inquiry...' : 'Submit Contact Inquiry'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Google Map Section */}
        <div className="space-y-6 pt-6 border-t border-zinc-900">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">
                Physical Location
              </span>
              <h3 className="font-serif text-2xl font-bold text-white mt-1">Google Maps Location</h3>
            </div>
            <a
              href="https://maps.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-[#C9A227] font-semibold hover:underline"
            >
              Open Directions in Google Maps <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl h-96 relative">
            <iframe
              title="Luthra Travels Operations Map"
              src={mapEmbedUrl}
              width="100%"
              height="100%"
              style={{ border: 0, filter: 'grayscale(0.8) contrast(1.2) invert(0.9)' }}
              allowFullScreen={false}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="absolute bottom-4 left-4 bg-zinc-950/90 backdrop-blur-md border border-[#C9A227]/30 p-4 rounded-2xl text-xs text-zinc-300 space-y-1">
              <strong className="text-[#C9A227] font-serif text-sm block">Signature Towers Sector Depot</strong>
              <span>South City 1, Gurgaon, Delhi NCR - 122001</span>
            </div>
          </div>
        </div>

        {/* Service Area Coverage Breakdown */}
        <div className="space-y-6 pt-6 border-t border-zinc-900">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest block">
              <Compass className="w-4 h-4 inline mr-1" /> Service Coverage Map
            </span>
            <h3 className="font-serif text-2xl font-bold text-white">Our Operational Regions</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {serviceAreas.map((area, idx) => (
              <div
                key={idx}
                className="bg-zinc-900/60 p-5 rounded-2xl border border-zinc-800 space-y-2 hover:border-[#C9A227]/40 transition-all"
              >
                <div className="flex items-center gap-2 text-sm font-bold text-white font-serif">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{area.name}</span>
                </div>
                <p className="text-xs text-zinc-400 leading-relaxed">{area.details}</p>
              </div>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
};