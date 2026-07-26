import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { blogService } from '../services/blogService';
import { BlogPost } from '../types';
import { ArrowLeft, Clock, User, Calendar } from 'lucide-react';

export const BlogPostView: React.FC = () => {
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
        console.error('Error fetching blog post:', err);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center pt-32">
        <div className="w-10 h-10 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center pt-32 gap-4">
        <h2 className="text-2xl font-serif font-bold">Article Not Found</h2>
        <Link to="/blog" className="text-amber-400 underline">Back to Journal</Link>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 text-white min-h-screen pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-8 space-y-8">
        
        <Link to="/blog" className="inline-flex items-center gap-2 text-slate-400 hover:text-amber-400 transition-colors text-xs uppercase font-mono tracking-wider">
          <ArrowLeft className="w-4 h-4" /> Back to All Articles
        </Link>

        <div className="space-y-4">
          <span className="text-xs font-mono text-amber-400 uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
            {post.category}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap gap-6 text-xs text-slate-400 font-mono pt-2 border-b border-slate-800 pb-4">
            <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-amber-400" /> By {post.author}</span>
            <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-amber-400" /> {post.publish_date}</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-amber-400" /> {post.read_time}</span>
          </div>
        </div>

        <div className="rounded-3xl overflow-hidden border border-slate-800 h-[400px]">
          <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
        </div>

        <div className="prose prose-invert max-w-none text-slate-300 text-base leading-relaxed space-y-6 pt-4">
          <p className="text-lg text-slate-200 font-medium italic border-l-2 border-amber-400 pl-4">
            {post.excerpt}
          </p>
          <div className="whitespace-pre-line text-slate-300 leading-relaxed">
            {post.content}
          </div>
        </div>

      </div>
    </div>
  );
};
