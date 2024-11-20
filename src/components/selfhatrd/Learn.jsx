import React, { useState } from 'react';
import './learn.css'; // นำเข้าไฟล์ CSS
import { Link } from 'react-router-dom';
import { useEffect } from 'react';

const Learn = () => {
  const messages = [
    'การเกลียดตัวเองเกิดจากความคิดในแง่ลบกับตัวเองที่พลั่งพลูมาอย่างมากมายจนไม่สามารถจัดการกับมันได้และรู้สึกว่าไม่มีใครอีกแล้วที่ช่วยเหลือเราได้',
    'เมื่อเกิดความรู้สึกว่าเราไม่สามารถทำอะไรได้เลย อยู่ไปก็มีแต่เป็นภาระให้คนอื่น เราก็จะรู้สึกไม่เป็นที่ต้องการ',
    'แต่อย่างไรก็ตามความรู้สึกนี้สามารถเปลี่ยนไปได้ ถ้าเรารู้ทันความคิดของตนเอง ก็จะเปิดมุมมองและเปิดโอกาสให้ตัวเราเองมากขึ้น',
    'มาเรียนรู้วิธีการรับมือเมื่อตัวเราหรือคนที่เรารักกำลังเผชิญปัญหานี้กัน'
  ];

  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [isLearningStarted, setIsLearningStarted] = useState(false); 
  const [isFinalStep, setIsFinalStep] = useState(false); // เพิ่มสถานะสำหรับขั้นตอนสุดท้าย

  const handleClick = () => {
    if (currentMessageIndex === messages.length - 1) {
      setIsLearningStarted(true); 
    } else {
      setCurrentMessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }
  };

  const handleOptionClick = () => {
    setIsFinalStep(true); // เมื่อกดปุ่มเดิมครบแล้ว เปลี่ยนเป็นขั้นตอนใหม่
  };

  const backgroundClass = isLearningStarted
    ? isFinalStep
      ? 'bg-final-step' // พื้นหลังใหม่สำหรับขั้นตอนสุดท้าย
      : 'bg-learning-started'
    : `bg-${currentMessageIndex + 1}`;


    

  return (
    <div className={`learn-container ${backgroundClass}`}>
      <div className="learn-content">
        {!isLearningStarted ? (
          <>
            <h1 className="learn-text">
              {messages[currentMessageIndex]}
            </h1>
            <button className="learn-btn" onClick={handleClick}>
              {currentMessageIndex === messages.length - 1 ? 'เริ่มเรียนรู้' : 'ไปต่อ'}
            </button>
          </>
        ) : !isFinalStep ? (
          <>
            <h1 className="learn-text">ช่วยสนับสนุนและให้กำลังใจคนที่พบเจอปัญหา</h1>
            <div className="button-group-larn">
              <button className="learn-option-btn" onClick={handleOptionClick}>
                ฉันดีใจที่ได้รู้จักเธอนะ
              </button>
              <button className="learn-option-btn" onClick={handleOptionClick}>
                เธอเป็นคนที่เก่งนะ ฉันภูมิใจในตัวเธอ
              </button>
              <button className="learn-option-btn" onClick={handleOptionClick}>
                เธอทำได้อยู่แล้ว ฉันคอยสนับสนุน
              </button>
            </div>
          </>
        ) : (
          <>
            <h1 className="learn-text-final">ลองสังเกตคนที่คุณรักให้มากขึ้นอีกนิด</h1>
            <div className="button-group-final">
              <Link to="/final-self"> {/* ใช้ Link ไปยังหน้า FinalSelf */}
                <button className="final-option-btn top-left">
                  เป็นไงบ้างช่วงนี้ มีปัญหาอะไรมั้ย 
                </button>
              </Link>
              <Link to="/final-self"> {/* ใช้ Link ไปยังหน้า FinalSelf */}
                <button className="final-option-btn center">
                  ไหวมั้ย ฉันอยู่ข้างๆนะ
                </button>
              </Link>
              <Link to="/final-self"> {/* ใช้ Link ไปยังหน้า FinalSelf */}
                <button className="final-option-btn bottom-right">
                  ฉันฟังอยู่ พูดได้เลย
                </button>
              </Link>
            </div>
          </>
          
        )}
      </div>
    </div>
  );
};

export default Learn;
