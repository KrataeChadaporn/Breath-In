import React, { useState } from 'react';
import './self.css';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // เชื่อมต่อ Firebase
import { Link } from 'react-router-dom';

const NewMoodAssessment = () => {
  const history = useNavigate();
  const [selectedMood, setSelectedMood] = useState('');
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(true);

  // ตัวเลือกอารมณ์พร้อมคะแนน
  const moods = [
    { id: 'relaxed', label: 'ผ่อนคลาย', emoji: '😌', score: 2 },
    { id: 'worried', label: 'กังวล', emoji: '😟', score: 3 },
    { id: 'happy', label: 'มีความสุข', emoji: '😊', score: 1 },
    { id: 'sad', label: 'เศร้า', emoji: '😢', score: 4 },
    { id: 'angry', label: 'โกรธ', emoji: '😠', score: 5 }
  ];

  // บันทึกข้อมูลลงใน Firestore
  const saveToMoodHistory = async (data) => {
    try {
      await addDoc(collection(db, 'moodHistory'), data); // เพิ่มข้อมูลใน Collection "moodHistory"
      console.log('Mood saved successfully:', data);
    } catch (error) {
      console.error('Error saving mood data:', error);
    }
  };

  // เมื่อผู้ใช้เลือกอารมณ์
  const handleMoodSelection = (moodId) => {
    setSelectedMood(moodId);
  };

  // เมื่อผู้ใช้ยืนยันการเลือกอารมณ์
  const confirmMoodSelection = async () => {
    if (selectedMood) {
      setIsMoodModalOpen(false);
      const currentMood = moods.find((mood) => mood.id === selectedMood);

      const moodAfterAssessment = {
        date: new Date().toISOString(),
        emoji: currentMood.emoji,
        label: currentMood.label,
        score: currentMood.score,
        type: 'afterAssessment', // ระบุประเภทของข้อมูล
      };

      await saveToMoodHistory(moodAfterAssessment);

      // Redirect ไปยังหน้า "mood-tracking"
      history.push('/mood-tracking');
    }
  };

  return (
    <div className="simulator-container">
      {isMoodModalOpen && (
        <div className="mood-modal-overlay">
          <div className="mood-modal">
            <h3 className="mood-selection-title">วันนี้คุณรู้สึกอย่างไรบ้าง?</h3>
            <div className="mood-selection">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  className={`mood-button ${selectedMood === mood.id ? 'selected' : ''}`}
                  onClick={() => handleMoodSelection(mood.id)}
                >
                  {mood.emoji} {mood.label}
                </button>
              ))}
            </div>
            <Link
        to="/mood-comparison" // The target route to navigate to
        className={`confirm-mood-btn ${!selectedMood ? 'disabled' : ''}`}
        onClick={confirmMoodSelection} // Execute the confirm function
      >
        ยืนยันอารมณ์
      </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default NewMoodAssessment;
