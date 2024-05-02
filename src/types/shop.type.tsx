export interface Shop {
    id: number,
    nameShop: string,
    linkImageAvatarShop: string
    linkImageShop: string
    addressShop: {
        id: number,
        city: string,
        district: string,
        ward: string,
        detail: string
    }
}