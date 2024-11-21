import React, { useEffect, useState } from "react";
import "./commu.css";
import { db, auth } from "../../firebaseConfig";
import {
  collection,
  getDocs,
  query,
  addDoc,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
} from "firebase/firestore";
import { useNavigate, Link } from "react-router-dom";

const Community = () => {
  const [experts, setExperts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isStarting, setIsStarting] = useState(false);
  const navigate = useNavigate();

  const currentUser = auth.currentUser;

  const fetchAuthorName = async (authorId) => {
    try {
      const userRef = doc(db, "users", authorId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return userData.name || userData.firstName || "ไม่ระบุชื่อ";
      }
    } catch (error) {
      console.error("Error fetching author name:", error);
    }
    return "ไม่ระบุชื่อ";
  };

  // Fetch experts from Firestore
  useEffect(() => {
    const fetchExperts = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, "experts"));
        const expertsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExperts(expertsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching experts:", err);
        setError("ไม่สามารถดึงข้อมูลผู้เชี่ยวชาญได้ในขณะนี้");
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

   // Fetch community posts from Firestore
   useEffect(() => {
    const fetchPosts = async () => {
      const postQuery = query(
        collection(db, "broadcasts"),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(postQuery, async (snapshot) => {
        const postsWithDetails = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const post = { id: docSnapshot.id, ...docSnapshot.data() };

            // Fetch author details
            if (post.authorId) {
              post.authorName = await fetchAuthorName(post.authorId);
            } else {
              post.authorName = "ไม่ระบุชื่อ";
            }

            // Fetch replies count
            const repliesCollection = collection(db, `broadcasts/${post.id}/replies`);
            const repliesSnapshot = await getDocs(repliesCollection);
            post.repliesCount = repliesSnapshot.size;

            return post;
          })
        );
        setPosts(postsWithDetails);
      });
      return unsubscribe;
    };

    fetchPosts();
  }, []);

  // Function to start a conversation
  const startConversation = async (expertId) => {
    if (!currentUser) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      navigate("/login");
      return;
    }

    setIsStarting(true);

    try {
      const conversationRef = collection(db, "conversations");
      const q = query(
        conversationRef,
        where("userId", "==", currentUser.uid),
        where("expertId", "==", expertId)
      );

      const existingConversation = await getDocs(q);
      if (existingConversation.empty) {
        await addDoc(conversationRef, {
          userId: currentUser.uid,
          expertId,
          lastMessage: "",
          timestamp: serverTimestamp(),
        });
      }

      navigate(`/chat/${expertId}`);
    } catch (error) {
      console.error("Error checking or creating conversation:", error);
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="community-container">
      {/* Experts Section */}
      <div className="expert-section">
        <h2>คุยกับผู้เชี่ยวชาญ</h2>
        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <>
            <ul>
              {experts.slice(0, 4).map((expert) => ( // แสดงเพียง 4 รายการ
                <li key={expert.id}>
                  <div className="expert-card">
                    <img src={expert.imageUrl} alt={expert.name} loading="lazy" />
                    <div className="expert-info">
                      <h3>{expert.name}</h3>
                      <p>ความเชี่ยวชาญ: {expert.specialty}</p>
                      <p>สถานที่: {expert.location}</p>
                      <p>
                      คลีนิค: <Link to={'/clinic'}>{expert.clinicLocation}</Link>
                    </p>
                    </div>
                    <button
                      className="btn-commuchat"
                      onClick={() => startConversation(expert.id)}
                      disabled={isStarting}
                    >
                      {isStarting ? "กำลังเชื่อมต่อ..." : "ปรึกษา"}
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <button
              className="btn-show-more"
              onClick={() => navigate("/experts")} // ไปยังหน้ารายชื่อผู้เชี่ยวชาญทั้งหมด
            >
              ดูเพิ่มเติม
            </button>
          </>
        )}
      </div>
  
      {/* Community Posts Section */}
      <div className="community-section">
        <h2>โพสต์ของชุมชน</h2>
        <ul>
          {posts.slice(0, 4).map((post) => (
            <li key={post.id} className="post-card">
              <Link to={`/post/${post.id}`} className="post-link">
                <div>
                  <h4>{post.authorName}</h4>
                  <p>{post.text}</p>
                  <p>
                    {post.createdAt?.toDate
                      ? post.createdAt.toDate().toLocaleString()
                      : "Invalid Date"}
                  </p>
                  <p>คำตอบ: {post.repliesCount || 0} รายการ</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
        <button
          className="btn-show-more"
          onClick={() => navigate("/broadcast-chat")} // ไปยังหน้ารายชื่อโพสต์ทั้งหมด
        >
          ดูเพิ่มเติม
        </button>
      </div>
    </div>
  );
};

export default Community;
