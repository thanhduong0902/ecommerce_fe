import { useContext, useEffect, useRef, useState } from "react";
import Pusher from "pusher-js";
import { AppContext } from "../../../context/app.context";
import { Message } from "../../../apis/chat.api";
interface IMessageDetailProp {
  groupId: number;
  userId: number;
  phone: string;
}
export default function MessageDetail(props: IMessageDetailProp) {
  const { groupId, userId, phone } = props;
  const [idUser, setIdUser] = useState(0);
  const { profile } = useContext(AppContext);

  const [newMessage, setNewMessage] = useState("");
  const [messageData, setMessageData] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const messagePayload = {
        group_id: groupId,
        user_id: profile?.id,
        message: {
          content: newMessage,
        },
      };

      try {
        const response = await fetch(
          "https://foodstore-production-167c.up.railway.app/api/auth/message/send",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(messagePayload),
          }
        );

        if (!response.ok) {
          console.error("Lỗi khi gửi tin nhắn:", await response.text());
        }
      } catch (error) {
        console.error("Lỗi khi gửi tin nhắn:", error);
      } finally {
        setNewMessage("");
      }
    }
  };
  useEffect(() => {
    const pusher = new Pusher("83cb3b3e7262e2724a5a", {
      cluster: "ap1",
    });
    const fetchGroupAndUserId = async () => {
      try {
        const response = await fetch(
          `https://foodstore-production-167c.up.railway.app/api/auth/message/group/connect?phone=${phone}`
        );
        const data = await response.json();
        if (data.groups.id && data.user_id) {
          setIdUser(data.user_id);
          setMessageData(data.messages);
        }
        const channel = pusher.subscribe(`${phone}`);
        channel.bind("sendMessage", (message: any) => {
          console.log("message", message);
          setMessageData((prev) => [...prev, message.message]);
        });
      } catch (error) {
        console.error("Lỗi khi kết nối tới API:", error);
      }
    };

    fetchGroupAndUserId();
  }, [phone, groupId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageData]);
  return (
    <div className="h-screen flex flex-col bg-gray-100 rounded-3xl">
      {/* Khung hiển thị tin nhắn */}
      <div className="flex-grow overflow-y-auto p-4">
        <div className="flex flex-col space-y-2">
          {messageData.map((item: Message) => (
            <div
              ref={scrollRef}
              key={item.id}
              className={`max-w-xs lg:max-w-md p-2 rounded-lg break-words
            ${
              item.user_id !== idUser
                ? "bg-orange text-white self-end" // Tin nhắn của user
                : "bg-gray-300 text-black self-start" // Tin nhắn của người khác
            }`}
            >
              {item.content}
            </div>
          ))}
        </div>
      </div>

      {/* Thanh nhập liệu */}
      <div className="relative bottom-0 left-0 w-full bg-white shadow-lg flex items-center p-4">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Nhập tin nhắn..."
          className="flex-grow border rounded-lg p-2 outline-none focus:ring focus:ring-orange-400"
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-orange-400 text-white py-2 px-4 rounded-lg bg-orange transition"
        >
          Gửi
        </button>
      </div>
    </div>
  );
}
