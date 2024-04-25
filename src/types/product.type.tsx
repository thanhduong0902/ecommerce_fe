export interface Product {
    id: number
    linkImage: string
    originalPrice: number
    sellingPrice: number
    rate: number
    quantitySold: number
    title: string
    description?: string
    shop: Shop
    quantity: number,
    desctiption?: string,
    statusSale?: boolean,
    dateTimeCreated?: string,
    linkImages: string[],
    censorship?: string,
    feedBacks?: string[],
    productDescriptionDetails?: desDetail[]

    // image: string
    // createdAt: string
    // updatedAt: string
}

export interface desDetail {
    id: number,
    title: string,
    description: string
}

export interface Shop {
    id: number
    nameShop: string
    linkImageAvatarShop: string
    linkImageShop: string
    status: string
    addressShop: {
        id: number
        city: string
        ward: string
        detail: string
    }
}

export interface ProductList {
    // products: Product[]
    // pagination: {
    //     page: number
    //     limit: number
    //     page_size: number
    // }
}

export interface ProductListConfig {
    page?: number | string
    limit?: number | string
    sort_by?: 'createdAt' | 'view' | 'sold' | 'price'
    order?: 'asc' | 'desc'
    exclude?: string
    rating_filter?: number | string
    price_max?: number | string
    price_min?: number | string
    name?: string
    category?: string
}