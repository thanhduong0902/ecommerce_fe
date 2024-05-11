import http from "../utils/http";
const staticApi = {
    profitStatic(body: any) {
        return http.post<any>('/statistics/interest', body)
    },
    topProductStatic(body: any) {
        return http.post<any>('/statistics/top/products', body)
    },
    topShopStatic(body: any) {
        return http.post<any>('/statistics/top/shops', body)
    },
    orderStatic() {
        return http.post<any>('/statistics/order')
    },
    feeStatic(body: any) {
        return http.post<any>('/statistics/transportFee', body)
    },
    exportStatic(body: any) {
        return http.post<any>('/statistics/export/excel/transportFee', body)
    }
}

export default staticApi