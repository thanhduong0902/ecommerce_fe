import { useMutation, useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import productApi from "../../apis/product.api";
import useQueryConfig from "../../hooks/useQueryConfig";
import {
  Product as ProductType,
  ProductListConfig,
  Specific,
} from "../../types/product.type";
import AsideFilter from "./components/AsideFilter/AsideFilter";
import Product from "./components/Product/Product"; // Component không đổi tên
import SortProductList from "./components/SortProductList";
import { useContext, useEffect, useRef, useState } from "react";
import { AppContext } from "../../context/app.context";
import ProductComponent from "../User/pages/ProductShop/ProductComponent";
import {
  Button,
  Image,
  Pagination,
  PaginationProps,
  Select,
  SelectProps,
} from "antd";
import { useSearchParams } from "react-router-dom";
import Lottie from "lottie-react";
import loading from "../../animation/loading.json";
import specificApi from "../../apis/specific.api";
import { toast } from "react-toastify";
import { date } from "yup";
import Filter from "./Filter";

export default function ProductList() {
  const queryConfig = useQueryConfig();
  const [searchParams] = useSearchParams();

  const [flavor, setFlavor] = useState<number[]>([]);
  const [category, setCategory] = useState<number[]>([]);
  const [charactics, setCharactics] = useState<number[]>([]);
  const [total, setTotal] = useState<number>(20);

  const { searchValue, searchImageValue, setSearchImageValue, setSearchValue } =
    useContext(AppContext);

  const [displayData, setDisplayData] = useState<ProductType[]>([]);
  const [suggestProduct, setSuggestProduct] = useState<ProductType[]>([]);

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
          data = response.data.data;
          console.log("Tìm kiếm bằng hình ảnh", data);
          setDisplayData(data);
          return;
        }

        // Kiểm tra nếu có giá trị tìm kiếm bằng văn bản
        if (searchValue && searchValue !== prevSearchValue.current) {
          console.log("Tim kiem bang text");
          const response = await productApi.getProducts(searchValue);
          data = response.data.data;
          setTotal(data.length);
          console.log("dataSearch", data);
          setDisplayData(data);
          return;
        }
        console.log("tim kiem tat ca");
        const response = await productApi.getProductAll(page);
        data = response.data.data;
        setTotal(response.data.total);
        setDisplayData(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
        setDisplayData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [searchValue, searchImageValue, page]);

  const onChange: PaginationProps["onChange"] = (page) => {
    setPage(page);
  };

  const filterMutation = useMutation({
    mutationFn: productApi.filterProduct,
  });

  const getProductSuggest = useMutation({
    mutationFn: productApi.getSuggestProducts,
  });

  useEffect(() => {
    // Lấy dữ liệu từ localStorage
    const viewProduct = localStorage.getItem("view_products");
    let parsedViewProduct = [];

    // Chuyển dữ liệu về mảng, xử lý lỗi nếu có
    try {
      parsedViewProduct = viewProduct ? JSON.parse(viewProduct) : [];
      if (!Array.isArray(parsedViewProduct)) {
        console.error("Dữ liệu trong view_products không phải là mảng.");
        parsedViewProduct = [];
      }
    } catch (error) {
      console.error("Lỗi khi parse view_products:", error);
      parsedViewProduct = [];
    }

    // Tạo body và gọi API
    const body = { view_products: parsedViewProduct };

    getProductSuggest.mutate(body, {
      onSuccess: (response) => {
        console.log(response.data);
        setSuggestProduct(response.data.data);
      },
      onError: (error) => {
        console.error("Lỗi khi lấy sản phẩm gợi ý:", error);
      },
    });
  }, []);

  const handleFilter = (body: any) => {
    setIsLoading(true);
    filterMutation.mutate(body, {
      onSuccess: (response) => {
        setDisplayData(response.data.data);
        setTotal(response.data.data.length);
        setIsLoading(false);
      },
      onError: () => {
        setIsLoading(false);
      },
    });
  };

  return (
    <div className="">
      <Helmet>
        <title>Sản phẩm | Yummy</title>
        <meta name="description" content="Trang chủ dự án Shopee Clone" />
      </Helmet>
      <div>
        {isLoading ? (
          <div className="items-center justify-center flex">
            <Lottie
              animationData={loading}
              style={{ width: "200px", height: "500px" }}
            />
          </div>
        ) : (
          <div className="container">
            {displayData && (
              <>
                <Filter onFilter={handleFilter} />

                {suggestProduct && (
                  <div className="border-2 border-orange rounded-xl p-2">
                    <div className="font-pacifico font-bold text-xl text-center p-3 text-green">
                      Sản phẩm gợi ý
                    </div>
                    <div className="col-span-10 row-span-1">
                      <div className="mt-6 flex gap-6 overflow-x-auto whitespace-nowrap p-3">
                        {suggestProduct?.map((product: ProductType) => (
                          <div className="flex-shrink-0 w-64" key={product.id}>
                            <Product product={product} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
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
                      total={total}
                      align="center"
                      pageSizeOptions={[20]}
                    />
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
