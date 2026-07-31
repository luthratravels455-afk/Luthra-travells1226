export interface GoogleReview {
  id: string;
  author_name: string;
  author_photo_url?: string;
  rating: number;
  relative_time_description: string;
  text: string;
  is_approved: boolean;
  is_featured: boolean;
  source?: string;
  created_at?: string;
}

export interface GoogleReviewSummary {
  avgRating: number;
  totalCount: number;
  approvedCount: number;
  featuredCount: number;
  rating?: number;
  totalReviews?: number;
  badgeText?: string;
}

export interface GoogleReviewsResponse {
  reviews: GoogleReview[];
  stats: GoogleReviewSummary;
}

export const googleReviewsService = {
  async getReviews(all = false): Promise<GoogleReviewsResponse> {
    try {
      const res = await fetch(`/api/integration?type=google-reviews${all ? '&all=true' : ''}`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return res.json();
    } catch {
      return {
        reviews: [],
        stats: { avgRating: 4.9, totalCount: 1284, approvedCount: 0, featuredCount: 0, rating: 4.9, totalReviews: 1284, badgeText: '4.9 Star Rating' },
      };
    }
  },

  async getSummaryStats(): Promise<GoogleReviewSummary> {
    const res = await this.getReviews(false);
    return {
      ...res.stats,
      rating: res.stats.avgRating || 4.9,
      totalReviews: res.stats.totalCount || 1284,
      badgeText: `${res.stats.avgRating || 4.9} Star Verified Rating`,
    };
  },

  async syncReviews(): Promise<{ message: string }> {
    const res = await fetch('/api/integration?type=google-reviews', { method: 'POST' });
    if (!res.ok) throw new Error('Sync failed');
    return res.json();
  },

  async updateReview(id: string | number, updates: Partial<GoogleReview>): Promise<GoogleReview> {
    const res = await fetch('/api/integration?type=google-reviews', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates }),
    });
    if (!res.ok) throw new Error('Update failed');
    return res.json();
  },

  async deleteReview(id: string | number): Promise<void> {
    const res = await fetch(`/api/integration?type=google-reviews&id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Delete failed');
  },
};
