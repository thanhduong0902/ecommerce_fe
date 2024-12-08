import {
  Product,
  ProductList,
  ProductListConfig,
  ProductSearch,
} from "../types/product.type";
import { SuccessResponse, SuccessResponseProduct } from "../types/utils.types";
import http from "../utils/http";
import httpFile from "../utils/httpFile";
import httpImg from "../utils/httpimg";

const URL = "auth/product/viewAll";
const URLDetail = "auth/product/viewdetail";
const productApi = {
  getProducts(searchValue?: string) {
    return http.get<ProductSearch>(`/auth/search/text?=${searchValue}`);
  },

  getProductAll(page?: number) {
    return http.get<ProductSearch>(`/auth/products?page=${page}`);
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
  searchProductbyImage(body: any) {
    return httpFile.post(`/auth/search/image`, body);
  },
  getHotProducts(body: any) {
    return http.post(`auth/products`, body);
  },
  reviewProduct(body: any) {
    console.log(body);
    return http.post(`auth/feedback/create`, body);
  },
  filterProduct(body: {
    filters: {
      categories: number[];
      characteristics: number[];
      flavors: number[];
    };
  }) {
    return http.post(`/auth/filter`, body);
  },
};

export default productApi;
