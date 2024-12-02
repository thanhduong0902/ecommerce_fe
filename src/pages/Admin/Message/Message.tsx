import { useContext, useEffect, useState } from "react";
import Pusher from "pusher-js";
import { AppContext } from "../../../context/app.context";
import { useQuery } from "@tanstack/react-query";
import chatApi, { Group } from "../../../apis/chat.api";
import { getAccessTokenFromLS } from "../../../utils/auth";
import axios from "axios";
import { Image } from "antd";
export default function Message() {
  const { profile } = useContext(AppContext);
  const token = getAccessTokenFromLS();
  const [groups, setGroups] = useState<Group[]>();
  const [refresh, setRefresh] = useState(true);

  function formatTimeDifference(updatedAt: string) {
    const now = new Date();
    const updatedDate = new Date(updatedAt);
    const diffInMilliseconds = now.getTime() - updatedDate.getTime();

    const diffInMinutes = Math.floor(diffInMilliseconds / (1000 * 60));
    const diffInHours = Math.floor(diffInMilliseconds / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMilliseconds / (1000 * 60 * 60 * 24));

    if (diffInMinutes < 60) {
      return `${diffInMinutes} phút trước`;
    } else if (diffInHours < 24) {
      return `${diffInHours} giờ trước`;
    } else {
      return `${diffInDays} ngày trước`;
    }
  }

  useEffect(() => {
    const pusher = new Pusher("83cb3b3e7262e2724a5a", {
      cluster: "ap1",
    });
    if (profile) {
      const channel = pusher.subscribe("adminChat");
      channel.bind("adminChat", function (data: any) {
        setRefresh((prevRefresh) => !prevRefresh);
      });
    }
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      if (token) {
        try {
          const response = await axios.get(
            "https://foodstore-production-167c.up.railway.app/api/v1/admin/chat/groups",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setGroups(response.data.groups);
          console.log(response.data);
        } catch (error) {
          console.log("bug");
        }
      }
    };
    fetchUserData();
  }, [refresh]);
  return (
    <div className="grid h-screen grid-cols-[1fr,2fr] gap-4 p-4">
      {/* Cột đầu tiên (2/3 màn hình) */}
      <div className="bg-slate-300 h-full rounded-lg p-4">
        <div className="text-lg font-bold">Tin nhắn mới</div>
        {groups &&
          groups.map((item: Group) => (
            <>
              <div className="rounded-2xl p-2 bg-slate-400 flex flex-row items-center justify-between my-2">
                <div className="flex flex-row gap-2 items-center">
                  <Image
                    src="/assets/user.svg"
                    width={60}
                    height={60}
                    preview={false}
                  />
                  <div className="flex flex-col gap-2">
                    <div>{item.name}</div>
                    <div>{item.last_message.content}</div>
                  </div>
                </div>
                <div>{formatTimeDifference(item.last_message.updated_at)}</div>
              </div>
            </>
          ))}
      </div>
      {/* Cột thứ hai (1/3 màn hình) */}
      <div className="bg-orange h-full rounded-lg p-4">
        {/* Nội dung khác */}
      </div>
    </div>
  );
}
