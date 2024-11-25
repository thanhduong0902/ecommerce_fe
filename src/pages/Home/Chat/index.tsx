import React, { useState } from "react";
import "./style.css"; // Bạn có thể tạo file CSS riêng để quản lý giao diện

const Chat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Chào bạn, tôi có thể giúp gì cho bạn hôm nay?" },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { id: messages.length + 1, text: newMessage }]);
      setNewMessage("");
    }
  };

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
            <div className="messages">
              {messages.map((message) => (
                <div key={message.id} className="message">
                  {message.text}
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
