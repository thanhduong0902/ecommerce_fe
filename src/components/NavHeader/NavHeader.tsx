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

  const { data: notification, refetch } = useQuery({
    queryKey: ["productMode"],
    queryFn: () => {
      return userApi.getNotification();
    },
  });
  const notificationData = notification?.data;

  return (
    <div className="flex justify-end">
      <Popover
        className="flex cursor-pointer items-center py-1 hover:text-white/70 "
        renderPopover={
          <div className="h-80 overflow-auto relative rounded-sm border border-gray-200 bg-white shadow-md flex flex-col">
            {notificationData &&
              notificationData.map((item: any) => (
                <div className="flex flex-col p-2">
                  <p className="text-orange">{item.title}</p>
                  <span>{item.notification}</span>
                  <p>
                    Thời gian{" "}
                    {moment(item.created).format("YYYY-MM-DD HH:mm:ss")}
                  </p>
                </div>
              ))}
          </div>
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          stroke="currentColor"
          strokeWidth={1.5}
          viewBox="0 0 448 512"
        >
          <path d="M224 0c-17.7 0-32 14.3-32 32V51.2C119 66 64 130.6 64 208v25.4c0 45.4-15.5 89.5-43.8 124.9L5.3 377c-5.8 7.2-6.9 17.1-2.9 25.4S14.8 416 24 416H424c9.2 0 17.6-5.3 21.6-13.6s2.9-18.2-2.9-25.4l-14.9-18.6C399.5 322.9 384 278.8 384 233.4V208c0-77.4-55-142-128-156.8V32c0-17.7-14.3-32-32-32zm0 96c61.9 0 112 50.1 112 112v25.4c0 47.9 13.9 94.6 39.7 134.6H72.3C98.1 328 112 281.3 112 233.4V208c0-61.9 50.1-112 112-112zm64 352H224 160c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7s18.7-28.3 18.7-45.3z" />
        </svg>
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
