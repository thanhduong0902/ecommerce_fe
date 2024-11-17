const path = {
    home: '/',
    user: '/user',
    profile: '/user/profile',
    changePassword: '/user/password',
    historyPurchase: '/user/purchase',
    login: '/login',
    register: '/register',
    logout: '/logout',
    productDetail: '/:nameId',
    productDetailShop: '/admin/productShop/:nameId',
    cart: '/cart',
    checkout: '/checkout',
    shop: '/admin/shop',
    reviews: '/user/reviews',
    wallet: '/user/wallet',
    infoShop: '/admin/shop/infoShop',
    productShop: '/admin/productShop',
    orderShop: '/admin/shop/orderShop',
    moderator: '/moderator',
    admin: '/admin',
    profit: '/admin/profit',

    specific:'/admin/specific'
} as const

export default path