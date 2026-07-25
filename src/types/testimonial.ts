export interface Testimonial {
  id: string;
  author: string;
  location: string;
  rating: 1 | 2 | 3 | 4 | 5;
  quote: string;
}

export interface InstagramPost {
  id: string;
  image: string;
  altText: string;
  likeCount: number;
  href: string;
}
