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
      // Check in users collection
      const userRef = doc(db, "users", authorId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data().firstName || "ไม่ระบุชื่อ";
      }

      // Check in experts collection using userId
      const expertsQuery = query(
        collection(db, "experts"),
        where("userId", "==", authorId)
      );
      const expertsSnap = await getDocs(expertsQuery);
      if (!expertsSnap.empty) {
        const expert = expertsSnap.docs[0].data();
        return expert.name || "ผู้เชี่ยวชาญ";
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

        // Fetch post data
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

          // Fetch replies
          const repliesRef = collection(db, "broadcasts", postId, "replies");
          const q = query(repliesRef, orderBy("createdAt", "asc"));

          const unsubscribe = onSnapshot(q, async (snapshot) => {
            const repliesData = await Promise.all(
              snapshot.docs.map(async (replyDoc) => {
                const reply = { id: replyDoc.id, ...replyDoc.data() };

                if (reply.authorId) {
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
    <div>
      <h2>รายละเอียดโพสต์</h2>
      <p>
        <strong>ข้อความ:</strong> {post?.text || "ไม่มีข้อความ"}
      </p>
      <p>
        <strong>วันที่โพสต์:</strong>{" "}
        {post?.createdAt?.toDate
          ? post.createdAt.toDate().toLocaleString()
          : "ไม่พบวันที่"}
      </p>
      <p>
        <strong>ผู้โพสต์:</strong> {post?.authorName || "ไม่ระบุชื่อ"}
      </p>

      <h3>การตอบกลับ</h3>
      {replies.length > 0 ? (
        <ul>
          {replies.map((reply) => (
            <li key={reply.id} style={{ marginBottom: "10px" }}>
              <p>
                <strong>ข้อความ:</strong> {reply.text}
              </p>
              <p>
                <strong>วันที่ตอบกลับ:</strong>{" "}
                {reply.createdAt?.toDate
                  ? reply.createdAt.toDate().toLocaleString()
                  : "ไม่พบวันที่"}
              </p>
              <p>
                <strong>ผู้ตอบ:</strong> {reply.authorName || "ไม่ระบุชื่อ"}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>ไม่มีการตอบกลับ</p>
      )}

      <div style={{ marginTop: "20px" }}>
        <h4>แสดงความคิดเห็น</h4>
        <textarea
          value={newReply}
          onChange={(e) => setNewReply(e.target.value)}
          placeholder="เขียนความคิดเห็นของคุณ..."
          style={{
            width: "100%",
            height: "80px",
            padding: "10px",
            marginBottom: "10px",
            borderRadius: "8px",
            border: "1px solid #ccc",
          }}
          disabled={!currentUser}
        />
        <button
          onClick={handleAddReply}
          style={{
            backgroundColor: currentUser ? "#4CAF50" : "#ccc",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: currentUser ? "pointer" : "not-allowed",
          }}
          disabled={!currentUser}
        >
          ส่งความคิดเห็น
        </button>
      </div>
    </div>
  );
};

export default PostDetails;
