/**
 * Utility functions for validating and parsing JWT tokens.
 */

function decodeBase64Url(str) {
  try {
    let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return jsonPayload;
  } catch (e) {
    return null;
  }
}

/**
 * Checks if a JWT token is valid (proper structure, valid payload, not expired).
 * @param {string} token
 * @returns {boolean}
 */
export function isTokenValid(token) {
  if (!token || typeof token !== 'string') return false;
  
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  try {
    const payloadJson = decodeBase64Url(parts[1]);
    if (!payloadJson) return false;

    const payload = JSON.parse(payloadJson);
    if (!payload || typeof payload !== 'object') return false;

    // Check expiration claim (exp in seconds)
    if (payload.exp && typeof payload.exp === 'number') {
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      if (payload.exp <= currentTimeInSeconds) {
        return false;
      }
    }

    return true;
  } catch (e) {
    return false;
  }
}

export default isTokenValid;
