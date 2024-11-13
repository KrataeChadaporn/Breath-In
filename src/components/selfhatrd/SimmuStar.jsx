import React, { useState, useEffect } from 'react';
import './self.css';

const SimuStar = () => {
  const [message, setMessage] = useState('');
  const [isSadMode, setIsSadMode] = useState(false);
  const [positions, setPositions] = useState([]);
  const [audio, setAudio] = useState(null);

  const isTooClose = (newPosition, minDistance) => {
    return positions.some((pos) => {
      const distance = Math.sqrt(
        Math.pow(newPosition.top - pos.top, 2) + Math.pow(newPosition.left - pos.left, 2)
      );
      return distance < minDistance;
    });
  };

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

  useEffect(() => {
    if (isSadMode) {
      generateRandomPositions();
    }
  }, [isSadMode]);

  const handleSubmit = () => {
    alert(`กำลังใจที่คุณให้ตัวเอง: ${message}`);
    setMessage('');
    setIsSadMode(true);

    if (audio && audio.paused) {
      audio.volume = 0.2;
      audio.play().catch((err) => {
        console.error("Error playing audio:", err);
      });

      const increaseVolume = setInterval(() => {
        if (audio.volume < 1) {
          audio.volume += 0.1;
        } else {
          clearInterval(increaseVolume);
        }
      }, 500);
    }
  };

  useEffect(() => {
    const audioObj = new Audio(`${process.env.PUBLIC_URL}/video/music1.mp3`);
    audioObj.loop = true;
    audioObj.volume = 0.2;

    const handlePlayError = (err) => {
      console.error("Error playing audio:", err);
    };

    audioObj.addEventListener("canplaythrough", () => {
      setAudio(audioObj);
    });
    audioObj.addEventListener("error", handlePlayError);

    return () => {
      audioObj.pause();
      audioObj.currentTime = 0;
      audioObj.removeEventListener("error", handlePlayError);
    };
  }, []);

  return (
    <div className={`simustar-container ${isSadMode ? 'sad-mode' : ''}`}>
      <h1 className="simustar-heading">{isSadMode ? 'ฉันห่วยแตกที่สุด' : 'พิมพ์ให้กำลังใจตัวเองสิ'}</h1>
      <textarea 
        className="simustar-textarea" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="พิมพ์กำลังใจของคุณที่นี่..." 
      />
      <button className="simustar-submit-btn" onClick={handleSubmit}>ส่ง</button>

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
    </div>
  );
};

export default SimuStar;
