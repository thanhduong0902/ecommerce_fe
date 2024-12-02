import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Helmet } from "react-helmet-async";
import moment from "moment";
import {
  formatCurrency,
  formatNumberToSocialStyle,
  getIdFromNameId,
  rateSale,
} from "../../../../utils/utils";
import productApi from "../../../../apis/product.api";
import ProductRating from "../../../../components/ProductRating";
import { Button, Modal, Select, SelectProps } from "antd";
import { FormProvider, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import Input from "../../../../components/Input";
import specificApi from "../../../../apis/specific.api";
import { date } from "yup";
export default function ProductDetailShop() {
  const { nameId } = useParams();
  const id = getIdFromNameId(nameId as string);
  const { data: productDetailData, refetch } = useQuery({
    queryKey: ["product", id],
    queryFn: () => productApi.getProductDetail(id as string),
  });
  const [currentIndexImages, setCurrentIndexImages] = useState([0, 5]);
  const [activeImage, setActiveImage] = useState("");
  const product = productDetailData?.data;
  const imageRef = useRef<HTMLImageElement>(null);

  const [flavor, setFlavor] = useState<string[]>([]);
  const [category, setCategory] = useState<string[]>([]);
  const [charactics, setCharactics] = useState<string[]>([]);

  const currentImages = useMemo(
    () => (product ? product.images.slice(...currentIndexImages) : []),
    [product, currentIndexImages]
  );

  const [options, setOptions] = useState<SelectProps["options"]>([]);
  const [optionsCate, setOptionsCate] = useState<SelectProps["options"]>([]);
  const [optionsChar, setOptionsChar] = useState<SelectProps["options"]>([]);

  useEffect(() => {
    if (productDetailData?.data) {
      setFlavor(productDetailData.data.flavors.map((item) => item.title));
      setCategory(productDetailData.data.categories.map((item) => item.title));
      setCharactics(
        productDetailData.data.characteristics.map((item) => item.title)
      );
    }
  }, []);
  const [isOpen, setIsOpen] = useState(false);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    })
      .format(value)
      .replace("₫", "đ");
  };

  function closeModal() {
    setIsOpen(false);
  }

  const methods = useForm<any>({
    defaultValues: {
      title: productDetailData?.data?.title,
      selling_price: product?.selling_price,
      list_price: product?.list_price,
      quantity: product?.quantity,
      description: product?.description,
      is_selling: product?.is_selling,
      main_image: product?.main_image,
      flavor: product?.flavors,
      category: product?.categories,
      characteristics: product?.characteristics,
    },
  });
  const {
    register,
    control,
    formState: { errors },
    handleSubmit,
    setValue,
    watch,
    getValues,
    setError,
  } = methods;

  useEffect(() => {
    if (productDetailData) {
      const data = productDetailData.data;
      setValue("title", data?.title || "");
      setValue("selling_price", product?.selling_price || "");
      setValue("list_price", product?.list_price || "");
      setValue("quantity", product?.quantity || "");
      setValue("description", product?.description || "");
      setValue("is_selling", product?.is_selling || "");
      setValue("main_image", product?.main_image || "");
    }
  }, [productDetailData, setValue]);

  const editProductMutation = useMutation({
    mutationFn: productApi.editProuct,
  });

  const onSubmit = handleSubmit((data: any) => {
    const body = {
      id: product?.id,
      title: data.title,
      selling_price: data.selling_price,
      quantity: data.quantity,
      description: data.description,
      list_price: data.list_price,
      is_selling: true,
      main_image: product?.main_image,
      flavors: flavor,
      categories: category,
      characteristics: charactics,
    };
    editProductMutation.mutate(body, {
      onSuccess: (response) => {
        toast.success("Thành công", {
          position: "top-center",
          autoClose: 1000,
        });
        refetch();
        setIsOpen(!isOpen);
      },
      onError: (errors) => {},
    });
  });
  useEffect(() => {
    if (product?.images && product.images.length > 0) {
      setActiveImage(product.images[0].link);
    }
  }, [product]);

  const next = () => {};

  const prev = () => {
    if (currentIndexImages[0] > 0) {
      setCurrentIndexImages((prev) => [prev[0] - 1, prev[1] - 1]);
    }
  };
  const chooseActive = (img: string) => {
    setActiveImage(img);
  };

  const { data: flavorData, isLoading } = useQuery({
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
      const newOptions = flavorData?.data?.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      setOptions(newOptions);
    }

    if (categoryData) {
      const newOptions = categoryData?.data?.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      setOptionsCate(newOptions);
    }

    if (CharactericData) {
      const newOptions = CharactericData?.data.map((item) => ({
        label: item.title,
        value: item.id,
      }));
      setOptionsChar(newOptions);
    }
  }, [flavorData, categoryData, CharactericData]);
  const handleChange = (value: string[]) => {
    setFlavor(value);
  };

  const handleChangeCate = (value: string[]) => {
    setCategory(value);
  };
  const handleChangeChar = (value: string[]) => {
    setCharactics(value);
  };
  if (!product) return null;
  const url = "https://pushimage-production.up.railway.app/api/auth/image/";

  return (
    <div className="bg-white py-6">
      <Helmet>
        <title>{product.title} | Shopee Clone</title>
      </Helmet>
      <div className="container">
        <div className="bg-yellow-200 p-4 shadow rounded-3xl border-orange border-4">
          <div className="grid grid-cols-12 gap-9">
            <div className="col-span-5">
              <div className="relative w-full overflow-hidden pt-[100%] shadow rounded-3xl">
                <img
                  src={`${url + activeImage}`}
                  alt={product.title}
                  className="absolute left-0 top-0 h-full w-full object-cover "
                  ref={imageRef}
                />
              </div>
              <div className="relative mt-4 grid grid-cols-5 gap-1">
                <button
                  className="absolute left-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white"
                  onClick={prev}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                  </svg>
                </button>
                {currentImages.map((img) => {
                  const isActive = img.link === activeImage;
                  return (
                    <div
                      className="relative w-full pt-[100%]"
                      key={img.id}
                      onMouseEnter={() => chooseActive(img.link)}
                    >
                      <img
                        src={`${url + img.link}`}
                        alt={product.title}
                        className="absolute left-0 top-0 h-full w-full cursor-pointer bg-white object-cover"
                      />
                      {isActive && (
                        <div className="absolute inset-0 border-2 border-orange" />
                      )}
                    </div>
                  );
                })}
                <button
                  className="absolute right-0 top-1/2 z-10 h-9 w-5 -translate-y-1/2 bg-black/20 text-white"
                  onClick={next}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-5 w-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8.25 4.5l7.5 7.5-7.5 7.5"
                    />
                  </svg>
                </button>
              </div>
            </div>
            <div className="col-span-7">
              <h1 className="text-xl font-medium uppercase">{product.title}</h1>
              <div className="mt-8 flex items-center">
                <div className="flex items-center">
                  <span className="mr-1 border-b border-b-orange text-orange">
                    {product.rate}
                  </span>
                  <ProductRating
                    rating={product.rate}
                    activeClassname="fill-orange text-orange h-4 w-4"
                    nonActiveClassname="fill-gray-300 text-gray-300 h-4 w-4"
                  />
                </div>
                <div className="mx-4 h-4 w-[1px] bg-gray-300"></div>
                <div>
                  <span>{formatNumberToSocialStyle(product.quantity)}</span>
                  <span className="ml-1 text-gray-500">Đã bán</span>
                </div>
              </div>
              <div className="mt-8 flex items-center bg-gray-50 px-5 py-4">
                <div className="text-gray-500 line-through">
                  ₫{formatCurrency(product.list_price)}
                </div>
                <div className="ml-3 text-3xl font-medium text-orange">
                  ₫{formatCurrency(product.selling_price)}
                </div>
                <div className="ml-4 rounded-sm bg-orange px-1 py-[2px] text-xs font-semibold uppercase text-white">
                  {rateSale(product.list_price, product.selling_price)} giảm
                </div>
              </div>
              <div className="mt-8 flex items-center">
                <div className="capitalize text-gray-500">Số lượng</div>

                <div className="ml-6 text-gray-500">
                  {product.quantity} có sẵn
                </div>
              </div>
              <div className="mt-2">
                <div>
                  <div className=" bg-white py-4">
                    <div className="rounded bg-yellow p-4 text-lg capitalize text-slate-700">
                      Mô tả sản phẩm
                    </div>
                    <div className="mx-4 mb-4 mt-2 text-sm leading-loose">
                      <div>{productDetailData.data.description}</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-row justify-between items-center w-full gap-4">
                <div className="flex flex-row items-center justify-between">
                  <div className="p-4 bg-orange rounded-md">Trạng thái</div>
                  <div className="ml-4">
                    {product.is_selling ? "Đang bán" : "Dừng bán"}
                  </div>
                </div>

                <Button
                  onClick={() => setIsOpen(true)}
                  type="primary"
                  size="large"
                  style={{
                    width: "40%",
                    height: "50px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-evenly",
                    backgroundColor: "#4caf50",
                    borderColor: "#4caf50",
                    color: "#ffffff",
                  }}
                >
                  Chỉnh sửa
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 shadow rounded-3xl border-orange border-4 mx-4">
        <div className="container">
          <div className=" bg-white p-4 ">
            <div className="rounded bg-gray-50 p-4 text-lg capitalize text-slate-700">
              Đánh giá
            </div>
            {/* {product.feedBacks?.map((item: any) => (
                            <div className='flex flex-col justify-center mb-5'>
                                <div>
                                    {item.comment}
                                </div>
                                <div>
                                    Thời gian: {moment(item.created).format('YYYY-MM-DD HH:mm:ss')}
                                </div>
                                <div>
                                    Khách hàng: {item.customer.name.lastName}
                                </div>
                                <div>
                                    {[1, 2, 3, 4, 5].map((star, index) => (
                                        <span
                                            key={index}
                                            style={{ color: star <= item.star ? 'gold' : 'white' }}
                                        >
                                            &#9733;
                                        </span>
                                    ))}
                                </div>
                            </div>

                        ))} */}
          </div>
        </div>
      </div>
      <Modal
        okText="Đồng ý"
        cancelText="Huỷ"
        open={isOpen}
        title="Chỉnh sửa sản phẩm"
        onOk={onSubmit}
        onCancel={closeModal}
      >
        <FormProvider {...methods}>
          <form
            className="mt-2 flex flex-col  md:flex-col md:items-start "
            onSubmit={onSubmit}
          >
            <div className="flex flex-col w-full">
              <div className="flex flex-col flex-wrap sm:flex-row ">
                <div className="capitalize sm:text-left w-full">
                  Tên sản phẩm
                </div>
                <div className="w-full md:w-full">
                  <Input
                    classNameInput="w-full justify-items-start rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                    name="title"
                    placeholder="Tên sản phẩm"
                    register={register}
                  />
                </div>
              </div>
              <div className="flex flex-col flex-wrap sm:flex-row ">
                <div className="truncate  capitalize sm:text-left w-full">
                  Số lượng
                </div>
                <div className="w-full">
                  <Input
                    classNameInput="w-full justify-items-start rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                    name="quantity"
                    placeholder="Số lượng"
                    register={register}
                  />
                </div>
              </div>
              <div className="mt-2 flex flex-col flex-wrap sm:flex-row ">
                <div className="truncate  capitalize sm:text-left w-full">
                  Mô tả
                </div>
                <div className="w-full ">
                  <Input
                    classNameInput="w-full justify-items-start rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                    name="description"
                    placeholder="Mô tả"
                    register={register}
                  />
                </div>
              </div>
              <div className="flex flex-col flex-wrap sm:flex-row ">
                <div className="truncate  capitalize sm:text-left w-full">
                  Giá gốc
                </div>
                <div className="w-full">
                  <Input
                    classNameInput="w-full justify-items-start rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                    name="list_price"
                    placeholder="Giá gốc"
                    register={register}
                  />
                </div>
              </div>
              <div className="flex flex-col flex-wrap sm:flex-row ">
                <div className="truncate  capitalize sm:text-left w-full">
                  Giá bán
                </div>
                <div className="w-full">
                  <Input
                    classNameInput="w-full justify-items-start rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                    name="selling_price"
                    placeholder="Giá bán"
                    register={register}
                  />
                </div>
              </div>
            </div>
            <div>Chọn hương vị</div>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Chọn hương vị"
              onChange={handleChange}
              defaultValue={product.flavors?.map((item) => item.title)}
              options={options}
            />
            <div>Chọn loại</div>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Chọn loại"
              onChange={handleChangeCate}
              defaultValue={product.categories?.map((item) => item.title)}
              options={optionsCate}
            />
            <div>Chọn tính chất</div>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Chọn tính chất"
              onChange={handleChangeChar}
              defaultValue={product.characteristics?.map((item) => item.title)}
              options={optionsChar}
            />
          </form>
        </FormProvider>
      </Modal>
    </div>
  );
}
