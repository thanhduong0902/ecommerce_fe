import { useQuery } from "@tanstack/react-query";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import path from "../../constants/path";
import Popover from "../Popover";
import { purchasesStatus } from "../../constants/purchase";
import purchaseApi from "../../apis/purchase.api";
import { formatCurrency } from "../../utils/utils";
import NavHeader from "../NavHeader";
// import useSearchProducts from '../../hooks/useSearchProducts'
import { AppContext } from "../../context/app.context";

const MAX_PURCHASES = 5;
export default function Header() {
  const { isAuthenticated, searchValue, setSearchValue } =
    useContext(AppContext);
  const navigate = useNavigate();

  const { data: purchasesInCartData } = useQuery({
    queryKey: ["purchases"],
    queryFn: () => purchaseApi.getPurchases(),
    enabled: isAuthenticated,
  });
  const [searchInput, setSearchInput] = useState("");

  const { profile } = useContext(AppContext);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchValue(searchInput);
    navigate("/");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };
  const purchasesInCart = purchasesInCartData?.data;
  const url = "https://image-production-cd47.up.railway.app";
  return (
    <div className="bg-yellow items-center text-white py-2">
      <div className="container">
        <NavHeader />
        <div className="mt-4 grid grid-cols-12 items-center gap-4">
          <Link to="/" className="col-span-2">
            <img
              src={require("../../assets/images/Logo.png")}
              // alt="no purchase"
              // className="h-24 w-24"
            />
          </Link>
          <form className="col-span-4" onSubmit={handleSearchSubmit}>
            <div className="flex rounded-sm bg-white p-1">
              <input
                onChange={handleInputChange}
                value={searchInput}
                type="text"
                className="flex-grow border-none bg-transparent px-3 py-2 text-black outline-none"
                placeholder="Tìm kiếm ..."
              />
              <button
                className="flex-shrink-0 rounded-sm bg-pink-400 px-6 py-2 hover:opacity-90"
                type="submit"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                  />
                </svg>
              </button>
            </div>
          </form>
          <div>Sản phẩm</div>
          <div className="col-span-1 justify-self-end">
            <Popover
              renderPopover={
                <div className="relative  max-w-[400px] rounded-sm border border-gray-200 bg-white text-sm shadow-md">
                  {purchasesInCart && purchasesInCart.length > 0 ? (
                    <div className="p-2">
                      <div className="capitalize text-gray-400">
                        Sản phẩm mới thêm
                      </div>
                      <div className="mt-5">
                        {purchasesInCart
                          .slice(0, MAX_PURCHASES)
                          .map((purchase) => (
                            <div
                              className="mt-2 flex py-2 hover:bg-gray-100"
                              key={purchase.id}
                            >
                              <div className="flex-shrink-0">
                                <img
                                  src={`${url + purchase.product.linkImages}`}
                                  alt={purchase.product.title}
                                  className="h-11 w-11 object-cover"
                                />
                              </div>
                              <div className="ml-2 flex-grow overflow-hidden">
                                <div className="truncate">
                                  {purchase.product.title}
                                </div>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <span className="text-orange">
                                  ₫
                                  {formatCurrency(
                                    purchase.product.sellingPrice
                                  )}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className="mt-6 flex items-center justify-between">
                        <div className="text-xs capitalize text-gray-500">
                          {purchasesInCart.length > MAX_PURCHASES
                            ? purchasesInCart.length - MAX_PURCHASES
                            : ""}{" "}
                          Thêm hàng vào giỏ
                        </div>
                        <Link
                          to={path.cart}
                          className="rounded-sm bg-orange px-4 py-2 capitalize text-white hover:bg-opacity-90"
                        >
                          Xem giỏ hàng
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="flex h-[300px] w-[300px] flex-col items-center justify-center p-2">
                      <img
                        src={require("../../assets/images/no-product.png")}
                        alt="no purchase"
                        className="h-24 w-24"
                      />
                      <div className="mt-3 capitalize">Chưa có sản phẩm</div>
                    </div>
                  )}
                </div>
              }
            >
              <Link to="/" className="relative">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="h-8 w-8"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                {/* {purchasesInCart && purchasesInCart.length > 0 && (
                                    <span className='absolute left-[17px] top-[-5px] rounded-full bg-white px-[9px] py-[1px] text-xs text-orange '>
                                        {purchasesInCart?.length}
                                    </span>
                                )} */}
              </Link>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  );
}
