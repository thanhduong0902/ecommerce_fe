import { SuccessResponse } from "../types/utils.types";
import http from "../utils/http";

export interface Coupon {
  id: number;
  code: string;
  ratio: string;
  quantity: number;
  accept_price: number;
  updated_at: string;
  max_discount: number;
  expiration_date: string;
}

export interface BodyCoupon {
  code: string;
  ratio: string;
  quantity: number;
  accept_price: number;
  max_discount: number;
  expiration_date: any;
}
const couponApi = {
  editCoupon(idCus: number) {
    return http.get<any>(`wallet/checkBalance?idCus=${idCus}`);
  },
  addCoupon(body: BodyCoupon) {
    return http.post<any>(`v1/admin/coupon/create`, body);
  },
  getCoupon() {
    return http.get<Coupon[]>("v1/admin/coupon/getAll");
  },
};

export default couponApi;
