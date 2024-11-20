import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import { auth, db } from '../../firebase'; // Import your Firebase setup
import { collection, query, where, getDocs } from 'firebase/firestore';
import './mood.css';
import { Link } from 'react-router-dom';

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
          'คุณไม่มีอาการซึมเศร้าเลย': 0,
          'คุณมีอาการซึมเศร้าระดับน้อย': 1,
          'คุณมีอาการซึมเศร้าระดับปานกลาง': 2,
          'คุณมีอาการซึมเศร้าระดับมาก': 3,
          'คุณมีอาการซึมเศร้าระดับรุนแรง': 4,
        };

        // Mood scores mapping
        const moodScores = {
          'ผ่อนคลาย': 1,
          'กังวล': 2,
          'มีความสุข': 0,
          'เศร้า': 3,
          'โกรธ': 4,
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
              backgroundColor: 'rgba(99, 143, 205, 0.6)',
              borderColor: '#4b97c0',
              borderWidth: 1,
              minBarLength: 6, // ความยาวขั้นต่ำของแถบ
            },
            {
              label: 'หลังการประเมิน',
              data: afterData,
              backgroundColor: 'rgba(255, 99, 132, 0.6)',
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 1,
              minBarLength: 6, // ความยาวขั้นต่ำของแถบ
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
      <p>แสดงผลระดับภาวะซึมเศร้าก่อนการประเมินและอารมณ์หลังการประเมิน</p>
      <Bar
  data={chartData}
  options={{
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'ระดับอารมณ์' },
        ticks: {
          stepSize: 1,
          min: 0,
          max: 5,
          callback: (value) => {
            const labels = ['ไม่มีเลย', 'น้อย', 'ปานกลาง', 'มาก', 'รุนแรง'];
            return labels[value] || '';
          },
        },
      },
      x: {
        title: { display: true, text: 'จำนวนครั้งที่ติดตาม' },
        ticks: {
          autoSkip: false, // ปิดการข้ามค่าบนแกน x
        },
        categoryPercentage: 0.8, // ปรับขนาดความกว้างของแถบบนแกน x
        barPercentage: 0.9, // ปรับความกว้างของแถบบาร์ให้เหมาะสม
      },
    },
    
  }}
/>

      <p className="note">
        หมายเหตุ: ระดับที่สูงขึ้นบ่งบอกถึงความรุนแรงของภาวะซึมเศร้าหรืออารมณ์ที่มีความเครียดสูง
      </p>
      <p className="note-bold">หากคุณรู้สึกไม่สบายใจ สามารถพูดคุยกับผู้เชี่ยวชาญ</p>
      <div className="center-container">
        
       
          <Link to="/chat" className="consult-button">
            พูดคุยผู้เชี่ยวชาญ
          </Link>
      </div>
    </div>
  );
};

export default MoodComparisonChart;
