import classNames from "classnames";
import { useContext, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import path from "../../../../constants/path";
import { getAvatarUrl } from "../../../../utils/utils";
import { AppContext } from "../../../../context/app.context";
import "./style.css";
import MenuNav from "./MenuNav";
export default function AdminSideNav() {
  const location = useLocation();
  const { profile } = useContext(AppContext);
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleSubMenu = () => {
    setIsExpanded(!isExpanded);
  };
  const isParentActive = location.pathname.startsWith(path.shop);

  return (
    <div className="">
      <div className="mt-2 gap-5 flex flex-col">
        <NavLink
          to={path.profit}
          className={({ isActive }) =>
            classNames("flex py-4 items-center capitalize transition-colors", {
              "nav-select": isActive,
              nav: !isActive,
            })
          }
          onClick={() => setIsExpanded(false)}
        >
          <div className="mr-3 h-[22px] w-[22px]">
            <img
              src="https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4"
              alt=""
              className="h-full w-full"
            />
          </div>
          Thống kê
        </NavLink>
        <div>
          <NavLink
            to={path.shop}
            className={({ isActive }) =>
              classNames(
                "flex py-4 items-center capitalize transition-colors",
                {
                  "nav-select": isParentActive,
                  nav: !isParentActive,
                }
              )
            }
            onClick={toggleSubMenu}
          >
            <div className="mr-3 h-[22px] w-[22px]">
              <img
                src="https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4"
                alt=""
                className="h-full w-full"
              />
            </div>
            Quản lí sản phẩm
          </NavLink>
          {isExpanded && (
            <div className={`sub-menu ${isExpanded ? "open" : ""}`}>
              <NavLink
                to={path.specific}
                className={({ isActive }) =>
                  classNames(
                    "flex py-2 items-center capitalize transition-colors",
                    {
                      "nav-child-select": isActive,
                      "nav-child": !isActive,
                    }
                  )
                }
              >
                Danh mục
              </NavLink>
              <NavLink
                to={path.productShop}
                className={({ isActive }) =>
                  classNames(
                    "flex py-2 items-center capitalize transition-colors",
                    {
                      "nav-child-select": isActive,
                      "nav-child": !isActive,
                    }
                  )
                }
              >
                Sản phẩm
              </NavLink>
            </div>
          )}
        </div>
        {/* <MenuNav /> */}
        <NavLink
          to={path.historyPurchase}
          className={({ isActive }) =>
            classNames("flex py-4 items-center capitalize transition-colors", {
              "nav-select": isActive,
              nav: !isActive,
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
          Quản lí đơn hàng
        </NavLink>
        <NavLink
          to={path.reviews}
          className={({ isActive }) =>
            classNames("flex py-4 items-center capitalize transition-colors", {
              "nav-select": isActive,
              nav: !isActive,
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
          Quản lí người dùng
        </NavLink>
      </div>
    </div>
  );
}
