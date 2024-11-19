import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import "chart.js/auto";
import "./mood.css";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

const MoodComparisonChart = () => {
  const [chartData, setChartData] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  useEffect(() => {
    // Listen for user authentication changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setCurrentUserId(user.uid);
      } else {
        setCurrentUserId(null);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!currentUserId) return;

    const fetchMoodData = async () => {
      try {
        const userDocRef = doc(db, "moodData", currentUserId); // Adjust collection name
        const userDocSnap = await getDoc(userDocRef);

        if (!userDocSnap.exists()) {
          console.warn("No mood data found for this user.");
          setChartData(null);
          return;
        }

        const moodHistory = userDocSnap.data().history || [];

        const depressionScores = {
          "คุณไม่มีอาการซึมเศร้าเลย": 1,
          "คุณมีอาการซึมเศร้าระดับน้อย": 2,
          "คุณมีอาการซึมเศร้าระดับปานกลาง": 3,
          "คุณมีอาการซึมเศร้าระดับมาก": 4,
          "คุณมีอาการซึมเศร้าระดับรุนแรง": 5,
        };

        const moodScores = {
          "ผ่อนคลาย": 2,
          "กังวล": 3,
          "มีความสุข": 1,
          "เศร้า": 4,
          "โกรธ": 5,
        };

        const beforeAssessmentData = moodHistory
          .filter((entry) => entry.type === "beforeAssessment" && entry.level)
          .map((entry, index) => ({
            id: index + 1,
            label: `Entry ${index + 1} (ก่อน)`,
            score: depressionScores[entry.level] || 0,
          }));

        const afterAssessmentData = moodHistory
          .filter((entry) => entry.type === "afterAssessment" && entry.label)
          .map((entry, index) => ({
            id: index + 1,
            label: `Entry ${index + 1} (หลัง)`,
            score: moodScores[entry.label] || 0,
          }));

        const consolidatedLabels = [];
        const consolidatedScores = [];
        const consolidatedColors = [];

        beforeAssessmentData.forEach((beforeData) => {
          consolidatedLabels.push(beforeData.label);
          consolidatedScores.push(beforeData.score);
          consolidatedColors.push("rgba(75, 192, 192, 1)"); // Green for before

          const afterData = afterAssessmentData.find(
            (after) => after.id === beforeData.id
          );
          if (afterData) {
            consolidatedLabels.push(afterData.label);
            consolidatedScores.push(afterData.score);
            consolidatedColors.push("rgba(255, 99, 132, 1)"); // Red for after
          }
        });

        setChartData({
          labels: consolidatedLabels,
          datasets: [
            {
              label: "ระดับภาวะซึมเศร้าและอารมณ์",
              data: consolidatedScores,
              backgroundColor: consolidatedColors,
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching mood data:", error);
      }
    };

    fetchMoodData();
  }, [currentUserId]);

  if (!chartData) return <p>Loading data...</p>;

  return (
    <div className="mood-comparison-container">
      <h2>ผลการติดตามภาวะซึมเศร้าและอารมณ์</h2>
      <p>
        แสดงผลระดับภาวะซึมเศร้าก่อนการประเมิน (สีเขียว) และอารมณ์หลังการประเมิน
        (สีแดง)
      </p>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "ระดับซึมเศร้า/อารมณ์" },
              ticks: { stepSize: 1, min: 1, max: 5 },
            },
            x: { title: { display: true, text: "ลำดับการบันทึก" } },
          },
        }}
      />
      <p className="note">
        หมายเหตุ: ระดับที่สูงขึ้นบ่งบอกถึงความรุนแรงของภาวะซึมเศร้าหรืออารมณ์ที่มีความเครียดสูง
      </p>
      <div style={{ textAlign: "center", marginTop: "15px" }}>
        <p className="note-bold">หากคุณรู้สึกไม่สบายใจ ควรปรึกษาผู้เชี่ยวชาญ</p>
        <button
          className="consult-button"
          onClick={() => window.open("https://example.com/consult", "_blank")}
        >
          แชร์กับผู้เชี่ยวชาญ
        </button>
      </div>
    </div>
  );
};

export default MoodComparisonChart;
