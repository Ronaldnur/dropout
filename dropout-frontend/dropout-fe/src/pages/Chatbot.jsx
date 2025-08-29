import React, { useState, useRef, useEffect } from 'react';
import ChatWindow from '../components/ChatWindow';
import MessageInput from '../components/MessageInput';
import '../index.css';

const API_URL = 'http://localhost:5000/chat';

const Chatbot = () => {
  const [messages, setMessages] = useState([
    { role: 'model', parts: 'Halo! Ada yang bisa saya bantu terkait kelulusan?' },
  ]);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Ref untuk autoscroll ke bawah
  const messagesEndRef = useRef(null);

  // Fungsi untuk menghapus semua karakter markdown bintang
  const removeAllMarkdownFormatting = (text) => {
    if (text) {
      // Menggunakan regex untuk menghapus satu atau lebih karakter bintang
      return text.replace(/\*+/g, '');
    }
    return '';
  };

  const handleSendMessage = async (text) => {
    if (isLoading) return;

    // Tambahkan pesan pengguna ke state lokal, bersihkan dari markdown
    const userMessage = { role: 'user', parts: removeAllMarkdownFormatting(text) };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        // Pastikan history yang dikirim bersih dari markdown
        body: JSON.stringify({ 
          message: text, 
          history: history.map(msg => ({ 
            role: msg.role, 
            parts: removeAllMarkdownFormatting(msg.parts) 
          }))
        }),
      });
      const data = await response.json();

      if (response.ok) {
        // Tambahkan balasan bot ke state lokal, bersihkan dari markdown
        const botMessage = { role: 'model', parts: removeAllMarkdownFormatting(data.response) };
        setMessages((prevMessages) => [...prevMessages, botMessage]);
        // Perbarui riwayat chat untuk percakapan berikutnya
        setHistory(data.history);
      } else {
        throw new Error(data.error || 'Terjadi kesalahan pada API.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      const errorMessage = { role: 'model', parts: 'Maaf, terjadi kesalahan. Silakan coba lagi.' };
      setMessages((prevMessages) => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Menggulir ke bawah setiap kali ada pesan baru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="flex flex-col flex-1 h-full bg-white shadow-lg rounded-lg">
      <header className="bg-blue-600 text-white p-4 shadow-md">
        <h1 className="text-xl font-bold">Asisten Akademik</h1>
      </header>
      <div className="flex-grow overflow-y-auto p-4 space-y-4">
        <ChatWindow messages={messages} />
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSendMessage={handleSendMessage} isLoading={isLoading} />
    </div>
  );
};

export default Chatbot;
