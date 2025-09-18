import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Buttons from '../Button/Buttons';
import { Input } from '../Form/Form';

const LiveChatWidget = ({ 
  isOpen = false, 
  onToggle,
  tourId = null,
  bookingId = null 
}) => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef(null);

  // Initialize chat with welcome message
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const welcomeMessage = {
        id: 1,
        type: 'system',
        message: 'Hi! 👋 Welcome to Buckler Tours support. How can I help you today?',
        timestamp: new Date(),
        sender: 'Support Team'
      };
      setMessages([welcomeMessage]);
      setIsConnected(true);
    }
  }, [isOpen, messages.length]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simulate typing indicator
  const showTypingIndicator = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
    }, 2000);
  };

  // Handle message send
  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      message: inputMessage,
      timestamp: new Date(),
      sender: 'You'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    
    // Show typing indicator and simulate response
    showTypingIndicator();
    
    // Simulate AI/support response
    setTimeout(() => {
      const responses = [
        "Thanks for your message! Let me help you with that. Can you provide more details?",
        "I understand your inquiry. Our team will get back to you shortly with the information you need.",
        "Great question! For tour bookings, you can check availability on our tour detail page. Would you like me to help you find a specific tour?",
        "I'm here to help! For immediate assistance with bookings, you can also call our support line at +254-123-456-789.",
        "That's a popular tour! I can help you check availability and pricing. Would you like me to connect you with our booking specialist?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      const botMessage = {
        id: Date.now() + 1,
        type: 'support',
        message: randomResponse,
        timestamp: new Date(),
        sender: 'Support Team'
      };
      
      setMessages(prev => [...prev, botMessage]);
    }, 2500);
  };

  // Handle key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Quick action buttons
  const quickActions = [
    "Check tour availability",
    "Modify my booking", 
    "Cancellation policy",
    "Payment options",
    "Group discounts"
  ];

  const handleQuickAction = (action) => {
    setInputMessage(action);
    setTimeout(() => handleSendMessage(), 100);
  };

  // Message component
  const Message = ({ message }) => (
    <div className={`flex mb-4 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`max-w-[70%] ${
        message.type === 'user' 
          ? 'bg-neonorange text-white' 
          : message.type === 'system'
          ? 'bg-blue-100 text-blue-800'
          : 'bg-gray-100 text-gray-800'
      } rounded-lg p-3`}>
        <p className="text-sm">{message.message}</p>
        <p className="text-xs opacity-70 mt-1">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </p>
      </div>
    </div>
  );

  // Typing indicator component
  const TypingIndicator = () => (
    <div className="flex justify-start mb-4">
      <div className="bg-gray-100 rounded-lg p-3">
        <div className="flex space-x-1">
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Chat Toggle Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <Buttons
          className={`btn-fancy ${isOpen ? 'btn-outline' : 'btn-fill'} rounded-full w-16 h-16 shadow-lg`}
          themeColor="#232323"
          color={isOpen ? "#232323" : "#fff"}
          onClick={onToggle}
          ariaLabel="Toggle live chat"
        >
          {isOpen ? (
            <i className="fas fa-times text-xl"></i>
          ) : (
            <div className="relative">
              <i className="fas fa-comments text-xl"></i>
              {/* Notification dot */}
              <div className="absolute -top-2 -right-2 w-3 h-3 bg-red-500 rounded-full"></div>
            </div>
          )}
        </Buttons>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-24 right-6 w-80 h-96 bg-white rounded-lg shadow-2xl border z-50 flex flex-col"
          >
            {/* Chat Header */}
            <div className="bg-neonorange text-white p-4 rounded-t-lg flex items-center justify-between">
              <div>
                <h4 className="font-semibold">Live Support</h4>
                <p className="text-xs opacity-90">
                  {isConnected ? '🟢 Online' : '🔴 Offline'} • Usually replies in minutes
                </p>
              </div>
              <button onClick={onToggle} className="text-white hover:text-gray-200">
                <i className="fas fa-minus"></i>
              </button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
              
              {isTyping && <TypingIndicator />}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Actions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2">
                <p className="text-xs text-gray-600 mb-2">Quick actions:</p>
                <div className="flex flex-wrap gap-1">
                  {quickActions.slice(0, 3).map((action, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickAction(action)}
                      className="text-xs px-2 py-1 bg-gray-100 rounded hover:bg-gray-200 transition-colors"
                    >
                      {action}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Chat Input */}
            <div className="p-4 border-t">
              <div className="flex space-x-2">
                <Input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your message..."
                  className="flex-1 text-sm"
                />
                <Buttons
                  className="btn-fancy btn-fill px-3"
                  themeColor="#232323"
                  color="#fff"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim()}
                  ariaLabel="Send message"
                >
                  <i className="fas fa-paper-plane"></i>
                </Buttons>
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                For urgent matters, call +254-123-456-789
              </p>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default LiveChatWidget;
