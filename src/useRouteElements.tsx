import path from './constants/path'
import { useContext, lazy, Suspense } from 'react'
import { Navigate, Outlet, useRoutes } from 'react-router-dom'
import { AppContext } from './context/app.context'
import MainLayout from './layouts/MainLayout'
import RegisterLayout from './layouts/RegisterLayout'
// import Login from './pages/Login'
// import ProductList from './pages/ProductList'
// import Profile from './pages/User/pages/Profile'
// import Register from './pages/Register'
// import ProductDetail from './pages/ProductDetail'
// import Cart from './pages/Cart'
import CartLayout from './layouts/CartLayout'
import UserLayout from './pages/User/layouts/UserLayout'
import CheckoutLayout from './layouts/CheckoutLayout'
import Checkout from './pages/Checkout'
import ProductShop from './pages/User/pages/ProductShop/ProductShop'
import InfoShop from './pages/User/pages/InfoShop/InfoShop'
import OrderShop from './pages/User/pages/Shop/OrderShop'
import AdminLayout from './pages/User/layouts/AdminLayout'
// import Reviews from './pages/User/pages/Reviews'
// import HistoryPurchase from './pages/User/pages/HistoryPurchase'
// import ChangePassword from './pages/User/pages/ChangePassword'
// import HistoryPurchase from './pages/User/pages/HistoryPurchase'
// import NotFound from './pages/NotFound'

const Login = lazy(() => import('./pages/Login'))
const ProductList = lazy(() => import('./pages/ProductList'))
const Profile = lazy(() => import('./pages/User/pages/Profile'))
const Register = lazy(() => import('./pages/Register'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const Cart = lazy(() => import('./pages/Cart'))
const Moderator = lazy(() => import('./pages/Moderator'))
const Admin = lazy(() => import('./pages/Admin'))
const Profit = lazy(() => import('./pages/Admin/ProfitStatic'))
// const ChangePassword = lazy(() => import('./pages/User/pages/ChangePassword'))
const Shop = lazy(() => import('./pages/User/pages/Shop'))
const Review = lazy(() => import('./pages/User/pages/Reviews'))
const Wallet = lazy(() => import('./pages/User/pages/Wallet'))
const HistoryPurchase = lazy(() => import('./pages/User/pages/HistoryPurchase'))
const NotFound = lazy(() => import('./pages/NotFound'))

/**
 * Để tối ưu re-render thì nên ưu tiên dùng <Outlet /> thay cho {children}
 * Lưu ý là <Outlet /> nên đặt ngay trong component `element` thì mới có tác dụng tối ưu
 * Chứ không phải đặt bên trong children của component `element`
 */

//  ✅ Tối ưu re-render
// export default memo(function RegisterLayout({ children }: Props) {
//  return (
//    <div>
//      <RegisterHeader />
//      {children}
//      <Outlet />
//      <Footer />
//    </div>
//  )
//  })

//  ❌ Không tối ưu được vì <Outlet /> đặt vào vị trí children
// Khi <Outlet /> thay đổi tức là children thay đổi
// Dẫn đến component `RegisterLayout` bị re-render dù cho có dùng React.memo như trên
// <RegisterLayout>
//   <Outlet />
// </RegisterLayout>

function ProtectedRoute() {
  const { isAuthenticated } = useContext(AppContext)
  return isAuthenticated ? <Outlet /> : <Navigate to='/login' />
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext)

  return !isAuthenticated ? <Outlet /> : <Navigate to='/' />
}

export default function useRouteElements() {
  const routeElements = useRoutes([
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: '',
          element: <RegisterLayout />,
          children: [
            {
              path: path.login,
              element: (
                <Suspense>
                  <Login />
                </Suspense>
              )
            },
            {
              path: path.register,
              element: (
                <Suspense>
                  <Register />
                </Suspense>
              )
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <ProtectedRoute />,
      children: [
        {
          path: path.cart,
          element: (
            <CartLayout>
              <Suspense>
                <Cart />
              </Suspense>
            </CartLayout>
          )
        },
        {
          path: path.checkout,
          element: (
            <CheckoutLayout>
              <Suspense>
                <Checkout />
              </Suspense>
            </CheckoutLayout>
          )
        }
        ,
        {
          path: path.user,
          element: <MainLayout />,
          children: [
            {
              path: '',
              element: <UserLayout />,
              children: [
                {
                  path: path.profile,
                  element: (
                    <Suspense>
                      <Profile />
                    </Suspense>
                  )
                },
                {
                  path: path.historyPurchase,
                  element: (
                    <Suspense>
                      <HistoryPurchase />
                    </Suspense>
                  )
                },
                {
                  path: path.shop,
                  element: (
                    <Suspense>
                      <Shop />
                    </Suspense>
                  ),
                  children: [
                    {
                      path: path.infoShop,
                      element: (
                        <InfoShop />
                      )
                    },
                    {
                      path: path.productShop,
                      element: (
                        <ProductShop />
                      )
                    },
                    {
                      path: path.orderShop,
                      element: (
                        <OrderShop />
                      )
                    },
                  ]
                },
                {
                  path: path.reviews,
                  element: (
                    <Suspense>
                      <Review />
                    </Suspense>
                  )
                },
                {
                  path: path.wallet,
                  element: (
                    <Suspense>
                      <Wallet />
                    </Suspense>
                  )
                }
              ]
            }
          ]
        }
      ]
    },
    {
      path: '',
      element: <MainLayout />,
      children: [
        {
          path: path.productDetail,
          element: (
            <Suspense>
              <ProductDetail />
            </Suspense>
          )
        },
        {
          path: '',
          index: true,
          element: (
            <Suspense>
              <ProductList />
            </Suspense>
          )
        },
        {
          path: path.moderator,
          element: (
            <Suspense>
              <Moderator />
            </Suspense>
          )
        },

        {
          path: '*',
          element: (
            <Suspense>
              <NotFound />
            </Suspense>
          )
        }
      ]
    },
    {
      path: path.admin,
      element: (
        <Suspense>
          <AdminLayout />
        </Suspense>
      ),
      // children: [
      //   {
      //     path: path.profit,
      //     element: (
      //       <Suspense>
      //         <Profit />
      //       </Suspense>
      //     )
      //   }
      // ]
    },
  ])
  return routeElements
}