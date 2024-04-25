import { Purchase, PurchaseListStatus } from '../types/purchase.type'
import { SuccessResponse } from '../types/utils.types'
import http from '../utils/http'

const URL = '/cart'

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
    buyProducts(body: { product_id: string; quantity: number }[]) {
        return http.post<SuccessResponse<Purchase[]>>(`${URL}/buy-products`, body)
    },
    updatePurchase(params: { cartId: number; quantity: number }) {
        console.log("update", params)
        return http.put<SuccessResponse<Purchase>>(`${URL}/set/quantity?cartId=${params.cartId}&quantity=${params.quantity}`)
    },
    deletePurchase(cartId: number) {
        return http.delete<SuccessResponse<{ deleted_count: number }>>(`${URL}/delete?cartId=${cartId}`)
    }
}

export default purchaseApi