export interface MediaItem {
  id?: number;
  name: string;
  url: string;
  size?: number;
  created_at?: string;
  category?: string;
  mimeType?: string;
}

export const mediaService = {
  async getAllMedia(): Promise<MediaItem[]> {
    try {
      const res = await fetch('/api/upload');
      if (!res.ok) throw new Error('Failed to fetch media files');
      return res.json();
    } catch (err) {
      console.error('Error fetching media:', err);
      return [];
    }
  },

  async uploadImage(file: File): Promise<{ url: string; name: string }> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const base64 = (reader.result as string).split(',')[1];
          const res = await fetch('/api/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fileName: file.name,
              fileBase64: base64,
              contentType: file.type || 'image/jpeg',
            }),
          });

          if (!res.ok) throw new Error('Failed to upload image');
          const data = await res.json();
          resolve(data);
        } catch (err) {
          reject(err);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  },

  async deleteMedia(nameOrUrl: string): Promise<void> {
    const res = await fetch(`/api/upload?name=${encodeURIComponent(nameOrUrl)}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete media file');
  },
};
