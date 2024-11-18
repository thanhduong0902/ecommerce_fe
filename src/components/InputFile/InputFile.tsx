import { Fragment, useRef } from "react";
import { toast } from "react-toastify";
import config from "../../constants/config";

interface Props {
  onChange?: (file: File[]) => void;
}

export default function InputFile({ onChange }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const filesFromLocal = Array.from(event.target.files || []);

    const validFiles = filesFromLocal.filter((file) => {
      if (
        file.size >= config.maxSizeUploadAvatar || 
        !file.type.includes("image") 
      ) {
        toast.error(`Dung lượng file tối đa 1MB. Định dạng: .JPEG, .PNG`, {
          position: "top-center",
        });
        return false; // Loại file không hợp lệ
      }
      return true; // Chỉ giữ file hợp lệ
    });

    // Gửi các file hợp lệ qua `onChange`
    if (onChange) {
      onChange(validFiles);
    }
  };

  const handleUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <Fragment>
      <input
        multiple
        className="hidden"
        type="file"
        accept=".jpg,.jpeg,.png"
        ref={fileInputRef}
        onChange={onFileChange}
        onClick={(event) => {
          (event.target as any).value = null;
        }}
      />
      <button
        className="flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm"
        type="button"
        onClick={handleUpload}
      >
        Chọn ảnh
      </button>
    </Fragment>
  );
}
