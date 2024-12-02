import path from "./constants/path";
import { useContext, lazy, Suspense, useEffect } from "react";
import { Navigate, Outlet, useNavigate, useRoutes } from "react-router-dom";
import { AppContext } from "./context/app.context";
import MainLayout from "./layouts/MainLayout";
import RegisterLayout from "./layouts/RegisterLayout";

import CartLayout from "./layouts/CartLayout";
import UserLayout from "./pages/User/layouts/UserLayout";
import CheckoutLayout from "./layouts/CheckoutLayout";
import Checkout from "./pages/Checkout";
import ProductShop from "./pages/User/pages/ProductShop/ProductShop";
import InfoShop from "./pages/User/pages/InfoShop/InfoShop";
import OrderShop from "./pages/User/pages/Shop/OrderShop";
import AdminLayout from "./pages/User/layouts/AdminLayout";
import UserSideNav from "./pages/User/components/UserSideNav";
import Specific from "./pages/Admin/Sepcific";
import ProductDetailShop from "./pages/User/pages/ProductShop/ProductDetailShop";
import Home from "./pages/Home";
import About from "./pages/About";
import UserManagement from "./pages/Admin/UserManagement";
import Message from "./pages/Admin/Message";

const Login = lazy(() => import("./pages/Login"));
const ProductList = lazy(() => import("./pages/ProductList"));
const Profile = lazy(() => import("./pages/User/pages/Profile"));
const Register = lazy(() => import("./pages/Register"));
const ProductDetail = lazy(() => import("./pages/ProductDetail"));
const Cart = lazy(() => import("./pages/Cart"));
const Moderator = lazy(() => import("./pages/Moderator"));
const Admin = lazy(() => import("./pages/Admin"));
const Profit = lazy(() => import("./pages/Admin/ProfitStatic"));
// const ChangePassword = lazy(() => import('./pages/User/pages/ChangePassword'))
const Shop = lazy(() => import("./pages/User/pages/Shop"));
const Review = lazy(() => import("./pages/User/pages/Reviews"));
const Wallet = lazy(() => import("./pages/User/pages/Wallet"));
const HistoryPurchase = lazy(
  () => import("./pages/User/pages/HistoryPurchase")
);
const NotFound = lazy(() => import("./pages/NotFound"));

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
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" />;
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext);

  return !isAuthenticated ? <Outlet /> : <Navigate to="/" />;
}

const ProtectedAdminRoute = () => {
  const { profile } = useContext(AppContext);
  const isAdmin = profile?.role.includes("admin");

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default function useRouteElements() {
  const { profile } = useContext(AppContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (profile?.role.includes("admin")) {
      navigate("/admin", { replace: true }); // Điều hướng đến /admin nếu người dùng là admin
    }
  }, []);
  const routeElements = useRoutes([
    {
      path: "",
      element: <MainLayout />,
      children: [
        {
          path: path.product,
          element: (
            <Suspense>
              <ProductList />
            </Suspense>
          ),
        },
        {
          path: path.productDetail,
          element: (
            <Suspense>
              <ProductDetail />
            </Suspense>
          ),
        },
        {
          path: path.cart,
          element: (
            <Suspense>
              <Cart />
            </Suspense>
          ),
        },
        {
          path: path.checkout,
          element: (
            <Suspense>
              <Checkout />
            </Suspense>
          ),
        },
        {
          path: "",
          element: (
            <Suspense>
              <Home />
            </Suspense>
          ),
        },
        {
          path: path.about,
          element: (
            <Suspense>
              <About />
            </Suspense>
          ),
        },
        {
          path: "*",
          element: (
            <Suspense>
              <NotFound />
            </Suspense>
          ),
        },
      ],
    },
    {
      path: "",
      element: <RejectedRoute />,
      children: [
        {
          path: "",
          element: <RegisterLayout />,
          children: [
            {
              path: path.login,
              element: (
                <Suspense>
                  <Login />
                </Suspense>
              ),
            },
            {
              path: path.register,
              element: (
                <Suspense>
                  <Register />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },

    {
      path: "",
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
          ),
        },
        {
          path: path.checkout,
          element: (
            <CheckoutLayout>
              <Suspense>
                <Checkout />
              </Suspense>
            </CheckoutLayout>
          ),
        },
        {
          path: path.historyPurchase,
          element: (
            <MainLayout>
              <Suspense>
                <HistoryPurchase />
              </Suspense>
            </MainLayout>
          ),
        },
      ],
    },
    {
      path: path.admin,
      element: (
        <Suspense>
          <ProtectedAdminRoute />
        </Suspense>
      ),
      children: [
        {
          path: "",
          element: <AdminLayout />,
          children: [
            {
              path: path.profit,
              element: (
                <Suspense>
                  <Profit />
                </Suspense>
              ),
            },
            {
              path: path.member,
              element: (
                <Suspense>
                  <UserManagement />
                </Suspense>
              ),
            },
            {
              path: path.message,
              element: (
                <Suspense>
                  <Message />
                </Suspense>
              ),
            },
            {
              path: path.shop,
              element: (
                <Suspense>
                  <InfoShop />
                </Suspense>
              ),
            },
            {
              path: path.productShop,
              element: (
                <Suspense>
                  <ProductShop />
                </Suspense>
              ),
            },
            {
              path: path.specific,
              element: (
                <Suspense>
                  <Specific />
                </Suspense>
              ),
            },
            {
              path: path.infoShop,
              element: (
                <Suspense>
                  <InfoShop />
                </Suspense>
              ),
            },
            {
              path: path.productShop,
              element: (
                <Suspense>
                  <ProductShop />
                </Suspense>
              ),
            },
            {
              path: path.productDetailShop,
              element: (
                <Suspense>
                  <ProductDetailShop />
                </Suspense>
              ),
            },
            {
              path: path.orderShop,
              element: (
                <Suspense>
                  <OrderShop />
                </Suspense>
              ),
            },
          ],
        },
      ],
    },
  ]);
  return routeElements;
}
