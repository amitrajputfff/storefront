import { CategoryDef, ProductCategory } from "@/types";
import { categoryImages } from "./images";

export const categories: CategoryDef[] = [
  {
    handle: "home-decor",
    name: "Home Decor",
    description: "Considered objects for rooms that feel like you.",
    image: categoryImages["home-decor"][0],
  },
  {
    handle: "kitchen",
    name: "Kitchen",
    description: "Tools designed to be seen, not hidden away.",
    image: categoryImages.kitchen[0],
  },
  {
    handle: "office",
    name: "Office",
    description: "A calmer way to get things done.",
    image: categoryImages.office[0],
  },
  {
    handle: "travel",
    name: "Travel",
    description: "Considered companions for wherever you're headed.",
    image: categoryImages.travel[0],
  },
  {
    handle: "accessories",
    name: "Accessories",
    description: "The small details that finish a look.",
    image: categoryImages.accessories[0],
  },
  {
    handle: "fitness",
    name: "Fitness",
    description: "Equipment built for a routine that sticks.",
    image: categoryImages.fitness[0],
  },
  {
    handle: "lifestyle",
    name: "Lifestyle",
    description: "Everyday rituals, made a little more considered.",
    image: categoryImages.lifestyle[0],
  },
  {
    handle: "pets",
    name: "Pets",
    description: "Thoughtful gear for the ones who greet you at the door.",
    image: categoryImages.pets[0],
  },
  {
    handle: "beauty",
    name: "Beauty",
    description: "Quiet luxury for a daily routine.",
    image: categoryImages.beauty[0],
  },
  {
    handle: "electronics",
    name: "Electronics",
    description: "Considered tech for a connected everyday.",
    image: categoryImages.electronics[0],
  },
];

function titleCase(handle: string): string {
  return handle
    .split(/[-_]+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Falls back to a generated definition for any category tag outside the
 * curated list above, so a brand-new Shopify tag still gets a readable nav
 * label and a working collection page without a code change.
 */
export function getCategoryByHandle(handle: string): CategoryDef {
  const known = categories.find((c) => c.handle === handle);
  if (known) return known;

  const name = titleCase(handle);
  return {
    handle,
    name,
    description: `Shop our ${name} picks.`,
    image: categoryImages.lifestyle[0],
  };
}

export const categoryHandles = categories.map((c) => c.handle) as ProductCategory[];
