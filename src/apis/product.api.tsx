import { Product, ProductList, ProductListConfig } from '../types/product.type'
import { SuccessResponse, SuccessResponseProduct } from '../types/utils.types'
import http from '../utils/http'

const URL = 'auth/product/viewAll'
const URLDetail = 'auth/product/viewdetail'
const productApi = {
    getProducts(params?: string) {
        return http.get<Product[]>(`auth/product/search?keywork=${params}`,)
    },

    getProductDetail(id: string) {
        return http.get<Product>(`${URLDetail}?productId=${id}`)
    },
}

export default productApi