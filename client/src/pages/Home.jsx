import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchFavorites } from "../redux/user/favoriteSlice";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import ListingItem from "../components/ListingItem";
import {
  FaArrowRight,
  FaMapMarkerAlt,
  FaHome,
  FaStar,
  FaFire,
} from "react-icons/fa";

export default function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.user.token);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      dispatch(fetchFavorites());
    }

    const fetchLatestListings = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          "/api/listings/get?sort=createdAt&order=desc&limit=12"
        );
        const data = await res.json();
        setListings(data);
      } catch (error) {
        console.error("Error fetching home listings:", error);
        setListings([]);
      }
      setLoading(false);
    };

    fetchLatestListings();
  }, [dispatch, token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-orange-300">
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="max-w-4xl text-left px-15 py-20"
      >
        <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
          Discover Your Next <span className="text-orange-400">Home</span>
        </h1>
        <p className="text-lg text-slate-700 max-w-2xl">
          Browse our latest listings for rent and sale — filtered by your
          preferences.
        </p>
        <button
          onClick={() => navigate("/search")}
          className="mt-6 bg-slate-800 text-orange-400 px-6 py-3 rounded-full font-semibold uppercase hover:opacity-90 transition flex items-center gap-2"
        >
          Start Exploring <FaArrowRight />
        </button>
      </motion.div>

      <div className="px-6 py-10 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800 flex items-center gap-2">
            <FaFire className="text-orange-400" /> Latest Listings
          </h2>
          <button
            onClick={() => navigate("/search")}
            className="text-orange-400 font-medium hover:underline flex items-center gap-1"
          >
            View all <FaArrowRight />
          </button>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {loading && (
            <div className="col-span-full flex justify-center items-center">
              <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin"></div>
            </div>
          )}

          {!loading && listings.length === 0 && (
            <p className="col-span-full text-center text-lg text-slate-600">
              No listings available at the moment.
            </p>
          )}
          {!loading &&
            listings.map((listing) => (
              <ListingItem key={listing._id} listing={listing} />
            ))}
        </motion.div>
      </div>
    </div>
  );
}
