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
  "Obsessed with this 😍 easily one of my best online orders this year!",
  "Arrived earlier than expected and the quality is 🔥 no complaints at all.",
  "Was a bit skeptical but wow, exceeded expectations 👏 will be ordering again.",
  "Packaging was so nice I almost didn't want to open it 😅 product's even better.",
  "Quality bahut acchi hai, bilkul photos jaisa hi laga 😍 Packaging bhi kaafi careful thi.",
  "Delivery time pe ho gayi aur product use karke laga paisa vasool hai 👍",
  "Pehle thoda doubt tha online order karne mein, par yeh quality dekh ke sab clear ho gaya.",
  "Roz use karti hoon, ek dum sturdy hai aur dekhne mein bhi premium lagta hai ✨",
  "Gift ke liye liya tha par ab khud ke liye bhi order kar diya — itna acha nikla 😄",
  "Thoda expensive laga pehle, par jab hath mein aaya toh samajh aaya kyun 💯",
  "Bilkul mast quality hai bhai, dosto ko bhi recommend kar diya 🙌",
  "Ekdum sahi laga, expect se better nikla — phir se order karunga 🔥",
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

/** The number of individual review cards actually rendered (with "Show more"
 * revealing them progressively) — around 20, independent of the displayed total. */
function getRenderedReviewCount(): number {
  return 18;
}

/** The displayed review total (rating stars, "N reviews", JSON-LD) — seeded per
 * product so it looks organically randomized, but always above 200. */
export function getReviewCount(product: Product): number {
  return 210 + seededIndex(product.handle, 900, 440); // 210-649
}

/** Star-level weights that sum to 1, skewed by the product's average rating,
 * with a little seeded jitter per product so distributions aren't identical. */
function getRatingWeights(product: Product): Record<1 | 2 | 3 | 4 | 5, number> {
  const avg = product.rating;
  const base: Record<1 | 2 | 3 | 4 | 5, number> =
    avg >= 4.7
      ? { 5: 0.78, 4: 0.15, 3: 0.04, 2: 0.02, 1: 0.01 }
      : avg >= 4.3
        ? { 5: 0.64, 4: 0.23, 3: 0.07, 2: 0.04, 1: 0.02 }
        : avg >= 4.0
          ? { 5: 0.53, 4: 0.28, 3: 0.11, 2: 0.05, 1: 0.03 }
          : { 5: 0.42, 4: 0.3, 3: 0.16, 2: 0.07, 1: 0.05 };

  const jitter = (seededIndex(product.handle, 950, 7) - 3) / 100; // ±0.03
  const weights = {
    5: Math.max(0.01, base[5] + jitter),
    4: Math.max(0.01, base[4] - jitter / 2),
    3: base[3],
    2: base[2],
    1: base[1],
  };
  const sum = weights[1] + weights[2] + weights[3] + weights[4] + weights[5];
  return {
    1: weights[1] / sum,
    2: weights[2] / sum,
    3: weights[3] / sum,
    4: weights[4] / sum,
    5: weights[5] / sum,
  };
}

export function getReviewsForProduct(product: Product): Review[] {
  const count = getRenderedReviewCount();
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
  const total = getReviewCount(product);
  const weights = getRatingWeights(product);

  const counts: RatingBreakdown["counts"] = {
    1: Math.round(weights[1] * total),
    2: Math.round(weights[2] * total),
    3: Math.round(weights[3] * total),
    4: Math.round(weights[4] * total),
    5: 0,
  };
  // Assign the 5-star bucket the remainder so counts always sum exactly to total.
  counts[5] = total - (counts[1] + counts[2] + counts[3] + counts[4]);

  return {
    average: product.rating,
    total,
    counts,
  };
}
