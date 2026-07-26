import { Product, RatingBreakdown, Review } from "@/types";

const REVIEWER_NAMES = [
  "Ananya Rao", "Kabir Mehta", "Priya Nair", "Arjun Sharma", "Sana Iqbal",
  "Rohan Kapoor", "Meera Pillai", "Vikram Singh", "Diya Kulkarni", "Aditya Verma",
  "Neha Joshi", "Karan Malhotra", "Ishita Bose", "Rahul Desai", "Tanvi Shah",
  "Aman Gupta", "Riya Chatterjee", "Siddharth Rao", "Pooja Menon", "Yash Trivedi",
  "Anjali Reddy", "Nikhil Bhatt", "Sneha Iyer", "Varun Chopra", "Kritika Sen",
];

const REVIEWER_CITIES = [
  "Bengaluru", "Mumbai", "Delhi", "Pune", "Hyderabad", "Chennai", "Kolkata",
  "Ahmedabad", "Jaipur", "Kochi", "Chandigarh", "Indore",
];

const COMMENT_TEMPLATES = [
  "Better quality than I expected for the price — this has quickly become a daily-use item in our home.",
  "Took a chance based on the photos and it did not disappoint. Packaging was thoughtful too.",
  "Exactly as described. Arrived faster than the estimate and looks even better in person.",
  "Bought this as a gift and ended up ordering a second one for myself.",
  "Solid, well-made, and doesn't feel like it'll fall apart in a few months like similar things I've bought before.",
  "The attention to detail is obvious — small things like the packaging and finish stand out.",
  "Does exactly what it promises. Would recommend to anyone on the fence.",
  "A little pricier than alternatives but the difference in quality is noticeable immediately.",
  "This is my third order from ZEEVARA and the consistency in quality keeps me coming back.",
  "Simple, well-designed, and genuinely useful — not just decorative.",
];

const TITLE_TEMPLATES = [
  "Worth every rupee",
  "Exceeded expectations",
  "Exactly what I needed",
  "Great addition to our home",
  "Would buy again",
  "Better than the photos",
  "Solid quality",
  "Highly recommend",
];

function seededIndex(seed: string, salt: number, mod: number): number {
  let hash = 0;
  const str = `${seed}-${salt}`;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000000007;
  }
  return Math.abs(hash) % mod;
}

/** The actual number of reviews getReviewsForProduct() will generate — use this
 * anywhere a review count is displayed so it never mismatches what's rendered. */
export function getReviewCount(product: Product): number {
  return Math.min(Math.max(Math.round(product.reviewCount / 20), 3), 8);
}

export function getReviewsForProduct(product: Product): Review[] {
  const count = getReviewCount(product);
  const reviews: Review[] = [];

  for (let i = 0; i < count; i++) {
    const nameIdx = seededIndex(product.handle, i, REVIEWER_NAMES.length);
    const cityIdx = seededIndex(product.handle, i + 100, REVIEWER_CITIES.length);
    const commentIdx = seededIndex(product.handle, i + 200, COMMENT_TEMPLATES.length);
    const titleIdx = seededIndex(product.handle, i + 300, TITLE_TEMPLATES.length);
    const ratingJitter = seededIndex(product.handle, i + 400, 3) - 1;
    const rating = Math.min(5, Math.max(3, Math.round(product.rating) + ratingJitter)) as
      | 1
      | 2
      | 3
      | 4
      | 5;
    const daysAgo = 5 + i * 23 + seededIndex(product.handle, i + 500, 10);
    const createdAt = new Date(Date.UTC(2026, 6, 26));
    createdAt.setUTCDate(createdAt.getUTCDate() - daysAgo);

    reviews.push({
      id: `review-${product.handle}-${i + 1}`,
      productId: product.id,
      author: REVIEWER_NAMES[nameIdx],
      location: REVIEWER_CITIES[cityIdx],
      rating,
      title: TITLE_TEMPLATES[titleIdx],
      body: COMMENT_TEMPLATES[commentIdx],
      createdAt: createdAt.toISOString(),
      verified: seededIndex(product.handle, i + 600, 10) > 1,
      helpfulCount: seededIndex(product.handle, i + 700, 40),
    });
  }

  return reviews.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export function getRatingBreakdown(product: Product): RatingBreakdown {
  const reviews = getReviewsForProduct(product);
  const counts: RatingBreakdown["counts"] = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const review of reviews) {
    counts[review.rating] += 1;
  }
  return {
    average: product.rating,
    total: getReviewCount(product),
    counts,
  };
}
