import { Product } from "../types/product.type"
import http from "../utils/http"

const URL = '/moderator'

const moderatorApi = {
    getWaitconfirm() {
        return http.get<Product[]>(`${URL}/view/product/waitconfim`)
    },
    confirmProduct(productId: number) {
        return http.put<any>(`${URL}/confirm?productId=${productId}`)
    },
    rejectProduct(productId: number) {
        return http.put<any>(`${URL}/reject?productId=${productId}`)
    }
}

export default moderatorApi