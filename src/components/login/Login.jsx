import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth"; // ฟังก์ชันสำหรับล็อกอินจาก Firebase
import { auth } from "../../firebaseConfig"; // การตั้งค่า Firebase Auth
import "./login.css";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./auth/AuthContext"; // Go up one directory and then into auth



const Login = () => {
  const [email, setEmail] = useState(""); // เก็บค่าอีเมล
  const [password, setPassword] = useState(""); // เก็บค่ารหัสผ่าน
  const [error, setError] = useState(null); // เก็บข้อความแสดงข้อผิดพลาด
  const history = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // ดำเนินการล็อกอิน
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      console.log("ล็อกอินสำเร็จ:", userCredential.user);
      alert("เข้าสู่ระบบสำเร็จ!");
      setError(null); // ล้างข้อความแสดงข้อผิดพลาด
      history.push("/"); // เปลี่ยนหน้าไปยังหน้าหลักหลังล็อกอินสำเร็จ
    } catch (err) {
      console.error("เกิดข้อผิดพลาดระหว่างการเข้าสู่ระบบ:", err.message);
      // กำหนดข้อความแสดงข้อผิดพลาดตามสถานการณ์ที่พบ
      switch (err.code) {
        case "auth/user-not-found":
          setError("ไม่พบผู้ใช้นี้ในระบบ");
          break;
        case "auth/wrong-password":
          setError("รหัสผ่านไม่ถูกต้อง");
          break;
        case "auth/invalid-email":
          setError("อีเมลไม่ถูกต้อง");
          break;
        default:
          setError("เกิดข้อผิดพลาดในการเข้าสู่ระบบ กรุณาลองอีกครั้ง");
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image">
        <img src="/images/23.jpg" alt="ภาพประกอบการเข้าสู่ระบบ" />
      </div>
      <div className="auth-form">
        <h2>เข้าสู่ระบบ</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleLogin}>
          <label htmlFor="email">อีเมล</label>
          <input
            type="email"
            id="email"
            placeholder="กรอกอีเมลของคุณ"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <label htmlFor="password">รหัสผ่าน</label>
          <input
            type="password"
            id="password"
            placeholder="กรอกรหัสผ่านของคุณ"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="auth-button">
            เข้าสู่ระบบ
          </button>
        </form>
        <p>
          หากคุณยังไม่มีบัญชี{" "}
          <a href="/register" className="auth-link">
            คลิกตรงนี้ !!!
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
