"use client";
import React from "react";
import TabBar from "../TabBar/TabBar";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Define the type for chartData if it has a specific structure
interface ChartData {
  prices: [number, number][]; // Array of [timestamp, price] pairs
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

interface CryptoChartProps {
  chartData: ChartData; // Chart data
  coinName: string; // Name of the coin (e.g., "Bitcoin")
  setDays: (tab: number) => void; // Function to set the selected time period (in days)
}

const CryptoChart: React.FC<CryptoChartProps> = ({
  chartData,
  coinName,
  setDays,
}) => {
  const handleTabChange = (tab: number) => {
    setDays(tab);
  };
  const prices = chartData?.prices.map(([_, price]) => price); // eslint-disable-line @typescript-eslint/no-unused-vars

  const timestamps = chartData?.prices.map(([timestamp]) =>
    new Date(timestamp).toLocaleDateString()
  );

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: `${coinName} Price Chart`, // Chart title
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Date", // X-axis label
        },
        grid: {
          display: false, // Hide grid lines behind the chart
        },
      },
      y: {
        title: {
          display: true,
          text: "Price (USD)", // Y-axis label
        },
        beginAtZero: false, // Start y-axis at zero
        grid: {
          display: false, // Hide grid lines behind the chart
        },
      },
    },
  };

  const chartDataFormatted = {
    labels: timestamps, // X-axis labels (formatted timestamps)
    datasets: [
      {
        label: `${coinName} Price`,
        data: prices, // Y-axis data (prices)
        borderColor: "#FF7000", // Line color
        // borderWidth: 2,
        fill: false, // Don't fill the area below the line
        tension: 0.4, // Smooth line
      },
    ],
  };

  return (
    <div className="flex w-full flex-col items-start justify-start gap-4 p-2">
      <div className="flex w-full items-center justify-between">
        <h1 className="text-lg font-semibold leading-7">
          {coinName} Price Chart
        </h1>
        <div>
          <TabBar onTabChange={handleTabChange} />
        </div>
      </div>
      <div className="flex-center flex h-[450px] w-full flex-col items-start justify-start rounded-lg border-[0.5px] border-gray-300 shadow-sm dark:border-gray-700">
        <Line data={chartDataFormatted} options={chartOptions} />
      </div>
    </div>
  );
};

export default CryptoChart;
