import { Carousel, Image } from "antd";
import React, { useState } from "react";
import "./style.css";

export default function Home() {
  const contentStyle: React.CSSProperties = {
    height: "160px",
    color: "#fff",
    lineHeight: "160px",
    textAlign: "center",
    background: "#364d79",
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    arrows: true,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  const [currentSlide, setCurrentSlide] = useState(1);

  const onChange = (current: number) => {
    if (current === 5) setCurrentSlide(0);
    else setCurrentSlide(current + 1);
  };

  const dataHotAdv = [
    {
      id: 0,
      title: "Hỗ trợ đa nền tảng",
      content: "Sản phẩm đã có mặt trên iOS, Android và Website",
      img: "/assets/banner1.png",
    },
    {
      id: 1,
      title: "Dễ sử dụng",
      content:
        "Giao diện đơn giản và thân thiện, giúp người dùng tiết kiệm thời gian",
      img: "/assets/banner2.png",
    },
    {
      id: 2,
      title: "Hiệu quả",
      content: "Đem đến giải pháp cho yêu cầu của người dùng",
      img: "/assets/banner3.png",
    },
    {
      id: 3,
      title: "Cá nhân hoá",
      content: "Cho phép tuỳ chỉnh theo mong muốn của người dùng",
      img: "/assets/banner4.png",
    },
    {
      id: 4,
      title: "Cá nhân hoá",
      content: "Cho phép tuỳ chỉnh theo mong muốn của người dùng",
      img: "/assets/banner5.png",
    },
    {
      id: 5,
      title: "Cá nhân hoá",
      content: "Cho phép tuỳ chỉnh theo mong muốn của người dùng",
      img: "/assets/banner5.png",
    },
  ];
  return (
    <div>
      <div className="flex flex-col gap-5 py-5 bg-orange">
        <div className=" font-pacifico font-bold text-5xl text-center">
          Sản phẩm nổi bật
        </div>
        <div className="py-4">
          <Carousel
            {...settings}
            swipeToSlide
            draggable
            autoplay
            afterChange={onChange}
          >
            {dataHotAdv.map((item, index) => (
              <div
                className={
                  currentSlide === item.id
                    ? "carousel-item focused"
                    : "carousel-item"
                }
                key={index}
              >
                <Image src={item.img} preview={false} />
              </div>
            ))}
          </Carousel>
        </div>
        <div className="font-pacifico text-4xl text-center ">Xem thêm</div>
      </div>

      <div className="flex flex-col gap-5 py-5 bg-green">
        <div className=" font-pacifico font-bold text-5xl text-center">
          Khuyến mãi
        </div>
        <div className="flex flex-row items-start gap-6 mx-10 justify-center">
          <div className="bg-white flex flex-col gap-10 rounded-3xl p-5">
            <Image
              src="/assets/banner3.png"
              preview={false}
              height={300}
              style={{ width: "100%", objectFit: "contain" }}
            />
            <div className="font-bold">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor.
            </div>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor.
            </div>
            <div className="text-orange font-bold">Xem thêm</div>
          </div>
          <div className="bg-white flex flex-col gap-10 rounded-3xl p-5">
            <Image
              src="/assets/banner3.png"
              preview={false}
              height={300}
              style={{ width: "100%", objectFit: "contain" }}
            />
            <div className="font-bold">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor.
            </div>
            <div>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor.
            </div>
            <div className="text-orange font-bold">Xem thêm</div>
          </div>
        </div>
      </div>
    </div>
  );
}
