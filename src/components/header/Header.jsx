import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth, db } from "../../firebaseConfig"; // Firebase Config
import { signOut } from "firebase/auth";
import { doc, getDoc, query, where, collection, getDocs } from "firebase/firestore";
import "./header.css";

const Header = () => {
  const [Mobile, setMobile] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [userRole, setUserRole] = useState("");
  const history = useNavigate();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      console.log("Auth State Changed:", user); // Debugging
      if (user) {
        setCurrentUser(user);

        // ตรวจสอบข้อมูลจาก Firestore
        try {
          // ตรวจสอบใน `users` collection
          const userDoc = doc(db, "users", user.uid);
          const userSnap = await getDoc(userDoc);

          if (userSnap.exists()) {
            console.log("User data found in 'users':", userSnap.data());
            setUserName(userSnap.data().name || "ไม่ระบุชื่อ");
            setUserRole(userSnap.data().role || "user");
          } else {
            // หากไม่พบใน `users` ให้ตรวจสอบใน `experts` collection
            const expertQuery = query(
              collection(db, "experts"),
              where("userId", "==", user.uid)
            );
            const expertSnap = await getDocs(expertQuery);

            if (!expertSnap.empty) {
              const expertData = expertSnap.docs[0].data();
              console.log("Expert data found in 'experts':", expertData);
              setUserName(expertData.firstname || "ไม่ระบุชื่อ");
              setUserRole(expertData.role || "expert");
            } else {
              console.log("No user data found in 'users' or 'experts'");
            }
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setCurrentUser(null);
        setUserName("");
        setUserRole("");
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("ออกจากระบบสำเร็จ!");
      history.push("/login");
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

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
              <Link to="/menu">เมนู</Link>
            </li>
            <li>
              <Link to="/articles">บทความ</Link>
            </li>
            <li>
              <Link to="/mood-tracking">ติดตามอารมณ์</Link>
            </li>
            <li>
              <Link to="/broadcast-chat">ชุมชน</Link>
            </li>
          </ul>
          <button className="toggle" onClick={() => setMobile(!Mobile)}>
            {Mobile ? (
              <i className="fa fa-times"></i>
            ) : (
              <i className="fa fa-bars"></i>
            )}
          </button>
        </nav>
        <div className="account flexSB">
          {currentUser ? (
            <>
              <span className="username">คุณ: {userName}</span>
              {userRole === "expert" && (
                <button
                  onClick={() => history.push("/expert-chat")}
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
              <button>เข้าสู่ระบบ</button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
