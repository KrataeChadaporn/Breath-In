import React, { useEffect, useState } from "react";
import "./chat.css";
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
import { useNavigate, Link } from "react-router-dom"; // ใช้ useHistory แทน useNavigate

const Community = () => {
  const [experts, setExperts] = useState([]); // ผู้เชี่ยวชาญ
  const [posts, setPosts] = useState([]); // โพสต์ของชุมชน
  const [newPost, setNewPost] = useState(""); // โพสต์ใหม่
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const history = useNavigate

  const currentUser = auth.currentUser; // ผู้ใช้ปัจจุบัน

  // ดึงข้อมูลผู้เชี่ยวชาญ
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

  // ดึงข้อมูลโพสต์
  useEffect(() => {
    const fetchPosts = async () => {
      const postQuery = query(
        collection(db, "broadcasts"),
        orderBy("createdAt", "desc")
      );
      const unsubscribe = onSnapshot(postQuery, async (snapshot) => {
        const postsWithAuthors = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const post = { id: docSnapshot.id, ...docSnapshot.data() };
            if (post.authorId) {
              try {
                // ตรวจสอบ `authorId` ใน `users` ก่อน
                const userRef = doc(db, "users", post.authorId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                  post.authorName = userSnap.data().name || "ไม่ระบุชื่อ";
                } else {
                  // หากไม่พบใน `users` ให้ตรวจสอบใน `experts`
                  const expertRef = doc(db, "experts", post.authorId);
                  const expertSnap = await getDoc(expertRef);
                  post.authorName = expertSnap.exists()
                    ? expertSnap.data().name || "ผู้เชี่ยวชาญ"
                    : "ไม่ระบุชื่อ";
                }
              } catch (error) {
                console.error("Error fetching user/expert:", error);
                post.authorName = "ไม่ระบุชื่อ";
              }
            } else {
              post.authorName = "ไม่ระบุชื่อ";
            }
            return post;
          })
        );
        setPosts(postsWithAuthors);
      });
      return unsubscribe;
    };

    fetchPosts();
  }, []);

  // ฟังก์ชันเริ่มต้นการสนทนากับผู้เชี่ยวชาญ
  const startConversation = async (expertId) => {
    if (!currentUser) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      history.push("/login"); // ใช้ history.push แทน navigate
      return;
    }

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

    history.push(`/chat/${expertId}`); // ใช้ history.push แทน navigate
  };

  // ฟังก์ชันเพิ่มโพสต์ใหม่
  const handleAddPost = async () => {
    if (newPost.trim()) {
      await addDoc(collection(db, "broadcasts"), {
        text: newPost,
        createdAt: serverTimestamp(),
        authorId: currentUser?.uid || null,
      });
      setNewPost("");
    }
  };

  return (
    <div className="community-container">
      {/* ส่วนคุยกับผู้เชี่ยวชาญ */}
      <div className="expert-section">
        <h2>คุยกับผู้เชี่ยวชาญ</h2>
        {loading ? (
          <p>กำลังโหลดข้อมูล...</p>
        ) : error ? (
          <p style={{ color: "red" }}>{error}</p>
        ) : (
          <ul>
            {experts.map((expert) => (
              <li key={expert.id}>
                <div className="expert-card">
                  <img src={expert.imageUrl} alt={expert.name} />
                  <div className="expert-info">
                    <h3>{expert.name}</h3>
                    <p>ความเชี่ยวชาญ: {expert.specialty}</p>
                    <p>สถานที่: {expert.location}</p>
                    <p>เบอร์โทร: {expert.phone}</p>
                  </div>
                  <button onClick={() => startConversation(expert.id)}>
                    แชทปรึกษา
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* ส่วนโพสต์ของชุมชน */}
      <div className="community-section">
        <h2>โพสต์ของชุมชน</h2>
        <div>
          <ul>
            {posts.map((post) => (
              <li key={post.id}>
                <div>
                  <Link to={`/post/${post.id}`}>
                    <h4>โพสต์โดย: {post.authorName}</h4>
                  </Link>
                  <p>{post.text}</p>
                  <p>
                    {post.createdAt?.toDate
                      ? post.createdAt.toDate().toLocaleString()
                      : "Invalid Date"}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Community;
