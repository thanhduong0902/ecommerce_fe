import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import specificApi from "../../../apis/specific.api";
import { Modal } from "antd";
import { toast } from "react-toastify";

export default function Category() {
  const [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }

  const [categoryTitle, setcategoryTitle] = useState("");

  const { data: categoryData, refetch } = useQuery({
    queryKey: ["category"],
    queryFn: () => {
      return specificApi.getCategory();
    },
  });

  const handlecategoryTitleChange = (event: any) => {
    setcategoryTitle(event.target.value);
  };

  const createcategoryMutation = useMutation({
    mutationFn: specificApi.createCategory,
  });

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleOk = () => {
    const body = {
      title: categoryTitle,
    };
    createcategoryMutation.mutate(body, {
      onSuccess: (response) => {
        toast.success("Thành công", {
          position: "top-center",
          autoClose: 1000,
        });
        refetch();
        setcategoryTitle("");
        setIsOpen(!isOpen);
      },
    });
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-xl font-bold my-4">Loại</h2>
        <div className="" onClick={() => setIsOpen(true)}>
          <button className="px-4 py-2 w-40 items-center text-white bg-orange rounded-md shadow-md">
            Thêm loại
          </button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {categoryData?.data?.map((category) => (
          <div
            key={category.id}
            className="p-4 text-center border rounded-md shadow-md"
          >
            <div className="text-4xl">🍞</div>
            <p className="mt-2 font-semibold">{category.title}</p>
          </div>
        ))}
      </div>

      <Modal
        open={isOpen}
        onOk={handleOk}
        title="Thêm loại"
        onCancel={closeModal}
      >
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600">
            Tên loại
          </label>
          <input
            type="text"
            className="w-full mt-1 border rounded-md p-2 text-sm focus:outline-none focus:ring focus:border-orange-500"
            placeholder="Nhập tên loại"
            value={categoryTitle}
            onChange={handlecategoryTitleChange}
          />
        </div>
      </Modal>
    </div>
  );
}
