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
  getDocs,
} from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const BroadcastChat = () => {
  const [broadcasts, setBroadcasts] = useState([]);
  const [newBroadcast, setNewBroadcast] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState(null);
  const history = useNavigate();
  const [anonymous, setAnonymous] = useState(false);


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
          const broadcastsWithAuthorsAndComments = await Promise.all(
            snapshot.docs.map(async (docSnapshot) => {
              const broadcast = { id: docSnapshot.id, ...docSnapshot.data() };
              console.log("Processing broadcast:", broadcast);

              // Get the author's name
              if (broadcast.authorId) {
                broadcast.authorName = await getAuthorName(broadcast.authorId);
              } else {
                broadcast.authorName = "ไม่ระบุชื่อ";
              }

              // Fetch and set replies count (comments count)
              const repliesCollection = collection(db, `broadcasts/${broadcast.id}/replies`);
              const repliesSnapshot = await getDocs(repliesCollection);
              broadcast.repliesCount = repliesSnapshot.size;

              // Fetch and set comments
              const comments = await fetchComments(broadcast.id);
              broadcast.comments = comments;

              console.log("Processed broadcast:", broadcast);
              return broadcast;
            })
          );
          setBroadcasts(broadcastsWithAuthorsAndComments);
          console.log("Broadcasts set:", broadcastsWithAuthorsAndComments);
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

  // Function to fetch author name from "users" or "experts"
  const getAuthorName = async (authorId) => {
    try {
      const userRef = doc(db, "users", authorId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        const userData = userSnap.data();
        return userData.firstName && userData.lastName
          ? `${userData.firstName} ${userData.lastName}`
          : userData.firstName || "ไม่ระบุชื่อ";
      }

      const expertRef = doc(db, "experts", authorId);
      const expertSnap = await getDoc(expertRef);
      if (expertSnap.exists()) {
        const expertData = expertSnap.data();
        return expertData.name || "ผู้เชี่ยวชาญ";
      }
    } catch (err) {
      console.error("Error fetching author name:", err);
    }

    return "ไม่ระบุชื่อ";
  };

  // Function to fetch comments for a broadcast
  const fetchComments = async (broadcastId) => {
    try {
      const commentsQuery = query(
        collection(db, "broadcasts", broadcastId, "comments"),
        orderBy("createdAt", "desc")
      );
      const commentsSnapshot = await getDocs(commentsQuery);
      const comments = commentsSnapshot.docs.map((doc) => doc.data());
      return comments;
    } catch (err) {
      console.error("Error fetching comments:", err);
      return [];
    }
  };

  const handleAddBroadcast = async () => {
    if (!auth.currentUser && !anonymous) {
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
        authorId: anonymous ? null : auth.currentUser?.uid || null,
      });
      setNewBroadcast("");
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
    <div>
      {/* Anonymous Toggle */}
      
      {/* Broadcast Container */}
      <div className="broadcast-chat-container">
        <h2>ชุมชน</h2>

        {/* Textarea and Button */}
        <div className="broadcast-chat-textarea-container">
          <textarea
            placeholder="คุณรู้สึกอย่างไร?"
            value={newBroadcast}
            onChange={(e) => setNewBroadcast(e.target.value)}
            disabled={posting}
          />
          <button
            className="broadcast-chat-button"
            onClick={handleAddBroadcast}
            disabled={posting}
          >
            {posting ? "กำลังโพสต์..." : "โพสต์"}
          </button>
        </div>
        <div>
        <label>
          <input
            className="anony"
            type="checkbox"
            checked={anonymous}
            onChange={(e) => setAnonymous(e.target.checked)}
          />
          โพสต์แบบไม่ระบุตัวตน
        </label>
      </div>

        {/* Broadcast Feed */}
        <div className="broadcast-chat-feed">
  <h3>โพสต์ล่าสุด</h3>
  <ul>
    {broadcasts.length > 0 ? (
      broadcasts.map((broadcast) => (
        <li key={broadcast.id}>
          {/* ใช้ Link สำหรับการนำทาง */}
          <Link to={`/post/${broadcast.id}`} className="post-link">
            {/* Post Author */}
            <div className="broadcast-chat-author-name">
              ผู้โพสต์: {broadcast.authorName || "ไม่ระบุตัวตน"}
            </div>

            {/* Post Text */}
            <p className="broadcast-chat-post-text">{broadcast.text}</p>

            {/* Post Meta */}
            <div className="broadcast-chat-post-meta">
              <span className="timestapBD">
                <strong>เวลา:</strong>{" "}
                {broadcast.createdAt?.toDate
                  ? broadcast.createdAt.toDate().toLocaleString()
                  : "ไม่พบวันที่"}
              </span>
            </div>

            {/* Comment Count */}
            <p>แสดงความคิดเห็น {broadcast.repliesCount || 0} รายการ</p>
          </Link>

          {/* Comments Section */}
          {broadcast.repliesCount > 0 && (
            <div className="comments-section">
              <ul>
                {broadcast.comments.map((comment, index) => (
                  <li key={index} className="comment">
                    <p>{comment.text}</p>
                    <small>
                      {comment.createdAt?.toDate
                        ? comment.createdAt.toDate().toLocaleString()
                        : "ไม่พบวันที่"}
                    </small>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))
    ) : (
      <p>ไม่มีโพสต์</p>
    )}
  </ul>
</div>
      </div>
    </div>
  );
};

export default BroadcastChat;