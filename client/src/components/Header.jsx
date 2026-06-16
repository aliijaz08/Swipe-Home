import React from "react";
import {
  FaSearch,
  FaBars,
  FaTimes,
  FaHome,
  FaInfoCircle,
  FaBell,
  FaHeart,
  FaChartBar,
  FaUser,
} from "react-icons/fa";
import { useLocation } from "react-router-dom";


import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import socket from "../socket";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { currentUser } = useSelector((state) => state.user);
  const [unread, setUnread] = useState(false);
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const location = useLocation(); 

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const searchTermFromURL = urlParams.get("searchTerm");
    if (searchTermFromURL) {
      setSearchTerm(searchTermFromURL);
    }
  });

  useEffect(() => {
    if (!currentUser) return;

    
    if (!socket.connected) {
      socket.connect(); 
    }

    socket.emit("addUser", currentUser._id);

    socket.emit("join", currentUser._id);

    socket.on("newNotification", (notif) => {
      setUnread(true);
      setNotifications((prev) => [...prev, notif]);
    });

    // Listen for new messages
    socket.on("newMessage", (message) => {
      // Handle the new message (e.g., update the chat state or show a notification)
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off("newNotification");
      socket.off("newMessage");
    };
  }, [currentUser]);

  const handleNotificationClick = () => {
    setUnread(false);
    navigate("/notifications");
  };

  const getNavItemClass = (path) => {
    return location.pathname === path
      ? "text-orange-400"  // Highlight active item
      : "text-gray-300 group-hover:text-orange-400";
  };

  return (
    <header className="sticky top-0 z-50 bg-gray-700 shadow-md">
  <div className="relative flex items-center justify-between p-3 max-w-8xl mx-auto">
    {/* Left Side: Logo */}
    <Link to="/" className="flex items-center gap-2">
      <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="hidden sm:block">
        <path d="M8 16h16M20 12l4 4-4 4" stroke="url(#gradient)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#3b82f6" />
          </linearGradient>
        </defs>
      </svg>
      <h1 className="text-sm sm:text-2xl flex flex-wrap italic font-extrabold bg-gradient-to-r from-orange-500 to-blue-500 bg-clip-text text-transparent tracking-wide">
        <span className="px-1">Swipe</span>
        <span className="px-1">Home</span>
      </h1>
    </Link>

    <ul className="hidden sm:flex absolute left-1/2 -translate-x-1/2 items-center gap-6 md:gap-15 text-sm font-semibold text-gray-50">
    <Link to="/">
              <li className={`flex flex-col items-center group hover:text-orange-400 transition ${getNavItemClass("/")}`}>
                <FaHome className="text-2xl" />
                <span className="text-xs text-gray-300 group-hover:text-orange-400">
                  Home
                </span>
              </li>
            </Link>
             
               <li onClick={handleNotificationClick} className={`flex flex-col items-center cursor-pointer group hover:text-orange-400 transition ${getNavItemClass("/notifications")}`}>
                
              <FaBell className="text-2xl" />
              <span className="text-xs text-gray-300 cursor-pointer group-hover:text-orange-400">
                Notifications
              </span>
              {unread && (
                <span className="absolute top-1 right-2 w-2.5 h-2.5 bg-red-500 rounded-full animate-ping"></span>
              )}
              </li>
            <Link to="/favourites"> 
            <li className={`flex flex-col items-center group hover:text-orange-400 transition ${getNavItemClass("/favourites")}`}>
          
                <FaHeart className="text-2xl" />
                <span className="text-xs text-gray-300 group-hover:text-orange-400">
                  Favourites
                </span>
              </li>
            </Link>
            <Link to="/analytics">
             <li className={`flex flex-col items-center group hover:text-orange-400 transition ${getNavItemClass("/analytics")}`}>
          
                <FaChartBar className="text-2xl" />
                <span className="text-xs text-gray-300 group-hover:text-orange-400">
                  Analytics
                </span>
              </li>
            </Link>
            <Link to="/search">
               <li className={`flex flex-col items-center group hover:text-orange-400 transition ${getNavItemClass("/search")}`}>
          
                <FaSearch className="text-2xl" />
                <span className="text-xs text-gray-300 group-hover:text-orange-400">
                  Search
                </span>
              </li>
            </Link>

            <Link to="/about">
              <li className={`flex flex-col items-center group hover:text-orange-400 transition ${getNavItemClass("/about")}`}>
          
                <FaInfoCircle className="text-2xl" />
                <span className="text-xs text-gray-300 group-hover:text-orange-400">
                  About
                </span>
              </li>
            </Link>
            
            <li className="flex items-center">
              <Link to="/profile">
                {currentUser ? (
                  <motion.img
                    key={currentUser?.avatar || "default"}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    src={
                      currentUser?.avatar
                        ? currentUser.avatar.startsWith("http")
                          ? currentUser.avatar
                          : `http://localhost:3000${currentUser.avatar}`
                        : "/default.png"
                    }
                    alt="Profile"
                    className="h-10 w-10 rounded-full object-cover border-2 border-white shadow-sm cursor-pointer hover:scale-105 transition-transform"
                  />
                ) : (
                  <span className="flex flex-col items-center group hover:text-orange-400 transition">
                    <FaUser className="text-2xl" />
                    <span className={`text-xs flex flex-col items-center group hover:text-orange-400 transition 
                    ${getNavItemClass("/favourites")}`}>
                      Sign In
                    </span>
                  </span>
                )}
              </Link>
            </li>
          </ul>
  

      {/* Hamburger Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="text-white text-2xl sm:hidden focus:outline-none ml-auto"
      >
        {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
      </div>

      {isMobileMenuOpen && (
        <div className="sm:hidden fixed top-12 right-0 w-2/3 max-w-3xs bg-gray-800 text-white shadow-lg  py-6 space-y-6 z-40 rounded-l-lg">
          <Link
            to="/"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex flex-col items-center"
          >
            <FaHome className="text-white text-2xl" />
            <span className="text-sm text-gray-300">Home</span>
          </Link>
          <Link
            to="/about"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex flex-col items-center"
          >
            <FaInfoCircle className="text-white text-2xl" />
            <span className="text-sm text-gray-300">About</span>
          </Link>
          <Link
            to="/notifications"
            onClick={() => {
              handleNotificationClick();
              setIsMobileMenuOpen(false);
            }}
            className="flex flex-col items-center relative"
          >
            <FaBell className="text-white text-2xl" />
            {unread && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full animate-ping"></span>
            )}
            <span className="text-sm text-gray-300">Notifications</span>
          </Link>
          <Link
            to="/favourites"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex flex-col items-center"
          >
            <FaHeart className="text-white text-2xl" />
            <span className="text-sm text-gray-300">Favourites</span>
          </Link>
          <Link
            to="/analytics"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex flex-col items-center"
          >
            <FaChartBar className="text-white text-2xl" />
            <span className="text-sm text-gray-300">Analytics</span>
          </Link>
          <Link
            to="/search"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex flex-col items-center"
          >
            <FaSearch className="text-white text-2xl" />
            <span className="text-sm text-gray-300">Search</span>
          </Link>
          <Link
            to="/profile"
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex flex-col items-center"
          >
            <FaUser className="text-white text-2xl" />
            <span className="text-sm text-gray-300">
              {currentUser ? "Profile" : "Sign In"}
            </span>
          </Link>
        </div>
      )}
    </header>
  );
}
