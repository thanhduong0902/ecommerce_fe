import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useEffect, useState } from "react";
import specificApi from "../../../apis/specific.api";
import { Modal } from "antd";
import { toast } from "react-toastify";

export default function Flavor() {
  const [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }

  const [flavorTitle, setFlavorTitle] = useState("");

  const {
    data: flavorData,
    refetch,
    isLoading,
  } = useQuery({
    queryKey: ["flavor"],
    queryFn: () => {
      return specificApi.getFlavor();
    },
  });

  const handleFlavorTitleChange = (event: any) => {
    setFlavorTitle(event.target.value);
  };

  const createFlavorMutation = useMutation({
    mutationFn: specificApi.createFlavor,
  });

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleOk = () => {
    const body = {
      title: flavorTitle,
    };
    createFlavorMutation.mutate(body, {
      onSuccess: (response) => {
        toast.success("Thành công", {
          position: "top-center",
          autoClose: 1000,
        });
        refetch();
        setFlavorTitle("");
        setIsOpen(!isOpen);
      },
    });
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <span>Loading...</span>
        </div>
      ) : (
        flavorData && (
          <>
            <div className="flex flex-row justify-between items-center">
              <h2 className="text-xl font-bold my-4">Hương vị</h2>
              <div className="" onClick={() => setIsOpen(true)}>
                <button className="px-4 py-2 w-40 items-center text-white bg-orange rounded-md shadow-md">
                  Thêm hương vị
                </button>
              </div>
            </div>
            <div className="grid grid-cols-5 gap-4">
              {flavorData?.data?.map((category) => (
                <div
                  key={category.id}
                  className="p-4 text-center border rounded-md shadow-md"
                >
                  <div className="text-4xl">🍞</div>
                  <p className="mt-2 font-semibold">{category.title}</p>
                </div>
              ))}
            </div>
          </>
        )
      )}

      <Modal
        open={isOpen}
        onOk={handleOk}
        title="Thêm hương vị"
        onCancel={closeModal}
      >
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600">
            Tên hương vị
          </label>
          <input
            type="text"
            className="w-full mt-1 border rounded-md p-2 text-sm focus:outline-none focus:ring focus:border-orange-500"
            placeholder="Nhập tên hương vị"
            value={flavorTitle}
            onChange={handleFlavorTitleChange}
          />
        </div>
      </Modal>
    </div>
  );
}
