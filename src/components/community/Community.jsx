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
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const currentUser = auth.currentUser;

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
        const postsWithAuthors = await Promise.all(
          snapshot.docs.map(async (docSnapshot) => {
            const post = { id: docSnapshot.id, ...docSnapshot.data() };
            if (post.authorId) {
              try {
                const userRef = doc(db, "users", post.authorId);
                const userSnap = await getDoc(userRef);
                if (userSnap.exists()) {
                  post.authorName = userSnap.data().name || "ไม่ระบุชื่อ";
                } else {
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

  // Function to start a conversation
  const startConversation = async (expertId) => {
    if (!currentUser) {
      alert("กรุณาเข้าสู่ระบบก่อน");
      navigate("/login");
      return;
    }

    const conversationRef = collection(db, "conversations");
    const q = query(
      conversationRef,
      where("userId", "==", currentUser.uid),
      where("expertId", "==", expertId)
    );

    try {
      const existingConversation = await getDocs(q);

      if (existingConversation.empty) {
        // If no conversation exists, create a new one
        await addDoc(conversationRef, {
          userId: currentUser.uid,
          expertId,
          lastMessage: "",
          timestamp: serverTimestamp(),
        });
      }

      // After checking or creating the conversation, redirect to the chat page
      navigate(`/chat/${expertId}`);
    } catch (error) {
      console.error("Error checking or creating conversation:", error);
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

      {/* Community Posts Section */}
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
