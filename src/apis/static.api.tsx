import http from "../utils/http";
import httpFile from "../utils/httpFile";
const staticApi = {
  profitStatic(params: { start_date: string; end_date: string; num: number }) {
    return http.get<any>("v1/admin/statistic/revenue", {
      params: params,
    });
  },
  topProductStatic(params: {
    num: number;
    start_date: string;
    end_date: string;
  }) {
    return http.get<any>("v1/admin/statistic/topProduct", {
      params: params,
    });
  },
  topUserStatic(params: { start_date: string; end_date: string; num: number }) {
    return http.get<any>("v1/admin/statistic/topUser", {
      params: params,
    });
  },
};

export default staticApi;
