import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const ConsumerMessages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');

  const chats = [
    {
      id: 1,
      name: "Pedro's Farm",
      avatar: '🌾',
      lastMessage: 'Your order has been shipped!',
      time: '10:30 AM',
      unread: 1,
      messages: [
        { sender: 'consumer', text: 'Hi! Is the Jasmine rice still available?', time: '10:25 AM' },
        { sender: 'farmer', text: 'Yes, we have it in stock. How many kg do you need?', time: '10:27 AM' },
        { sender: 'consumer', text: 'I need 10kg please', time: '10:28 AM' },
        { sender: 'farmer', text: 'Great! Your order has been shipped!', time: '10:30 AM' },
      ]
    },
    {
      id: 2,
      name: "Garcia Farm",
      avatar: '🌾',
      lastMessage: 'Thank you for your order!',
      time: 'Yesterday',
      unread: 0,
      messages: [
        { sender: 'consumer', text: 'Do you have organic brown rice?', time: 'Yesterday 2:00 PM' },
        { sender: 'farmer', text: 'Yes! We have fresh organic brown rice. ₱50/kg', time: 'Yesterday 2:15 PM' },
        { sender: 'consumer', text: 'Perfect! I will order 5kg', time: 'Yesterday 2:20 PM' },
        { sender: 'farmer', text: 'Thank you for your order!', time: 'Yesterday 2:30 PM' },
      ]
    },
    {
      id: 3,
      name: "Santos Farm",
      avatar: '🌾',
      lastMessage: 'We can offer bulk discounts!',
      time: '2 days ago',
      unread: 0,
      messages: [
        { sender: 'consumer', text: 'Do you offer bulk discounts?', time: '2 days ago' },
        { sender: 'farmer', text: 'Yes! For orders over 20kg, we can offer bulk discounts!', time: '2 days ago' },
      ]
    },
  ];

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (messageText.trim()) {
      // Handle send message logic
      console.log('Sending:', messageText);
      setMessageText('');
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar userType="consumer" />
      
      <div className="flex-1 flex">
        {/* Chat List */}
        <div className="w-80 bg-white border-r">
          <div className="p-4 border-b">
            <h2 className="text-xl font-bold">Messages</h2>
            <input
              type="text"
              placeholder="Search conversations..."
              className="w-full mt-3 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-primary"
            />
          </div>
          <div className="overflow-y-auto h-[calc(100vh-140px)]">
            {chats.map((chat) => (
              <div
                key={chat.id}
                onClick={() => setSelectedChat(chat)}
                className={`p-4 border-b cursor-pointer hover:bg-gray-50 transition ${
                  selectedChat?.id === chat.id ? 'bg-gray-100' : ''
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-2xl">
                    {chat.avatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-semibold truncate">{chat.name}</h3>
                      <span className="text-xs text-gray-500">{chat.time}</span>
                    </div>
                    <p className="text-sm text-gray-600 truncate">{chat.lastMessage}</p>
                  </div>
                  {chat.unread > 0 && (
                    <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                      {chat.unread}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="flex-1 flex flex-col bg-white">
          {selectedChat ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white text-xl">
                    {selectedChat.avatar}
                  </div>
                  <div>
                    <h3 className="font-bold">{selectedChat.name}</h3>
                    <p className="text-xs text-green-500">● Online</p>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                  </svg>
                </button>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {selectedChat.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === 'consumer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        message.sender === 'consumer'
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p>{message.text}</p>
                      <p className={`text-xs mt-1 ${
                        message.sender === 'consumer' ? 'text-gray-200' : 'text-gray-500'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-full transition"
                  >
                    Send
                  </button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400">
              <div className="text-center">
                <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-lg">Select a conversation to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ConsumerMessages;
