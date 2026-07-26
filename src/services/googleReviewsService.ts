import { Testimonial } from '../types';

/**
 * Google Reviews Service Abstraction Layer
 * Ready for future Google Places API (Place Details / Reviews) integration.
 */
export interface GoogleReviewSummary {
  rating: number;
  totalReviews: string;
  badgeText: string;
  placeId?: string;
}

export const googleReviewsService = {
  /**
   * Fetches Google Places summary stats.
   * Currently returns CMS settings or fallback defaults.
   */
  async getSummaryStats(): Promise<GoogleReviewSummary> {
    try {
      const res = await fetch('/api/settings');
      if (res.ok) {
        const data = await res.json();
        return {
          rating: parseFloat(data.google_rating) || 4.9,
          totalReviews: data.google_review_count || '100+',
          badgeText: data.google_badge_text || 'Google Verified Reviews',
        };
      }
    } catch {
      // Fallback
    }
    return {
      rating: 4.9,
      totalReviews: '100+',
      badgeText: 'Google Verified Reviews',
    };
  },

  /**
   * Placeholder for future live Google Places API sync.
   * Can be hooked up to `https://maps.googleapis.com/maps/api/place/details/json` via serverless API route.
   */
  async syncLiveGoogleReviews(placeId: string): Promise<Testimonial[]> {
    console.log('[googleReviewsService] Abstract sync triggered for placeId:', placeId);
    return [];
  },
};
