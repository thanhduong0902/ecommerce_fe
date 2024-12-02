import { useMutation, useQuery } from "@tanstack/react-query";
import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import path from "../../constants/path";
import Popover from "../Popover";
import { purchasesStatus } from "../../constants/purchase";
import purchaseApi from "../../apis/purchase.api";
import { formatCurrency } from "../../utils/utils";
import NavHeader from "../NavHeader";
import { AppContext } from "../../context/app.context";
import "./style.css";
import {
  CameraOutlined,
  LoadingOutlined,
  PlusOutlined,
  SearchOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { Product } from "../../types/product.type";
import {
  Button,
  GetProp,
  Image,
  Modal,
  Upload,
  UploadProps,
  message,
} from "antd";
import productApi from "../../apis/product.api";
type FileType = Parameters<GetProp<UploadProps, "beforeUpload">>[0];
const getBase64 = (img: FileType, callback: (url: string) => void) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result as string));
  reader.readAsDataURL(img);
};

const MAX_PURCHASES = 5;

export default function Header() {
  const {
    isAuthenticated,
    searchValue,
    setSearchValue,
    setCart,
    setSearchImageValue,
  } = useContext(AppContext);
  const navigate = useNavigate();
  const cart = useSelector((state: RootState) => state.cart.cart);

  const [searchInput, setSearchInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const [file, setFile] = useState<any>("");
  const [imageUrl, setImageUrl] = useState<any>("");
  const [uploading, setUploading] = useState(false);

  const { profile, shaking } = useContext(AppContext);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchValue(searchInput);
    navigate(`/product?search=${searchInput}`);
  };

  const handleSearchImageSubmit = async (e: any) => {
    e.preventDefault();
    setIsOpen(false);
    setSearchImageValue(file);
    setFile("");
    setImageUrl("");
    navigate(`/product`);
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  function closeModal() {
    setIsOpen(false);
  }

  const handleFileChange = (e: any) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      // Hiển thị bản xem trước nếu là hình ảnh
      const reader = new FileReader();
      reader.onload = () => setImageUrl(reader.result);
      reader.readAsDataURL(selectedFile);
    }
  };

  useEffect(() => {
    setSearchImageValue("");
    setSearchValue("");
    setSearchInput("");
  }, []);

  const url = "https://pushimage-production.up.railway.app/api/auth/image/";
  return (
    <div className="bg-yellow items-center text-black font-pacifico">
      <div className="container">
        <NavHeader />
        <div className="grid grid-cols-12 items-center font-bold gap-4">
          <Link to="/" className="col-span-2">
            <Image src="assets/Logo.png" preview={false} />
          </Link>
          <form className="col-span-3" onSubmit={handleSearchSubmit}>
            <div className="flex rounded-3xl bg-white p-1">
              <input
                onChange={handleInputChange}
                value={searchInput}
                type="text"
                className="flex-grow border-none bg-transparent px-3 py-2 text-black outline-none"
                placeholder="Tìm kiếm ..."
              />
              <button
                className="flex-shrink-0 rounded-3xl bg-red px-4 py-2 hover:opacity-90"
                type="submit"
              >
                <SearchOutlined size={40} />
              </button>
            </div>
          </form>
          <button
            onClick={() => setIsOpen(true)}
            className="col-span-1 flex-shrink-0 rounded-3xl bg-red px-4 py-2 mx-2 hover:opacity-90"
            type="submit"
          >
            <CameraOutlined size={40} />
          </button>
          <div className="flex flex-row col-span-5 justify-between">
            <NavLink
              to=""
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Trang chủ
            </NavLink>
            <NavLink
              to={path.product}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Sản phẩm
            </NavLink>
            <NavLink
              to={path.about}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Giới thiệu
            </NavLink>
            <NavLink
              to={path.contact}
              className={({ isActive }) =>
                isActive ? "nav-item active" : "nav-item"
              }
            >
              Liên hệ
            </NavLink>
          </div>
          <div className="col-span-1 justify-self-end">
            <Popover
              renderPopover={
                <div className="relative  max-w-[400px] rounded-sm border border-gray-200 bg-white text-sm shadow-md">
                  {cart && cart.length > 0 ? (
                    <div className="p-2">
                      <div className="capitalize text-gray-400">
                        Sản phẩm mới thêm
                      </div>
                      <div className="mt-5">
                        {cart
                          .slice(0, MAX_PURCHASES)
                          .map((purchase: Product) => (
                            <div
                              className="mt-2 flex py-2 hover:bg-gray-100"
                              key={purchase.id}
                            >
                              <div className="flex-shrink-0">
                                <img
                                  src={`${url + purchase.main_image}`}
                                  alt={purchase.title}
                                  className="h-11 w-11 object-cover"
                                />
                              </div>
                              <div className="ml-2 flex-grow overflow-hidden">
                                <div className="truncate">{purchase.title}</div>
                              </div>
                              <div className="ml-2 flex-shrink-0">
                                <span className="text-orange">
                                  ₫{formatCurrency(purchase.selling_price)}
                                </span>
                              </div>
                            </div>
                          ))}
                      </div>
                      <div className="mt-6 flex items-center justify-center">
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
                        src="assets/no-product.png"
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
                  className={`h-8 w-8 transition-transform ${
                    shaking ? "animate-shake" : ""
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
                  />
                </svg>
                {cart.length > 0 && (
                  <span className="absolute left-[17px] top-[-5px] rounded-full bg-white px-[9px] py-[1px] text-xs text-orange">
                    {cart.length}
                  </span>
                )}
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
      <Modal
        open={isOpen}
        onCancel={closeModal}
        title="Thêm hình ảnh"
        onOk={handleSearchImageSubmit}
      >
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {imageUrl && (
          <div style={{ margin: "20px 0" }}>
            <img src={imageUrl} alt="Preview" style={{ width: "200px" }} />
          </div>
        )}
      </Modal>
    </div>
  );
}
