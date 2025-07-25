import { configureStore } from '@reduxjs/toolkit';
import { authSlice } from '@/utils/services/authSlice';
import { inventorySlice } from '@/utils/services/inventorySlice';

export const store = configureStore({
    reducer: {
        auth: authSlice.reducer,
        inventory: inventorySlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;