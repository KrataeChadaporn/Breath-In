import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Use useNavigate instead of useHistory
import { collection, getDocs, deleteDoc, addDoc } from 'firebase/firestore';
import { db } from '../../firebase'; // เชื่อมต่อ Firebase
import './mood.css';

const MoodTracking = () => {
  const [beforeMoodHistory, setBeforeMoodHistory] = useState([]); // ข้อมูลอารมณ์ก่อนการประเมิน
  const [afterMoodHistory, setAfterMoodHistory] = useState([]);  // ข้อมูลอารมณ์หลังการประเมิน
  const navigate = useNavigate(); // Use useNavigate hook

  // ดึงข้อมูลจาก Firestore
  useEffect(() => {
    const fetchMoods = async () => {
      const moodCollection = collection(db, 'moodHistory'); // อ้างอิง Collection
      const moodSnapshot = await getDocs(moodCollection); // ดึงข้อมูลทั้งหมดจาก Firestore
      const moodData = moodSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })); // แปลงข้อมูลจาก snapshot

      // แยกข้อมูลก่อนและหลังการประเมิน
      const beforeMoods = moodData.filter(entry => entry.type === 'beforeAssessment');
      const afterMoods = moodData.filter(entry => entry.type === 'afterAssessment');

      setBeforeMoodHistory(beforeMoods); // เก็บข้อมูลใน state
      setAfterMoodHistory(afterMoods);
    };

    fetchMoods();
  }, []);

  // ฟังก์ชันสำหรับบันทึก "อารมณ์หลังการประเมิน"
  const saveAfterAssessmentMood = async (totalScore, selectedMood) => {
    let level = '';
    let emoji = '';
    let label = '';

    // ตัวอย่างการกำหนดระดับภาวะซึมเศร้าและคำแนะนำ
    if (totalScore === 0) {
      level = 'ไม่มีอาการซึมเศร้า';
      emoji = '😊';
      label = 'มีความสุข';
    } else if (totalScore <= 7) {
      level = 'ซึมเศร้าระดับน้อย';
      emoji = '😌';
      label = 'ผ่อนคลาย';
    } else if (totalScore <= 13) {
      level = 'ซึมเศร้าระดับปานกลาง';
      emoji = '😟';
      label = 'กังวล';
    } else if (totalScore <= 19) {
      level = 'ซึมเศร้าระดับมาก';
      emoji = '😢';
      label = 'เศร้า';
    } else {
      level = 'ซึมเศร้าระดับรุนแรง';
      emoji = '😠';
      label = 'โกรธ';
    }

    const moodAfterAssessment = {
      date: new Date().toISOString(),
      emoji: emoji,
      label: label,
      score: totalScore,
      type: 'afterAssessment',
      level: level,
    };

    try {
      await addDoc(collection(db, 'moodHistory'), moodAfterAssessment); // บันทึกข้อมูลลง Firestore
      console.log('Mood after assessment saved successfully');
    } catch (error) {
      console.error('Error saving mood after assessment:', error);
    }
  };

  // ฟังก์ชันล้างข้อมูลจาก Firestore
  const clearMoodHistory = async () => {
    try {
      const moodCollection = collection(db, 'moodHistory');
      const moodSnapshot = await getDocs(moodCollection);

      // ลบข้อมูลทั้งหมดใน collection
      const deletePromises = moodSnapshot.docs.map(doc => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      // เคลียร์ข้อมูลใน state
      setBeforeMoodHistory([]);
      setAfterMoodHistory([]);
    } catch (error) {
      console.error('เกิดข้อผิดพลาดในการลบข้อมูล:', error);
    }
  };

  return (
    <div className="mood-tracking">
      <h2>ประวัติการติดตามอารมณ์</h2>

      <div className="button-row">
        <button className="mood-tracking-button" onClick={() => navigate('/mood-comparison')}>
          ดูรวมประเมิน
        </button>
        <button className="clear-data-button" onClick={clearMoodHistory}>
          ล้างข้อมูล
        </button>
      </div>

      {/* ตารางแสดงข้อมูล "อารมณ์ก่อนการประเมิน" */}
      <h3>อารมณ์ก่อนการประเมิน</h3>
      <table className="mood-table">
        <thead>
          <tr>
            <th>วันที่</th>
            <th>เวลา</th>
            <th>อารมณ์</th>
            <th>ระดับภาวะซึมเศร้า</th>
          </tr>
        </thead>
        <tbody>
          {beforeMoodHistory.length > 0 ? (
            beforeMoodHistory.map((entry, index) => {
              const date = new Date(entry.date);
              const formattedDate = date.toLocaleDateString('th-TH');
              const formattedTime = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
              const depressionLevel = entry.level || 'N/A';
              return (
                <tr key={entry.id || index} className="mood-entry">
                  <td>{formattedDate}</td>
                  <td>{formattedTime}</td>
                  <td>
                    <span className="mood-emoji">{entry.emoji}</span>
                    {entry.label}
                  </td>
                  <td>{depressionLevel}</td>
                </tr>
              );
            })
          ) : (
            <tr><td colSpan="4" className="empty-message">ไม่มีข้อมูลอารมณ์ก่อนการประเมิน</td></tr>
          )}
        </tbody>
      </table>

      {/* ตารางแสดงข้อมูล "อารมณ์หลังการประเมิน" */}
      <h3>อารมณ์หลังการประเมิน</h3>
      <table className="mood-table">
        <thead>
          <tr>
            <th>วันที่</th>
            <th>เวลา</th>
            <th>อารมณ์</th>
          </tr>
        </thead>
        <tbody>
          {afterMoodHistory.length > 0 ? (
            afterMoodHistory.map((entry, index) => {
              const date = new Date(entry.date);
              const formattedDate = date.toLocaleDateString('th-TH');
              const formattedTime = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });
              return (
                <tr key={entry.id || index} className="mood-entry">
                  <td>{formattedDate}</td>
                  <td>{formattedTime}</td>
                  <td>
                    <span className="mood-emoji">{entry.emoji}</span>
                    {entry.label}
                  </td>
                </tr>
              );
            })
          ) : (
            <tr><td colSpan="3" className="empty-message">ไม่มีข้อมูลอารมณ์หลังการประเมิน</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MoodTracking;
