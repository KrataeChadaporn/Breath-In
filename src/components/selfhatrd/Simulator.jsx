import React, { useState } from 'react';
import './self.css'; 
import { questions } from '../../dummyData';
import { Link ,useParams} from 'react-router-dom';


const Simulator = () => {
  const { id } = useParams();
  const [isAssessmentStarted, setIsAssessmentStarted] = useState(false);
  const [responses, setResponses] = useState(Array(questions.length).fill(null)); 
  const [score, setScore] = useState(null); 
  const [depressionLevel, setDepressionLevel] = useState(''); 
  const [recommendation, setRecommendation] = useState(''); 
  const [isAssessmentCompleted, setIsAssessmentCompleted] = useState(false); 
  const [resultClass, setResultClass] = useState(''); 

  const startAssessment = () => setIsAssessmentStarted(true);


  const handleResponseChange = (index, value) => {
    
    const newResponses = [...responses];
    newResponses[index] = value;
    setResponses(newResponses);
  };

  const calculateScore = () => responses.reduce((total, score) => total + (score || 0), 0);

  const submitAssessment = () => {
    const totalScore = calculateScore();
    setScore(totalScore);
    let level = '';
    let advice = '';
    let resultClass = '';
  
    // คำนวณระดับความซึมเศร้าและคำแนะนำ
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
  };

  return (
    <div className="simulator-container">
      {!isAssessmentStarted ? (
        <div className="overlay">
          <h2 className="warning-text">
            คำเตือน: เนื้อหาที่กำลังจะปรากฏต่อไปนี้<br />อาจสะท้อนถึงความรู้สึกอันซับซ้อนและกระทบกระเทือนจิตใจ<br />
            ผู้ที่มีความไวต่ออารมณ์ควรมีผู้ดูแลใกล้ชิด
          </h2>
          <button className="start-simulation-btn" onClick={startAssessment}>เริ่มโหมดจำลอง</button>
        </div>
      ) : isAssessmentCompleted ? (
        <div className={`result-container ${resultClass}`}>
          <h2>ผลการประเมิน</h2>
          <h3>{depressionLevel}</h3>
          <p>{recommendation}</p>
          {/* เงื่อนไขสำหรับแสดงปุ่มตามระดับของความซึมเศร้า */}
          {score <= 13 ? (
           <button className="restart-btn">
           <Link to={`/simustar/${id}`}>
             เริ่มโหมดจำลอง
           </Link>
         </button>
          ) : (
            <button className="restart-btn" onClick={() => window.open('https://example.com/consult', '_blank')}>ปรึกษาจิตแพทย์</button>
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
                  className={`answer-button ${responses[index] === 0 ? 'answer-none selected' : 'answer-none'}`} 
                  onClick={() => handleResponseChange(index, 0)}>
                  ไม่มีเลย
                </button>
                <button 
                  className={`answer-button ${responses[index] === 1 ? 'answer-sometimes selected' : 'answer-sometimes'}`} 
                  onClick={() => handleResponseChange(index, 1)}>
                  มีบ้างไม่บ่อย
                </button>
                <button 
                  className={`answer-button ${responses[index] === 2 ? 'answer-often selected' : 'answer-often'}`} 
                  onClick={() => handleResponseChange(index, 2)}>
                  มีบ่อย
                </button>
                <button 
                  className={`answer-button ${responses[index] === 3 ? 'answer-everyday selected' : 'answer-everyday'}`} 
                  onClick={() => handleResponseChange(index, 3)}>
                  มีทุกวัน
                </button>
              </div>
            </div>
          ))}
          <button className="submit-btn" onClick={submitAssessment}>ส่งข้อมูล</button>
        </div>
      )}
    </div>
  );
};

export default Simulator;
