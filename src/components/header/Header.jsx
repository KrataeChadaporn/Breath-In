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
  const [expertRole, setExpertRole] = useState("");
  const [loading, setLoading] = useState(true); 
  const navigate = useNavigate();
  const { currentUser } = useContext(AuthContext); 
  
  



  useEffect(() => {
    const fetchUserData = async () => { // Ensure this is async
      if (currentUser) {
        try {
          console.log("Fetching data for user UID:", currentUser.uid);
  
          // ดึงข้อมูลจาก users
          const userDoc = doc(db, "users", currentUser.uid);
          const userSnap = await getDoc(userDoc);
  
          if (userSnap.exists()) {
            console.log("User data:", userSnap.data());
            setUserName(userSnap.data().firstName || "ไม่ระบุ");
            setUserRole(userSnap.data().role || "user");
          }
  
          // ดึงข้อมูลจาก experts
          const expertQuery = query(
            collection(db, "experts"),
            where("userId", "==", currentUser.uid)
          );
          const expertSnap = await getDocs(expertQuery);
  
          if (!expertSnap.empty) {
            console.log("Expert data:", expertSnap.docs[0].data());
            setUserName(expertSnap.firstname || "แพทย์");
            setUserRole(expertSnap.role || "expert");
          } else {
            console.log("No expert found for this user.");
          }
          
  
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        console.log("No current user.");
        // กำหนดค่าเริ่มต้นถ้าไม่มี currentUser
        setUserName("ไม่ระบุ");
        setUserRole("guest");
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
    return <div>กำลังโหลดข้อมูล...</div>;
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
             
              {userRole === "expert" && (
          
               <Link to="/expert-chat" className="chat-link">
               สนทนากับผู้ใช้
             </Link>
              )}
                <Link to="/userprofile" className="userheader"> {/* Add the route path here */}
                  {userName}
              </Link>
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
