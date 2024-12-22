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
  images: ImageProp[];
  flavors: Specific[];
  categories: Specific[];
  characteristics: Specific[];
  feedbacks: FeedbackProp[];
  total_sold: number;
  star: number;
}

export interface ProductView {
  product_id: number;
  view_num: number;
}

export interface ImageProp {
  id: number;
  link: string;
}

export interface FeedbackProp {
  id: number;
  content: string;
  created_at: string;
  updated_at: string;
  star: number;
  user_id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
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

export interface Menu {
  categories: Specific[];
  characteristics: Specific[];
  flavors: Specific[];
}

export interface Item {
  product_id: number;
  quantity: number;
  price: number;
  title: string;
  img: string;
}

export interface ProductSearch {
  total: number;
  data: Product[];
}
