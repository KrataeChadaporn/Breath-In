import React, { useState } from 'react';
import './self.css';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase'; // Firebase connection

const NewMoodAssessment = () => {
  const navigate = useNavigate();
  const [selectedMood, setSelectedMood] = useState('');
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(true);
  const [feedbackModal, setFeedbackModal] = useState(null);

  // Mood options
  const moods = [
    { id: 'relaxed', label: 'ผ่อนคลาย', emoji: '😌', score: 2, feedback: 'คุณไม่มีอาการซึมเศร้าเลย', action: 'home' },
    { id: 'worried', label: 'กังวล', emoji: '😟', score: 3, feedback: 'คุณมีอาการซึมเศร้าระดับน้อย', action: 'expert' },
    { id: 'happy', label: 'มีความสุข', emoji: '😊', score: 1, feedback: 'คุณไม่มีอาการซึมเศร้าเลย', action: 'home' },
    { id: 'sad', label: 'เศร้า', emoji: '😢', score: 4, feedback: 'คุณมีอาการซึมเศร้าระดับปานกลาง', action: 'expert' },
    { id: 'angry', label: 'โกรธ', emoji: '😠', score: 5, feedback: 'คุณมีอาการซึมเศร้าระดับมาก', action: 'expert' },
  ];

  // Save mood data to Firestore
  const saveToFirestore = async (data) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        console.error('User not logged in!');
        return;
      }

      await addDoc(collection(db, 'moodHistory'), {
        ...data,
        userId: user.uid, // Save mood with the current user's ID
      });
      console.log('Mood history saved to Firestore!');
    } catch (error) {
      console.error('Failed to save mood history to Firestore:', error);
    }
  };

  // Save mood data to localStorage
  const saveToMoodHistory = (data) => {
    try {
      const savedMoods = JSON.parse(localStorage.getItem('moodHistory')) || [];
      savedMoods.push(data);
      localStorage.setItem('moodHistory', JSON.stringify(savedMoods));
    } catch (error) {
      console.error('Failed to save mood history locally:', error);
    }
  };

  // Handle mood selection
  const handleMoodSelection = (moodId) => {
    setSelectedMood(moodId);
  };

  // Confirm mood and show feedback modal
  const confirmMoodSelection = () => {
    if (selectedMood) {
      const currentMood = moods.find((mood) => mood.id === selectedMood);

      const moodAfterAssessment = {
        date: new Date().toISOString(),
        emoji: currentMood.emoji,
        label: currentMood.label,
        score: currentMood.score,
        type: 'afterAssessment',
      };

      // Save mood data locally and to Firestore
      saveToMoodHistory(moodAfterAssessment);
      saveToFirestore(moodAfterAssessment);

      // Show feedback modal
      setIsMoodModalOpen(false);
      setFeedbackModal(currentMood);
    }
  };

  // Handle feedback action button
  const handleFeedbackAction = () => {
    if (feedbackModal?.action === 'home') {
      navigate('/'); // Redirect to the homepage
    } else if (feedbackModal?.action === 'expert') {
      navigate('/talk-to-expert'); // Redirect to the expert page
    }
  };

  return (
    <div className="simulator-container">
      {/* Mood Selection Modal */}
      {isMoodModalOpen && (
        <div className="mood-modal-overlay">
          <div className="mood-modal">
            <h3 className="mood-selection-title">หลังเล่นคุณรู้สึกอย่างไรบ้าง?</h3>
            <div className="mood-selection">
              {moods.map((mood) => (
                <button
                  key={mood.id}
                  className={`mood-button ${selectedMood === mood.id ? 'selected' : ''}`}
                  onClick={() => handleMoodSelection(mood.id)}
                >
                  <span className="mood-emojiNA">{mood.emoji}</span>
                  <span className="mood-labelNA">{mood.label}</span>
                </button>
              ))}
            </div>
            <button
              className="confirm-mood-btn"
              onClick={confirmMoodSelection}
              disabled={!selectedMood}
            >
              ยืนยันอารมณ์
            </button>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
{feedbackModal && (
  <div className="mood-modal-overlay">
    <div className={`feedback-modal ${feedbackModal.id}`}>
      <h3>{feedbackModal.feedback}</h3>
      <div className="feedback-actions">
        <button className="confirm-mood-btn" onClick={handleFeedbackAction}>
          {feedbackModal.action === 'home' ? 'กลับไปหน้าแรก' : 'พูดคุยกับผู้เชี่ยวชาญ'}
        </button>
        <button
          className="confirm-mood-btn"
          onClick={() => navigate('/mood-comparison')}
        >
          ดูกราฟผลการประเมิน
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default NewMoodAssessment;
