import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels';  // Import chartjs-plugin-datalabels

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels); // Register the plugin

function TopListings() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = useSelector((state) => state.user.token);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTopListings = async () => {
      setLoading(true);
      try {
        const res = await axios.get("http://localhost:3000/api/listings/top", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const topListings = res.data.topListings || res.data;
        setData(topListings);
      } catch (err) {
        console.error("Failed to fetch top listings:", err);
      }
      setLoading(false);
    };

    fetchTopListings();
  }, [token]);

  const gradientColors = [
    "rgba(30, 58, 138, 0.9)",
    "rgba(37, 99, 235, 0.8)",
    "rgba(59, 130, 246, 0.75)",
    "rgba(96, 165, 250, 0.7)",
    "rgba(147, 197, 253, 0.6)",
    "rgba(219, 234, 254, 0.5)",
  ];

  const chartData = {
    labels: data.map((item) =>
      item.name.length > 12 ? item.name.slice(0, 12) + "..." : item.name
    ),
    datasets: [
      {
        label: "Views",
        data: data.map((item) => item.views),
        backgroundColor: gradientColors.slice(0, data.length),
        borderRadius: 10,
        barThickness: 35,
        borderSkipped: false,
        hoverBackgroundColor: "rgba(29, 78, 216, 0.95)",
      },
    ],
  };

  const chartOptions = {
    indexAxis: "y",
    responsive: true,
    animation: {
      duration: 1200,
      easing: "easeOutCubic",
    },
    scales: {
      x: {
        beginAtZero: true,
        ticks: { color: "#00000" },
        grid: { color: "#E5E7EB", borderDash: [4, 4] },
      },
      y: {
        ticks: {
          color: "#1F2937",
          font: { size: 14, weight: "bold" },
        },
        grid: { display: false },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "#0f172a",
        titleColor: "#fff",
        bodyColor: "#cbd5e1",
        padding: 10,
        cornerRadius: 6,
      },
      datalabels: {
        color: '#fff',  
        font: {
          weight: 'bold',
          size: 12,
        },
        align: 'center',
        anchor: 'center',
      },
    },
    onClick: (e) => {
      const chart = e.chart; // Get the chart instance
      const elements = chart.getElementsAtEventForMode(e.native, "nearest", {
        intersect: true,
      }, false);

      if (elements && elements.length > 0) {
        const index = elements[0].index; 
        const clickedListing = data[index];
        if (clickedListing) {
          navigate(`/listing/${clickedListing._id}`);
        }
      }
    },
  };

  return (
    <motion.div
      className="w-full sm:max-w-md md:w-3xl lg:max-w-4xl px-4 sm:px-6 md:px-8 py-8 bg-transparent rounded-2xl shadow-xl mx-auto mt-5 border border-gray-200"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
        Top Viewed Listings
      </h2>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 border-dashed rounded-full animate-spin"></div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center text-gray-500 text-lg mt-6">
          No top listings found.
        </div>
      ) : (
        <div className="relative h-96 sm:h-60 md:h-[28rem] lg:h-[22rem]">
          <Bar
            data={chartData}
            options={{ ...chartOptions, maintainAspectRatio: false }}
          />
        </div>
      )}
    </motion.div>
  );
}

export default TopListings;
