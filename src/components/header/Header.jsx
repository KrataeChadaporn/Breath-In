// src/components/header/Header.jsx
import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig"; // Firebase Config
import { signOut } from "firebase/auth";
import { doc, getDoc, query, where, collection, getDocs } from "firebase/firestore";
import "./header.css";
import { AuthContext } from "../login/auth/AuthContext";
// ใช้ชื่อที่แตกต่างจาก Link ที่มาจาก react-router-dom
import { Link as ScrollLink } from 'react-scroll'; // เปลี่ยนชื่อ Link จาก react-scroll

const Header = () => {
  const [Mobile, setMobile] = useState(false);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext); 

  useEffect(() => {
    const fetchUserData = async () => {
      if (currentUser) {
        try {
          const userDoc = doc(db, "users", currentUser.uid); // ดึงเอกสารผู้ใช้
          const userSnap = await getDoc(userDoc);
  
          if (userSnap.exists()) {
            setUserName(userSnap.data().firstName || "ไม่ระบุชื่อ"); // ใช้ firstName
            setUserRole(userSnap.data().role || "user");
          } else {
            // หากไม่พบใน users ให้ลองดึงจาก experts
            const expertQuery = query(
              collection(db, "experts"),
              where("userId", "==", currentUser.uid)
            );
            const expertSnap = await getDocs(expertQuery);
  
            if (!expertSnap.empty) {
              const expertData = expertSnap.docs[0].data();
              setUserName(expertData.firstname || "ไม่ระบุชื่อ");
              setUserRole(expertData.role || "expert");
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
      setLoading(false); // เสร็จสิ้นการโหลด
    };
  
    fetchUserData();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("ออกจากระบบสำเร็จ!");
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  if (loading) {
    return <div>Lodeing</div>; // หรือแสดง Loader ตามความเหมาะสม
  }

  return (
    <header>
      <div className="container flexSB">
        <nav className="flexSB">
          <div className="logo">
            <img src="./images/logo.png" alt="Logo" />
          </div>
          <ul
            className={Mobile ? "navMenu-list" : "flexSB"}
            onClick={() => setMobile(false)}
          >
            <li>
              <Link to="/">หน้าหลัก</Link>
            </li>
            <li>
            <ScrollLink to="simmu" smooth={true} duration={500}>
              โหมดจำลอง</ScrollLink>
            </li>
            <li>
              {/* ใช้ ScrollLink แทน Link จาก react-scroll */}
              <ScrollLink to="blog" smooth={true} duration={500}>
                บทความ
              </ScrollLink>
            </li>
            {currentUser && (
              <>
                <li>
                  <Link to="/mood-tracking">ติดตามอารมณ์</Link>
                </li>
                <li>
                <ScrollLink to="commu" smooth={true} duration={500}>
                ชุมชน</ScrollLink>
                </li>
              </>
            )}
          </ul>
          <button className="toggle" onClick={() => setMobile(!Mobile)}>
            {Mobile ? <i className="fa fa-times"></i> : <i className="fa fa-bars"></i>}
          </button>
        </nav>
        <div className="account flexSB">
          {currentUser ? (
            <>
              <span className="username-hearder"> {userName}</span>
              {userRole === "expert" && (
                <button
                  onClick={() => navigate("/expert-chat")}
                  className="chat-button"
                >
                  แชทกับผู้ใช้
                </button>
              )}
              <button onClick={handleLogout} className="logout-button">
                ออกจากระบบ
              </button>
            </>
          ) : (
            <Link to="/login">
              <button className="logout-button">เข้าสู่ระบบ</button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
