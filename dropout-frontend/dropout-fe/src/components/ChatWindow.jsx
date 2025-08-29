import React from 'react';

const ChatWindow = ({ messages }) => {
  return (
    <div className="flex flex-col space-y-4">
      {messages.map((msg, index) => (
        <div
          key={index}
          className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`p-3 rounded-xl max-w-sm break-words ${
              msg.role === 'user'
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
            }`}
          >
            {msg.parts}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatWindow;