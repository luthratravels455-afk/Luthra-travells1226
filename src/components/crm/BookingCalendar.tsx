import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, MapPin, User, Car, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Booking } from '../../types';
import { Badge } from '../ui/Badge';

export interface BookingCalendarProps {
  bookings: Booking[];
  onSelectBooking?: (booking: Booking) => void;
}

export const BookingCalendar: React.FC<BookingCalendarProps> = ({
  bookings,
  onSelectBooking,
}) => {
  const [viewMode, setViewMode] = useState<'daily' | 'weekly' | 'monthly'>('weekly');
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  const formattedDateString = currentDate.toISOString().split('T')[0];

  // Filter bookings for the selected view
  const activeBookings = bookings.filter((b) => {
    if (!b.travel_date) return false;
    if (viewMode === 'daily') {
      return b.travel_date === formattedDateString;
    }
    return true; // Return all for calendar overview
  });

  const upcomingBookings = bookings.filter(b => b.status === 'CONFIRMED' || b.status === 'PENDING');
  const pastBookings = bookings.filter(b => b.status === 'COMPLETED' || b.status === 'CANCELLED');

  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6">
      
      {/* Calendar Bar Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
        <div className="flex items-center gap-3">
          <CalendarIcon className="w-6 h-6 text-[#C9A227]" />
          <div>
            <h3 className="font-serif text-xl font-bold text-white">Operations Calendar</h3>
            <p className="text-xs text-zinc-400">Schedule &amp; dispatch timeline view</p>
          </div>
        </div>

        {/* View Switchers */}
        <div className="flex items-center gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800 font-mono text-xs">
          {(['daily', 'weekly', 'monthly'] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 rounded-xl uppercase font-bold transition-all ${
                viewMode === mode
                  ? 'bg-[#C9A227] text-zinc-950 shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Calendar Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Upcoming Schedule */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center text-xs font-mono text-zinc-400">
            <span>UPCOMING DISPATCHES ({upcomingBookings.length})</span>
            <span className="text-[#C9A227]">Auto-Synced with Radar Feed</span>
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {upcomingBookings.map((b) => (
              <div
                key={b.id || b.booking_ref}
                onClick={() => onSelectBooking && onSelectBooking(b)}
                className="bg-zinc-950 border border-zinc-800/80 hover:border-[#C9A227]/40 p-4 rounded-2xl transition-all cursor-pointer flex flex-col sm:flex-row justify-between sm:items-center gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-[#C9A227]">
                      {b.booking_ref}
                    </span>
                    <Badge variant={b.status === 'CONFIRMED' ? 'emerald' : 'gold'} dot>
                      {b.status}
                    </Badge>
                  </div>

                  <div className="text-sm font-semibold text-white flex items-center gap-2 pt-0.5">
                    <User className="w-3.5 h-3.5 text-[#C9A227]" /> {b.customer_name} ({b.customer_phone})
                  </div>

                  <div className="text-xs text-zinc-400 flex items-center gap-2">
                    <MapPin className="w-3 h-3 text-[#C9A227]" /> {b.pickup} → {b.drop_location}
                  </div>
                </div>

                <div className="text-left sm:text-right border-t sm:border-t-0 pt-2 sm:pt-0 border-zinc-800">
                  <div className="text-xs text-white font-mono font-bold flex items-center sm:justify-end gap-1">
                    <Clock className="w-3.5 h-3.5 text-[#C9A227]" /> {b.travel_date} at {b.pickup_time}
                  </div>
                  <div className="text-xs text-zinc-400 font-mono pt-1">
                    Vehicle: <span className="text-zinc-200">{b.vehicle}</span>
                  </div>
                  <div className="text-xs font-bold font-mono text-[#C9A227] pt-0.5">
                    ₹{b.estimated_amount}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Completed History List */}
        <div className="lg:col-span-4 space-y-4">
          <div className="text-xs font-mono text-zinc-400">
            RECENT COMPLETED TRIPS ({pastBookings.length})
          </div>

          <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
            {pastBookings.map((b) => (
              <div
                key={b.id || b.booking_ref}
                className="bg-zinc-950/60 border border-zinc-800 p-3.5 rounded-2xl space-y-1.5 text-xs"
              >
                <div className="flex justify-between items-center font-mono">
                  <span className="text-[#C9A227] font-bold">{b.booking_ref}</span>
                  <span className="text-zinc-500">{b.travel_date}</span>
                </div>
                <div className="text-zinc-200 font-medium">{b.customer_name}</div>
                <div className="text-zinc-400 truncate">{b.pickup}</div>
                <div className="flex justify-between items-center pt-1 border-t border-zinc-800 text-[11px] font-mono">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> {b.status}
                  </span>
                  <span className="text-zinc-300">₹{b.estimated_amount}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
