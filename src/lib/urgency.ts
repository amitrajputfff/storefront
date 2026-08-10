const DEFAULT_FLASH_SALE_WINDOW_HOURS = 6;
const DEFAULT_PRICE_LOCK_WINDOW_MINUTES = 5;

/**
 * Purely decorative, not tied to a real sale system — rounds up to the next fixed-size
 * window so a page reload never makes the countdown jump around.
 */
export function getFlashSaleEndsAt(now: Date = new Date(), windowHours: number = DEFAULT_FLASH_SALE_WINDOW_HOURS): Date {
  const windowMs = windowHours * 60 * 60 * 1000;
  const epoch = now.getTime();
  return new Date(Math.ceil((epoch + 1) / windowMs) * windowMs);
}

/**
 * Checkout price-lock countdown — starts fresh from the moment it's requested (usually
 * page load), unlike the flash sale window which rounds to a shared clock boundary.
 */
export function getPriceLockEndsAt(
  now: Date = new Date(),
  minutes: number = DEFAULT_PRICE_LOCK_WINDOW_MINUTES,
): Date {
  return new Date(now.getTime() + minutes * 60 * 1000);
}
