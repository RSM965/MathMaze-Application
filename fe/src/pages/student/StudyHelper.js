import React, { useEffect, useState } from 'react';
import './StudyHelper.css';
import axios from 'axios';

const StudyHelper = ({ studentId }) => {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendedResources, setRecommendedResources] = useState([]);

const handleGetRecommendations = async () => {
  setLoading(true);
  setError(null);

  try {
    // Correct URL without any extra characters
    const response = await axios.post('http://127.0.0.1:5000/api/ai/study-helper', {
      studentId,
      topics,
    });
    if (response.status === 200) {
      setRecommendedResources(response.data);
    } else {
      throw new Error('Unable to fetch recommendations');
    }
  } catch (err) {
    setError('Failed to get study recommendations. Please try again later.');
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="study-helper-container">
      <h2>AI Study Helper</h2>
      <div className="topics-input">
        <input
          type="text"
          placeholder="Enter topics to get recommendations"
          value={topics}
          onChange={(e) => setTopics(e.target.value.split(','))}
        />
        <button onClick={handleGetRecommendations} disabled={loading}>
          {loading ? 'Loading...' : 'Get Recommendations'}
        </button>
      </div>
      {error && <p className="error-message">{error}</p>}
      <div className="recommended-resources">
        {recommendedResources.length > 0 && (
          <ul>
            {recommendedResources.map((resource, index) => (
              <li key={index}>{resource}</li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default StudyHelper;
