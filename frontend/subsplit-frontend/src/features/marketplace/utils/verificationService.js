/**
 * Verification Service — Create Listing Wizard
 * ----------------------------------------------
 * simulateVerification is intentionally isolated behind this single function.
 * When the real AI verification backend is available, replace the body of
 * simulateVerification with a real API call — no other file needs to change.
 *
 * TODO: Wire to real AI verification API when available.
 *
 * State values: 'idle' | 'uploading' | 'analyzing' | 'verified' | 'failed'
 */

/**
 * Simulates an upload → AI analysis → verified flow with realistic delays.
 * Calls onStateChange(state) at each transition.
 *
 * @param {function} onStateChange - Callback receiving the new state string
 * @returns {Promise<void>}
 *
 * TODO: Replace this entire function body with a real API call, e.g.:
 *   const formData = new FormData();
 *   formData.append('file', file);
 *   onStateChange('uploading');
 *   const response = await api.post('/verification/upload', formData);
 *   onStateChange(response.data.status === 'VERIFIED' ? 'verified' : 'failed');
 */
export async function simulateVerification(onStateChange) {
  onStateChange('uploading');
  await delay(1200);
  onStateChange('analyzing');
  await delay(1600);
  onStateChange('verified');
}

/** @param {number} ms */
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
