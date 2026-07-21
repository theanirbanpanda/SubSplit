/**
 * @typedef {Object} Settlement
 * @property {string|number} id - Unique identifier of the settlement
 * @property {string} fromUser - User paying the settlement
 * @property {string} toUser - User receiving the settlement
 * @property {number|string} amount - Settlement amount
 * @property {'Pending' | 'Completed'} status - Status of settlement
 * @property {string} date - Settlement date
 */

/**
 * Creates a normalized Settlement object.
 * @param {Partial<Settlement>} data
 * @returns {Settlement}
 */
export const createSettlementModel = (data = {}) => ({
  id: data.id || '',
  fromUser: data.fromUser || '',
  toUser: data.toUser || '',
  amount: data.amount || 0,
  status: data.status || 'Pending',
  date: data.date || new Date().toISOString(),
});

export default createSettlementModel;
