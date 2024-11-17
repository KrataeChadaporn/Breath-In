import React, { useState, useEffect } from "react";
import { db, auth } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  onSnapshot,
  orderBy,
  Timestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const BroadcastChat = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [newBroadcast, setNewBroadcast] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);
  const history = useNavigate(); 

  useEffect(() => {
    const fetchBroadcasts = async () => {
      try {
        setLoading(true);
        setError(null);
  
        const broadcastQuery = query(
          collection(db, "broadcasts"),
          orderBy("createdAt", "desc")
        );
  
        const unsubscribe = onSnapshot(broadcastQuery, async (snapshot) => {
          const broadcastsWithAuthors = await Promise.all(
            snapshot.docs.map(async (docSnapshot) => {
              const broadcast = { id: docSnapshot.id, ...docSnapshot.data() };
              console.log("Processing broadcast:", broadcast);
  
              if (broadcast.authorId) {
                broadcast.authorName = await getAuthorName(broadcast.authorId);
              } else {
                broadcast.authorName = "ไม่ระบุชื่อ";
              }
              console.log("Processed broadcast:", broadcast);
              return broadcast;
            })
          );
          setBroadcasts(broadcastsWithAuthors);
          console.log("Broadcasts set:", broadcastsWithAuthors);
        });
  
        return () => unsubscribe();
      } catch (err) {
        console.error("Error fetching broadcasts:", err);
        setError("ไม่สามารถโหลดข้อมูลได้");
      } finally {
        setLoading(false);
      }
    };
  
    fetchBroadcasts();
  }, []);
  
  // ฟังก์ชันช่วยดึงชื่อผู้เขียนจาก users หรือ experts
  const getAuthorName = async (authorId) => {
    try {
      // ตรวจสอบใน collection "users"
      const userRef = doc(db, "users", authorId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return userData.firstName && userData.lastName
          ? `${userData.firstName} ${userData.lastName}`
          : userData.firstName || "ไม่ระบุชื่อ";
      }
  
      // หากไม่พบใน "users" ให้ตรวจสอบใน "experts"
      const expertRef = doc(db, "experts", authorId);
      const expertSnap = await getDoc(expertRef);
      if (expertSnap.exists()) {
        const expertData = expertSnap.data();
        return expertData.name || "ผู้เชี่ยวชาญ";
      }
    } catch (err) {
      console.error("Error fetching author name:", err);
    }
  
    // กรณีไม่พบทั้งใน "users" และ "experts"
    return "ไม่ระบุชื่อ";
  };

  const handleAddBroadcast = async () => {
    if (!auth.currentUser) {
      alert("กรุณาเข้าสู่ระบบก่อนโพสต์");
      return;
    }

    if (!newBroadcast.trim()) {
      alert("กรุณาใส่ข้อความก่อนโพสต์");
      return;
    }

    try {
      setPosting(true);
      await addDoc(collection(db, "broadcasts"), {
        text: newBroadcast,
        createdAt: Timestamp.now(),
        authorId: auth.currentUser?.uid || null, // เก็บ ID ผู้โพสต์
      });
      setNewBroadcast(""); // Reset input field
      alert("โพสต์สำเร็จ!");
    } catch (err) {
      console.error("Error adding broadcast:", err);
      alert("ไม่สามารถเพิ่มโพสต์ได้");
    } finally {
      setPosting(false);
    }
  };

  if (loading) return <p>กำลังโหลด...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto", padding: "20px" }}>
      <h2>Broadcast Chat</h2>
      <div>
        <textarea
          placeholder="คุณต้องการพูดอะไร?"
          value={newBroadcast}
          onChange={(e) => setNewBroadcast(e.target.value)}
          style={{
            width: "100%",
            height: "80px",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
          disabled={posting}
        />
        <button
          onClick={handleAddBroadcast}
          style={{
            backgroundColor: "#4CAF50",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            opacity: posting ? 0.6 : 1,
          }}
          disabled={posting}
        >
          {posting ? "กำลังโพสต์..." : "โพสต์"}
        </button>
      </div>

      <div style={{ marginTop: "20px" }}>
        <h3>โพสต์ล่าสุด</h3>
        <ul style={{ listStyleType: "none", padding: "0" }}>
          {broadcasts.length > 0 ? (
            broadcasts.map((broadcast) => (
              <li
                key={broadcast.id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  padding: "10px",
                  marginBottom: "10px",
                  backgroundColor: "#f9f9f9",
                  cursor: "pointer",
                }}
                onClick={() => history.push(`/post/${broadcast.id}`)} // ใช้ history.push แทน navigate
              >
                <p>
                  <strong>ผู้โพสต์:</strong> {broadcast.authorName}
                </p>
                <p>
                  <strong>ข้อความ:</strong> {broadcast.text}
                </p>
                <p style={{ fontSize: "12px", color: "#888" }}>
                  <strong>เวลา:</strong>{" "}
                  {broadcast.createdAt?.toDate
                    ? broadcast.createdAt.toDate().toLocaleString()
                    : "ไม่พบวันที่"}
                </p>
              </li>
            ))
          ) : (
            <p>ไม่มีโพสต์</p>
          )}
        </ul>
      </div>
    </div>
  );
};

export default BroadcastChat;
