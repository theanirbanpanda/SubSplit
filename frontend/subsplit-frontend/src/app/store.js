import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import uiReducer from '../features/ui/uiSlice';
import marketplaceReducer from '../features/marketplace/marketplaceSlice';
import subscriptionsReducer from '../features/groups/subscriptionsSlice';
import walletReducer from '../features/settlements/walletSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';
import messageReducer from '../features/messages/messageSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    marketplace: marketplaceReducer,
    subscriptions: subscriptionsReducer,
    wallet: walletReducer,
    notifications: notificationsReducer,
    messages: messageReducer,
  },
});



