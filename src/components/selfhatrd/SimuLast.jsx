import React, { useState, useEffect } from 'react';
import './simlast.css';
import { Link } from 'react-router-dom';

const SimuLast = () => {
  const [isStageChanged, setIsStageChanged] = useState(false);
  const [isFinalQuestion, setIsFinalQuestion] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0); // Track button selections

  // Handle button click to update the selection count and show different content
  const handleButtonClick = () => {
    setSelectedCount((prevCount) => {
      const newCount = prevCount + 1;
      if (newCount === 1) {
        setIsStageChanged(true); // First button clicked: Show stage changed content
      } else if (newCount === 2) {
        setIsFinalQuestion(true); // Second button clicked: Transition to the final question
      }
      return newCount;
    });
  };
  // Handle random button movement for the "no" button within a fixed 1400x472 area
const moveButtonRandomly = () => {
    const noButton = document.querySelector('.no-btn');
    const container = document.querySelector('.simulast-container');
  
    if (!noButton || !container) return;
  
    const noButtonWidth = noButton.offsetWidth;
    const noButtonHeight = noButton.offsetHeight;
  
    // Set fixed container boundaries (1400x472)
    const containerWidth = 1400;
    const containerHeight = 472;
  
    // Calculate random positions within the fixed boundaries
    const maxX = containerWidth - noButtonWidth - 20; // Offset for right boundary
    const maxY = containerHeight - noButtonHeight - 20; // Offset for bottom boundary
  
    // Random X and Y positions within the fixed container area
    const randomX = Math.floor(Math.random() * maxX) + 10; // Offset for left boundary
    const randomY = Math.floor(Math.random() * maxY) + 10; // Offset for top boundary
  
    // Apply random position to the button
    noButton.style.position = 'absolute';
    noButton.style.left = `${randomX}px`;
    noButton.style.top = `${randomY}px`;
  };
  
  // Start random movement when mouse enters the button
  const onMouseEnter = () => {
    moveButtonRandomly(); // Move immediately when mouse enters
  };

  // Stop random movement when mouse leaves
  const onMouseLeave = () => {
    // Do nothing when mouse leaves, as we are only triggering movement on enter
  };

  // Dynamically set the canvas size
  const setCanvasSize = () => {
    const canvas = document.getElementById('canvas');
    if (canvas) {
      canvas.width = window.innerWidth - 100; // ลบขนาดซ้ายขวา 50px
      canvas.height = window.innerHeight - 100; // ลบขนาดบนล่าง 50px
    }
  };
  
  // Update the canvas size on window resize
  useEffect(() => {
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    return () => window.removeEventListener('resize', setCanvasSize);
  }, []);

  return (
    <div       className={`simulast-container ${isFinalQuestion ? 'final-stage' : isStageChanged ? 'stage-changed' : ''}`}
    >

      {!isFinalQuestion && (
        <h1 className="message">
          {isStageChanged
            ? 'ประโยคที่เพื่อนๆมักพูดถึงคุณ'
            : 'ลองมองคนรอบข้างสิ คุณได้ยินอะไรจากพวกเขา'}
        </h1>
      )}

      {!isFinalQuestion && (
        <div className={`button-group-simlast ${isStageChanged ? 'horizontal' : 'vertical'}`}>
          <button className={`right-button-simlast`} onClick={handleButtonClick}>
            {isStageChanged ? 'ดูไม่มีสมอง โง่ดี' : 'เธอมันผิดตั้งแต่เกิด'}
          </button>
          <button className={`right-button-simlast`} onClick={handleButtonClick}>
            {isStageChanged ? 'หน้าตาแย่แบบนี้ จะมีคนคบด้วยหรอ' : 'เธอเป็นตัวน่ารังเกลียดของสังคม'}
          </button>
          <button className={`right-button-simlast`} onClick={handleButtonClick}>
            {isStageChanged ? 'ทำตัวแบบนี้ใครจะอยู่ด้วย' : 'เธอคือภาระ ไร้ประโยชน์'}
          </button>
        </div>
      )}

      {isFinalQuestion && (
        
        <div className="final-question">
          <h1>คุณคิดว่าคุณมีค่าพอจะมีชีวิตต่อหรือไม่?</h1>
          <div className="btn-group-final">
          <Link to="/Learn">
            <button className="yes-btn">ไม่มีค่า</button>
            </Link>
            <button
              id="canvas"
              className="no-btn"
              onMouseEnter={onMouseEnter} // Start random movement immediately when mouse enters
              onMouseLeave={onMouseLeave} // Optionally stop movement on mouse leave, if needed
            >
              มีค่า
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimuLast;
