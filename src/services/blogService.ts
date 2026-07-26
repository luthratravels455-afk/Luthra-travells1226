import { BlogPost } from '../types';

export const blogService = {
  async getAllBlogs(): Promise<BlogPost[]> {
    const res = await fetch('/api/content?type=blogs');
    if (!res.ok) throw new Error('Failed to fetch blogs');
    return res.json();
  },

  async getBlogBySlug(slug: string): Promise<BlogPost> {
    const res = await fetch(`/api/content?type=blogs&slug=${encodeURIComponent(slug)}`);
    if (!res.ok) throw new Error('Failed to fetch blog post');
    return res.json();
  },

  async createBlog(blog: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetch('/api/content?type=blogs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'blogs', ...blog })
    });
    if (!res.ok) throw new Error('Failed to create blog');
    return res.json();
  },

  async updateBlog(id: number, updates: Partial<BlogPost>): Promise<BlogPost> {
    const res = await fetch('/api/content?type=blogs', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, type: 'blogs', ...updates })
    });
    if (!res.ok) throw new Error('Failed to update blog');
    return res.json();
  },

  async deleteBlog(id: number): Promise<void> {
    const res = await fetch(`/api/content?type=blogs&id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete blog');
  }
};
