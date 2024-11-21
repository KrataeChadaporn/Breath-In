import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  doc,
  getDoc,
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  Timestamp,
  getDocs,
  where,
} from "firebase/firestore";
import { db } from "../../firebaseConfig";
import { AuthContext } from "../login/auth/AuthContext"; // Adjust according to your directory structure
import './post.css';

const PostDetails = () => {
  const { postId } = useParams();
  const [post, setPost] = useState(null);
  const [replies, setReplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newReply, setNewReply] = useState("");
  const { currentUser } = useContext(AuthContext);

  const fetchAuthorName = async (authorId) => {
    try {
      if (!authorId) return "ไม่ระบุชื่อ"; // กรณีไม่มี authorId
      const userRef = doc(db, "users", authorId); // อ้างอิง ID ของ author
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        // ตรวจสอบและคืนค่า firstName หรือ name
        return userData.firstName || userData.name || "ไม่ระบุชื่อ";
      }
    } catch (err) {
      console.error("Error fetching author name:", err);
    }
    return "ไม่ระบุชื่อ";
  };
  
  useEffect(() => {
    if (!postId) {
      setError("ไม่มี ID ของโพสต์ใน URL");
      setLoading(false);
      return;
    }
  
    const fetchPostAndReplies = async () => {
      try {
        setLoading(true);
        setError(null);
  
        // ดึงโพสต์หลัก
        const postRef = doc(db, "broadcasts", postId);
        const postSnap = await getDoc(postRef);
  
        if (postSnap.exists()) {
          const postData = postSnap.data();
  
          if (postData.authorId) {
            postData.authorName = await fetchAuthorName(postData.authorId);
          } else {
            postData.authorName = "ไม่ระบุชื่อ";
          }
          setPost(postData);
  
          // ดึง replies
          const repliesRef = collection(db, "broadcasts", postId, "replies");
          const q = query(repliesRef, orderBy("createdAt", "asc"));
  
          const unsubscribe = onSnapshot(q, async (snapshot) => {
            const repliesData = await Promise.all(
              snapshot.docs.map(async (replyDoc) => {
                const reply = { id: replyDoc.id, ...replyDoc.data() };
  
                if (reply.authorId) {
                  // ดึงชื่อผู้ตอบกลับ
                  reply.authorName = await fetchAuthorName(reply.authorId);
                } else {
                  reply.authorName = "ไม่ระบุชื่อ";
                }
  
                return reply;
              })
            );
  
            setReplies(repliesData);
          });
  
          return () => unsubscribe();
        } else {
          setError("ไม่พบโพสต์นี้");
        }
      } catch (err) {
        console.error("Error fetching post and replies:", err);
        setError("เกิดข้อผิดพลาดในการดึงข้อมูล");
      } finally {
        setLoading(false);
      }
    };
  
    fetchPostAndReplies();
  }, [postId]);

  const handleAddReply = async () => {
    if (!currentUser) {
      alert("กรุณาเข้าสู่ระบบก่อนแสดงความคิดเห็น");
      return;
    }

    if (!newReply.trim()) {
      alert("กรุณาใส่ข้อความก่อนส่ง");
      return;
    }

    try {
      const repliesRef = collection(db, "broadcasts", postId, "replies");
      await addDoc(repliesRef, {
        text: newReply,
        createdAt: Timestamp.now(),
        authorId: currentUser.uid,
      });

      setNewReply("");
      alert("ความคิดเห็นถูกส่งเรียบร้อยแล้ว");
    } catch (err) {
      console.error("Error adding reply:", err);
      alert("เกิดข้อผิดพลาดในการส่งความคิดเห็น");
    }
  };

  if (loading) return <p>กำลังโหลด...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="post-details-container">
    <h2 className="post-title"></h2>
    <p className="post-text">
      <strong></strong> {post?.text || "ไม่มีข้อความ"}
    </p>
    <p className="post-meta">
      <strong>วันที่โพสต์:</strong>{" "}
      {post?.createdAt?.toDate
        ? post.createdAt.toDate().toLocaleString()
        : "ไม่พบวันที่"}
    </p>
    <p className="post-meta">
    <strong>ผู้โพสต์:</strong>{" "}
    {post?.authorName || (currentUser ? currentUser.name : "ไม่ระบุชื่อ")}
  </p>
  
    <h3 className="replies-title">การตอบกลับ</h3>
    {replies.length > 0 ? (
      <ul className="replies-list">
        {replies.map((reply) => (
          <li key={reply.id} className="reply-item">
            <p>
              <strong></strong> {reply.text}
            </p>
            <p className="reply-meta">
              <strong>วันที่ตอบกลับ:</strong>{" "}
              {reply.createdAt?.toDate
                ? reply.createdAt.toDate().toLocaleString()
                : "ไม่พบวันที่"}
            </p>
            <p className="reply-meta">
       <strong>ผู้ตอบ:</strong> 
        {console.log("Reply:", reply)} 
      { console.log("Current User:", currentUser)}
  {reply?.authorName || (currentUser?.name || "ไม่ระบุชื่อ")}
</p>


          </li>
        ))}
      </ul>
    ) : (
      <p className="no-replies">ไม่มีการตอบกลับ</p>
    )}
  
    <div className="reply-section">
      <h4 className="comment-title">แสดงความคิดเห็น</h4>
      <textarea
        className="reply-input"
        value={newReply}
        onChange={(e) => setNewReply(e.target.value)}
        placeholder="เขียนความคิดเห็นของคุณ..."
        disabled={!currentUser}
      />
      <button
        className="btn-reply"
        onClick={handleAddReply}
        disabled={!currentUser}
      >
        ส่งความคิดเห็น
      </button>
    </div>
  </div>
  
  );
};

export default PostDetails;