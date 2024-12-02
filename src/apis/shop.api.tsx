import { Product, ProductResponse } from "../types/product.type";
import { Order } from "../types/purchase.type";
import { Shop } from "../types/shop.type";
import http from "../utils/http";
import httpImg from "../utils/httpimg";

const URL = "/shop";

export interface OrderShop {
  total: number;
  data: Order[];
  last_page: number;
}

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
  getOrder(status?: string, page?: number) {
    return http.get<OrderShop>(
      `v1/admin/order/getAll?status=${status}&page=${page}`
    );
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
