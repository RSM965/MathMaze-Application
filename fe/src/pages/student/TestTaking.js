// src/pages/student/TestTaking.js
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTestDetails, submitTest } from '../../redux/actions/studentActions';
import { useParams, useNavigate } from 'react-router-dom';

const TestTaking = () => {
  const { test_id } = useParams();
  const dispatch = useDispatch();
  const testDetails = useSelector((state) => state.student.currentTest);
  const [answers, setAnswers] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (test_id) {
      dispatch(fetchTestDetails(test_id));
    }
  }, [dispatch, test_id]);

  const handleOptionChange = (question_id, option_id) => {
    setAnswers({ ...answers, [question_id]: option_id });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(submitTest(test_id, answers));
    navigate('/student/performance');
  };

  if (!testDetails) return <div>Loading...</div>;

  return (
    <form onSubmit={handleSubmit} className="container mx-auto mt-10">
      <h1 className="text-2xl mb-6">{testDetails.test_name}</h1>
      {testDetails.questions.map((question) => (
        <div key={question.question_id} className="mb-4">
          <p className="mb-2">{question.question_text}</p>
          {question.options.map((option) => (
            <div key={option.option_id} className="mb-1">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`question_${question.question_id}`}
                  value={option.option_id}
                  onChange={() =>
                    handleOptionChange(question.question_id, option.option_id)
                  }
                  required
                />
                <span className="ml-2">{option.option_text}</span>
              </label>
            </div>
          ))}
        </div>
      ))}
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">
        Submit Test
      </button>
    </form>
  );
};

export default TestTaking;
