import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
// import authApi from 'src/apis/auth.api'
import path from "../../constants/path";
// import { purchasesStatus } from 'src/constants/purchase'
// import { AppContext } from 'src/contexts/app.context'
import { getAvatarUrl } from "../../utils/utils";
import Popover from "../Popover";
import { AppContext } from "../../context/app.context";
import { clearLS } from "../../utils/auth";
import userApi from "../../apis/user.api";
import moment from "moment";
import { BellOutlined } from "@ant-design/icons";
// import { useTranslation } from 'react-i18next'
// import { locales } from 'src/i18n/i18n'

export default function NavHeader() {
  const navigate = useNavigate();
  const { setIsAuthenticated, isAuthenticated, setProfile, profile } =
    useContext(AppContext);
  const queryClient = useQueryClient();

  const handleLogout = () => {
    setIsAuthenticated(false);
    setProfile(null);
    clearLS();
    navigate("/");
  };

  // const { data: notification, refetch } = useQuery({
  //   queryKey: ["productMode"],
  //   queryFn: () => {
  //     return userApi.getNotification();
  //   },
  // });
  // const notificationData = notification?.data;

  return (
    <div className="flex justify-end text-2xl">
      <Popover
        className="flex cursor-pointer items-center py-1 hover:text-white/70 "
        renderPopover={
          <div className="h-80 overflow-auto relative rounded-sm border border-gray-200 bg-white shadow-md flex flex-col">
            {/* {notificationData &&
              notificationData.map((item: any) => (
                <div className="flex flex-col p-2">
                  <p className="text-orange">{item.title}</p>
                  <span>{item.notification}</span>
                  <p>
                    Thời gian{" "}
                    {moment(item.created).format("YYYY-MM-DD HH:mm:ss")}
                  </p>
                </div>
              ))} */}
          </div>
        }
      >
        <BellOutlined size={30} />
      </Popover>
      {isAuthenticated && (
        <Popover
          className="ml-6 flex cursor-pointer items-center py-1 hover:text-white/70"
          renderPopover={
            <div className="relative rounded-sm border border-gray-200 bg-white shadow-md">
              <Link
                to={path.profile}
                className="block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500"
              >
                Tài khoản của tôi
              </Link>
              <Link
                to={path.historyPurchase}
                className="block w-full bg-white px-4 py-3 text-left hover:bg-slate-100 hover:text-cyan-500"
              >
                Đơn mua
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
          <div className="text-black">{profile?.name}</div>
        </Popover>
      )}
      {!isAuthenticated && (
        <div className="flex items-center">
          <Link
            to={path.register}
            className="mx-3 capitalize hover:text-white/70"
          >
            Đăng ký
          </Link>
          <div className="h-4 border-r-[1px] border-r-white/40" />
          <Link to={path.login} className="mx-3 capitalize hover:text-white/70">
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  );
}
