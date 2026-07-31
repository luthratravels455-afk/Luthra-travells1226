import { BlogPost } from '../types';
import { apiFetch } from './apiClient';
import supabase from '../lib/supabase';

export const blogService = {
  async getAllBlogs(): Promise<BlogPost[]> {
    return apiFetch<BlogPost[]>(
      '/api/content?type=blogs',
      { method: 'GET' },
      async () => {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .order('publish_date', { ascending: false });
        if (error) throw error;
        return (data || []) as BlogPost[];
      }
    );
  },

  async getBlogBySlug(slug: string): Promise<BlogPost> {
    return apiFetch<BlogPost>(
      `/api/content?type=blogs&slug=${encodeURIComponent(slug)}`,
      { method: 'GET' },
      async () => {
        const { data, error } = await supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .single();
        if (error) throw error;
        return data as BlogPost;
      }
    );
  },

  async createBlog(blog: Partial<BlogPost>): Promise<BlogPost> {
    const payload = { ...blog };
    if (!payload.slug && payload.title) {
      payload.slug = payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    return apiFetch<BlogPost>(
      '/api/content?type=blogs',
      {
        method: 'POST',
        body: JSON.stringify({ type: 'blogs', ...payload }),
      },
      async () => {
        const { data, error } = await supabase
          .from('blogs')
          .insert([payload])
          .select()
          .single();
        if (error) throw error;
        return data as BlogPost;
      }
    );
  },

  async updateBlog(id: number, updates: Partial<BlogPost>): Promise<BlogPost> {
    return apiFetch<BlogPost>(
      '/api/content?type=blogs',
      {
        method: 'PUT',
        body: JSON.stringify({ id, type: 'blogs', ...updates }),
      },
      async () => {
        const { data, error } = await supabase
          .from('blogs')
          .update(updates)
          .eq('id', id)
          .select()
          .single();
        if (error) throw error;
        return data as BlogPost;
      }
    );
  },

  async deleteBlog(id: number): Promise<void> {
    return apiFetch<void>(
      `/api/content?type=blogs&id=${id}`,
      {
        method: 'DELETE',
        body: JSON.stringify({ id, type: 'blogs' }),
      },
      async () => {
        const { error } = await supabase.from('blogs').delete().eq('id', id);
        if (error) throw error;
      }
    );
  },
};
