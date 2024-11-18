import React, { useState, useEffect } from 'react';
import './self.css';
import { questions } from '../../dummyData';
import { Link, useParams, useHistory } from 'react-router-dom';
import { addDoc, collection, getDocs, updateDoc, query, where, doc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useNavigate } from 'react-router-dom';


const Simulator = () => {
  const { id } = useParams();
  const history = useNavigate();  // Replacing useHistory with useNavigate

  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);
  const [responses, setResponses] = useState(Array(questions.length).fill(null));
  const [score, setScore] = useState(null);
  const [depressionLevel, setDepressionLevel] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [isAssessmentCompleted, setIsAssessmentCompleted] = useState(false);
  const [resultClass, setResultClass] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(true);

  const moods = [
    { id: 'relaxed', label: 'ผ่อนคลาย', emoji: '😌', score: 2 },
    { id: 'worried', label: 'กังวล', emoji: '😟', score: 3 },
    { id: 'happy', label: 'มีความสุข', emoji: '😊', score: 1 },
    { id: 'sad', label: 'เศร้า', emoji: '😢', score: 4 },
    { id: 'angry', label: 'โกรธ', emoji: '😠', score: 5 },
  ];

  // ฟังก์ชันสำหรับบันทึกข้อมูลลง Firebase
  const saveToMoodHistory = async (data) => {
    try {
      await addDoc(collection(db, 'moodHistory'), data);
      console.log('Mood saved:', data);
    } catch (error) {
      console.error('Error saving mood data:', error);
    }
  };

  const startAssessment = async () => {
    if (selectedMood) {
      setIsAssessmentStarted(true);
      const currentMood = moods.find((mood) => mood.id === selectedMood);

      const moodBeforeAssessment = {
        date: new Date().toISOString(),
        emoji: currentMood.emoji,
        label: currentMood.label,
        score: currentMood.score,
        type: 'beforeAssessment',
        level: null, // Placeholder for assessment level
      };

      await saveToMoodHistory(moodBeforeAssessment);
    }
  };

  const handleMoodSelection = (moodId) => {
    setSelectedMood(moodId);
  };

  const confirmMoodSelection = () => {
    if (selectedMood) {
      setIsMoodModalOpen(false);
    }
  };

  const handleResponseChange = (index, value) => {
    const updatedResponses = [...responses];
    updatedResponses[index] = value;
    setResponses(updatedResponses);
  };

  const calculateTotalScore = () =>
    responses.reduce((total, score) => total + (score || 0), 0);

  const submitAssessment = async () => {
    const totalScore = calculateTotalScore();
    setScore(totalScore);

    let level = '';
    let advice = '';
    let resultClass = '';

    // กำหนดระดับภาวะซึมเศร้า
    if (totalScore === 0) {
      level = 'คุณไม่มีอาการซึมเศร้าเลย';
      advice = 'คุณอยู่ในภาวะที่ดี คอยดูแลตัวเองและรักษาสมดุลในการใช้ชีวิตให้ดี';
      resultClass = 'no-depression';
    } else if (totalScore <= 7) {
      level = 'คุณมีอาการซึมเศร้าระดับน้อย';
      advice = 'พักผ่อนให้เพียงพอ คุยกับคนที่คุณรัก ออกกำลังกายอย่างสม่ำเสมอ';
      resultClass = 'low-depression';
    } else if (totalScore <= 13) {
      level = 'คุณมีอาการซึมเศร้าระดับปานกลาง';
      advice = 'พิจารณาพูดคุยกับผู้เชี่ยวชาญด้านสุขภาพจิตหากรู้สึกไม่ดี';
      resultClass = 'medium-depression';
    } else if (totalScore <= 19) {
      level = 'คุณมีอาการซึมเศร้าระดับมาก';
      advice = 'ขอแนะนำให้คุณพบผู้เชี่ยวชาญเพื่อรับคำปรึกษา';
      resultClass = 'high-depression';
    } else {
      level = 'คุณมีอาการซึมเศร้าระดับรุนแรง';
      advice = 'ขอแนะนำให้คุณติดต่อผู้เชี่ยวชาญโดยด่วน';
      resultClass = 'severe-depression';
    }

    setDepressionLevel(level);
    setRecommendation(advice);
    setIsAssessmentCompleted(true);
    setResultClass(resultClass);

    try {
      const moodCollection = collection(db, 'moodHistory');
      const moodQuery = query(
        moodCollection,
        where('type', '==', 'beforeAssessment'),
        where('level', '==', null)
      );
      const snapshot = await getDocs(moodQuery);

      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        await updateDoc(docRef, { level });
        console.log('Updated mood level in Firestore');
      }
    } catch (error) {
      console.error('Error updating mood level:', error);
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
                className={`mood-button ${
                  selectedMood === mood.id ? "selected" : ""
                }`}
                onClick={() => handleMoodSelection(mood.id)}
              >
                <span className="mood-emoji">{mood.emoji}</span>
                <span className="mood-label">{mood.label}</span>
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

    

      {!isAssessmentStarted ? (
        <div className="overlay">
          <h2 className="warning-text">
            คำเตือน: เนื้อหาที่กำลังจะปรากฏต่อไปนี้<br />อาจสะท้อนถึงความรู้สึกอันซับซ้อนและกระทบกระเทือนจิตใจ<br />
            ผู้ที่มีความไวต่ออารมณ์ควรมีผู้ดูแลใกล้ชิด
          </h2>
          <button
            className="start-simulation-btn"
            onClick={startAssessment}
            disabled={!selectedMood}
          >
            เริ่มโหมดจำลอง
          </button>
        </div>
      ) : isAssessmentCompleted ? (
        <div className={`result-container ${resultClass}`}>
          <h2>ผลการประเมิน</h2>
          <h3>{depressionLevel}</h3>
          <p>{recommendation}</p>
          <p>อารมณ์ก่อนเริ่มการประเมิน: {moods.find((m) => m.id === selectedMood)?.label}</p>
          {score <= 13 ? (
            <button className="restart-btn">
              <Link to={`/simustar/${id}`}>เริ่มโหมดจำลอง</Link>
            </button>
          ) : (
            <Link 
                to="/chat" // Replace with your actual route, e.g., "/consult"
                className="restart-btn"
              >
                ปรึกษาจิตแพทย์
              </Link>
          )}
        </div>
      ) : (
        <div className="scrollable-box">
          <h2 className="warning-text">แบบประเมินภาวะซึมเศร้า</h2>
          {questions.map((question, index) => (
            <div key={index} className="question-container">
              <p className="question-text">{question}</p>
              <div className="answer-options">
                <button
                  className={`answer-button ${
                    responses[index] === 0 ? 'answer-none selected' : 'answer-none'
                  }`}
                  onClick={() => handleResponseChange(index, 0)}
                >
                  ไม่มีเลย
                </button>
                <button
                  className={`answer-button ${
                    responses[index] === 1 ? 'answer-sometimes selected' : 'answer-sometimes'
                  }`}
                  onClick={() => handleResponseChange(index, 1)}
                >
                  มีบ้างไม่บ่อย
                </button>
                <button
                  className={`answer-button ${
                    responses[index] === 2 ? 'answer-often selected' : 'answer-often'
                  }`}
                  onClick={() => handleResponseChange(index, 2)}
                >
                  มีบ่อย
                </button>
                <button
                  className={`answer-button ${
                    responses[index] === 3 ? 'answer-everyday selected' : 'answer-everyday'
                  }`}
                  onClick={() => handleResponseChange(index, 3)}
                >
                  มีทุกวัน
                </button>
              </div>
            </div>
          ))}
          <button className="submit-btn" onClick={submitAssessment}>
            ส่งข้อมูล
          </button>
        </div>
      )}
    </div>
  );
};

export default Simulator;
