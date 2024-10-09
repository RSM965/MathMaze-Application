// src/components/PerformanceChart.js

import React, { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAllCategories } from '../../redux/actions/miscActions';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// **1. Register Chart.js Components**
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PerformanceChart = ({ performance_reports }) => {
  const chartRef = useRef(null);
  const dispatch = useDispatch();

  // **2. Fetch all categories when the component mounts**
  useEffect(() => {
    dispatch(fetchAllCategories());
  }, [dispatch]);

  // **3. Access all categories from the Redux 'misc' state**
  const { allCategories = [], loading, error } = useSelector((state) => state.misc || {});

  // **4. Aggregates scores by category from the performance reports**
  const aggregateScores = (reports) => {
    const aggregated = {};

    reports.forEach((report) => {
      const scores = report.scores;
      for (const [categoryId, score] of Object.entries(scores)) {
        if (aggregated[categoryId]) {
          aggregated[categoryId] += score;
        } else {
          aggregated[categoryId] = score;
        }
      }
    });

    return aggregated;
  };

  // **5. Aggregate Scores**
  const aggregatedScores = aggregateScores(performance_reports);

  // **6. Map Category IDs to Names using data from Redux store**
  const categoryIdToName = {};
  allCategories.forEach((category) => {
    categoryIdToName[category.category_id] = category.category_name;
  });

  // **7. Prepare Chart Labels and Data**
  const labels = Object.keys(aggregatedScores).map(
    (categoryId) => categoryIdToName[categoryId] || `Category ${categoryId}`
  );

  const data = {
    labels,
    datasets: [
      {
        label: 'Total Scores',
        data: Object.values(aggregatedScores),
        backgroundColor: 'rgba(54, 162, 235, 0.6)', // Semi-transparent blue
        borderColor: 'rgba(54, 162, 235, 1)',       // Solid blue
        borderWidth: 1,
      },
    ],
  };

  // **8. Define Chart Options**
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to adjust based on container size
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Performance by Category',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Score',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Category',
        },
      },
    },
  };

  // **9. Handle Chart Cleanup to Prevent Canvas Reuse Errors**
  useEffect(() => {
    const chartInstance = chartRef.current;

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, []);

  // **10. Loading or Error Handling**
  if (loading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error loading categories: {error}</div>;
  }

  return (
    <div style={{ height: '400px', width: '600px' }}>
      <Bar ref={chartRef} data={data} options={options} />
    </div>
  );
};

export default PerformanceChart;
