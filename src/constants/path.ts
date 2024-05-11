const path = {
    home: '/',
    user: '/user',
    profile: '/user/profile',
    changePassword: '/user/password',
    historyPurchase: '/user/purchase',
    login: '/login',
    register: '/register',
    logout: '/logout',
    productDetail: ':nameId',
    cart: '/cart',
    checkout: '/checkout',
    shop: '/user/shop',
    reviews: '/user/reviews',
    wallet: '/user/wallet',
    infoShop: '/user/shop/infoShop',
    productShop: '/user/shop/productShop',
    orderShop: '/user/shop/orerShop',
    moderator: '/moderator',
    admin: '/admin',
    profit: '/admin/profit'
} as const

export default path