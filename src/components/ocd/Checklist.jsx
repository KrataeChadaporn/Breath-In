import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Checklist.css";

const Checklist = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([
    { id: 1, text: "กินข้าวเที่ยงกับเพื่อน", done: false },
    { id: 2, text: "ไปวิ่งที่สวน", done: false },
    { id: 3, text: "กลับมานอนดูซีรีย์ที่บ้าน", done: false },
  ]);

  const [extraTasks, setExtraTasks] = useState([
    { id: 4, text: "ล้างมือ", done: false, color: "red" },
    { id: 5, text: "อาบน้ำ", done: false, color: "red" },
    { id: 6, text: "เช็คความปลอดภัย", done: false, color: "red" },
    { id: 7, text: "เช็คเตาแก๊ส", done: false, color: "red" },
    { id: 8, text: "ล้างหน้า", done: false, color: "red" },
    { id: 9, text: "ทาครีม", done: false, color: "red" },
    { id: 10, text: "ตั้งนาฬิกาปลุก", done: false, color: "red" },
    { id: 11, text: "นอน", done: false, color: "red" },
  ]);

  const [allTasksShown, setAllTasksShown] = useState(false);
  const [allTasksCompleted, setAllTasksCompleted] = useState(false);

  const toggleTask = (id, isExtra = false) => {
    if (isExtra) {
      setExtraTasks((prev) =>
        prev.map((task) =>
          task.id === id ? { ...task, done: !task.done } : task
        )
      );
    } else {
      const updatedTasks = tasks.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      );
      setTasks(updatedTasks);

      // แสดงรายการใหม่เมื่อ task ทั้งหมดเสร็จสิ้น
      if (updatedTasks.every((task) => task.done)) {
        setAllTasksShown(true);
      }
    }
  };

  useEffect(() => {
    if (
      allTasksShown &&
      extraTasks.length > 0 &&
      extraTasks.every((task) => task.done)
    ) {
      setAllTasksCompleted(true);
    }
  }, [extraTasks, allTasksShown]);

  useEffect(() => {
    if (allTasksCompleted) {
      // ใช้ alert และหลังจากนั้น navigate
      setTimeout(() => {
        alert("คุณทำรายการเสร็จสิ้นทั้งหมดแล้ว!");
        navigate("/"); // เปลี่ยนเส้นทางไปยังหน้าหลัก
      }, 10); // ตั้ง delay สั้นๆ เพื่อรอ alert
    }
  }, [allTasksCompleted, navigate]);

  return (
    <div className="checklist-container">
      <h2>สิ่งที่ต้องทำวันนี้</h2>
      <ul className="checklist">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`checklist-item ${task.done ? "done" : ""}`}
            onClick={() => toggleTask(task.id)}
          >
            {task.text}
          </li>
        ))}
        {allTasksShown &&
          extraTasks.map((task) => (
            <li
              key={task.id}
              className={`checklist-item ${task.done ? "done" : ""}`}
              style={{ color: task.color }}
              onClick={() => toggleTask(task.id, true)}
            >
              {task.text}
            </li>
          ))}
      </ul>
      {allTasksCompleted }
    </div>
  );
};

export default Checklist;
