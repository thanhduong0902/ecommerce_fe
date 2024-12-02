import { useMutation, useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import specificApi from "../../../apis/specific.api";
import { Modal } from "antd";
import { toast } from "react-toastify";

export default function Characteric() {
  const [isOpen, setIsOpen] = useState(false);
  function closeModal() {
    setIsOpen(false);
  }

  const [CharactericTitle, setCharactericTitle] = useState("");

  const { data: CharactericData, refetch } = useQuery({
    queryKey: ["Characteric"],
    queryFn: () => {
      return specificApi.getCharacterics();
    },
  });

  const handleCharactericTitleChange = (event: any) => {
    setCharactericTitle(event.target.value);
  };

  const createCharactericMutation = useMutation({
    mutationFn: specificApi.createCharacteric,
  });

  const handleCancel = () => {
    setIsOpen(false);
  };

  const handleOk = () => {
    const body = {
      title: CharactericTitle,
    };
    createCharactericMutation.mutate(body, {
      onSuccess: (response) => {
        toast.success("Thành công", {
          position: "top-center",
          autoClose: 1000,
        });
        refetch();
        setCharactericTitle("");
        setIsOpen(!isOpen);
      },
    });
  };

  return (
    <div>
      <div className="flex flex-row justify-between items-center">
        <h2 className="text-xl font-bold my-4">Tính chất</h2>
        <div className="" onClick={() => setIsOpen(true)}>
          <button className="px-4 py-2 w-40 items-center text-white bg-orange rounded-md shadow-md">
            Thêm tính chất
          </button>
        </div>
      </div>
      <div className="grid grid-cols-5 gap-4">
        {CharactericData?.data?.map((Characteric) => (
          <div
            key={Characteric.id}
            className="p-4 text-center border rounded-md shadow-md"
          >
            <div className="text-4xl">🍞</div>
            <p className="mt-2 font-semibold">{Characteric.title}</p>
          </div>
        ))}
      </div>

      <Modal
        open={isOpen}
        onOk={handleOk}
        title="Thêm tính chất"
        onCancel={closeModal}
        okText="Đồng ý"
        cancelText="Huỷ"
      >
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-600">
            Tên tính chất
          </label>
          <input
            type="text"
            className="w-full mt-1 border rounded-md p-2 text-sm focus:outline-none focus:ring focus:border-orange-500"
            placeholder="Nhập tên loại"
            value={CharactericTitle}
            onChange={handleCharactericTitleChange}
          />
        </div>
      </Modal>
    </div>
  );
}
