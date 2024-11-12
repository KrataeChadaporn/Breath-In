import React, { useState, useEffect } from 'react';
import './self.css';

const SimuStar = () => {
  const [message, setMessage] = useState('');
  const [audio, setAudio] = useState(null);

  useEffect(() => {
   
    const audioObj = new Audio(`${process.env.PUBLIC_URL}/video/music1.mp3`);
    audioObj.loop = true; 
    setAudio(audioObj); 

    
    return () => {
      audioObj.pause();
      audioObj.currentTime = 0;
    };
  }, []);

  const handleSubmit = () => {
    if (audio && audio.paused) {
      // เล่นเพลงเมื่อมีการคลิกปุ่ม
      audio.play().catch((err) => {
        console.error("Error playing audio:", err); // หากเกิดข้อผิดพลาดในการเล่นเพลง
      });
    }
    alert(`กำลังใจที่คุณให้ตัวเอง: ${message}`);
    setMessage(''); // ล้างข้อความหลังส่ง
  };

  return (
    <div className="simustar-container">
      <h1 className="simustar-heading">พิมพ์ให้กำลังใจตัวเองสิ</h1>
      <textarea 
        className="simustar-textarea" 
        value={message} 
        onChange={(e) => setMessage(e.target.value)} 
        placeholder="พิมพ์กำลังใจของคุณที่นี่..." 
      />
      <button className="simustar-submit-btn" onClick={handleSubmit}>ส่ง</button>
    </div>
  );
};

export default SimuStar;
