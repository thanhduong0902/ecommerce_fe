const path = {
    home: '/home',
    login: '/login',
    register: '/register',
    logout: '/logout',
    productDetail: '/product/:nameId',
    cart: '/cart',
    checkout: '/checkout',
    product:'/product',
    about:'/about',
    contact:'/contact',

    reviews: '/user/reviews',
    wallet: '/user/wallet',
    user: '/user',
    profile: '/user/profile',
    changePassword: '/user/password',
    historyPurchase: '/user/purchase',

    shop: '/admin/shop',
    infoShop: '/admin/shop/infoShop',
    productShop: '/admin/productShop',
    orderShop: '/admin/shop/orderShop',
    moderator: '/moderator',
    admin: '/admin',
    profit: '/admin/profit',
    specific:'/admin/specific',
    productDetailShop: '/admin/productShop/:nameId',

} as const

export default path