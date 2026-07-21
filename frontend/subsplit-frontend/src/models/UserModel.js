/**
 * @typedef {Object} User
 * @property {string|number} id - Unique identifier of the user
 * @property {string} fullName - Full name of the user
 * @property {string} email - Email address
 * @property {string} [phone] - Optional phone number
 * @property {string} [role] - User role (e.g. USER, ADMIN)
 * @property {string} [profileImage] - URL or path to profile avatar image
 * @property {boolean} [active] - Whether user account is active
 */

/**
 * Creates a normalized User object.
 * @param {Partial<User>} data
 * @returns {User}
 */
export const createUserModel = (data = {}) => ({
  id: data.id || '',
  fullName: data.fullName || '',
  email: data.email || '',
  phone: data.phone || '',
  role: data.role || 'USER',
  profileImage: data.profileImage || '',
  active: data.active ?? true,
});

export default createUserModel;
