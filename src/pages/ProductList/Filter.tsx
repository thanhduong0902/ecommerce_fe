import { useQuery } from "@tanstack/react-query";
import { Select, SelectProps } from "antd";
import { useEffect, useState } from "react";
import specificApi from "../../apis/specific.api";
import { Specific } from "../../types/product.type";

export default function Filter({ onFilter }: any) {
  const [flavor, setFlavor] = useState<number[]>([]);
  const [category, setCategory] = useState<number[]>([]);
  const [charactics, setCharactics] = useState<number[]>([]);

  const [options, setOptions] = useState<SelectProps["options"]>([]);
  const [optionsCate, setOptionsCate] = useState<SelectProps["options"]>([]);
  const [optionsChar, setOptionsChar] = useState<SelectProps["options"]>([]);

  const { data: menuData } = useQuery({
    queryKey: ["menu"],
    queryFn: () => {
      return specificApi.getDataSpecifc();
    },
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

  const handleFilter = () => {
    const body = {
      filters: {
        categories: category,
        characteristics: charactics,
        flavors: flavor,
      },
    };
    onFilter(body); // Gọi hàm `onFilter` từ props
  };

  useEffect(() => {
    if (menuData) {
      const newOptions = menuData?.data?.categories.map((item: Specific) => ({
        label: item.title,
        value: item.id,
      }));
      setOptionsCate(newOptions);

      const newOptions1 = menuData?.data?.flavors.map((item: Specific) => ({
        label: item.title,
        value: item.id,
      }));
      setOptions(newOptions1);

      const newOptions2 = menuData?.data?.characteristics.map(
        (item: Specific) => ({
          label: item.title,
          value: item.id,
        })
      );
      setOptionsChar(newOptions2);
    }
  }, [menuData]);

  return (
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
  );
}
