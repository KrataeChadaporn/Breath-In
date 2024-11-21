import React, { useState } from "react";
import "./ColorSorting.css";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const ColorSorting = () => {
  const navigate = useNavigate();
  const [colors, setColors] = useState(() =>
    shuffleArray([
      { id: "1", color: "#4b0082" },
      { id: "2", color: "#8a2be2" },
      { id: "3", color: "#9932cc" },
      { id: "4", color: "#ba55d3" },
      { id: "5", color: "#dda0dd" },
    ])
  );

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("draggedIndex", index);
  };

  const handleDrop = (e, dropIndex) => {
    const draggedIndex = parseInt(e.dataTransfer.getData("draggedIndex"), 10);

    // สลับตำแหน่งของแถบสี
    const newColors = [...colors];
    const [movedColor] = newColors.splice(draggedIndex, 1);
    newColors.splice(dropIndex, 0, movedColor);

    setColors(newColors);
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // ป้องกันค่าเริ่มต้นเพื่อให้ "drop" ทำงาน
  };

  const isOrderCorrect = () => {
    return colors.map((c) => c.id).join("") === "12345";
  };

  return (
    <div className="color-sorting">
        <h2 className="text-color">ลำดับสีแบบนี้ไม่ถูกต้อง</h2>
        <div className="color-container">
            {colors.map((color, index) => (
            <div
                key={color.id}
                className="color-box"
                style={{ backgroundColor: color.color }}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
            ></div>
            ))}
        </div>
        {isOrderCorrect() && (
            <Link to="/sort-box" className="next-button">
            ไปต่อ
          </Link>
        )}
    </div>
  );
};

export default ColorSorting;
