/**
 * @typedef {Object} Group
 * @property {string|number} id - Unique identifier of the group
 * @property {string} name - Group name
 * @property {string} [description] - Group description
 * @property {number} [membersCount] - Number of members in the group
 * @property {string} [balance] - Current balance display status
 * @property {string} [color] - Accent color theme for group card
 * @property {Array<Object>} [members] - List of member objects
 */

/**
 * Creates a normalized Group object.
 * @param {Partial<Group>} data
 * @returns {Group}
 */
export const createGroupModel = (data = {}) => ({
  id: data.id || '',
  name: data.name || '',
  description: data.description || '',
  membersCount: data.membersCount || 0,
  balance: data.balance || '$0.00',
  color: data.color || '#2563eb',
  members: data.members || [],
});

export default createGroupModel;
