// src/components/student/PerformanceChart.js
import React from "react";
import { Bar } from "react-chartjs-2";

const PerformanceChart = ({ data }) => {
  const chartData = {
    labels: Object.keys(data),
    datasets: [
      {
        label: "Scores",
        data: Object.values(data),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  return <Bar data={chartData} />;
};

export default PerformanceChart;
