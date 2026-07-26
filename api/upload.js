import supabase from './_lib/db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    // GET: List files in media bucket
    if (req.method === 'GET') {
      const { data, error } = await supabase.storage
        .from('media')
        .list('', { limit: 100, offset: 0, sortBy: { column: 'created_at', order: 'desc' } });

      if (error) {
        // Fallback: Return gallery table items if bucket list fails
        const { data: galleryData } = await supabase.from('gallery').select('*');
        return res.status(200).json((galleryData || []).map(g => ({
          name: g.title,
          url: g.image_url,
          id: g.id,
          category: g.category || 'General',
          created_at: g.created_at || new Date().toISOString()
        })));
      }

      const files = (data || []).map(f => {
        const { data: urlData } = supabase.storage.from('media').getPublicUrl(f.name);
        return {
          name: f.name,
          url: urlData.publicUrl,
          size: f.metadata?.size || 0,
          created_at: f.created_at || new Date().toISOString(),
          mimeType: f.metadata?.mimetype || 'image/jpeg'
        };
      });

      return res.status(200).json(files);
    }

    // POST: Upload file
    if (req.method === 'POST') {
      const { fileName, fileBase64, contentType } = req.body || {};

      if (!fileBase64) {
        return res.status(400).json({ error: 'No file data provided' });
      }

      const buffer = Buffer.from(fileBase64, 'base64');
      const sanitizedName = (fileName || 'image.jpg').replace(/[^a-zA-Z0-9.-]/g, '_');
      const uniqueName = `media_${Date.now()}_${sanitizedName}`;

      const { error: uploadErr } = await supabase.storage
        .from('media')
        .upload(uniqueName, buffer, {
          contentType: contentType || 'image/jpeg',
          upsert: true
        });

      let publicUrl = '';
      if (uploadErr) {
        // Fallback data URL if storage upload failed
        publicUrl = `data:${contentType || 'image/jpeg'};base64,${fileBase64}`;
      } else {
        const { data: urlData } = supabase.storage.from('media').getPublicUrl(uniqueName);
        publicUrl = urlData.publicUrl;
      }

      // Also register in gallery table for backup index
      await supabase.from('gallery').insert([{
        title: sanitizedName,
        category: 'Media Library',
        image_url: publicUrl,
        created_at: new Date().toISOString()
      }]).select();

      return res.status(200).json({
        name: uniqueName,
        url: publicUrl,
        success: true
      });
    }

    // DELETE: Delete file from storage
    if (req.method === 'DELETE') {
      const name = req.query.name || req.body?.name;
      if (!name) return res.status(400).json({ error: 'Missing file name' });

      await supabase.storage.from('media').remove([name]);
      await supabase.from('gallery').delete().eq('image_url', name);

      return res.status(200).json({ success: true, name });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Upload API error:', err);
    res.status(500).json({ error: err.message });
  }
}
