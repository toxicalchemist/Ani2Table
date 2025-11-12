import React, { useState } from 'react';
import Sidebar from '../../components/Sidebar';

const FarmerMessages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');

  const chats = [
    {
      id: 1,
      name: 'Juan Dela Cruz',
      avatar: '👤',
      lastMessage: 'Is the Jasmine rice still available?',
      time: '10:30 AM',
      unread: 2,
      messages: [
        { sender: 'customer', text: 'Hi! Is the Jasmine rice still available?', time: '10:25 AM' },
        { sender: 'farmer', text: 'Yes, we have it in stock. How many kg do you need?', time: '10:27 AM' },
        { sender: 'customer', text: 'Is the Jasmine rice still available?', time: '10:30 AM' },
      ]
    },
    {
      id: 2,
      name: 'Maria Santos',
      avatar: '👤',
      lastMessage: 'Thank you for the fast delivery!',
      time: 'Yesterday',
      unread: 0,
      messages: [
        { sender: 'customer', text: 'When will my order arrive?', time: 'Yesterday 2:00 PM' },
        { sender: 'farmer', text: 'It will be delivered today by 5 PM', time: 'Yesterday 2:15 PM' },
        { sender: 'customer', text: 'Thank you for the fast delivery!', time: 'Yesterday 6:30 PM' },
      ]
    },
    {
      id: 3,
      name: 'Pedro Garcia',
      avatar: '👤',
      lastMessage: 'Can I get a bulk discount?',
      time: '2 days ago',
      unread: 1,
      messages: [
        { sender: 'customer', text: 'I need 50kg of Sinandomeng rice. Can I get a bulk discount?', time: '2 days ago' },
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
      <Sidebar userType="farmer" />
      
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
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white text-xl">
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
              <div className="p-4 border-b flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white">
                  {selectedChat.avatar}
                </div>
                <div>
                  <h3 className="font-bold">{selectedChat.name}</h3>
                  <p className="text-xs text-green-500">● Online</p>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {selectedChat.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === 'farmer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md lg:max-w-lg px-6 py-4 rounded-2xl shadow-md ${
                        message.sender === 'farmer'
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-lg leading-relaxed">{message.text}</p>
                      <p className={`text-sm mt-2 ${
                        message.sender === 'farmer' ? 'text-gray-200' : 'text-gray-500'
                      }`}>
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <form onSubmit={handleSendMessage} className="p-6 border-t bg-gray-50">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={messageText}
                    onChange={(e) => setMessageText(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-6 py-4 text-lg border-2 border-gray-300 rounded-full focus:outline-none focus:border-primary shadow-sm"
                  />
                  <button
                    type="submit"
                    className="bg-primary hover:bg-primary-dark text-white px-8 py-4 rounded-full transition font-bold text-lg shadow-lg"
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

export default FarmerMessages;
