import { Purchase, PurchaseListStatus } from '../types/purchase.type'
import { SuccessResponse } from '../types/utils.types'
import http from '../utils/http'

const URL = '/cart'

const URLORDER = '/order'

const URLPAY = '/wallet'

interface productCart {
    productId: number;
    quantity: number;
}

const purchaseApi = {
    addToCart({ productId, quantity }: productCart) {
        return http.post(`${URL}/add?productId=${productId}&quantity=${quantity}`)
    },
    getPurchases() {
        return http.get<Purchase[]>(`${URL}/viewMyCart`, {
            // params
        })
    },
    buyProducts(body: Purchase[]) {
        return http.post<any>(`${URLORDER}/preview`, body)
    },
    updatePurchase(params: { cartId: number; quantity: number }) {
        console.log("update", params)
        return http.put<SuccessResponse<Purchase>>(`${URL}/set/quantity?cartId=${params.cartId}&quantity=${params.quantity}`)
    },
    deletePurchase(cartId: number) {
        return http.delete<SuccessResponse<{ deleted_count: number }>>(`${URL}/delete?cartId=${cartId}`)
    },
    checkPay(amount: number) {
        return http.get<any>(`${URLPAY}/checkPay?amount=${amount}`)
    },
    pay(body: any) {
        console.log("body", body)
        return http.post<any>(`${URLORDER}/order`, body)
    },
    getOrder(status?: string) {
        console.log("status", status)
        return http.get<any>(`${URLORDER}/customer/view/order/status?statusOrder=${status}`)
    },
    getReview() {
        return http.get<Purchase[]>(`/feedback/get/cartToFeedback`)
    },
    addReview(body: any) {
        return http.post<any>(`/feedback/add`, body)
    }
}

export default purchaseApi