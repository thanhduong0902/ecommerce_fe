import http from "../utils/http";
import httpFile from "../utils/httpFile";
const staticApi = {
  profitStatic(params: {
    status: string;
    start_date: string;
    end_date: string;
  }) {
    return http.get<any>("v1/admin/statistic/revenue", {
      params: params,
    });
  },
  topProductStatic(params: {
    status: string;
    start_date: string;
    end_date: string;
  }) {
    return http.get<any>("/statistics/top/products", {
      params: params,
    });
  },
  topUserStatic(params: {
    status: string;
    start_date: string;
    end_date: string;
  }) {
    return http.post<any>("/statistics/top/shops", {
      params: params,
    });
  },
};

export default staticApi;
