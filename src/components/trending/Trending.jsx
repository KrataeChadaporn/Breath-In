import React, { useState } from "react"
import { trending } from "../../dummyData"
import Home from "../homes/Home"
import "./style.css"

const Trending = () => {
  const [selectedMood, setSelectedMood] = useState(null); 
  const moods = ["มีความสุข", "เศร้า", "เครียด", "ผ่อนคลาย"];

  const handleMoodSelection = (mood) => {
    setSelectedMood(mood);
  };

  return (
    <section className="trending">
      <h2>ประเมินอารมณ์ของคุณวันนี้</h2>
      <p>โปรดเลือกอารมณ์ของคุณจากตัวเลือกด้านล่าง:</p>

      <div className="mood-selection">
        {moods.map((mood, index) => (
          <button
            key={index}
            className={`mood-button ${selectedMood === mood ? "active" : ""}`}
            onClick={() => handleMoodSelection(mood)}
          >
            {mood}
          </button>
        ))}
      </div>

      {selectedMood && (
        <div className="selected-mood">
          <h3>อารมณ์ที่คุณเลือก: {selectedMood}</h3>
          <p>ขอบคุณที่ประเมินอารมณ์ของคุณกับเรา!</p>
        </div>
      )}
    </section>
  );
};

export default Trending;
