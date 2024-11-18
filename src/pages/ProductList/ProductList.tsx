import { useQuery } from "@tanstack/react-query";
import { Helmet } from "react-helmet-async";
import productApi from "../../apis/product.api";
import Pagination from "../../components/Pagination";
import useQueryConfig from "../../hooks/useQueryConfig";
import { ProductListConfig } from "../../types/product.type";
import AsideFilter from "./components/AsideFilter/AsideFilter";
import Product from "./components/Product/Product";
import SortProductList from "./components/SortProductList";
import { useContext } from "react";
import { AppContext } from "../../context/app.context";
import ProductComponent from "../User/pages/ProductShop/ProductComponent";
import { Image } from "antd";
import { useSearchParams } from "react-router-dom";
import Lottie from "lottie-react";
import loading from "../../animation/loading.json";

export default function ProductList() {
  const queryConfig = useQueryConfig();
  const [searchParams] = useSearchParams();

  const { searchValue } = useContext(AppContext);

  const searchValueParam = searchParams.get("search") || ""; // Lấy giá trị từ URL

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["products", searchValue],
    queryFn: () => {
      return productApi.getProducts(searchValue);
    },
    staleTime: 3 * 60 * 1000,
  });

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
            {productsData && (
              <div className="grid grid-cols-5 gap-10 py-10">
                {/* <div className='col-span-3'>
                            <AsideFilter queryConfig={queryConfig} categories={categoriesData?.data.data || []} />
                        </div> */}
                <div className="col-span-10">
                  {/* <SortProductList queryConfig={queryConfig} /> */}
                  <div className="mt-6 grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                    {productsData?.data?.data.map((product: any) => (
                      <div className="col-span-1" key={product.id}>
                        <Product product={product} />
                      </div>
                    ))}
                  </div>
                  <Pagination
                    queryConfig={queryConfig}
                    pageSize={Math.ceil(
                      productsData.data.total / productsData.data.data.length
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
