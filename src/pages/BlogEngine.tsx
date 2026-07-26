import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Clock, User, Calendar, Share2, ArrowLeft, Bookmark } from 'lucide-react';
import { blogService } from '../services/blogService';
import { BlogPost } from '../types';
import { SEOHead } from '../components/seo/SEOHead';
import { SchemaMarkup } from '../components/seo/SchemaMarkup';
import { Container } from '../components/ui/Container';
import { Breadcrumb } from '../components/ui/Breadcrumb';
import { BookingForm } from '../components/BookingForm';

export const defaultBlogCategories = [
  'Airport Travel Guides',
  'Chandigarh Taxi Guides',
  'Punjab Travel Guides',
  'Himachal Travel Guides',
  'Delhi Airport Taxi',
  'Taxi Booking Tips',
  'Corporate Travel',
  'Family Travel',
  'Tourist Destinations',
  'Weekend Getaways',
  'Travel Safety Tips',
  'Luthra Travels News',
];

export const BlogEngine: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      if (!slug) return;
      try {
        const data = await blogService.getBlogBySlug(slug);
        setPost(data);
      } catch (err) {
        console.error('Error loading blog:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-white flex items-center justify-center pt-32">
        <div className="w-10 h-10 border-2 border-[#C9A227] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) return null;

  return (
    <div className="bg-zinc-950 text-white min-h-screen pt-32 pb-24">
      <SEOHead
        title={post.title}
        description={post.excerpt}
        ogImage={post.cover_image}
        ogType="article"
      />
      <SchemaMarkup type="Organization" />

      <Container size="7xl" className="space-y-10">
        <Breadcrumb items={[{ label: 'Blog', path: '/blog' }, { label: post.title }]} />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8 space-y-6">
            <span className="text-xs font-mono text-[#C9A227] uppercase tracking-widest bg-[#C9A227]/10 border border-[#C9A227]/30 px-3 py-1 rounded-full">
              {post.category}
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
              {post.title}
            </h1>

            <div className="flex flex-wrap gap-6 text-xs text-zinc-400 font-mono border-b border-zinc-800 pb-4">
              <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-[#C9A227]" /> By {post.author}</span>
              <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-[#C9A227]" /> {post.publish_date}</span>
              <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-[#C9A227]" /> {post.read_time}</span>
            </div>

            <div className="rounded-3xl overflow-hidden border border-zinc-800 h-[380px]">
              <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
            </div>

            {/* Table of Contents */}
            <div className="bg-zinc-900/80 p-5 rounded-2xl border border-zinc-800 space-y-2">
              <h3 className="font-serif font-bold text-white text-sm flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-[#C9A227]" /> Table of Contents
              </h3>
              <ul className="text-xs text-zinc-300 space-y-1 list-disc pl-5">
                <li>Overview &amp; Executive Summary</li>
                <li>Key Route Considerations &amp; Highway Permits</li>
                <li>Recommended Chauffeur Vehicle Choice</li>
                <li>Frequently Asked Traveler Questions</li>
              </ul>
            </div>

            <div className="prose prose-invert max-w-none text-zinc-300 text-sm sm:text-base leading-relaxed space-y-4">
              <p className="text-base text-zinc-200 font-medium italic border-l-2 border-[#C9A227] pl-4">
                {post.excerpt}
              </p>
              <div className="whitespace-pre-line leading-relaxed">
                {post.content}
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8">
            <BookingForm initialTripType="OUTSTATION" />
          </div>
        </div>
      </Container>
    </div>
  );
};
