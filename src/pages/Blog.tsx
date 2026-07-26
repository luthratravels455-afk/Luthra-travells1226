import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { blogService } from '../services/blogService';
import { BlogPost } from '../types';
import { Clock, User, ArrowRight } from 'lucide-react';

export const Blog: React.FC = () => {
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBlogs = async () => {
      try {
        const data = await blogService.getAllBlogs();
        setBlogs(data);
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    loadBlogs();
  }, []);

  return (
    <div className="bg-slate-950 text-white min-h-screen pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 space-y-12">
        
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest block">Executive Insights & Travel Guides</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-white">
            Luthra Travel Journal
          </h1>
          <p className="text-slate-300 text-sm sm:text-base">
            Expert highway travel advice, corporate mobility trends, route guides, and luxury fleet safety protocols.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-slate-900/50 h-80 rounded-2xl border border-slate-800 animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((post) => (
              <Link
                key={post.id}
                to={`/blog/${post.slug}`}
                className="bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 rounded-2xl overflow-hidden transition-all group flex flex-col justify-between"
              >
                <div className="relative h-48 overflow-hidden bg-slate-950">
                  <img
                    src={post.cover_image}
                    alt={post.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-3 left-3 bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>

                <div className="p-6 space-y-3 flex-1 flex flex-col justify-between">
                  <div className="space-y-2">
                    <h3 className="font-serif text-lg font-bold text-white group-hover:text-amber-300 transition-colors leading-snug">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {post.excerpt}
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400 font-mono">
                    <span className="flex items-center gap-1"><User className="w-3 h-3 text-amber-400" /> {post.author}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3 text-amber-400" /> {post.read_time}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
