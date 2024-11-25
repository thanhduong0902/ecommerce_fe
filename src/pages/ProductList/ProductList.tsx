import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import productApi from "../../apis/product.api";
import useQueryConfig from "../../hooks/useQueryConfig";
import {
  Product as ProductType,
  ProductListConfig,
} from "../../types/product.type";
import AsideFilter from "./components/AsideFilter/AsideFilter";
import Product from "./components/Product/Product"; // Component không đổi tên
import SortProductList from "./components/SortProductList";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../context/app.context";
import ProductComponent from "../User/pages/ProductShop/ProductComponent";
import { Image, Pagination, PaginationProps } from "antd";
import { useSearchParams } from "react-router-dom";
import Lottie from "lottie-react";
import loading from "../../animation/loading.json";

export default function ProductList() {
  const queryConfig = useQueryConfig();
  const [searchParams] = useSearchParams();

  const { searchValue, searchImageValue, setSearchImageValue } =
    useContext(AppContext);

  const [displayData, setDisplayData] = useState<ProductType[]>([]);
  const prevSearchImageValue = useRef(searchImageValue);
  const prevSearchValue = useRef(searchValue);

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);

      try {
        let data: ProductType[] = [];

        if (
          searchImageValue &&
          searchImageValue !== prevSearchImageValue.current
        ) {
          prevSearchImageValue.current = searchImageValue; // Cập nhật giá trị searchImageValue trước khi gọi API
          const formData = new FormData();
          formData.append("image", searchImageValue);
          const response = await productApi.searchProductbyImage(formData);
          data = response.data.products;
          console.log("Tìm kiếm bằng hình ảnh", data);
          setDisplayData(data); // Cập nhật dữ liệu sau khi tìm kiếm
          return;
        }

        // Kiểm tra nếu có giá trị tìm kiếm bằng văn bản
        if (searchValue && searchValue !== prevSearchValue.current) {
          console.log("Tim kiem bang text");
          const response = await productApi.getProducts(searchValue);
          data = response.data.data;
          console.log("dataSearch", data);
          setDisplayData(data);
          return;
        }
        console.log("tim kiem tat ca");
        const response = await productApi.getProductAll(page);
        data = response.data.data;
        setDisplayData(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setDisplayData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchValue, searchImageValue, page]); // Chỉ gọi lại effect khi các giá trị thay đổi

  const onChange: PaginationProps["onChange"] = (page) => {
    setPage(page);
  };

  return (
    <div className="">
      <Helmet>
        <title>Trang chủ | Yummy</title>
        <meta name="description" content="Trang chủ dự án Shopee Clone" />
      </Helmet>
      <div>
        {isLoading ? (
          <div className="items-center justify-center flex">
            <Lottie
              animationData={loading}
              style={{ width: "200px", height: "200px" }}
            />
          </div>
        ) : (
          <div className="container">
            {displayData && (
              <div className="grid grid-cols-5 gap-10 py-10">
                {/* <div className="col-span-3">
                  <AsideFilter queryConfig={queryConfig} categories={[]} />
                </div> */}
                <div className="col-span-10">
                  {/* <SortProductList queryConfig={queryConfig} /> */}
                  <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {displayData?.map((product: ProductType) => (
                      <div className="col-span-1" key={product.id}>
                        <Product product={product} />
                      </div>
                    ))}
                  </div>
                  <Pagination
                    style={{ marginTop: 20 }}
                    defaultPageSize={20}
                    current={page}
                    onChange={onChange}
                    total={300}
                    align="center"
                    pageSizeOptions={[20]}
                  />
                  ;
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
