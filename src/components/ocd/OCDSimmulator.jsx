import React, { useState } from 'react';
import './OCDSimulator.css';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';

const OCDSimulator = () => {
  const [isTestStarted, setIsTestStarted] = useState(false); // จัดการสถานะเริ่มทำแบบทดสอบ
  const navigate = useNavigate();
  // ฟังก์ชันเริ่มต้นแบบทดสอบ
  

  return (
    <div className="ocd-simulator">
      {/* เนื้อหาในส่วนแสดง OCD */}
      {!isTestStarted ? (
        <div className="ocd-start">
          <div className="ocd-info">
            <h2 className="text-ocd">Obsessive Compulsive Disorder</h2>
            <p className="ptext-ocd">
              เนื้อหาในนี้มีพฤติกรรมของผู้ป่วยที่มีอาการเข้าข่ายโรคย้ำคิดย้ำทำ ผู้ใช้โปรดพิจารณาในการเล่น
            </p>
            <Link to="/color-sorting">
      <button className="start-test-button">
        เริ่มทำแบบทดสอบ
      </button>
    </Link>
          </div>
        </div>
      ) : (
        <div className="ocd-test">
          <h2>แบบทดสอบ OCD</h2>
          <p>นี่คือเนื้อหาแบบทดสอบ</p>
        </div>
      )}
    </div>
  );
};

export default OCDSimulator;
