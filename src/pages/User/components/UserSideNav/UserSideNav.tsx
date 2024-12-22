import classNames from "classnames";
import { useContext } from "react";
import { Link, NavLink } from "react-router-dom";
import path from "../../../../constants/path";
import { getAvatarUrl } from "../../../../utils/utils";
import { AppContext } from "../../../../context/app.context";

export default function UserSideNav() {
  const { profile } = useContext(AppContext);

  return (
    <div>
      <div className="flex items-center border-b border-b-gray-200 py-4">
        <div className="flex-grow pl-4">
          <div className="mb-1 truncate font-semibold text-gray-600">
            {profile?.email}
          </div>
        </div>
      </div>
      <div className="mt-7">
        <NavLink
          to={path.shop}
          className={({ isActive }) =>
            classNames("mt-4 flex items-center capitalize transition-colors", {
              "text-orange": isActive,
              "text-gray-600": !isActive,
            })
          }
        >
          <div className="mr-3 h-[22px] w-[22px]">
            <img
              src="https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4"
              alt=""
              className="h-full w-full"
            />
          </div>
          Shop
        </NavLink>
        <NavLink
          to={path.historyPurchase}
          className={({ isActive }) =>
            classNames("mt-4 flex items-center capitalize transition-colors", {
              "text-orange": isActive,
              "text-gray-600": !isActive,
            })
          }
        >
          <div className="mr-3 h-[22px] w-[22px]">
            <img
              src="https://cf.shopee.vn/file/f0049e9df4e536bc3e7f140d071e9078"
              alt=""
              className="h-full w-full"
            />
          </div>
          Đơn mua
        </NavLink>
        <NavLink
          to={path.reviews}
          className={({ isActive }) =>
            classNames("mt-4 flex items-center capitalize transition-colors", {
              "text-orange": isActive,
              "text-gray-600": !isActive,
            })
          }
        >
          <div className="mr-3 h-[22px] w-[22px]">
            <img
              src="https://cf.shopee.vn/file/f0049e9df4e536bc3e7f140d071e9078"
              alt=""
              className="h-full w-full"
            />
          </div>
          Đánh giá
        </NavLink>
        <NavLink
          to={path.wallet}
          className={({ isActive }) =>
            classNames("mt-4 flex items-center capitalize transition-colors", {
              "text-orange": isActive,
              "text-gray-600": !isActive,
            })
          }
        >
          <div className="mr-3 h-[22px] w-[22px]">
            <img
              src="https://www.svgrepo.com/show/523948/wallet.svg"
              alt=""
              className="h-full w-full"
            />
          </div>
          Ví của tôi
        </NavLink>
      </div>
    </div>
  );
}
