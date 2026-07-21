/**
 * @typedef {Object} Expense
 * @property {string|number} id - Unique identifier of the expense
 * @property {string} description - Description of the expense
 * @property {number|string} amount - Total amount of expense
 * @property {string} paidBy - Name or ID of user who paid
 * @property {string} groupName - Group associated with expense
 * @property {string} date - Date string of expense creation
 * @property {Array<Object>} [splits] - Breakdown of individual splits
 */

/**
 * Creates a normalized Expense object.
 * @param {Partial<Expense>} data
 * @returns {Expense}
 */
export const createExpenseModel = (data = {}) => ({
  id: data.id || '',
  description: data.description || '',
  amount: data.amount || 0,
  paidBy: data.paidBy || '',
  groupName: data.groupName || '',
  date: data.date || new Date().toISOString(),
  splits: data.splits || [],
});

export default createExpenseModel;
