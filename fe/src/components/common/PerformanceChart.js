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
        backgroundColor: 'rgba(75, 192, 192, 0.6)', // Semi-transparent teal
        borderColor: 'rgba(75, 192, 192, 1)',       // Solid teal
        borderWidth: 1,
        hoverBackgroundColor: 'rgba(75, 192, 192, 0.8)', // Highlight on hover
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
        labels: {
          font: {
            size: 12,
            family: 'Arial, Helvetica, sans-serif',
            weight: 'bold',
          },
          color: '#333',
        },
      },
      title: {
        display: true,
        text: 'Performance by Category',
        font: {
          size: 18,
          family: 'Arial, Helvetica, sans-serif',
          weight: 'bold',
        },
        color: '#111',
      },
      tooltip: {
        callbacks: {
          label: (context) => `Score: ${context.raw}`, // Custom tooltip formatting
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Score',
          font: {
            size: 14,
            family: 'Arial, Helvetica, sans-serif',
            weight: 'bold',
          },
          color: '#555',
        },
        ticks: {
          font: {
            size: 12,
            family: 'Arial, Helvetica, sans-serif',
          },
          color: '#444',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Category',
          font: {
            size: 14,
            family: 'Arial, Helvetica, sans-serif',
            weight: 'bold',
          },
          color: '#555',
        },
        ticks: {
          font: {
            size: 12,
            family: 'Arial, Helvetica, sans-serif',
          },
          color: '#444',
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
    return <div className="alert alert-info text-center">Loading categories...</div>;
  }

  if (error) {
    return <div className="alert alert-danger text-center">Error loading categories: {error}</div>;
  }

  return (
    <div className="container my-4">
      <div className="card shadow-sm">
        <div className="card-header bg-primary text-white text-center py-2">
          <h4>Performance Chart</h4>
        </div>
        <div className="card-body">
          <div style={{ height: '400px', width: '100%' }} className="mx-auto">
            <Bar ref={chartRef} data={data} options={options} />
          </div>
        </div>
        <div className="card-footer text-muted text-center py-1">
          <small style={{ fontFamily: 'Arial, Helvetica, sans-serif', fontSize: '13px', fontWeight: 'bold', color: '#555' }}>Data visualization of performance scores by category.</small>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;