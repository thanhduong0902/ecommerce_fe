import {
  FacebookOutlined,
  InstagramOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import "./style.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container h-60 items-center flex justify-evenly flex-row pl-80">
        <div className="flex flex-col gap-10">
          <div className="w-16 h-16 flex items-center text-white gap-2">
            <FacebookOutlined style={{ color: "white", fontSize: "50px" }} />
            <div className="text-3xl">/YumYum</div>
          </div>
          <div className="w-16 h-16 flex items-center text-white gap-2">
            <InstagramOutlined style={{ color: "white", fontSize: "50px" }} />
            <div className="text-3xl">/YumYum</div>
          </div>
        </div>
        <div className="flex flex-col gap-10">
          <div className="w-16 h-16 flex items-center text-white gap-2">
            <PhoneOutlined style={{ color: "white", fontSize: "50px" }} />
            <div className="text-3xl">/YumYum</div>
          </div>
          <div className="w-16 h-16 flex items-center text-white gap-2">
            <MailOutlined style={{ color: "white", fontSize: "50px" }} />
            <div className="text-3xl">/YumYum</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
