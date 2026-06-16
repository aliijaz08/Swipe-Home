import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend, ChartDataLabels); 

function AmenitiesChart({ listings }) {
  let carParking = 0, discount = 0, furnished = 0, rent = 0, sell = 0;

  listings.forEach((listing) => {
    if (listing.parking) carParking++;
    if (listing.offer) discount++;
    if (listing.furnished) furnished++;
    if (listing.type === 'rent') rent++;
    if (listing.type === 'sell') sell++;
  });

  const barData = {
    labels: ['Car Parking', 'Discount Offers', 'Furnished', 'Rent', 'Sell'],
    datasets: [
      {
        label: 'Listing Features & Types',
        data: [carParking, discount, furnished, rent, sell],
          backgroundColor: ['#2e9e60', '#3e87c5', '#e14f4f', '#d99e13', '#4a4fe0'],
        borderRadius: 10,
       barThickness: 'flex',  
       maxBarThickness: 50, 
        borderColor: '#fff',
        borderWidth: 1,
      }
    ]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.7)', 
        titleFont: {
          size: 14,
          weight: '600',
          color: '#fff'
        },
        bodyFont: {
          size: 12,
          color: '#fff'
        },
        callbacks: {
          label: (tooltipItem) => `${tooltipItem.raw} listings`
        }
      },
      datalabels: {
        display: false, 
        color: '#00000',
        font: {
          size: 14,
          weight: 'bold'
        },
        align: 'top', 
        formatter: (value) => `${value}`, 
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0,
          stepSize: 2,
          color: '#00000',
          font: {
            size: 12,
            weight: '500'
          }
        },
        grid: {
          color: '#e5e7eb'
        }
      },
      x: {
        ticks: {
          color: '#374151',
          font: {
            size: 14,
            weight: '600'
          }
        },
        grid: {
          display: false
        }
      }
    }
  };
return (
  <div className="w-full sm:max-w-md md:w-3xl lg:max-w-4xl px-4 sm:px-6 md:px-8 py-8 bg-transparent rounded-2xl shadow-xl mx-auto mt-5 border border-gray-200">
    <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
      Amenities Overview
    </h2>

    <div className="relative h-94 sm:h-60 md:h-[28rem] lg:h-[22rem]">
      <Bar
        data={barData}
        options={{
          ...barOptions,
          maintainAspectRatio: false, 
        }}
      />
    </div>
  </div>
);

}

export default AmenitiesChart;
