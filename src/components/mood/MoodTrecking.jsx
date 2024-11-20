import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, addDoc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase'; // Firebase setup
import './mood.css';

const MoodTracking = () => {
  const [beforeMoodHistory, setBeforeMoodHistory] = useState([]);
  const [afterMoodHistory, setAfterMoodHistory] = useState([]);
  const [currentUser, setCurrentUser] = useState(null); // Track the logged-in user
  const navigate = useNavigate();

  // Fetch user data on mount
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setCurrentUser(user);
        await fetchMoodHistory(user.uid);
      } else {
        setCurrentUser(null);
        setBeforeMoodHistory([]);
        setAfterMoodHistory([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Fetch mood history from Firestore for the logged-in user
  const fetchMoodHistory = async (userId) => {
    try {
      const moodCollection = collection(db, 'moodHistory');
      const userMoodQuery = query(moodCollection, where('userId', '==', userId));
      const moodSnapshot = await getDocs(userMoodQuery);

      const moodData = moodSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      const beforeMoods = moodData.filter((entry) => entry.type === 'beforeAssessment');
      const afterMoods = moodData.filter((entry) => entry.type === 'afterAssessment');

      setBeforeMoodHistory(beforeMoods);
      setAfterMoodHistory(afterMoods);
    } catch (error) {
      console.error('Error fetching mood history:', error);
    }
  };

  // Clear mood history for the logged-in user
  const clearMoodHistory = async () => {
    if (!currentUser) return; // Ensure user is logged in

    try {
      const moodCollection = collection(db, 'moodHistory');
      const userMoodQuery = query(moodCollection, where('userId', '==', currentUser.uid));
      const moodSnapshot = await getDocs(userMoodQuery);

      const deletePromises = moodSnapshot.docs.map((doc) => deleteDoc(doc.ref));
      await Promise.all(deletePromises);

      setBeforeMoodHistory([]);
      setAfterMoodHistory([]);
    } catch (error) {
      console.error('Error clearing mood history:', error);
    }
  };

  return (
    <div className="mood-tracking">
      <h2>ประวัติการติดตามอารมณ์</h2>

     

      {/* Table for "Before" Moods */}
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
            <tr>
              <td colSpan="4" className="empty-message">ไม่มีข้อมูลอารมณ์ก่อนการประเมิน</td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Table for "After" Moods */}
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
            <tr>
              <td colSpan="3" className="empty-message">ไม่มีข้อมูลอารมณ์หลังการประเมิน</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="button-row">
        <button className="mood-tracking-button" onClick={() => navigate('/mood-comparison')}>
          แสดงผลกราฟ
        </button>
        <button className="clear-data-button" onClick={clearMoodHistory}>
          ล้างข้อมูล
        </button>
      </div>
    </div>
  );
};

export default MoodTracking;
