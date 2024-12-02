import React, { useContext, useEffect, useRef, useState } from "react";
import "./style.css"; // Bạn có thể tạo file CSS riêng để quản lý giao diện
import { AppContext } from "../../../context/app.context";
import Pusher from "pusher-js";
import { Message } from "../../../apis/chat.api";

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { profile } = useContext(AppContext);
  const [groupId, setGroupId] = useState(null);
  const [userId, setUserId] = useState(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Chào bạn, bạn muốn tư vấn gì!",
    },
  ]);
  const [messageData, setMessageData] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const messagePayload = {
        group_id: groupId,
        user_id: userId,
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
          `https://foodstore-production-167c.up.railway.app/api/auth/message/group/connect?phone=${profile?.phone}`
        );
        const data = await response.json();
        if (data.groups.id && data.user_id) {
          console.log("getData");
          setGroupId(data.groups.id);
          setUserId(data.user_id);
          setMessageData(data.messages);
        }

        const channel = pusher.subscribe(`${profile?.phone}`);
        channel.bind("sendMessage", (message: any) => {
          console.log("message", message);
          setMessageData((prev) => [...prev, message.message]);
        });
      } catch (error) {
        console.error("Lỗi khi kết nối tới API:", error);
      }
    };

    fetchGroupAndUserId();
  }, [profile?.phone]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageData]);

  return (
    <div>
      {/* Nút chat nhỏ ở góc phải */}
      <button className="chat-button" onClick={() => setIsOpen(!isOpen)}>
        Chat
      </button>

      {/* Modal chat */}
      {isOpen && (
        <div className="chat-modal">
          <div className="chat-header">
            <h3>Tư vấn viên</h3>
            <button onClick={() => setIsOpen(false)} className="close-btn">
              X
            </button>
          </div>
          <div className="chat-body">
            <div className="flex flex-col">
              <div className="message">{messages[0].text}</div>
              {messageData.map((item: Message) => (
                <div
                  ref={scrollRef}
                  key={item.id}
                  className={`p-2 rounded-lg my-2 inline-block
                  ${
                    item.user_id === userId
                      ? "bg-orange text-right ml-auto " // Tin nhắn của user
                      : "bg-gray-300 text-left mr-auto " // Tin nhắn của người khác
                  }`}
                >
                  {item.content}
                </div>
              ))}
            </div>
          </div>
          <div className="chat-footer">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Nhập tin nhắn..."
            />
            <button onClick={handleSendMessage} className="send-btn">
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;
