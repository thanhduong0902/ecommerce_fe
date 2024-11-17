export interface Product {
  id: number;
  main_image: string;
  selling_price: number;
  list_price: number;
  is_selling: number;
  rate: number;
  title: string;
  description: string;
  quantity: number;
}

export interface ProductResponse {
  data: Product[];
  current_page: number;
  total: number;
}

export interface desDetail {
  id: number;
  title: string;
  description: string;
}

export interface Shop {
  id: number;
  nameShop: string;
  linkImageAvatarShop: string;
  linkImageShop: string;
  status: string;
  addressShop: {
    id: number;
    city: string;
    ward: string;
    detail: string;
  };
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
  page?: number | string;
  limit?: number | string;
  sort_by?: "createdAt" | "view" | "sold" | "price";
  order?: "asc" | "desc";
  exclude?: string;
  rating_filter?: number | string;
  price_max?: number | string;
  price_min?: number | string;
  name?: string;
  category?: string;
  keyword?: string;
}

export interface Specific {
  id: number;
  title: string;
}
