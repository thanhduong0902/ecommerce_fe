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

export default function ProductList() {
  const queryConfig = useQueryConfig();
  const [searchParams] = useSearchParams();

  const [flavor, setFlavor] = useState<number[]>([]);
  const [category, setCategory] = useState<number[]>([]);
  const [charactics, setCharactics] = useState<number[]>([]);

  const [options, setOptions] = useState<SelectProps["options"]>([]);
  const [optionsCate, setOptionsCate] = useState<SelectProps["options"]>([]);
  const [optionsChar, setOptionsChar] = useState<SelectProps["options"]>([]);

  const { searchValue, searchImageValue, setSearchImageValue, setSearchValue } =
    useContext(AppContext);

  const [displayData, setDisplayData] = useState<ProductType[]>([]);
  const prevSearchImageValue = useRef(searchImageValue);
  const prevSearchValue = useRef(searchValue);

  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const handleChange = (value: number[]) => {
    setFlavor(value);
  };

  const handleChangeCate = (value: number[]) => {
    setCategory(value);
  };
  const handleChangeChar = (value: number[]) => {
    setCharactics(value);
  };

  const { data: flavorData } = useQuery({
    queryKey: ["flavor"],
    queryFn: () => {
      return specificApi.getFlavor();
    },
  });

  const { data: CharactericData } = useQuery({
    queryKey: ["Characteric"],
    queryFn: () => {
      return specificApi.getCharacterics();
    },
  });

  const { data: categoryData } = useQuery({
    queryKey: ["category"],
    queryFn: () => {
      return specificApi.getCategory();
    },
  });

  useEffect(() => {
    if (flavorData) {
      const newOptions = flavorData?.data?.map((item: Specific) => ({
        label: item.title,
        value: item.id,
      }));
      setOptions(newOptions);
    }

    if (categoryData) {
      const newOptions = categoryData?.data?.map((item: Specific) => ({
        label: item.title,
        value: item.id,
      }));
      setOptionsCate(newOptions);
    }

    if (CharactericData) {
      const newOptions = CharactericData?.data.map((item: Specific) => ({
        label: item.title,
        value: item.id,
      }));
      setOptionsChar(newOptions);
    }
  }, [flavorData, categoryData, CharactericData]);

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
  }, [searchValue, searchImageValue, page]);

  const onChange: PaginationProps["onChange"] = (page) => {
    setPage(page);
  };

  const filterMutation = useMutation({
    mutationFn: productApi.filterProduct,
  });

  const handleFilter = () => {
    setIsLoading(true);
    const body = {
      filters: {
        categories: category,
        characteristics: charactics,
        flavors: flavor,
      },
    };
    filterMutation.mutate(body, {
      onSuccess: (response) => {
        setSearchImageValue("");
        setDisplayData(response.data.data);
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
                <div className="flex justify-center items-center">
                  <div className="flex flex-row items-center my-4 gap-4">
                    <div>Lọc sản phẩm</div>
                    <div>Chọn hương vị</div>
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: 200 }}
                      placeholder="Chọn hương vị"
                      onChange={handleChange}
                      options={options}
                    />
                    <div>Chọn loại</div>
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: 200 }}
                      placeholder="Chọn loại"
                      onChange={handleChangeCate}
                      options={optionsCate}
                    />
                    <div>Chọn tính chất</div>
                    <Select
                      mode="multiple"
                      allowClear
                      style={{ width: 200 }}
                      placeholder="Chọn tính chất"
                      onChange={handleChangeChar}
                      options={optionsChar}
                    />
                    <button
                      onClick={handleFilter}
                      className="bg-orange-400 text-white py-2 px-4 rounded-lg bg-orange transition"
                    >
                      Xác nhận 
                    </button>{" "}
                  </div>
                </div>
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
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
