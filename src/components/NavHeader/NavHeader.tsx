import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
// import authApi from 'src/apis/auth.api'
import path from "../../constants/path";
// import { purchasesStatus } from 'src/constants/purchase'
// import { AppContext } from 'src/contexts/app.context'
import { getAvatarUrl } from "../../utils/utils";
import Popover from "../Popover";
import { AppContext } from "../../context/app.context";
import { clearLS, getProfileFromLS } from "../../utils/auth";
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

  const profileUser = getProfileFromLS();

  const handleLogout = () => {
    setIsAuthenticated(false);
    setProfile(null);
    clearLS();
    navigate("/");
  };

  useEffect(() => {
    if (profileUser) {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, []);

  // const { data: notification, refetch } = useQuery({
  //   queryKey: ["productMode"],
  //   queryFn: () => {
  //     return userApi.getNotification();
  //   },
  // });
  // const notificationData = notification?.data;

  return (
    <div className="flex justify-end text-xl">
      {isAuthenticated && (
        <Popover
          className="ml-6  flex cursor-pointer items-center hover:text-white/70"
          renderPopover={
            <div className="relative z-50 rounded-sm border border-gray-200 bg-white shadow-md">
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
            className="mx-3 capitalize hover:text-white/40"
          >
            Đăng ký
          </Link>
          <span>|</span>
          <div className="border-r-[1px] border-r-white/40" />
          <Link to={path.login} className="mx-3 capitalize hover:text-white/70">
            Đăng nhập
          </Link>
        </div>
      )}
    </div>
  );
}
