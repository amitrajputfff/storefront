const FLASH_SALE_WINDOW_HOURS = 6;

/**
 * Purely decorative, not tied to a real sale system — rounds up to the next fixed-size
 * window so a page reload never makes the countdown jump around.
 */
export function getFlashSaleEndsAt(now: Date = new Date()): Date {
  const windowMs = FLASH_SALE_WINDOW_HOURS * 60 * 60 * 1000;
  const epoch = now.getTime();
  return new Date(Math.ceil((epoch + 1) / windowMs) * windowMs);
}
