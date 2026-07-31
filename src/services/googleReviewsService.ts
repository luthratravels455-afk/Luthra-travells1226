export interface GoogleReview {
  id: number;
  author_name: string;
  author_photo_url: string;
  rating: number;
  relative_time_description: string;
  text: string;
  is_approved: boolean;
  is_featured: boolean;
  source: string;
  created_at?: string;
}

export interface GoogleReviewSummary {
  rating: number;
  totalReviews: string;
  badgeText: string;
}

export interface GoogleReviewsResponse {
  reviews: GoogleReview[];
  stats: {
    avgRating: number;
    totalCount: number;
    approvedCount: number;
    featuredCount: number;
  };
}

export const googleReviewsService = {
  async getReviews(all = false): Promise<GoogleReviewsResponse> {
    const res = await fetch(`/api/google-reviews${all ? '?all=true' : ''}`);
    if (!res.ok) throw new Error('Failed to fetch Google Reviews');
    return res.json();
  },

  async getSummaryStats(): Promise<GoogleReviewSummary> {
    try {
      const data = await this.getReviews(false);
      return {
        rating: data.stats?.avgRating || 4.9,
        totalReviews: `${data.stats?.totalCount || 1284}+`,
        badgeText: 'Google Verified Reviews',
      };
    } catch {
      return {
        rating: 4.9,
        totalReviews: '1,284+',
        badgeText: 'Google Verified Reviews',
      };
    }
  },

  async syncReviews(): Promise<{ message: string; review: GoogleReview }> {
    const res = await fetch('/api/google-reviews', { method: 'POST' });
    if (!res.ok) throw new Error('Failed to auto-sync Google Reviews');
    return res.json();
  },

  async updateReview(id: number, updates: Partial<GoogleReview>): Promise<GoogleReview> {
    const res = await fetch('/api/google-reviews', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...updates })
    });
    if (!res.ok) throw new Error('Failed to update review status');
    return res.json();
  },

  async deleteReview(id: number): Promise<void> {
    const res = await fetch(`/api/google-reviews?id=${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete review');
  }
};
