import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './finalself.css';

const FinalSelf = () => {
  const [messages, setMessages] = useState([]); // For storing messages to display
  const [isAnimating, setIsAnimating] = useState(false); // For animation status
  const [clickCount, setClickCount] = useState(0); // Count how many times the heart has been clicked
  const [messageHistory, setMessageHistory] = useState([]); // Keep track of displayed messages
  const navigate = useNavigate(); // For navigation

  // Messages list
  const messagesList = [
    "ฉันอยู่กับเธอนะ", 
    "เธอเหนื่อยมั้ย", 
    "ฉันรักเธอ แม้เธอจะเป็นยังไง",
    "ฉันเห็นแล้วว่าเธอกำลังพยายาม",
    "พวกเราจะไม่ทิ้งเธอนะ เราจะอยู่ข้างๆ เธอ"
  ];

  const handleClick = () => {
    if (isAnimating || messageHistory.length === messagesList.length) return; // If animation is active or all messages have been shown

    setIsAnimating(true); // Start animation

    // Find the next message to display that hasn't been shown yet
    const remainingMessages = messagesList.filter(message => !messageHistory.includes(message));
    const randomMessage = remainingMessages[Math.floor(Math.random() * remainingMessages.length)];

    // Random position generation
    const randomTop = Math.random() * 80 + 5;  // Random vertical position (5% to 95%)
    const isRight = Math.random() < 0.5;  // Random left or right (50% chance for right)
    const randomLeft = isRight ? Math.random() * 100 + 5 : Math.random() * 100 + 5;  // Random horizontal position

    // Add click count
    setClickCount(prevCount => prevCount + 1);

    // Start removing old messages
    setMessages([]);

    // Wait 0.5 seconds before showing new message
    setTimeout(() => {
      // Add new message to state
      setMessages([{ text: randomMessage, top: randomTop, left: randomLeft }]);
      
      // Update message history to prevent repeats
      setMessageHistory(prevHistory => [...prevHistory, randomMessage]);

      setIsAnimating(false); // End animation

      // Check if all 5 messages have been shown (check after message has been added)
      if (messageHistory.length + 1 === messagesList.length) {
        navigate('/tellself'); // Navigate to /tellself when all messages are shown
      }
    }, 500);
  };

  return (
    <div className="final-self-container">
      <h1 className="final-h">เรียนรู้ที่จะเข้าใจ</h1>
      <div className="heart-container" onClick={handleClick}>
        <div className="heart"></div>
        {messages.map((message, index) => (
          <p
            key={index}
            className="heart-text"
            style={{ top: `${message.top}%`, left: `${message.left}%` }}
          >
            {message.text}
          </p>
        ))}
      </div>
    </div>
  );
};

export default FinalSelf;
