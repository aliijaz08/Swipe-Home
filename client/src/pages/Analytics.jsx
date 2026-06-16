import React, { useEffect, useState } from "react";
import axios from "axios";
import TopListings from "../components/TopListings";
import PriceDistribution from "../components/PriceDistribution";
import AmenitiesChart from "../components/AmenitiesChart";
import ChartDataLabels from "chartjs-plugin-datalabels";
import { Chart } from "chart.js";

Chart.register(ChartDataLabels);

import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title
);

function Analytics() {
  const [listings, setListings] = useState([]);
  const [activeGraph, setActiveGraph] = useState("top");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/listings")
      .then((res) => setListings(res.data))
      .catch((err) => console.error("Error fetching listings:", err));
  }, []);

  const priceDistributionData = listings.map((listing) => ({
    price: listing.regularPrice,
    type: listing.type,
    sell: listing.type === "sell" ? 1 : 0,
    rent: listing.type === "rent" ? 1 : 0,
  }));

  const options = [
    { key: "top", label: "Top Listings" },
    { key: "price", label: "Price Distribution" },
    { key: "amenities", label: "Amenities" },
  ];

  return (
    <div className="flex flex-col p-8 bg-gradient-to-br from-orange-300 to-blue-300 min-h-screen">
      <div className="sm:hidden mb-6 relative">
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="w-full py-2 px-3 bg-gray-800 text-white rounded-xl text-md font-semibold flex justify-between items-center"
        >
          {options.find((opt) => opt.key === activeGraph)?.label}
          <span className="ml-2 text-sm">{dropdownOpen ? "▲" : "▼"}</span>
        </button>

        {dropdownOpen && (
          <ul className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200">
            {options.map((opt) => (
              <li
                key={opt.key}
                className={`p-3 cursor-pointer hover:bg-gray-100 rounded-xl ${
                  activeGraph === opt.key ? "bg-gray-200 font-bold" : ""
                }`}
                onClick={() => {
                  setActiveGraph(opt.key);
                  setDropdownOpen(false);
                }}
              >
                {opt.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="hidden sm:flex justify-center space-x-6 mb-12">
        {options.map((opt) => (
          <button
            key={opt.key}
            className={`w-50 py-2 px-5 rounded-xl text-md font-semibold transition-all duration-300 ${
              activeGraph === opt.key
                ? "bg-gray-500 text-white shadow-lg scale-105"
                : "bg-gray-800 text-white hover:bg-gray-500"
            }`}
            onClick={() => setActiveGraph(opt.key)}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Chart display area */}
      <div className="flex justify-center mx-auto w-full">
        {activeGraph === "top" && <TopListings />}
        {activeGraph === "price" && (
          <PriceDistribution data={priceDistributionData} />
        )}
        {activeGraph === "amenities" && <AmenitiesChart listings={listings} />}
      </div>
    </div>
  );
}

export default Analytics;
