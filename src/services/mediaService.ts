import supabase from '../lib/supabase';

export interface MediaItem {
  id?: string | number;
  name: string;
  url: string;
  size?: number;
  category?: string;
  created_at?: string;
  mimeType?: string;
}

export const mediaService = {
  // Compress image client-side and convert to WebP
  async compressImage(file: File, maxWidth = 1920, maxHeight = 1080, quality = 0.85): Promise<{ blob: Blob; fileName: string; contentType: string }> {
    // If SVG or GIF, preserve raw file
    if (file.type === 'image/svg+xml' || file.type === 'image/gif') {
      return { blob: file, fileName: file.name, contentType: file.type };
    }

    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;

          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
          }

          // Try converting to WebP, fallback to JPEG
          canvas.toBlob(
            (blob) => {
              if (blob) {
                const baseName = file.name.replace(/\.[^/.]+$/, '');
                resolve({
                  blob,
                  fileName: `${baseName}.webp`,
                  contentType: 'image/webp',
                });
              } else {
                resolve({ blob: file, fileName: file.name, contentType: file.type });
              }
            },
            'image/webp',
            quality
          );
        };
        img.src = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    });
  },

  // Upload image to Supabase Storage & Database Index via API or Direct Supabase Storage
  async uploadImage(file: File, category = 'General'): Promise<{ url: string; name: string }> {
    const { blob, fileName, contentType } = await this.compressImage(file);
    
    // Convert blob to base64 for API endpoint transport
    const base64 = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });

    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fileName: `${category.toLowerCase().replace(/[^a-z0-9]/g, '_')}_${fileName}`,
        fileBase64: base64,
        contentType,
        category,
      }),
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.error || 'Failed to upload image');
    }

    const data = await res.json();
    return { url: data.url, name: data.name };
  },

  // Fetch all media items
  async getMediaItems(): Promise<MediaItem[]> {
    const res = await fetch('/api/upload');
    if (!res.ok) throw new Error('Failed to fetch media library');
    return res.json();
  },

  // Delete media item
  async deleteMediaItem(name: string): Promise<void> {
    const res = await fetch(`/api/upload?name=${encodeURIComponent(name)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete file');
  },

  // Bulk delete media items
  async bulkDeleteMediaItems(names: string[]): Promise<void> {
    await Promise.all(names.map((name) => this.deleteMediaItem(name)));
  },
};
