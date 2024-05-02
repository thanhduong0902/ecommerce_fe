import { Product, Shop } from './product.type'

export type PurchaseStatus = "WAITE_CONFIRM" | "DELIVERING" | "CANCELLED" | "DELEVERED"

export type PurchaseListStatus = PurchaseStatus | 0

export interface Purchase {
    id: number,
    dateTimeCreated: string,
    quantity: number,
    product: {
        id: number,
        title: string,
        originalPrice: number,
        sellingPrice: number,
        weight: number,
        rate: number,
        linkImages: string,
        shop: {
            id: number,
            nameShop: string,
            linkImageAvatarShop: string
        }
    }

}

export interface ExtendedPurchase extends Purchase {
    disabled: boolean
    checked: boolean
}