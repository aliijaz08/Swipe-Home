import React from "react";
import { useParams } from "react-router-dom";
import Chat from "../components/Chat";

const ChatPage = () => {
  const { listingId, receiverId } = useParams();

  return (
     <div className="min-h-screen bg-gradient-to-br from-blue-200 to-orange-200">
      <Chat listingId={listingId} receiverId={receiverId} />
    </div>
  );
  
};

export default ChatPage;
