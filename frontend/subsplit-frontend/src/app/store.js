import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';
import marketplaceReducer from '../features/marketplace/marketplaceSlice';
import subscriptionsReducer from '../features/groups/subscriptionsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    marketplace: marketplaceReducer,
    subscriptions: subscriptionsReducer,
  },
});


