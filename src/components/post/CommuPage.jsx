import React, { useState, useEffect } from "react";
import { db } from "../../firebaseConfig";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./post.css";

const Commupage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const postsCollection = collection(db, "posts");
        const postsQuery = query(postsCollection, orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(postsQuery);
        const postsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        console.log("Fetched Posts Data: ", postsData); // ตรวจสอบข้อมูลที่ดึงมา
        
        setPosts(postsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching posts:", error);
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div className="commupage-section">
      <h2>โพสต์ทั้งหมด</h2>
      <ul>
        {posts.length > 0 ? (
          posts.map((post) => (
            <li key={post.id} className="post-card">
              <Link to={`/post/${post.id}`} className="post-link">
                <div>
                  <h4>{post.authorName}</h4>
                  <p>{post.text}</p>
                  <p>
                    {post.createdAt && post.createdAt.toDate
                      ? post.createdAt.toDate().toLocaleString()
                      : "Invalid Date"}
                  </p>
                  <p>คำตอบ: {post.repliesCount || 0} รายการ</p>
                </div>
              </Link>
            </li>
          ))
        ) : (
          <p>ยังไม่มีโพสต์</p>
        )}
      </ul>
    </div>
  );
};

export default Commupage;
