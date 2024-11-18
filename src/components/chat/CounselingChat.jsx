import React, { useState, useEffect, useRef } from "react";
import { db, auth } from "../../firebaseConfig";
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  orderBy,
  doc,
  getDoc,
} from "firebase/firestore";
import { useParams, useNavigate } from "react-router-dom";
import styles from "./chat.css";

const CounselingChat = () => {
  const { expertId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expertName, setExpertName] = useState("");
  const chatBoxRef = useRef(null);
  const userId = auth.currentUser?.uid; // ดึง userId ของผู้ใช้งานปัจจุบัน
  const navigate = useNavigate();

  // ดึงชื่อผู้เชี่ยวชาญ
  useEffect(() => {
    const fetchExpertName = async () => {
      try {
        const expertRef = doc(db, "experts", expertId);
        const expertSnap = await getDoc(expertRef);
        if (expertSnap.exists()) {
          setExpertName(expertSnap.data().name || "ผู้เชี่ยวชาญ");
        } else {
          setExpertName("ไม่พบชื่อผู้เชี่ยวชาญ");
        }
      } catch (err) {
        console.error("Error fetching expert name:", err);
      }
    };

    fetchExpertName();
  }, [expertId]);

  // ดึงข้อความแชท
  useEffect(() => {
    const fetchMessages = () => {
      if (!userId || !expertId) return;

      setLoading(true);

      const q = query(
        collection(db, "chats"),
        where("userId", "==", userId),
        where("expertId", "==", expertId),
        orderBy("createdAt", "asc")
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const messagesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setMessages(messagesData);
          setLoading(false);
          scrollToBottom();
        },
        (err) => {
          console.error("Error fetching messages:", err);
          setError("ไม่สามารถโหลดข้อความได้");
          setLoading(false);
        }
      );

      return unsubscribe;
    };

    const unsubscribe = fetchMessages();
    return () => unsubscribe();
  }, [userId, expertId]);

  // ส่งข้อความ
  const sendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim()) {
      return alert("กรุณากรอกข้อความก่อนส่ง");
    }

    try {
      await addDoc(collection(db, "chats"), {
        userId,
        expertId,
        text: newMessage,
        sender: "user",
        createdAt: serverTimestamp(),
      });
      setNewMessage("");
      scrollToBottom();
    } catch (err) {
      console.error("Error sending message:", err);
      alert("ไม่สามารถส่งข้อความได้");
    }
  };

  // เลื่อนแชทลงล่างสุด
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  return (
    <div className={styles.chatAppContainer}>
      <div className={styles.counselingChatContainer}>
        <h2 className={styles.chatHeading}>
          Chat กับผู้เชี่ยวชาญ: {expertName || "กำลังโหลด..."}
        </h2>

        {loading && <p className={styles.loadingText}>กำลังโหลด...</p>}
        {error && <p className={styles.errorText}>{error}</p>}

        <div className={styles.chatBox} ref={chatBoxRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.chatMessage} ${
                message.sender === "user" ? styles.user : styles.expert
              }`}
            >
              <p>{message.text}</p>
              <span className={styles.timestamp}>
                {message.createdAt?.toDate()?.toLocaleString("th-TH", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={sendMessage} className={styles.chatForm}>
          <input
            type="text"
            placeholder="พิมพ์ข้อความ..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={styles.chatInput}
          />
          <button type="submit" className={styles.chatButton}>
            ส่ง
          </button>
        </form>
      </div>
    </div>
  );
};

export default CounselingChat;
