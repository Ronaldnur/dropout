import React, { useState } from 'react';
import { Send } from 'lucide-react'; // Impor ikon Send

const MessageInput = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 flex items-center bg-white border-t border-gray-200 shadow-md">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={isLoading ? "Bot sedang mengetik..." : "Ketik pesan Anda..."}
        className="flex-grow p-3 rounded-full bg-gray-100 border border-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        disabled={isLoading}
      />
      <button
        type="submit"
        className={`ml-2 p-3 rounded-full flex items-center justify-center text-white transition-colors duration-200 ${
          isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
        disabled={isLoading}
      >
        <Send size={24} />
      </button>
    </form>
  );
};

export default MessageInput;