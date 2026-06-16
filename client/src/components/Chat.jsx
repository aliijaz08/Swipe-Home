import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { FaPaperPlane } from "react-icons/fa";
import axios from "axios";
import moment from "moment";
import socket from "../socket.js";
import { Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";
import "react-toastify/dist/ReactToastify.css";

const Chat = ({ listingId, receiverId }) => {
  const { currentUser } = useSelector((state) => state.user); 
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const [confirmDeleteMsgId, setConfirmDeleteMsgId] = useState(null);

  const token = currentUser?.token;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `/api/chat/${currentUser._id}/${receiverId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Use token from currentUser
            },
          }
        );
        setMessages(res.data || []);
      } catch (error) {
        console.error("Error fetching messages:", error);
        setError("Error fetching messages. Please try again.");
      }
    };

    if (token) {
      fetchMessages();
    }
  }, [currentUser._id, receiverId, token]);

  useEffect(() => {
    if (socket) {
      socket.emit("addUser", currentUser._id);
      socket.on("getMessage", (msg) => {
        if (
          msg.receiverId === currentUser._id ||
          msg.senderId === currentUser._id
        ) {
          setMessages((prev) => [...prev, msg]);
        }
      });

      socket.on("deleteMessage", (msgId) => {
        setMessages((prev) => prev.filter((msg) => msg._id !== msgId));
      });
    }

    return () => {
      socket.off("getMessage");
      socket.off("deleteMessage");
    };
  }, [currentUser._id, receiverId]);

  const sendMessage = async () => {
    const cleanedListingId =
      typeof listingId === "object" ? listingId._id : listingId;

    if (newMessage.trim()) {
      const messageData = {
        receiverId: receiverId, // Receiver's ID
        message: newMessage, // The message text
        listingId: cleanedListingId, // Listing ID
      };

      try {
        const res = await axios.post("/api/chat/send", messageData, {
          headers: {
            Authorization: `Bearer ${token}`, // Use token from currentUser
          },
        });

        socket.emit("sendMessage", {
          ...res.data,
          room: receiverId, // Emit to the receiver's room
        });

        setMessages((prevMessages) => [...prevMessages, res.data]); // Update message state
        setNewMessage(""); // Clear the input field
      } catch (error) {
        console.error("Error sending message:", error);
        setError("Error sending message. Please try again.");
      }
    }
  };

  const handleDeleteMessage = async (msgId, timestamp, senderId) => {
    const timePassed = moment().diff(moment(timestamp), "minutes");
    if (timePassed > 5)
      return alert("You can only delete messages within 5 minutes.");

    const actualSenderId =
      typeof senderId === "object" ? senderId._id : senderId;

    if (String(actualSenderId) !== String(currentUser._id)) {
      return alert("You can only delete your own messages.");
    }

    try {
      await axios.delete(`/api/chat/delete/${msgId}`, {
        headers: {
          Authorization: `Bearer ${token}`, // Use token from currentUser
        },
      });

      setMessages((prev) => prev.filter((msg) => msg._id !== msgId));
      socket.emit("deleteMessage", { msgId, receiverId });
      toast.success("Message deleted successfully!");
    } catch (error) {
      console.error("Error deleting message:", error);
      setError("Failed to delete the message.");
    }
  };

  return (
    <div className="h-[90vh] sticky top-15 flex flex-col max-w-4xl mx-auto bg-transparent shadow-lg rounded-lg">
      <div className="bg-blue-600 text-white px-5 py-4 flex justify-between items-center rounded-t-2xl shadow-sm">
        <h2 className="font-semibold text-xl">Chat</h2>
      </div>

      {error && (
        <p className="text-red-500 text-center text-sm mt-1">{error}</p>
      )}

      <div
        className="flex-1 overflow-y-auto px-4 py-3 space-y-3"
        style={{ maxHeight: "calc(100vh - 180px)" }}
      >
        {messages.length > 0 ? (
          messages.map((msg, index) => {
            const senderId =
              typeof msg.senderId === "string"
                ? msg.senderId
                : msg.senderId._id;
            const isSender = senderId === currentUser._id;
            const isReceiver = !isSender;

            return (
              <div
                key={index}
                className={`relative flex flex-col ${
                  isSender ? "items-end self-end" : "items-start self-start"
                } mb-6`}
              >
                {/* Username Tag */}
                <div
                  className={`mb-1 px-3 text-xs font-medium rounded-full shadow-sm inline-block ${
                    isSender
                      ? "bg-blue-100 text-blue-800 mr-7"
                      : "bg-green-100 text-green-800 ml-7"
                  }`}
                  title={msg.senderId?.email || "User"}
                >
                  {msg.senderId?.username || "Unknown"}
                </div>

                {/* Message Bubble */}
                <div
                  className={`relative p-2 mr-5 ml-5 rounded-lg text-sm max-w-[75%] break-words ${
                    isSender ? "bg-blue-300" : "bg-green-300"
                  }`}
                >
                  {/* Message Text */}
                  <p>{msg.message}</p>

                  {/* Timestamp */}
                  <span
                    className={`text-xs text-gray-500 block mt-1 ${
                      isSender ? "ml-10" : "mr-10"
                    }`}
                  >
                    {moment(msg.createdAt).calendar()}
                  </span>

                  {isSender &&
                    moment().diff(moment(msg.createdAt), "minutes") <= 5 && (
                      <button
                        onClick={() => setConfirmDeleteMsgId(msg._id)}
                        className="object-cover absolute -top-0 -right-5 text-black hover:text-red-500 p-1 rounded-full transition-colors"
                        title="Delete Message"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                </div>

                {/* Avatar Outside Bubble (Bottom Corner) */}
                <img
                  src={`http://localhost:3000${
                    isSender
                      ? msg.senderId?.avatar || "/default.png"
                      : msg.senderId?.avatar || "/default.png"
                  }`}
                  className={`w-7 h-7 rounded-full object-cover absolute -bottom-4 ${
                    isSender ? "right" : "left"
                  }`}
                />
              </div>
            );
          })
        ) : (
          <p className="text-center text-gray-400">No messages yet.</p>
        )}
        <div ref={messagesEndRef} />
      </div>

      {confirmDeleteMsgId && (
        <div className="fixed inset-0 bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-gradient-to-br from-green-50 to-blue-200 rounded-lg p-6 shadow-md w-80">
            <h2 className="text-lg font-semibold mb-3">Delete Message?</h2>
            <p className="text-sm text-gray-600 mb-4">
              Are you sure you want to delete this message for both users?
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setConfirmDeleteMsgId(null)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const msg = messages.find(
                    (m) => m._id === confirmDeleteMsgId
                  );
                  if (msg) {
                    handleDeleteMessage(msg._id, msg.createdAt, msg.senderId);
                  }
                  setConfirmDeleteMsgId(null);
                }}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Bar */}
      <div className="flex items-center gap-2 border-t p-4 bg-transparent">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="Type a message..."
          className="flex-1 px-4 py-2 rounded-full border focus:outline-none focus:ring-2 focus:ring-blue-400 shadow-sm"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-md"
          title="Send"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

export default Chat;
