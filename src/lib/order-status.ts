const STEPS = ["Order Placed", "Processing", "Shipped", "Delivered"] as const;

/** Maps Shopify's displayFulfillmentStatus to how far along our 4-step timeline is. */
export function getOrderStepIndex(fulfillmentStatus: string): number {
  switch (fulfillmentStatus) {
    case "FULFILLED":
      return 3;
    case "IN_TRANSIT":
    case "OUT_FOR_DELIVERY":
    case "PARTIALLY_FULFILLED":
      return 2;
    case "IN_PROGRESS":
    case "SCHEDULED":
      return 1;
    default:
      return 0;
  }
}

export function getOrderSteps(): readonly string[] {
  return STEPS;
}

export function formatFulfillmentStatus(status: string): string {
  return status
    .toLowerCase()
    .split("_")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
}
