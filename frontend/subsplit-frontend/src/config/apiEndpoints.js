export const API_ENDPOINTS = {
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  GROUPS: {
    BASE: '/groups',
    BY_ID: (id) => `/groups/${id}`,
    MEMBERS: (id) => `/groups/${id}/members`,
    MEMBER_BY_ID: (id, memberId) => `/groups/${id}/members/${memberId}`,
  },
  EXPENSES: {
    BASE: '/expenses',
    BY_ID: (id) => `/expenses/${id}`,
  },
  SETTLEMENTS: {
    BASE: '/settlements',
  },
  USERS: {
    BASE: '/users',
  },
};

export default API_ENDPOINTS;
