import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import useQueryConfig from "../../../../hooks/useQueryConfig";
import Product from "../../../ProductList/components/Product";
import shopApi from "../../../../apis/shop.api";
import ProductComponent from "./ProductComponent";
import { useEffect, useMemo, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import Input from "../../../../components/Input";
import InputFile from "../../../../components/InputFile";
import { toast } from "react-toastify";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Button, Modal, Select, SelectProps } from "antd";
import specificApi from "../../../../apis/specific.api";

export default function ProductShop() {
  const [file, setFile] = useState<File[]>();
  const [flavor, setFlavor] = useState<number[]>([]);
  const [category, setCategory] = useState<number[]>([]);
  const [charactics, setCharactics] = useState<number[]>([]);

  const queryConfig = useQueryConfig();
  const [isOpen, setIsOpen] = useState(false);

  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [options, setOptions] = useState<SelectProps["options"]>([]);
  const [optionsCate, setOptionsCate] = useState<SelectProps["options"]>([]);
  const [optionsChar, setOptionsChar] = useState<SelectProps["options"]>([]);

  const { data: productsData, refetch } = useQuery({
    queryKey: ["productShop"],
    queryFn: () => {
      return shopApi.getProduct();
    },
  });
  const addImageMutation = useMutation({
    mutationFn: shopApi.addImageProduct,
    onSuccess: (data) => {
      toast.success("Thành công", {
        position: "top-center",
        autoClose: 1000,
      });
    },
  });

  const createProductMutation = useMutation({
    mutationFn: shopApi.createProduct,
  });
  function closeModal() {
    setIsOpen(false);
  }

  const methods = useForm<any>({
    defaultValues: {
      title: "",
      selling_price: 0,
      list_price: 0,
      quantity: 0,
      description: "",
      is_selling: true,
      images: "",
      main_image: "",
      flavor: [],
      category: [],
      characteristics: [],
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

  const url = "https://pushimage-production.up.railway.app/api/auth/image/";

  const [linkFile, setLinkFile] = useState<string[]>([]);
  const navigate = useNavigate();

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
  const handleChangeFile = async (file: File[]) => {
    if (file) {
      try {
        console.log("filess", file);
        const formData = new FormData();
        file.forEach((file) => {
          formData.append("images[]", file);
        });
        const response = await addImageMutation.mutateAsync(formData);
        const dataResponse = response.data.images.map((item: any) => item.link);
        setLinkFile(dataResponse);
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
    setFile(file);
  };

  const onSubmit = handleSubmit((data: any) => {
    const imageObjects = linkFile.map((link) => ({
      link: link,
    }));
    const body = {
      title: data.title,
      selling_price: data.selling_price,
      quantity: data.quantity,
      description: data.description,
      list_price: data.list_price,
      is_selling: true,
      images: imageObjects,
      main_image: linkFile[0],
      flavors: flavor,
      categories: category,
      characteristics: charactics,
    };
    createProductMutation.mutate(body, {
      onSuccess: (response) => {
        toast.success("Thành công", {
          position: "top-center",
          autoClose: 1000,
        });
        refetch();
        setIsOpen(!isOpen);
      },
    });
  });

  const handleChange = (value: number[]) => {
    setFlavor(value);
  };

  const handleChangeCate = (value: number[]) => {
    setCategory(value);
  };
  const handleChangeChar = (value: number[]) => {
    setCharactics(value);
  };
  const location = useLocation(); // Hook để lấy đường dẫn hiện tại

  const handleDetail = (id: number) => {
    const currentPath = location.pathname;
    navigate(`${currentPath}/${id}`);
  };

  return (
    <div className="container">
      <div className="flex justify-center my-5">
        <Button
          onClick={() => {
            setIsOpen(true);
          }}
          className="flex h-9 items-center rounded-3xl bg-orange p-5 text-center text-sm text-white hover:bg-orange"
        >
          Thêm sản phẩm
        </Button>
      </div>
      {productsData && (
        <div className="grid grid-cols-6 gap-6">
          <div className="col-span-9">
            <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {productsData?.data?.data?.map((product: any) => (
                <div
                  className="col-span-1"
                  key={product.id}
                  onClick={() => handleDetail(product.id)}
                >
                  <ProductComponent product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Modal
        open={isOpen}
        title="Thêm sản phẩm"
        onOk={onSubmit}
        onCancel={closeModal}
        okText="Đồng ý"
        cancelText="Huỷ"
      >
        <FormProvider {...methods}>
          <form
            className="mt-2 flex flex-col md:flex-col md:items-start"
            onSubmit={onSubmit}
          >
            <div className="flex flex-col w-full">
              <div className="flex flex-col gap-2">
                <div className="truncate capitalize sm:text-left">
                  Tên sản phẩm
                </div>
                <div className="w-full">
                  <Input
                    classNameInput="w-full justify-items-start rounded-2xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                    name="title"
                    placeholder="Tên sản phẩm"
                    register={register}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <div className="truncate capitalize sm:text-left">Số lượng</div>
                <div className="w-full">
                  <Input
                    classNameInput="w-full justify-items-start rounded-2xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                    name="quantity"
                    placeholder="Số lượng"
                    register={register}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <div className="truncate pt-3 capitalize sm:text-left">
                  Mô tả
                </div>
                <div className="w-full">
                  <textarea
                    className="h-20 orange-border w-full rounded-2xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                    placeholder="Nhập nội dung..."
                    {...register("description")}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <div className="truncate pt-3 capitalize sm:text-left">
                  Giá gốc
                </div>
                <div className="w-full">
                  <Input
                    classNameInput="w-full justify-items-start rounded-2xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
                    name="list_price"
                    placeholder="Giá gốc"
                    register={register}
                  />
                </div>
              </div>
              <div className="flex flex-col gap-1 w-full">
                <div className="truncate pt-3 capitalize sm:text-left">
                  Giá bán
                </div>
                <div className="w-full">
                  <Input
                    classNameInput="w-full justify-items-start rounded-2xl border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm"
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
              options={options}
            />
            <div>Chọn loại</div>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Chọn loại"
              onChange={handleChangeCate}
              options={optionsCate}
            />
            <div>Chọn tính chất</div>
            <Select
              mode="multiple"
              allowClear
              style={{ width: "100%" }}
              placeholder="Chọn tính chất"
              onChange={handleChangeChar}
              options={optionsChar}
            />
            <div className="mt-2 flex flex-wrap items-center gap-4">
              {linkFile.map((image, index) => (
                <div key={index} className="h-24 w-24">
                  <img
                    src={`${url + image}`}
                    alt={`Preview ${index}`}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
              ))}
              <InputFile onChange={handleChangeFile} />
            </div>
          </form>
        </FormProvider>
      </Modal>
    </div>
  );
}
