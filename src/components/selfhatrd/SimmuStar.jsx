import React, { useState, useEffect } from 'react';
import './self.css';
import { Link } from 'react-router-dom';
import useAudio from '../audio/AudioProvider';
import { useParams } from 'react-router-dom';

const SimuStar = () => {
  const [message, setMessage] = useState('');
  const [isSadMode, setIsSadMode] = useState(false);  // โหมดแรก (พิมพ์กำลังใจ)
  const [isSecondMode, setIsSecondMode] = useState(false); // โหมดที่สอง (คำถามเกี่ยวกับหน้าตา)
  const [isFinalMode, setIsFinalMode] = useState(false);  // โหมดสุดท้าย (คำถามเกี่ยวกับคนรอบข้าง)

  const [positions, setPositions] = useState([]);
  const [audio, setAudio] = useState(null);
  const [buttonText, setButtonText] = useState('ดี');
  const [buttonColor, setButtonColor] = useState('#000000');
  const [backgroundImage, setBackgroundImage] = useState('default');
  
  

  // ฟังก์ชันการจัดการคลิกปุ่ม "ดี"
  const handleLeftButtonClick = () => {
    if (buttonText === 'ดี') {
      setButtonText('ไม่ดี');
      setButtonColor('#f13c32');
      setBackgroundImage('sad');
    } else {
      setButtonText('ดี');
      setButtonColor('#000000');
      setBackgroundImage('happy');
    }
    setIsSadMode(false);  // ปิดโหมดแรก
    setIsSecondMode(false); // ปิดโหมดที่สอง
  };

  // ฟังก์ชันการจัดการคลิกปุ่ม "ไม่ดี"
  const handleRightButtonClick = () => {
    setIsSecondMode(false); // ปิดโหมดที่สอง
    setIsFinalMode(true);  // เปิดโหมดสุดท้าย
  };

  // ฟังก์ชันที่ใช้ตรวจสอบตำแหน่งว่าใกล้เกินไปหรือไม่
  const isTooClose = (newPosition, minDistance) => {
    return positions.some((pos) => {
      const distance = Math.sqrt(
        Math.pow(newPosition.top - pos.top, 2) + Math.pow(newPosition.left - pos.left, 2)
      );
      return distance < minDistance;
    });
  };

  // ฟังก์ชันเพื่อสุ่มตำแหน่งข้อความ
  const generateRandomPositions = () => {
    const minDistance = 50;
    const newPositions = [];
    const numberOfMessages = 50;

    while (newPositions.length < numberOfMessages) {
      const top = Math.floor(Math.random() * 100);
      const left = Math.floor(Math.random() * 100);
      const newPosition = { top, left };

      if (!isTooClose(newPosition, minDistance)) {
        newPositions.push(newPosition);
      }
    }

    setPositions(newPositions);
  };

  // การตั้งค่าเสียง
  const handleSubmit = () => {
    setMessage('');
    if (isFinalMode) {
      setIsSadMode(false);  
      setIsFinalMode(false);
    } else if (isSadMode) {
      setIsFinalMode(true);
    } else {
      setIsSadMode(true);
      if (audio && audio.paused) {
        audio.volume = 0.2;
        audio.play().catch((err) => {
          console.error("Error playing audio:", err);
        });

        const increaseVolume = setInterval(() => {
          audio.volume = Math.min(audio.volume + 0.1, 1);
          if (audio.volume >= 1) {
            clearInterval(increaseVolume);
          }
        }, 500);
      }
    }
  };

  // การตั้งค่าเสียงเมื่อเริ่มต้น
  // useEffect(() => {
  //   const audioObj = new Audio(`${process.env.PUBLIC_URL}/video/music1.mp3`);
  //   audioObj.loop = true;
  //   audioObj.volume = 0.2;

  //   const handlePlayError = (err) => {
  //     console.error("Error playing audio:", err);
  //   };

  //   audioObj.addEventListener("canplaythrough", () => {
  //     setAudio(audioObj);
  //   });
  //   audioObj.addEventListener("error", handlePlayError);

  //   return () => {
  //     audioObj.pause();
  //     audioObj.currentTime = 0;
  //     audioObj.removeEventListener("error", handlePlayError);
  //   };
  // }, []);

  // สร้างตำแหน่งข้อความแบบสุ่มเมื่อโหมด Sad
  useEffect(() => {
    if (isSadMode) {
      generateRandomPositions();
    }
  }, [isSadMode]);

  return (
    <div className={`simustar-container ${isSadMode ? 'sad-mode' : ''} ${isFinalMode ? 'final-mode' : ''}`}>
      {!isFinalMode ? (
        <>
          <h1 className="simustar-heading">
            {isSadMode ? 'ฉันห่วยแตกที่สุด' : 'พิมพ์ให้กำลังใจตัวเองสิ'}
          </h1>
          <textarea
            className="simustar-textarea"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="พิมพ์กำลังใจของคุณที่นี่..."
          />
          <button className="simustar-submit-btn" onClick={handleSubmit}>
            {isSadMode ? 'กดส่งข้อความ' : 'ส่งข้อความ'}
          </button>
          {isSadMode && (
            <div className="sad-messages">
              {positions.map((position, i) => {
                const randomRedClass = ['red-1', 'red-2', 'red-3'][Math.floor(Math.random() * 3)];
                return (
                  <p
                    key={i}
                    className={`floating-sad-message ${randomRedClass}`}
                    style={{
                      top: `${position.top}vh`,
                      left: `${position.left}vw`,
                      fontSize: `${Math.floor(Math.random() * 20) + 15}px`,
                      transform: `rotate(${Math.floor(Math.random() * 60) - 30}deg)`,
                      fontStyle: Math.random() > 0.5 ? 'italic' : 'normal',
                    }}
                  >
                    ฉันห่วยแตกที่สุด
                  </p>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <div className="final-question">
          <h1>คุณคิดว่าตัวเองหน้าตาดีหรือไม่?</h1>
          <div className="button-group-simstar">
            <button
              className="left-button-simstar"
              style={{ backgroundColor: buttonColor }}
              onClick={handleLeftButtonClick}
            >
              {buttonText}
            </button>

            {/* ปุ่ม "ไม่ดี" สำหรับโหมดที่สอง */}
            <Link to="/simulast">
            <button className="right-button-simstar">
              ไม่ดี
            </button>
          </Link>
          </div>
        </div>
      )}
      
    </div>
  );
};

export default SimuStar;
