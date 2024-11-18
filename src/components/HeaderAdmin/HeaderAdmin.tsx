import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import NavHeader from "../NavHeader";
import { AppContext } from "../../context/app.context";
import Popover from "../Popover";
import { UserOutlined } from "@ant-design/icons";
import { clearLS } from "../../utils/auth";
import { Image } from "antd";

export default function Header() {
  const {
    isAuthenticated,
    searchValue,
    setSearchValue,
    setIsAuthenticated,
    setProfile,
  } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    setIsAuthenticated(false);
    setProfile(null);
    clearLS();
    navigate("/");
  };

  const { profile } = useContext(AppContext);

  return (
    <div className="bg-yellow items-center text-white py-2 border-b-2 border-orange">
      <div className="container flex flex-row justify-between">
        <div>
          <Link to="/admin">
            <Image
              src="/assets/Logo.png"
              // alt="no purchase"
              className="h-20 w-32"
            />
          </Link>
        </div>

        {isAuthenticated && (
          <Popover
            className="flex cursor-pointer items-center py-1 hover:text-white/70"
            renderPopover={
              <div className="relative rounded-sm border border-gray-200 bg-white shadow-md">
                <Link
                  to={""}
                  className="block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500"
                >
                  Tài khoản của tôi
                </Link>

                <button
                  onClick={handleLogout}
                  className="block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500"
                >
                  Đăng xuất
                </button>
              </div>
            }
          >
            <div className="flex flex-row items-center gap-3">
              <div>
                <UserOutlined style={{ fontSize: "24px", color: "#000" }} />
              </div>
              <div className="text-black">{profile?.name}</div>
            </div>
          </Popover>
        )}
      </div>
    </div>
  );
}
