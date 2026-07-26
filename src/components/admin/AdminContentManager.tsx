import React, { useState } from 'react';
import { SiteSettings, PopularRoute, Testimonial, FAQItem, BlogPost, GalleryItem } from '../../types';
import { Save, Plus, Trash2, FileText, Check, Eye } from 'lucide-react';
import { Button } from '../ui/Button';

interface AdminContentManagerProps {
  settingsForm: SiteSettings;
  setSettingsForm: React.Dispatch<React.SetStateAction<SiteSettings>>;
  routes: PopularRoute[];
  testimonials: Testimonial[];
  faqs: FAQItem[];
  blogs: BlogPost[];
  gallery: GalleryItem[];
  onSaveSettings: (e: React.FormEvent) => Promise<void>;
  onDeleteRoute: (id: number) => Promise<void>;
  onDeleteTestimonial: (id: number) => Promise<void>;
  onDeleteFaq: (id: number) => Promise<void>;
  onDeleteBlog: (id: number) => Promise<void>;
  onDeleteGalleryItem: (id: number) => Promise<void>;
}

export const AdminContentManager: React.FC<AdminContentManagerProps> = ({
  settingsForm,
  setSettingsForm,
  routes,
  testimonials,
  faqs,
  blogs,
  gallery,
  onSaveSettings,
  onDeleteRoute,
  onDeleteTestimonial,
  onDeleteFaq,
  onDeleteBlog,
  onDeleteGalleryItem,
}) => {
  const [activeSection, setActiveSection] = useState<'pages' | 'routes' | 'reviews' | 'faqs' | 'blogs'>('pages');

  return (
    <div className="space-y-6 animate-fadeIn">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="font-serif text-2xl font-bold text-white">Content &amp; Page Manager CMS</h2>
          <p className="text-xs text-zinc-400">
            Control page headings, section subtitles, popular routes, testimonials, support FAQs, and travel blogs.
          </p>
        </div>

        {/* Sub-tab navigation */}
        <div className="flex flex-wrap gap-2 bg-zinc-900 p-1.5 rounded-2xl border border-zinc-800">
          {(['pages', 'routes', 'reviews', 'faqs', 'blogs'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveSection(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all uppercase ${
                activeSection === tab ? 'bg-[#C9A227] text-zinc-950 font-extrabold' : 'text-zinc-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* SECTION 1: PAGES & HEADINGS */}
      {activeSection === 'pages' && (
        <form onSubmit={onSaveSettings} className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-6">
          <h3 className="font-serif text-lg font-bold text-[#C9A227]">Page Headings &amp; Section Visibility</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Homepage Hero */}
            <div className="space-y-1 sm:col-span-2">
              <label className="text-zinc-300 font-semibold">Homepage Hero Headline</label>
              <input
                type="text"
                value={settingsForm.hero_title || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, hero_title: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
              />
            </div>

            {/* Airport Page */}
            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">Airport Page Title</label>
              <input
                type="text"
                value={settingsForm.airport_page_title || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, airport_page_title: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
              />
            </div>

            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">Outstation Page Title</label>
              <input
                type="text"
                value={settingsForm.outstation_title || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, outstation_title: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
              />
            </div>

            {/* Local Taxi */}
            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">Local Taxi Page Title</label>
              <input
                type="text"
                value={settingsForm.local_taxi_title || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, local_taxi_title: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
              />
            </div>

            {/* Corporate */}
            <div className="space-y-1">
              <label className="text-zinc-300 font-semibold">Corporate Page Title</label>
              <input
                type="text"
                value={settingsForm.corporate_title || ''}
                onChange={(e) => setSettingsForm({ ...settingsForm, corporate_title: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 rounded-xl p-3 text-white"
              />
            </div>
          </div>

          <Button variant="gold" size="md" type="submit" leftIcon={<Save className="w-4 h-4" />}>
            Save Page Content
          </Button>
        </form>
      )}

      {/* SECTION 2: POPULAR ROUTES */}
      {activeSection === 'routes' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-white">Popular Intercity Routes</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950 text-[#C9A227] font-mono border-b border-zinc-800 uppercase">
                <tr>
                  <th className="p-3">Origin → Destination</th>
                  <th className="p-3">Distance / Duration</th>
                  <th className="p-3">Vehicle</th>
                  <th className="p-3">Flat Fare</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800 text-zinc-300">
                {routes.map((rt) => (
                  <tr key={rt.id}>
                    <td className="p-3 font-bold text-white">{rt.origin} → {rt.destination}</td>
                    <td className="p-3">{rt.distance_km} KM ({rt.estimated_time})</td>
                    <td className="p-3">{rt.vehicle_type}</td>
                    <td className="p-3 font-mono text-[#C9A227]">₹{rt.price}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => onDeleteRoute(rt.id)} className="text-rose-400 p-1">
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

      {/* SECTION 3: REVIEWS */}
      {activeSection === 'reviews' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-white">Testimonials &amp; Customer Reviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {testimonials.map((t) => (
              <div key={t.id} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 relative">
                <button
                  onClick={() => onDeleteTestimonial(t.id)}
                  className="absolute top-3 right-3 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <span className="font-serif font-bold text-white block">{t.name} ({t.title_role})</span>
                <p className="text-zinc-400 italic">"{t.comment}"</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 4: FAQS */}
      {activeSection === 'faqs' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-white">Support FAQs</h3>
          <div className="space-y-3 text-xs">
            {faqs.map((f) => (
              <div key={f.id} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-1 relative">
                <button
                  onClick={() => onDeleteFaq(f.id)}
                  className="absolute top-3 right-3 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="font-bold text-[#C9A227]">{f.question}</h4>
                <p className="text-zinc-300">{f.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SECTION 5: BLOGS */}
      {activeSection === 'blogs' && (
        <div className="bg-zinc-900 border border-zinc-800 p-6 rounded-3xl space-y-4">
          <h3 className="font-serif text-lg font-bold text-white">Travel Articles &amp; Guides</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            {blogs.map((b) => (
              <div key={b.id} className="bg-zinc-950 p-4 rounded-xl border border-zinc-800 space-y-2 relative">
                <button
                  onClick={() => onDeleteBlog(b.id)}
                  className="absolute top-3 right-3 text-rose-400 hover:text-rose-300"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <h4 className="font-serif font-bold text-white text-sm">{b.title}</h4>
                <p className="text-zinc-400 line-clamp-2">{b.excerpt}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
