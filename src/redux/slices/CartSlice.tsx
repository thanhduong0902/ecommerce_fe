import { createSlice } from "@reduxjs/toolkit";
import { Product } from "../../types/product.type";

const initialState = {
  cart: localStorage.getItem("cart")
    ? JSON.parse(localStorage.getItem("cart") as string) // Ép kiểu để đảm bảo giá trị không null
    : [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const existingItem = state.cart.find(
        (item: Product) => item.id === product.id
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        state.cart.push({ ...product, quantity: 1 });
      }

      localStorage.setItem("cart", JSON.stringify(state.cart)); // Lưu vào localStorage
    },
    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.cart = state.cart.filter((item: Product) => item.id !== productId);

      localStorage.setItem("cart", JSON.stringify(state.cart)); // Lưu vào localStorage
    },
    updateCart: (state) => {
      localStorage.setItem("cart", JSON.stringify(state.cart)); // Đồng bộ lại
    },
    increaseQuantity: (state, action) => {
      const productId = action.payload;
      const product = state.cart.find((item: Product) => item.id === productId);
      if (product) {
        product.quantity += 1;
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    decreaseQuantity: (state, action) => {
      const productId = action.payload;
      const product = state.cart.find((item: Product) => item.id === productId);
      if (product && product.quantity > 1) {
        product.quantity -= 1;
      }
      localStorage.setItem("cart", JSON.stringify(state.cart));
    },
    clearCart: (state) => {
      state.cart = []; // Xóa toàn bộ sản phẩm trong giỏ hàng
      // Xóa giỏ hàng trong `localStorage` để đồng bộ
      localStorage.removeItem("cart");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  updateCart,
  increaseQuantity,
  decreaseQuantity,
  clearCart,
} = cartSlice.actions;
export default cartSlice.reducer;
