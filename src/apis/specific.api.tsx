import {
  Product,
  ProductList,
  ProductListConfig,
  Specific,
} from "../types/product.type";
import { SuccessResponse, SuccessResponseProduct } from "../types/utils.types";
import http from "../utils/http";

const specificApi = {
  getFlavor() {
    return http.get<Specific[]>(`auth/flavor/getAll`);
  },
  createFlavor(body: { title: string }) {
    return http.post<any>(`v1/admin/ccf/flavor/create`, body);
  },
  getCategory() {
    return http.get<Specific[]>(`auth/category/getAll`);
  },
  createCategory(body: { title: string }) {
    return http.post<any>(`v1/admin/ccf/category/create`, body);
  },
  getCharacterics() {
    return http.get<Specific[]>(`auth/characteristic/getAll`);
  },
  createCharacteric(body: { title: string }) {
    return http.post<any>(`v1/admin/ccf/characteristic/create`, body);
  },
  train() {
    return http.get<any>(`v1/admin/product/training`);
  },
};

export default specificApi;
