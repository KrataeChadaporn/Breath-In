import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Updated to useNavigate
import './mood.css'; // Ensure this file exists or create it

const MoodTracking = () => {
  const [beforeMoodHistory, setBeforeMoodHistory] = useState([]); // State for moods before assessment
  const [afterMoodHistory, setAfterMoodHistory] = useState([]);  // State for moods after assessment
  const navigate = useNavigate(); // Hook for navigation

  // Fetch mood history from localStorage on component mount
  useEffect(() => {
    try {
      const savedMoods = JSON.parse(localStorage.getItem('moodHistory')) || [];
      const beforeMoods = savedMoods.filter(entry => entry.type === 'beforeAssessment');
      const afterMoods = savedMoods.filter(entry => entry.type === 'afterAssessment');

      setBeforeMoodHistory(beforeMoods); // Store before-assessment data
      setAfterMoodHistory(afterMoods);   // Store after-assessment data
    } catch (error) {
      console.error("Error fetching mood data:", error);
    }
  }, []);

  // Function to clear mood history
  const clearMoodHistory = () => {
    localStorage.removeItem('moodHistory'); // Remove all data from localStorage
    setBeforeMoodHistory([]); // Clear state for before-assessment moods
    setAfterMoodHistory([]);  // Clear state for after-assessment moods
  };

  return (
    <div className="mood-tracking">
      <h2>ประวัติการติดตามอารมณ์</h2>

      <div className="button-row">
        <button
          className="mood-tracking-button"
          onClick={() => navigate('/mood-comparison')}
        >
          ดูรวมประเมิน
        </button>
        <button
          className="clear-data-button"
          onClick={clearMoodHistory}
        >
          ล้างข้อมูล
        </button>
      </div>

      {/* Table for Moods Before Assessment */}
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
              const formattedTime = date.toLocaleTimeString('th-TH', {
                hour: '2-digit',
                minute: '2-digit',
              });
              const depressionLevel = entry.level || 'N/A'; // Display depression level if available

              return (
                <tr key={index} className="mood-entry">
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
              <td colSpan="4" className="empty-message">
                ไม่มีข้อมูลอารมณ์ก่อนการประเมิน
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Table for Moods After Assessment */}
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
              const formattedTime = date.toLocaleTimeString('th-TH', {
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <tr key={index} className="mood-entry">
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
              <td colSpan="3" className="empty-message">
                ไม่มีข้อมูลอารมณ์หลังการประเมิน
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MoodTracking;
