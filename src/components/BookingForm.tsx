import React, { useState } from 'react';
import { Calendar, Clock, MapPin, Car, Phone, User, MessageSquare, CheckCircle, ChevronRight, Sparkles, Send, AlertCircle, ArrowRightLeft, RotateCw, ShieldCheck } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { bookingService } from '../services/bookingService';
import { Button } from './ui/Button';

interface BookingFormProps {
  initialVehicle?: string;
  initialTripType?: 'AIRPORT' | 'OUTSTATION' | 'LOCAL' | 'CORPORATE';
  initialTripMode?: 'ONE_WAY' | 'ROUND_TRIP';
  initialPickup?: string;
  initialDrop?: string;
}

interface ValidationErrors {
  name?: string;
  phone?: string;
  pickup?: string;
  dropLocation?: string;
  travelDate?: string;
  pickupTime?: string;
  returnDate?: string;
  returnTime?: string;
  vehicle?: string;
}

export const BookingForm: React.FC<BookingFormProps> = ({
  initialVehicle = 'Toyota Innova Crysta',
  initialTripType = 'OUTSTATION',
  initialTripMode = 'ONE_WAY',
  initialPickup = '',
  initialDrop = '',
}) => {
  const { showToast } = useToast();

  const [tripType, setTripType] = useState<'AIRPORT' | 'OUTSTATION' | 'LOCAL' | 'CORPORATE'>(initialTripType);
  const [tripMode, setTripMode] = useState<'ONE_WAY' | 'ROUND_TRIP'>(initialTripMode);
  
  const [pickup, setPickup] = useState(initialPickup);
  const [dropLocation, setDropLocation] = useState(initialDrop);
  
  const [travelDate, setTravelDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [pickupTime, setPickupTime] = useState('09:00');
  
  const [returnDate, setReturnDate] = useState(() => {
    const nextDay = new Date();
    nextDay.setDate(nextDay.getDate() + 2);
    return nextDay.toISOString().split('T')[0];
  });
  const [returnTime, setReturnTime] = useState('18:00');
  
  const [vehicle, setVehicle] = useState(initialVehicle);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState<{ ref: string; whatsappUrl: string } | null>(null);

  // Exact 4 allowed default vehicles
  const defaultVehicles = [
    { title: 'Toyota Innova Crysta' },
    { title: 'Maruti Ertiga' },
    { title: 'Maruti Dzire' },
    { title: 'Honda Amaze' },
  ];

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

  // Name Input Handler: Enforce alphabets and spaces only
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow typing alphabets and spaces up to 50 characters
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

  // Phone Input Handler: Enforce 10 digits max, numbers only, prevent spaces/letters/symbols/country code
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Clean input to numbers only, max 10 digits
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

  const handleBlur = (field: string) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    runValidation();
  };

  const runValidation = () => {
    const errs: ValidationErrors = {};
    const nameErr = validateName(name);
    const phoneErr = validatePhone(phone);

    if (nameErr) errs.name = nameErr;
    if (phoneErr) errs.phone = phoneErr;
    if (!pickup.trim()) errs.pickup = 'Pickup location is required.';
    if (!dropLocation.trim()) errs.dropLocation = 'Drop location is required.';
    if (!travelDate) errs.travelDate = 'Travel date is required.';
    if (!pickupTime) errs.pickupTime = 'Pickup time is required.';
    if (!vehicle) errs.vehicle = 'Please select a vehicle.';

    if (tripMode === 'ROUND_TRIP') {
      if (!returnDate) errs.returnDate = 'Return date is required for round trips.';
      if (!returnTime) errs.returnTime = 'Return time is required for round trips.';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setTouched({
      name: true,
      phone: true,
      pickup: true,
      dropLocation: true,
      travelDate: true,
      pickupTime: true,
      vehicle: true,
      returnDate: tripMode === 'ROUND_TRIP',
      returnTime: tripMode === 'ROUND_TRIP',
    });

    const isValid = runValidation();
    if (!isValid) {
      showToast('Please fix the errors in the form before submitting.', 'error');
      return;
    }

    setSubmitting(true);

    try {
      const notes = tripMode === 'ROUND_TRIP'
        ? `Round Trip: Returning on ${returnDate} at ${returnTime}. ${message.trim()}`
        : message.trim();

      const bookingData = await bookingService.createBooking({
        trip_type: tripType,
        pickup: pickup.trim(),
        drop_location: dropLocation.trim(),
        travel_date: travelDate,
        pickup_time: pickupTime,
        vehicle,
        customer_name: name.trim(),
        customer_phone: phone,
        message: notes,
      });

      const waMsg =
        `🚖 *New Booking Request*\n\n` +
        `👤 *Name:* ${name.trim()}\n` +
        `📞 *Phone:* ${phone}\n` +
        `🚘 *Vehicle:* ${vehicle}\n` +
        `📍 *Pickup:* ${pickup.trim()}\n` +
        `🏁 *Drop:* ${dropLocation.trim()}\n` +
        `📅 *Travel Date:* ${travelDate} at ${pickupTime}\n` +
        (tripMode === 'ROUND_TRIP' ? `🔄 *Return:* ${returnDate} at ${returnTime}\n` : '') +
        `📝 *Additional Message:* ${notes || 'None'}`;

      const whatsappTargetUrl = `https://wa.me/919958956593?text=${encodeURIComponent(waMsg)}`;

      setBookingSuccess({
        ref: bookingData.booking_ref || 'LT-RESERVED',
        whatsappUrl: whatsappTargetUrl,
      });

      showToast('Booking submitted! Launching WhatsApp confirmation...', 'success');

      setTimeout(() => {
        window.open(whatsappTargetUrl, '_blank');
      }, 600);
    } catch (err: any) {
      showToast(err.message || 'Failed to submit booking.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      id="booking-engine"
      className="bg-zinc-900/90 backdrop-blur-2xl border border-[#C9A227]/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/90 relative overflow-hidden transition-all duration-300"
    >
      <div className="absolute top-0 right-0 w-72 h-72 bg-[#C9A227]/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header & Trip Category Switcher */}
      <div className="space-y-4 mb-6 relative z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#C9A227] text-xs font-mono tracking-widest uppercase">
            <Sparkles className="w-4 h-4" /> Instant Chauffeur Reservation
          </div>
          <span className="text-[11px] text-zinc-400 font-mono">24x7 Direct Dispatch</span>
        </div>

        {/* Category Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
          {(['OUTSTATION', 'AIRPORT', 'LOCAL', 'CORPORATE'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => {
                setTripType(type);
                setBookingSuccess(null);
              }}
              className={`py-2.5 px-3 rounded-xl text-xs font-bold tracking-wider transition-all uppercase ${
                tripType === type
                  ? 'bg-[#C9A227] text-zinc-950 shadow-md shadow-[#C9A227]/20 font-extrabold'
                  : 'text-zinc-400 hover:text-white hover:bg-zinc-900'
              }`}
            >
              {type === 'OUTSTATION' ? 'Outstation' : type === 'AIRPORT' ? 'Airport' : type === 'LOCAL' ? 'Local Taxi' : 'Corporate'}
            </button>
          ))}
        </div>

        {/* Mode Toggle for Outstation */}
        {tripType === 'OUTSTATION' && (
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={() => setTripMode('ONE_WAY')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                tripMode === 'ONE_WAY'
                  ? 'bg-zinc-800 text-[#C9A227] border-[#C9A227]/40'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" /> One-Way Drop
            </button>
            <button
              type="button"
              onClick={() => setTripMode('ROUND_TRIP')}
              className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 border transition-all ${
                tripMode === 'ROUND_TRIP'
                  ? 'bg-zinc-800 text-[#C9A227] border-[#C9A227]/40'
                  : 'bg-zinc-950 text-zinc-400 border-zinc-800 hover:text-white'
              }`}
            >
              <RotateCw className="w-3.5 h-3.5" /> Round Trip
            </button>
          </div>
        )}
      </div>

      {bookingSuccess ? (
        <div className="bg-zinc-950/90 border border-emerald-500/40 rounded-2xl p-6 sm:p-8 text-center space-y-5 animate-fadeIn relative z-10">
          <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto text-emerald-400">
            <CheckCircle className="w-10 h-10" />
          </div>
          <div>
            <span className="text-xs font-mono text-emerald-400 uppercase tracking-widest block">Booking Received</span>
            <h3 className="font-serif text-2xl font-bold text-white mt-1">Ref: {bookingSuccess.ref}</h3>
            <p className="text-xs sm:text-sm text-zinc-300 mt-2 max-w-md mx-auto">
              Thank you, <span className="text-[#C9A227] font-semibold">{name}</span>! Your booking request for <span className="text-white font-semibold">{vehicle}</span> on {travelDate} is logged.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row justify-center gap-3">
            <a
              href={bookingSuccess.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <Send className="w-4 h-4" /> Open WhatsApp Booking
            </a>
            <button
              onClick={() => {
                setBookingSuccess(null);
                setPickup('');
                setDropLocation('');
                setName('');
                setPhone('');
                setMessage('');
                setTouched({});
                setErrors({});
              }}
              className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all"
            >
              Book Another Taxi
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4 relative z-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Pickup Location */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227]" /> Pickup Location <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder={tripType === 'AIRPORT' ? 'e.g., Delhi IGI Airport Terminal 3' : 'e.g., Vasant Vihar, New Delhi'}
                value={pickup}
                onChange={(e) => {
                  setPickup(e.target.value);
                  if (touched.pickup) runValidation();
                }}
                onBlur={() => handleBlur('pickup')}
                className={`w-full bg-zinc-950 border ${
                  touched.pickup && errors.pickup ? 'border-rose-500/80 focus:border-rose-500' : 'border-zinc-800 focus:border-[#C9A227]'
                } rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors`}
              />
              {touched.pickup && errors.pickup && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.pickup}
                </p>
              )}
            </div>

            {/* Drop Location */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C9A227]" /> Drop Location <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder={tripType === 'AIRPORT' ? 'e.g., Cyber City, Gurgaon' : 'e.g., Oberoi Amarvilas, Agra'}
                value={dropLocation}
                onChange={(e) => {
                  setDropLocation(e.target.value);
                  if (touched.dropLocation) runValidation();
                }}
                onBlur={() => handleBlur('dropLocation')}
                className={`w-full bg-zinc-950 border ${
                  touched.dropLocation && errors.dropLocation ? 'border-rose-500/80 focus:border-rose-500' : 'border-zinc-800 focus:border-[#C9A227]'
                } rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors`}
              />
              {touched.dropLocation && errors.dropLocation && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.dropLocation}
                </p>
              )}
            </div>

            {/* Travel Date */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#C9A227]" /> Travel Date <span className="text-rose-400">*</span>
              </label>
              <input
                type="date"
                value={travelDate}
                onChange={(e) => {
                  setTravelDate(e.target.value);
                  if (touched.travelDate) runValidation();
                }}
                onBlur={() => handleBlur('travelDate')}
                className={`w-full bg-zinc-950 border ${
                  touched.travelDate && errors.travelDate ? 'border-rose-500/80' : 'border-zinc-800 focus:border-[#C9A227]'
                } rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors`}
              />
              {touched.travelDate && errors.travelDate && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.travelDate}
                </p>
              )}
            </div>

            {/* Pickup Time */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-[#C9A227]" /> Pickup Time <span className="text-rose-400">*</span>
              </label>
              <input
                type="time"
                value={pickupTime}
                onChange={(e) => {
                  setPickupTime(e.target.value);
                  if (touched.pickupTime) runValidation();
                }}
                onBlur={() => handleBlur('pickupTime')}
                className={`w-full bg-zinc-950 border ${
                  touched.pickupTime && errors.pickupTime ? 'border-rose-500/80' : 'border-zinc-800 focus:border-[#C9A227]'
                } rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors`}
              />
              {touched.pickupTime && errors.pickupTime && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.pickupTime}
                </p>
              )}
            </div>

            {/* Round Trip Return Inputs */}
            {tripMode === 'ROUND_TRIP' && (
              <>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#C9A227] flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" /> Return Date <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={(e) => {
                      setReturnDate(e.target.value);
                      if (touched.returnDate) runValidation();
                    }}
                    onBlur={() => handleBlur('returnDate')}
                    className={`w-full bg-zinc-950 border ${
                      touched.returnDate && errors.returnDate ? 'border-rose-500/80' : 'border-zinc-800 focus:border-[#C9A227]'
                    } rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors`}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-[#C9A227] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Return Time <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="time"
                    value={returnTime}
                    onChange={(e) => {
                      setReturnTime(e.target.value);
                      if (touched.returnTime) runValidation();
                    }}
                    onBlur={() => handleBlur('returnTime')}
                    className={`w-full bg-zinc-950 border ${
                      touched.returnTime && errors.returnTime ? 'border-rose-500/80' : 'border-zinc-800 focus:border-[#C9A227]'
                    } rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors`}
                  />
                </div>
              </>
            )}

            {/* Vehicle Selection - STRICTLY DISPLAY ONLY VEHICLE NAME */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Car className="w-3.5 h-3.5 text-[#C9A227]" /> Vehicle Selection <span className="text-rose-400">*</span>
              </label>
              <select
                value={vehicle}
                onChange={(e) => {
                  setVehicle(e.target.value);
                  if (touched.vehicle) runValidation();
                }}
                onBlur={() => handleBlur('vehicle')}
                className={`w-full bg-zinc-950 border ${
                  touched.vehicle && errors.vehicle ? 'border-rose-500/80' : 'border-zinc-800 focus:border-[#C9A227]'
                } rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none transition-colors`}
              >
                {defaultVehicles.map((v) => (
                  <option key={v.title} value={v.title}>
                    {v.title}
                  </option>
                ))}
              </select>
              {touched.vehicle && errors.vehicle && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.vehicle}
                </p>
              )}
            </div>

            {/* Passenger Name Field - STRICT ALPHABETS ONLY, PLACEHOLDER: "Name" */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-[#C9A227]" /> Name <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                placeholder="Name"
                maxLength={50}
                value={name}
                onChange={handleNameChange}
                onBlur={() => handleBlur('name')}
                className={`w-full bg-zinc-950 border ${
                  touched.name && errors.name ? 'border-rose-500/80 focus:border-rose-500' : 'border-zinc-800 focus:border-[#C9A227]'
                } rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors`}
              />
              {touched.name && errors.name && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.name}
                </p>
              )}
            </div>

            {/* Phone Number Field - STRICT 10 DIGITS NUMBERS ONLY, PLACEHOLDER: "Phone Number" */}
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#C9A227]" /> Phone Number <span className="text-rose-400">*</span>
              </label>
              <input
                type="tel"
                placeholder="Phone Number"
                maxLength={10}
                value={phone}
                onChange={handlePhoneChange}
                onPaste={handlePhonePaste}
                onBlur={() => handleBlur('phone')}
                className={`w-full bg-zinc-950 border ${
                  touched.phone && errors.phone ? 'border-rose-500/80 focus:border-rose-500' : 'border-zinc-800 focus:border-[#C9A227]'
                } rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors`}
              />
              {touched.phone && errors.phone && (
                <p className="text-[11px] text-rose-400 flex items-center gap-1 font-medium pt-0.5">
                  <AlertCircle className="w-3 h-3 shrink-0" /> {errors.phone}
                </p>
              )}
            </div>

            {/* Additional Message */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-[#C9A227]" /> Additional Message
              </label>
              <input
                type="text"
                placeholder="Special notes, flight details, extra luggage requirements..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-[#C9A227] rounded-xl px-4 py-2.5 text-sm text-white placeholder-zinc-600 focus:outline-none transition-colors"
              />
            </div>

          </div>

          {/* Action Bar */}
          <div className="bg-zinc-950 p-4.5 rounded-2xl border border-zinc-800 flex flex-wrap items-center justify-between gap-4 mt-6">
            <div className="flex items-center gap-2 text-xs text-zinc-300">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Instant Confirmation • Direct Concierge Dispatch</span>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="md"
              isLoading={submitting}
              rightIcon={<ChevronRight className="w-4 h-4" />}
            >
              {submitting ? 'Logging Booking...' : 'Book Now'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};