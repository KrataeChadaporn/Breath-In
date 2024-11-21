import React, { useState, useRef } from "react";
import "./sortbox.css";
import { useNavigate } from "react-router-dom";

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const SortBox = () => {
  const navigate = useNavigate();
  const [boxes, setBoxes] = useState(() =>
    shuffleArray([
      { id: "1", color: "#000000", category: "black" },
      { id: "2", color: "#FFFFFF", category: "white" },
      { id: "3", color: "#808080", category: "gray" },
      { id: "4", color: "#000000", category: "black" },
      { id: "5", color: "#FFFFFF", category: "white" },
      { id: "6", color: "#808080", category: "gray" },
      { id: "7", color: "#000000", category: "black" },
      { id: "8", color: "#FFFFFF", category: "white" },
      { id: "9", color: "#808080", category: "gray" },
    ])
  );

  const dragItem = useRef();
  const dragOverItem = useRef();

  const handleDragStart = (index) => {
    dragItem.current = index;
  };

  const handleDragEnter = (index) => {
    dragOverItem.current = index;
  };

  const handleDragEnd = () => {
    const items = [...boxes];
    const draggedItem = items[dragItem.current];
    items.splice(dragItem.current, 1);
    items.splice(dragOverItem.current, 0, draggedItem);
    setBoxes(items);
    dragItem.current = null;
    dragOverItem.current = null;
  };

  const isGroupingCorrect = () => {
    const rows = [[], [], []];

    for (let i = 0; i < boxes.length; i++) {
      rows[Math.floor(i / 3)].push(boxes[i]);
    }

    return (
      rows[0].every((box) => box.category === "black") &&
      rows[1].every((box) => box.category === "gray") &&
      rows[2].every((box) => box.category === "white")
    );
  };

  const correctBoxes = [
    { color: "#000000", category: "black" },
    { color: "#000000", category: "black" },
    { color: "#000000", category: "black" },
    { color: "#808080", category: "gray" },
    { color: "#808080", category: "gray" },
    { color: "#808080", category: "gray" },
    { color: "#FFFFFF", category: "white" },
    { color: "#FFFFFF", category: "white" },
    { color: "#FFFFFF", category: "white" },
  ];

  return (
    <div className="sort-box-containerAA">
      <h2>จัดกลุ่มกล่องให้ถูกต้อง</h2>
      <div className="grids-containerAA">
        {/* ตารางที่ผู้ใช้สามารถลากกล่องได้ */}
        <div>
          <h3 className="Ex" >ตารางของคุณ</h3>
          <div className="box-gridAA">
            {boxes.map((box, index) => (
              <div
                key={box.id}
                className={`boxAA box-${box.category}`}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragEnter={() => handleDragEnter(index)}
                onDragEnd={handleDragEnd}
                style={{
                  backgroundColor: box.color,
                  border: "1px solid #000",
                }}
              ></div>
            ))}
          </div>
        </div>

        {/* ตารางตัวอย่างที่ถูกต้อง */}
        <div>
          <h3 className="Ex" >ตัวอย่างที่ถูกต้อง</h3>
          <div className="box-gridAA">
            {correctBoxes.map((box, index) => (
              <div
                key={index}
                className={`boxAA box-${box.category}`}
                style={{
                  backgroundColor: box.color,
                  border: "1px solid #000",
                }}
              ></div>
            ))}
          </div>
        </div>
      </div>

      {/* แสดงปุ่ม "ไปต่อ" เฉพาะเมื่อจัดเรียงถูกต้อง */}
      {isGroupingCorrect() && (
        <button className="next-buttonAA" onClick={() => navigate("/chack-list")}>
          ไปต่อ
        </button>
      )}
    </div>
  );
};

export default SortBox;
