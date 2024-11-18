import {
  Product,
  ProductList,
  ProductListConfig,
  ProductSearch,
} from "../types/product.type";
import { SuccessResponse, SuccessResponseProduct } from "../types/utils.types";
import http from "../utils/http";

const URL = "auth/product/viewAll";
const URLDetail = "auth/product/viewdetail";
const productApi = {
  getProducts(searchValue?: string) {
    return http.get<ProductSearch>(`/auth/search/text?=${searchValue}`);
  },

  getAllProducts() {
    return http.get<Product[]>(`v1/admin/product/getAll`);
  },

  getProductDetail(id: string) {
    return http.get<Product>(`auth/products/${id}`);
  },

  editProuct(body: any) {
    console.log("body", body);
    return http.put<any>(`/v1/admin/product/update`, body);
  },
};

export default productApi;
