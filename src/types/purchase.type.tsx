import { Product } from './product.type'

export type PurchaseStatus = -1 | 1 | 2 | 3 | 4 | 5

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
    }

}

export interface ExtendedPurchase extends Purchase {
    disabled: boolean
    checked: boolean
}