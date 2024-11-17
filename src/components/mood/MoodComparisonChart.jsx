import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';
import './mood.css';

const MoodComparisonChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const moodHistory = JSON.parse(localStorage.getItem('moodHistory')) || [];

    const depressionScores = {
      'คุณไม่มีอาการซึมเศร้าเลย': 1,
      'คุณมีอาการซึมเศร้าระดับน้อย': 2,
      'คุณมีอาการซึมเศร้าระดับปานกลาง': 3,
      'คุณมีอาการซึมเศร้าระดับมาก': 4,
      'คุณมีอาการซึมเศร้าระดับรุนแรง': 5,
    };

    const moodScores = {
      'ผ่อนคลาย': 2,
      'กังวล': 3,
      'มีความสุข': 1,
      'เศร้า': 4,
      'โกรธ': 5,
    };

    const beforeAssessmentData = moodHistory
      .filter((entry) => entry.type === 'beforeAssessment' && entry.level)
      .map((entry, index) => ({
        id: index + 1,
        x: `Entry ${index + 1} (ก่อน)`,
        y: depressionScores[entry.level] || 0,
      }));

    const afterAssessmentData = moodHistory
      .filter((entry) => entry.type === 'afterAssessment' && entry.label)
      .map((entry, index) => ({
        id: index + 1,
        x: `Entry ${index + 1} (หลัง)`,
        y: moodScores[entry.label] || 0,
      }));

    const consolidatedData = [];
    beforeAssessmentData.forEach((beforeData, index) => {
      consolidatedData.push(beforeData);
      const afterData = afterAssessmentData.find((after) => after.id === beforeData.id);
      if (afterData) consolidatedData.push(afterData);
    });

    setChartData({
      labels: consolidatedData.map((data) => data.x),
      datasets: [
        {
          label: 'ระดับภาวะซึมเศร้าและอารมณ์',
          data: consolidatedData.map((data) => data.y),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: false,
          tension: 0.3,
          pointBackgroundColor: consolidatedData.map((data) =>
            data.label?.includes('ก่อน') ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
          ),
        },
      ],
    });
  }, []);

  if (!chartData) return <p>Loading data...</p>;

  return (
    <div className="mood-comparison-container">
      <h2>ผลการติดตามภาวะซึมเศร้าและอารมณ์</h2>
      <p>แสดงผลระดับภาวะซึมเศร้าก่อนการประเมินและอารมณ์หลังการประเมินในรูปแบบเส้นเดียว</p>
      <Line
        data={chartData}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: 'ระดับซึมเศร้า' },
              ticks: { stepSize: 1, min: 1, max: 5 },
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
          onClick={() => window.open('https://example.com/consult', '_blank')}
        >
          แชร์กับผู้เชี่ยวชาญ
        </button>
      </div>
    </div>
  );
};

export default MoodComparisonChart;
