import { Image } from "antd";
import "./style.css";
export default function About() {
  return (
    <div className="h-screen about p-20">
      <div className="m-10 p-5 rounded-3xl border-8 border-white bg-blue-500 flex flex-col gap-5 font-pacifico">
        <div className="text-6xl font-bold font-pacifico text-white">
          Giới thiệu
        </div>
        <div className="flex flex-row items-center gap-10 w-full text-white">
          <div className="w-5/6 flex flex-col gap-5">
            <div>
              PepsiCo Foods Việt Nam với hơn 10 năm hoạt động tại Việt Nam, hiện
              nay là một trong những công ty sản xuất thực phẩm hàng đầu tại
              Việt Nam với nhãn hiệu chính là “Poca” cùng đội ngũ hơn 300 nhân
              viên có mặt tại khắp các tỉnh thành trên cả nước.”
            </div>
            <div>
              Sứ mệnh PepsiCo Foods đề ra là: “Trở thành công ty hàng đầu về sản
              xuất thực phẩm bánh snack Chúng tôi không ngừng tìm kiếm và tạo ra
              các hiệu quả tài chính lành mạnh cho các nhà đầu tư, tạo cơ hội
              phát triển và đem lại nhiều lợi ích kinh tế cho nhân viên, các đối
              tác kinh doanh và cộng đồng nơi chúng tôi hoạt động. Chúng tôi
              luôn phấn đấu hoạt động trên cơ sở trung thực, công bằng và chính
              trực trong mọi hành động của mình.
            </div>
          </div>

          <Image src="/assets/Logo.png" preview={false} />
        </div>
      </div>
    </div>
  );
}
