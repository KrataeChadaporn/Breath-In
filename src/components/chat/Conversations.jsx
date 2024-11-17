// src/components/Conversations.js
import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Conversations = ({ userRole }) => {
  const [conversations, setConversations] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = auth.currentUser?.uid;
    if (!userId) return;

    const q = userRole === 'user'
      ? query(collection(db, 'conversations'), where('userId', '==', userId))
      : query(collection(db, 'conversations'), where('expertId', '==', userId));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const conversationsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setConversations(conversationsData);
    });

    return () => unsubscribe();
  }, [userRole]);

  return (
    <div className="conversations-list">
      <h2>Conversations</h2>
      {conversations.map((conversation) => (
        <div
          key={conversation.id}
          onClick={() => navigate(`/chat/${userRole === 'user' ? conversation.expertId : conversation.userId}`)}
        >
          <p>{userRole === 'user' ? `Expert: ${conversation.expertId}` : `User: ${conversation.userId}`}</p>
          <span>{conversation.lastMessage}</span>
        </div>
      ))}
    </div>
  );
};

export default Conversations;
