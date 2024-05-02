import { Shop } from '../types/shop.type'
import http from '../utils/http'
import httpImg from '../utils/httpimg'


const URL = '/shop'

const shopApi = {
    createShop(body: any) {
        return http.post<any>(`${URL}/create`, body)
    },
    getShop() {
        return http.get<Shop>(`${URL}/get`)
    },
    getProduct() {
        return http.get<any>(`/product/view/myshop`)
    },
    addImageProduct(body: any) {
        return httpImg.post<any>(`/image/addImage`, body)
    },
    createProduct(body: any) {
        return http.post<any>('/product/create', body)
    },
    setOnSale(productId: number) {
        return http.put<any>(`/product/set/onsale?productId=${productId}`)
    },
    getOrder(status?: string) {
        return http.get<any>(`/order/shop/view/order/status?statusOrder=${status}`)
    },
    confirmOrder(orderId: number) {
        return http.put<any>(`/order/confirm?orderId=${orderId}`)
    },
    prepareOrder(orderId: number) {
        return http.put<any>(`/order/prepare?orderId=${orderId}`)
    },
    deliveringOrder(orderId: number) {
        return http.put<any>(`/order/delevered?orderId=${orderId}`)
    },
    cancelOrder(orderId: number) {
        return http.put<any>(`/order/cancel?orderId=${orderId}`)
    },


}

export default shopApi