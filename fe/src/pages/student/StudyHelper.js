import React, { useState } from 'react';
import './StudyHelper.css';
import axios from 'axios';

const StudyHelper = ({ studentId }) => {
  const [topics, setTopics] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendedResources, setRecommendedResources] = useState([]);

  const handleGetRecommendations = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post('http://127.0.0.1:5000/api/ai/study-helper', {
        studentId,
        topics: topics.split(',').map((topic) => topic.trim()),
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100 py-10">
      <div className="w-full max-w-lg p-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-blue-900 mb-4">AI Study Helper</h2>
          <p className="text-gray-600">
            Enter topics to receive personalized recommendations for your studies.
          </p>
        </div>

        <div className="mb-8">
          <label htmlFor="topics" className="block text-lg font-medium text-gray-800 mb-2">
            Topics
          </label>
          <input
            id="topics"
            type="text"
            placeholder="Enter topics (comma separated)"
            value={topics}
            onChange={(e) => setTopics(e.target.value)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 mb-4 shadow-sm"
          />
          <div className="flex justify-center">
            <button
              onClick={handleGetRecommendations}
              disabled={loading}
              className={`w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 transform hover:scale-105 ${
                loading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Loading...' : 'Get Recommendations'}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-center text-red-600 font-semibold mb-6">{error}</p>
        )}

        {recommendedResources.length > 0 && (
          <div className="bg-gray-50 p-6 rounded-lg shadow-inner mt-10">
            <h3 className="text-2xl font-bold text-blue-900 mb-4">Recommended Resources</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-800">
              {recommendedResources.map((resource, index) => (
                <li key={index} className="text-lg">{resource}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudyHelper;
