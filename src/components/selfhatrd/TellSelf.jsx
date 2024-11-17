import React, { useState } from 'react';
import './finalself.css'; // นำเข้าไฟล์ CSS ถ้ามี
import { Link } from 'react-router-dom';

const TellSelf = () => {
  const buttonLabels = [
    '1', '2', '3',
    '4', '5', '6',
    '7', '8', '9',
    '*', '0', '#',
  ];

  // สถานะสำหรับข้อความที่จะแสดง
  const [displayText, setDisplayText] = useState('');
  const [subText, setSubText] = useState('');

  // ฟังก์ชันเมื่อกดปุ่ม
  const handleButtonClick = (label) => {
    if (['1', '4', '7', '*'].includes(label)) {
      setDisplayText('1323');
      setSubText('สายด่วนสุขภาพจิต');
    } else if (['2', '5', '8', '0'].includes(label)) {
      setDisplayText('1667');
      setSubText('ฮอตไลน์คลายเครียด');
    } else if (['3', '6', '9', '#'].includes(label)) {
      setDisplayText('0 2713 6793');
      setSubText('ศูนย์ปรึกษาปัญหาชีวิต');
    }
  };

  return (
    <div className="tellself-container">
      <div className="phone-display">
        <h2>{displayText}</h2>
        <p>{subText}</p>
      </div>
      <div className="phone-buttons">
        {buttonLabels.map((label, index) => (
          <button 
            key={index} 
            className="phone-button" 
            onClick={() => handleButtonClick(label)}>
            {label}
          </button>
        ))}
      </div>
       {/* ปุ่ม Call */}
       <Link to="/new-mood-assessment" className="call-button">
        Call
      </Link>
    </div>
  );
};

export default TellSelf;
