// src/components/teacher/CreateTestForm.js
import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { createTest } from '../../redux/actions/teacherActions';
import axios from '../../utils/axiosConfig'; // Import axios instance

const CreateTestForm = ({ classId, onClose }) => {
  const [testName, setTestName] = useState('');
  const [questions, setQuestions] = useState([
    {
      question_text: '',
      category_id: '',
      options: [
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false },
      ],
    },
  ]);
  const [categories, setCategories] = useState([]); // New state for categories
  const dispatch = useDispatch();

  // Fetch categories when component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`/api/classes/${classId}/categories`);
        setCategories(res.data.categories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, [classId]);

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...questions];
    newQuestions[index][field] = value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, field, value) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex][field] = value;
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        question_text: '',
        category_id: '',
        options: [
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false },
          // You can add more default options if needed
        ],
      },
    ]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, idx) => idx !== index);
    setQuestions(newQuestions);
  };

  const addOption = (qIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options.push({ option_text: '', is_correct: false });
    setQuestions(newQuestions);
  };

  const removeOption = (qIndex, oIndex) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options = newQuestions[qIndex].options.filter(
      (_, idx) => idx !== oIndex
    );
    setQuestions(newQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const testData = {
      test_name: testName,
      categories:categories,
      questions,
    };
    dispatch(createTest(classId, testData));
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label className="block">Test Name</label>
        <input
          type="text"
          value={testName}
          onChange={(e) => setTestName(e.target.value)}
          className="border p-2 w-full rounded"
          required
        />
      </div>
      {questions.map((question, qIndex) => (
        <div key={qIndex} className="mb-4 border p-4 rounded">
          <div className="flex justify-between items-center">
            <h3 className="text-lg">Question {qIndex + 1}</h3>
            <button
              type="button"
              onClick={() => removeQuestion(qIndex)}
              className="text-red-600"
            >
              Remove Question
            </button>
          </div>
          <div className="mt-2">
            <label className="block">Question Text</label>
            <input
              type="text"
              value={question.question_text}
              onChange={(e) =>
                handleQuestionChange(qIndex, 'question_text', e.target.value)
              }
              className="border p-2 w-full rounded"
              required
            />
          </div>
          <div className="mt-2">
            <label className="block">Category</label>
            <select
              value={question.category_id}
              onChange={(e) =>
                handleQuestionChange(qIndex, 'category_id', e.target.value)
              }
              className="border p-2 w-full rounded"
              required
            >
              <option value="">Select Category</option>
              {categories.map((category) => (
                <option
                  key={category.category_id}
                  value={category.category_id}
                >
                  {category.category_name}
                </option>
              ))}
            </select>
          </div>
          {question.options.map((option, oIndex) => (
            <div key={oIndex} className="mt-2 flex items-center">
              <input
                type="text"
                value={option.option_text}
                onChange={(e) =>
                  handleOptionChange(qIndex, oIndex, 'option_text', e.target.value)
                }
                className="border p-2 w-full rounded"
                required
              />
              <label className="ml-2 flex items-center">
                <input
                  type="checkbox"
                  checked={option.is_correct}
                  onChange={(e) =>
                    handleOptionChange(
                      qIndex,
                      oIndex,
                      'is_correct',
                      e.target.checked
                    )
                  }
                />
                <span className="ml-1">Correct</span>
              </label>
              <button
                type="button"
                onClick={() => removeOption(qIndex, oIndex)}
                className="ml-2 text-red-600"
              >
                Remove Option
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addOption(qIndex)}
            className="text-blue-600 mt-2"
          >
            Add Option
          </button>
        </div>
      ))}
      <button type="button" onClick={addQuestion} className="text-blue-600 mb-4">
        Add Question
      </button>
      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Create Test
      </button>
    </form>
  );
};

export default CreateTestForm;
