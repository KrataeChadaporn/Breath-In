import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { auth, db } from '../../firebase'; // Import your Firebase setup
import { collection, query, where, getDocs } from 'firebase/firestore';
import './mood.css';

const MoodComparisonChart = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const user = auth.currentUser; // Get the currently logged-in user
      if (!user) {
        console.error('User not logged in');
        return;
      }

      try {
        const moodCollection = collection(db, 'moodHistory'); // Replace 'moodHistory' with your collection name
        const moodQuery = query(moodCollection, where('userId', '==', user.uid)); // Filter by user ID
        const moodSnapshot = await getDocs(moodQuery);

        const moodHistory = moodSnapshot.docs.map((doc) => doc.data());

        // Depression levels mapping
        const depressionScores = {
          'คุณไม่มีอาการซึมเศร้าเลย': 1,
          'คุณมีอาการซึมเศร้าระดับน้อย': 2,
          'คุณมีอาการซึมเศร้าระดับปานกลาง': 3,
          'คุณมีอาการซึมเศร้าระดับมาก': 4,
          'คุณมีอาการซึมเศร้าระดับรุนแรง': 5,
        };

        // Mood scores mapping
        const moodScores = {
          'ผ่อนคลาย': 2,
          'กังวล': 3,
          'มีความสุข': 1,
          'เศร้า': 4,
          'โกรธ': 5,
        };

        // Group data
        const beforeAssessmentData = moodHistory
          .filter((entry) => entry.type === 'beforeAssessment' && entry.level)
          .map((entry, index) => ({
            x: `Entry ${index + 1} (ก่อน)`,
            y: depressionScores[entry.level] || 0,
          }));

        const afterAssessmentData = moodHistory
          .filter((entry) => entry.type === 'afterAssessment' && entry.label)
          .map((entry, index) => ({
            x: `Entry ${index + 1} (หลัง)`,
            y: moodScores[entry.label] || 0,
          }));

        // Combine labels and datasets
        const labels = beforeAssessmentData.map((entry, index) => `Entry ${index + 1}`);
        const beforeData = beforeAssessmentData.map((entry) => entry.y);
        const afterData = afterAssessmentData.map((entry) => entry.y);

        // Set chart data
        setChartData({
          labels,
          datasets: [
            {
              label: 'ก่อนการประเมิน',
              data: beforeData,
              backgroundColor: 'rgba(75, 192, 192, 0.6)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1,
            },
            {
              label: 'หลังการประเมิน',
              data: afterData,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
            },
          ],
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching mood history:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <p>Loading data...</p>;
  if (!chartData) return <p>No data available</p>;

  return (
    <div className="mood-comparison-container">
      <h2>ผลการติดตามภาวะซึมเศร้าและอารมณ์</h2>
      <p>แสดงผลระดับภาวะซึมเศร้าก่อนการประเมินและอารมณ์หลังการประเมินในรูปแบบกราฟแท่ง</p>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'ระดับซึมเศร้า/อารมณ์' },
              ticks: { stepSize: 1, min: 0, max: 5 },
            },
            x: { title: { display: true, text: 'ลำดับการบันทึก' } },
          },
        }}
      />
      <p className="note">
        หมายเหตุ: ระดับที่สูงขึ้นบ่งบอกถึงความรุนแรงของภาวะซึมเศร้าหรืออารมณ์ที่มีความเครียดสูง
      </p>
      <div style={{ textAlign: 'center', marginTop: '15px' }}>
        <p className="note-bold">หากคุณรู้สึกไม่สบายใจ ควรปรึกษาผู้เชี่ยวชาญ</p>
        <button
          className="consult-button"
          onClick={('/chat')}
        >
          แชทกับผู้เชี่ยวชาญ
        </button>
      </div>
    </div>
  );
};

export default MoodComparisonChart;
