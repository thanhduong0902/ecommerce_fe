import { createSlice } from "@reduxjs/toolkit";
import { Product, ProductView } from "../../types/product.type";

const initialState = {
  cartView: localStorage.getItem("view_products")
    ? JSON.parse(localStorage.getItem("view_products") as string) // Ép kiểu để đảm bảo giá trị không null
    : [],
};

const cartViewSlice = createSlice({
  name: "view_products",
  initialState,
  reducers: {
    addTocartView: (state, action) => {
      const product = action.payload;
      const existingItem = state.cartView.find(
        (item: ProductView) => item.product_id === product.product_id
      );

      if (existingItem) {
        existingItem.view_num += 1;
      } else {
        state.cartView.push({ ...product, view_num: 1 });
      }

      localStorage.setItem("view_products", JSON.stringify(state.cartView)); // Lưu vào localStorage
    },
    removeFromcartView: (state, action) => {
      const productId = action.payload;
      state.cartView = state.cartView.filter(
        (item: Product) => item.id !== productId
      );

      localStorage.setItem("view_products", JSON.stringify(state.cartView)); // Lưu vào localStorage
    },
    updatecartView: (state) => {
      localStorage.setItem("view_products", JSON.stringify(state.cartView)); // Đồng bộ lại
    },
  },
});

export const { addTocartView, removeFromcartView, updatecartView } =
  cartViewSlice.actions;
export default cartViewSlice.reducer;
