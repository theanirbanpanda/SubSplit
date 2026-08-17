/**
 * Pricing Helpers — Create Listing Wizard
 * ----------------------------------------
 * getRecommendedPrice is intentionally isolated behind this single function.
 * When a real pricing engine / backend endpoint is available, replace the
 * body of getRecommendedPrice with a real API call or Redux selector lookup.
 */

/**
 * Returns the recommended seat price for a catalog product.
 * Recommended price = currentPrice × 1.05 (5% above the official current price).
 *
 * @param {object} product - Catalog product object (from MOCK_CATALOG)
 * @returns {number} Recommended price in ₹
 */
export function getRecommendedPrice(product) {
  const currentPrice = product?.currentPrice ?? product?.recommendedPrice ?? 149;
  return Math.round(currentPrice * 1.05);
}

/**
 * Returns the official current price for a catalog product (from master catalog).
 * This is the anchor for the ±15% listing price validation.
 *
 * @param {object} product - Catalog product object
 * @returns {number} Current price in ₹
 */
export function getCurrentPrice(product) {
  return product?.currentPrice ?? product?.recommendedPrice ?? 149;
}

/**
 * Returns the allowed price range for listing (±15% from currentPrice).
 * @param {object} product - Catalog product object
 * @returns {{ min: number, max: number, current: number }}
 */
export function getPriceRange(product) {
  const current = getCurrentPrice(product);
  const min = Math.floor(current * 0.85);
  const max = Math.ceil(current * 1.15);
  return { min, max, current };
}

/**
 * Validates a listing price against the ±15% constraint.
 * @param {number} price - Entered price
 * @param {object} product - Catalog product
 * @returns {{ valid: boolean, message: string | null }}
 */
export function validatePrice(price, product) {
  if (!price || price <= 0) return { valid: false, message: null };
  const { min, max, current } = getPriceRange(product);
  if (price < min) {
    return {
      valid: false,
      message: `Price is too low. Minimum allowed is ₹${min} (−15% of official price ₹${current}).`,
    };
  }
  if (price > max) {
    return {
      valid: false,
      message: `Price is too high. Maximum allowed is ₹${max} (+15% of official price ₹${current}).`,
    };
  }
  return { valid: true, message: null };
}

/**
 * Computes earnings from a given price.
 * Platform fee has been removed — host keeps 100% of the seat price.
 * @param {number} price - Seat price in ₹
 * @returns {{ fee: number, earnings: number }}
 */
export function computeFeeBreakdown(price) {
  // Platform fee removed — host keeps 100% of the seat price
  const fee = 0;
  const earnings = price;
  return { fee, earnings };
}

/**
 * Determines price competitiveness relative to the recommended price.
 * Returns one of: 'excellent' | 'good' | 'high'
 * and a 0–100 marker position for the gradient bar.
 *
 * @param {number} price - Entered price
 * @param {number} recommended - Recommended price (currentPrice × 1.05)
 * @returns {{ label: string, level: 'excellent'|'good'|'high', markerPct: number }}
 */
export function getPriceCompetitiveness(price, recommended) {
  if (!price || !recommended) return { label: 'Enter a price', level: 'neutral', markerPct: 50 };
  const ratio = price / recommended;
  // markerPct: 0 = far left (excellent/cheap), 100 = far right (high/expensive)
  const markerPct = Math.min(100, Math.max(0, Math.round((ratio - 0.5) * 100)));
  if (ratio <= 0.9) return { label: 'Excellent', level: 'excellent', markerPct };
  if (ratio <= 1.1) return { label: 'Good', level: 'good', markerPct };
  return { label: 'High', level: 'high', markerPct };
}
