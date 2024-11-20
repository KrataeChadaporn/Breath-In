import React, { useState, useEffect } from 'react';
import './self.css';
import { questions } from '../../dummyData';
import { Link, useParams } from 'react-router-dom';
import { addDoc, collection, updateDoc, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebase';
import { useNavigate } from 'react-router-dom';

const Simulator = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);
  const [responses, setResponses] = useState(Array(questions.length).fill(null));
  const [score, setScore] = useState(null);
  const [depressionLevel, setDepressionLevel] = useState('');
  const [recommendation, setRecommendation] = useState('');
  const [isAssessmentCompleted, setIsAssessmentCompleted] = useState(false);
  const [resultClass, setResultClass] = useState('');
  const [selectedMood, setSelectedMood] = useState('');
  const [isMoodModalOpen, setIsMoodModalOpen] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);

  const moods = [
    { id: 'relaxed', label: 'ผ่อนคลาย', emoji: '😌', score: 2 },
    { id: 'worried', label: 'กังวล', emoji: '😟', score: 3 },
    { id: 'happy', label: 'มีความสุข', emoji: '😊', score: 1 },
    { id: 'sad', label: 'เศร้า', emoji: '😢', score: 4 },
    { id: 'angry', label: 'โกรธ', emoji: '😠', score: 5 },
  ];

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return () => unsubscribe();
  }, []);

  const saveToMoodHistory = async (data) => {
    if (!currentUser) {
      console.error('No user logged in. Cannot save data.');
      return;
    }

    try {
      await addDoc(collection(db, 'moodHistory'), {
        ...data,
        userId: currentUser.uid,
      });
      console.log('Mood data saved:', data);
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
        level: null,
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
  
    // Determine depression level and advice
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
  
    if (!currentUser) {
      console.error('User not logged in. Cannot save assessment result.');
      return;
    }
  
    try {
      // Update the most recent "beforeAssessment" record for this user
      const moodCollection = collection(db, 'moodHistory');
      const moodQuery = query(
        moodCollection,
        where('userId', '==', currentUser.uid),
        where('type', '==', 'beforeAssessment'),
        where('level', '==', null) // Find the most recent unprocessed record
      );
      const snapshot = await getDocs(moodQuery);
  
      if (!snapshot.empty) {
        const docRef = snapshot.docs[0].ref;
        await updateDoc(docRef, { level }); // Update the record with the depression level
        console.log('Updated "beforeAssessment" record with depression level.');
      } else {
        console.error('No matching mood record found.');
      }
    } catch (error) {
      console.error('Error updating mood record:', error);
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
                    selectedMood === mood.id ? 'selected' : ''
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
  

  {/* Conditional redirection based on depressionLevel */}
  <button
    className="restart-btn"
    onClick={() => {
      if (
        depressionLevel === 'คุณไม่มีอาการซึมเศร้าเลย' || 
        depressionLevel === 'คุณมีอาการซึมเศร้าระดับน้อย' || 
        depressionLevel === 'คุณมีอาการซึมเศร้าระดับปานกลาง'
      ) {
        navigate('/simustar/1'); // Redirect to simustar page
      } else if (
        depressionLevel === 'คุณมีอาการซึมเศร้าระดับมาก' || 
        depressionLevel === 'คุณมีอาการซึมเศร้าระดับรุนแรง'
      ) {
        navigate('/chat'); // Redirect to consult a psychiatrist
      }
      
    }}
  >
    {depressionLevel === 'คุณมีอาการซึมเศร้าระดับรุนแรง'
      ? 'ปรึกษาจิตแพทย์'
      : 'เริ่มโหมดจำลอง'}
  </button>
</div>

      ) : (
        <div className="scrollable-box">
          <h2>แบบประเมินภาวะซึมเศร้า</h2>
          {questions.map((question, index) => (
            <div key={index} className="question-container">
              <p>{question}</p>
              <div className="answer-options">
  {['ไม่มีเลย', 'มีบ้าง', 'บ่อย', 'ทุกวัน'].map((label, value) => (
    <button
      key={value}
      className={`answer-button ${responses[index] === value ? 'selected' : ''} ${
        label === 'ไม่มีเลย'
          ? 'answer-none'
          : label === 'มีบ้าง'
          ? 'answer-sometimes'
          : label === 'บ่อย'
          ? 'answer-often'
          : 'answer-everyday'
      }`}
      onClick={() => handleResponseChange(index, value)}
    >
      {label}
    </button>
  ))}
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
