import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Recommendations = ({ student }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch AI-based study recommendations for the student
    const fetchRecommendations = async () => {
      try {
        const response = await axios.post('/api/ai/recommendations', { studentId: student.id });
        if (response.status === 200) {
          setRecommendations(response.data);
        } else {
          throw new Error('Failed to fetch recommendations');
        }
      } catch (error) {
        console.error('Error fetching recommendations:', error);
        setError('Failed to load recommendations. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [student.id]);

  return (
    <div className="recommendations-container">
      {loading ? (
        <p>Loading recommendations...</p>
      ) : error ? (
        <p className="error-message">{error}</p>
      ) : recommendations.length > 0 ? (
        <ul>
          {recommendations.map((recommendation, index) => (
            <li key={index}>{recommendation}</li>
          ))}
        </ul>
      ) : (
        <p>No recommendations available.</p>
      )}
    </div>
  );
};

export default Recommendations;