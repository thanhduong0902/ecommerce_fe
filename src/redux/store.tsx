import { configureStore } from "@reduxjs/toolkit";
import CartSlice from "./slices/CartSlice";
import CartViewSlice from "./slices/CartViewSlice";

const store = configureStore({
  reducer: {
    cart: CartSlice,
    cartView: CartViewSlice,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
