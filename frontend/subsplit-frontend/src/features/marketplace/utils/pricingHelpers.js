/**
 * Pricing Helpers — Create Listing Wizard
 * ----------------------------------------
 * getRecommendedPrice is intentionally isolated behind this single function.
 * When a real pricing engine / backend endpoint is available, replace the
 * body of getRecommendedPrice with a real API call or Redux selector lookup —
 * no other file needs to change.
 *
 * TODO: Wire to real pricing API when available.
 */

/**
 * Returns the recommended seat price for a catalog product.
 * Currently returns the product's static recommendedPrice field from the mock catalog.
 *
 * @param {object} product - Catalog product object (from MOCK_CATALOG)
 * @returns {number} Recommended price in ₹
 */
export function getRecommendedPrice(product) {
  // TODO: Replace with real pricing engine call, e.g.:
  // const response = await api.get(`/pricing/recommend?productId=${product.id}`);
  // return response.data.recommendedPrice;
  return product?.recommendedPrice ?? 149;
}

/**
 * Returns the platform fee percentage (currently 5%).
 * Isolated here so it's a one-line change if the fee structure changes.
 */
export const PLATFORM_FEE_PERCENT = 5;

/**
 * Computes fee and earnings from a given price.
 * @param {number} price - Seat price in ₹
 * @returns {{ fee: number, earnings: number }}
 */
export function computeFeeBreakdown(price) {
  const fee = Math.round((price * PLATFORM_FEE_PERCENT) / 100 * 100) / 100;
  const earnings = Math.round((price - fee) * 100) / 100;
  return { fee, earnings };
}

/**
 * Determines price competitiveness relative to the recommended price.
 * Returns one of: 'excellent' | 'good' | 'high'
 * and a 0–100 marker position for the gradient bar.
 *
 * @param {number} price - Entered price
 * @param {number} recommended - Recommended price
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
