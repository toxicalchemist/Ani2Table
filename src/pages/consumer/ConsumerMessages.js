import React, { useState, useEffect } from 'react';
import Sidebar from '../../components/Sidebar';
import Toast from '../../components/Toast';
import { getMessages, sendMessage, markAsRead } from '../../services/messageService';
import { getCurrentUser } from '../../services/authService';

const ConsumerMessages = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);
  const currentUser = getCurrentUser();

  useEffect(() => {
    loadMessages();
    // Poll for new messages every 5 seconds
    const interval = setInterval(loadMessages, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadMessages = async () => {
    const result = await getMessages();
    if (result.success) {
      // Group messages by conversation partner
      const grouped = {};
      
      result.messages.forEach(msg => {
        const partnerId = msg.senderId === currentUser.id ? msg.receiverId : msg.senderId;
        const partnerName = msg.senderId === currentUser.id ? msg.receiverName : msg.senderName;
        
        if (!grouped[partnerId]) {
          grouped[partnerId] = {
            id: partnerId,
            name: partnerName,
            avatar: '🌾',
            messages: [],
            unreadCount: 0,
            lastMessage: null,
            lastTime: null
          };
        }
        
        const messageObj = {
          id: msg.id,
          sender: msg.senderId === currentUser.id ? 'consumer' : 'farmer',
          text: msg.message,
          time: new Date(msg.createdAt).toLocaleString('en-US', { 
            hour: 'numeric', 
            minute: 'numeric',
            hour12: true 
          }),
          isRead: msg.isRead
        };
        
        grouped[partnerId].messages.push(messageObj);
        
        if (!grouped[partnerId].lastTime || new Date(msg.createdAt) > new Date(grouped[partnerId].lastTime)) {
          grouped[partnerId].lastMessage = msg.message;
          grouped[partnerId].lastTime = msg.createdAt;
        }
        
        if (msg.receiverId === currentUser.id && !msg.isRead) {
          grouped[partnerId].unreadCount++;
        }
      });
      
      const convArray = Object.values(grouped)
        .sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime))
        .map(conv => ({
          ...conv,
          messages: conv.messages.sort((a, b) => new Date(a.time) - new Date(b.time)),
          time: getTimeDisplay(conv.lastTime)
        }));
      
      setConversations(convArray);
    }
    setLoading(false);
  };

  const getTimeDisplay = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const handleSelectChat = async (chat) => {
    setSelectedChat(chat);
    
    // Mark all messages from this conversation as read
    const unreadMessages = chat.messages.filter(m => m.sender === 'farmer' && !m.isRead);
    for (const msg of unreadMessages) {
      await markAsRead(msg.id);
    }
    
    // Reload to update unread count
    loadMessages();
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (messageText.trim() && selectedChat) {
      const result = await sendMessage(selectedChat.id, '', messageText);
      
      if (result.success) {
        setMessageText('');
        await loadMessages();
        
        // Update selected chat with new messages
        const updated = conversations.find(c => c.id === selectedChat.id);
        if (updated) {
          setSelectedChat(updated);
        }
      } else {
        setToast({ message: result.error || 'Failed to send message', type: 'error' });
      }
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
            {loading ? (
              <div className="flex justify-center p-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <p>No messages yet</p>
                <p className="text-sm mt-2">Start a conversation with a farmer</p>
              </div>
            ) : (
              conversations.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleSelectChat(chat)}
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
                    {chat.unreadCount > 0 && (
                      <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
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
              <div className="flex-1 overflow-y-auto p-6 space-y-6">
                {selectedChat.messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex ${message.sender === 'consumer' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-md lg:max-w-lg px-6 py-4 rounded-2xl shadow-md ${
                        message.sender === 'consumer'
                          ? 'bg-primary text-white'
                          : 'bg-gray-200 text-gray-800'
                      }`}
                    >
                      <p className="text-lg leading-relaxed">{message.text}</p>
                      <p className={`text-sm mt-2 ${
                        message.sender === 'consumer' ? 'text-gray-200' : 'text-gray-500'
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

      {/* Toast Notification */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};

export default ConsumerMessages;
