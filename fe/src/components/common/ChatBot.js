import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';

const Chatbot = ({ user_id }) => {
  const [isOpen, setIsOpen] = useState(false); // Toggle chatbot open/close
  const [messages, setMessages] = useState([{ message: "Hi! How can I help you?" }]); // Initial messages
  const [userMessage, setUserMessage] = useState(""); // User input message

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (userMessage.trim() === "") return;

    // Add the user's message to the chat
    setMessages((prevMessages) => [...prevMessages, { message: userMessage, isUser: true }]);

    // Clear the input
    setUserMessage("");

    // Prepare last five messages (including the current message)
    const lastFiveMessages = [...messages, { message: userMessage, isUser: true }]
      .slice(-5)
      .map((msg) => msg.message); // Extract only the text of the last five messages

    // Payload to send to the backend
    const payload = {
      message: userMessage,
      history: lastFiveMessages, // Sending the last five messages as the history
    };

    // Fetch bot's response from the Flask API
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/chatbot/${user_id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Set headers to indicate JSON body
        },
        body: JSON.stringify(payload), // Send the message and history in the request body
      });

      const data = await response.json();
      setMessages((prevMessages) => [...prevMessages, { message: data.reply }]); // Append bot's reply to the chat
    } catch (error) {
      setMessages((prevMessages) => [...prevMessages, { message: "Error fetching response." }]);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat toggle button */}
      <button
        className="bg-blue-500 text-white p-3 rounded-full shadow-lg focus:outline-none"
        onClick={toggleChat}
      >
        {isOpen ? "Close" : "Chat With Me."}
      </button>

      {/* Chat window */}
      {isOpen && (
        <div className="bg-white border border-gray-300 rounded-lg shadow-lg p-4 mt-2 w-[350px] h-[400px] md:w-[450px] md:h-[600px]">
          <div className="h-[75%] overflow-y-scroll mb-4">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 mb-2 rounded-lg ${
                  msg.isUser ? "bg-blue-100 text-right" : "bg-gray-100"
                }`}
              >
                <ReactMarkdown>{msg.message}</ReactMarkdown>
              </div>
            ))}
          </div>

          {/* Chat input and send button together */}
          <div className="flex">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-l-lg"
              placeholder="Type a message..."
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleSendMessage();
                }
              }}
            />
            <button
              className="bg-green-500 text-white px-6 rounded-r-lg"
              onClick={handleSendMessage}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
