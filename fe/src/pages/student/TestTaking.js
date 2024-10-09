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

  if (!testDetails) return <div className="text-center text-blue-600 font-semibold mt-10">Loading test details...</div>;

  return (
    <form onSubmit={handleSubmit} className="container mx-auto mt-10 px-4 bg-white p-8 rounded-lg shadow-md">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-blue-900 mb-4">{testDetails.test_name}</h1>
        <p className="text-gray-600 mb-6">Answer the questions below to complete your test.</p>
      </div>

      {testDetails.questions.map((question) => (
        <div key={question.question_id} className="mb-8 p-6 border rounded-lg shadow-sm bg-gray-50">
          <p className="text-xl font-semibold text-gray-800 mb-4">{question.question_text}</p>
          {question.options.map((option) => (
            <div key={option.option_id} className="mb-2">
              <label className="flex items-center">
                <input
                  type="radio"
                  name={`question_${question.question_id}`}
                  value={option.option_id}
                  onChange={() => handleOptionChange(question.question_id, option.option_id)}
                  required
                  className="form-radio h-5 w-5 text-blue-600"
                />
                <span className="ml-3 text-gray-700">{option.option_text}</span>
              </label>
            </div>
          ))}
        </div>
      ))}

      <div className="flex justify-center mt-10">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg transition duration-300 transform hover:scale-105"
        >
          Submit Test
        </button>
      </div>
    </form>
  );
};

export default TestTaking;
