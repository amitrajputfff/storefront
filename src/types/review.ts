export interface Review {
  id: string;
  productId: string;
  author: string;
  location?: string;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  createdAt: string;
  verified: boolean;
  helpfulCount: number;
}

export interface RatingBreakdown {
  average: number;
  total: number;
  counts: Record<1 | 2 | 3 | 4 | 5, number>;
}
