import { Product, ProductResponse } from "../types/product.type";
import { Shop } from "../types/shop.type";
import http from "../utils/http";
import httpImg from "../utils/httpimg";

const URL = "/shop";

const shopApi = {
  createShop(body: any) {
    return http.post<any>(`${URL}/create`, body);
  },
  getShop() {
    return http.get<Shop>(`${URL}/get`);
  },
  getProduct() {
    return http.get<ProductResponse>(`/v1/admin/product/getAll`);
  },
  addImageProduct(body: any) {
    return httpImg.post<any>(`auth/image/upload`, body);
  },
  getImageProduct(link: string) {
    return httpImg.get<any>(`/auth/image/${link}`);
  },
  createProduct(body: any) {
    return http.post<any>("v1/admin/product/create", body);
  },
  setOnSale(productId: number) {
    return http.put<any>(`/product/set/onsale?productId=${productId}`);
  },
  getOrder(status?: string) {
    return http.get<any>(`v1/admin/order/getAll?status=${status}`);
  },
  confirmOrder(orderId: number) {
    return http.put<any>(`/order/confirm?orderId=${orderId}`);
  },
  prepareOrder(orderId: number) {
    return http.put<any>(`/order/prepare?orderId=${orderId}`);
  },
  deliveringOrder(orderId: number) {
    return http.put<any>(`/order/delevered?orderId=${orderId}`);
  },
  cancelOrder(orderId: number) {
    return http.put<any>(`/order/cancel?orderId=${orderId}`);
  },
};

export default shopApi;
