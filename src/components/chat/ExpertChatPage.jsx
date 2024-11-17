import React, { useState, useEffect, useRef } from 'react';
import { db, auth } from '../../firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, addDoc, query, where, onSnapshot, serverTimestamp, orderBy, getDoc, getDocs, doc, updateDoc } from 'firebase/firestore';
import styles from './chat.css';

const ExpertChatPage = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [userDetails, setUserDetails] = useState({});
  const [expertId, setExpertId] = useState(null);
  const [notifications, setNotifications] = useState({});
  const [userNames, setUserNames] = useState({});
  const chatBoxRef = useRef(null);

  // Mark messages as read when a conversation is selected
  useEffect(() => {
    if (!selectedConversation) return;

    const markMessagesAsRead = async () => {
      const messageQuery = query(
        collection(db, 'chats'),
        where('expertId', '==', selectedConversation.expertId),
        where('userId', '==', selectedConversation.userId),
        where('isRead', '==', false)
      );

      const snapshot = await getDocs(messageQuery);
      snapshot.forEach((doc) => {
        updateDoc(doc.ref, { isRead: true });
      });
    };

    markMessagesAsRead();
  }, [selectedConversation]);

  // Fetch unread messages for notifications
  useEffect(() => {
    if (!expertId) return;

    const unreadMessagesQuery = query(
      collection(db, 'chats'),
      where('expertId', '==', expertId),
      where('isRead', '==', false),
      orderBy('createdAt')
    );

    const unsubscribe = onSnapshot(unreadMessagesQuery, (snapshot) => {
      const newNotifications = {};
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const conversationId = data.conversationId;

        if (!newNotifications[conversationId]) {
          newNotifications[conversationId] = 0;
        }
        newNotifications[conversationId] += 1;
      });
      setNotifications(newNotifications);
    });

    return () => unsubscribe();
  }, [expertId]);

  // Fetch authenticated expert's ID
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log('Authenticated user ID:', user.uid);
        
        const expertQuery = query(collection(db, 'experts'), where('userId', '==', user.uid));
        const expertSnapshot = await getDocs(expertQuery);
        
        if (!expertSnapshot.empty) {
          const expertData = expertSnapshot.docs[0];
          setExpertId(expertData.id);
          console.log("Fetched Expert ID (document ID):", expertData.id);
        } else {
          console.warn("No expert found for this user.");
        }
      } else {
        console.log('No authenticated user found');
      }
    });
  
    return () => unsubscribeAuth();
  }, []);

  // Fetch conversations and user names
  useEffect(() => {
    if (!expertId) return;
  
    const conversationQuery = query(
      collection(db, 'conversations'),
      where('expertId', '==', expertId)
    );
  
    const unsubscribe = onSnapshot(conversationQuery, async (snapshot) => {
      const conversationsData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setConversations(conversationsData);
      console.log("Conversations fetched:", conversationsData);
  
      // ดึงชื่อผู้ใช้จาก userId ที่อยู่ใน document
      const names = {};
      for (const conversation of conversationsData) {
        if (conversation.userId) {
          try {
            // ใช้ userId จาก conversation เพื่อดึงข้อมูลจากคอลเลกชัน users
            const userRef = doc(db, 'users', conversation.userId);
            const userSnap = await getDoc(userRef);
            if (userSnap.exists()) {
              // เก็บ firstname จาก user document
              names[conversation.id] = userSnap.data().firstName || 'ไม่ระบุชื่อ';
              console.log("User Names Ref:", names[conversation.id]);
            } else {
              console.warn(`User ID ${conversation.userId} not found in users collection.`);
              names[conversation.id] = 'ไม่ระบุชื่อ';
            }
          } catch (error) {
            console.error(`Error fetching user data for conversation ${conversation.id}:`, error);
            names[conversation.id] = 'ไม่ระบุชื่อ';
          }
        } else {
          console.warn(`No userId found for conversation ${conversation.id}.`);
          names[conversation.id] = 'ไม่ระบุชื่อ';
        }
      }
      console.log("User Names Map:", names);
      setUserNames(names);
  
      // ตั้งค่าการสนทนาแรกโดยอัตโนมัติหากยังไม่มีการเลือก
      if (conversationsData.length > 0 && !selectedConversation) {
        setSelectedConversation(conversationsData[0]);
        console.log("Selected first conversation:", conversationsData[0]);
      } else if (conversationsData.length === 0) {
        console.warn("No conversations available for this expert.");
      }
    });
  
    return () => unsubscribe();
  }, [expertId, selectedConversation]);

  // Fetch messages for the selected conversation
  useEffect(() => {
    if (!selectedConversation) {
      console.warn("No selected conversation to fetch messages for.");
      return;
    }

    console.log("Selected Conversation:", selectedConversation);

    const messageQuery = query(
      collection(db, 'chats'),
      where('expertId', '==', selectedConversation.expertId),
      where('userId', '==', selectedConversation.userId),
      orderBy('createdAt')
    );

    const unsubscribe = onSnapshot(messageQuery, (snapshot) => {
      const messagesData = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesData);
      console.log("Messages fetched:", messagesData);

      if (messagesData.length > 0) {
        fetchUserDetails(selectedConversation.userId);
      } else {
        console.warn("No messages found for this conversation.");
      }
    });

    return () => unsubscribe();
  }, [selectedConversation]);

  // Fetch user details for the selected conversation
  const fetchUserDetails = async (userId) => {
    if (!userId) {
      console.error("User ID is missing. Cannot fetch user details.");
      return;
    }
  
    console.log("Fetching user details for:", userId);
  
    try {
      const userRef = doc(db, 'users', userId);
      const userSnapshot = await getDoc(userRef);
      if (userSnapshot.exists()) {
        const userData = userSnapshot.data();
        console.log("Fetched user data:", userData);
        setUserDetails(userData);
      } else {
        console.error('User not found in database');
        setUserDetails({ firstname: 'ไม่พบข้อมูลผู้ใช้' });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  // Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (newMessage.trim() === '' || !selectedConversation) {
      console.error("Cannot send message. Either message is empty or no conversation is selected.");
      return;
    }

    try {
      await addDoc(collection(db, 'chats'), {
        expertId: selectedConversation.expertId,
        userId: selectedConversation.userId,
        senderId: auth.currentUser.uid,
        text: newMessage,
        isRead: false,
        createdAt: serverTimestamp(),
      });
      setNewMessage('');
      scrollToBottom();
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  // Scroll chat box to bottom
  const scrollToBottom = () => {
    if (chatBoxRef.current) {
      chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
    }
  };

  return (
    <div className={styles.expertChatAppContainer}>
      <div className={styles.expertSidebar}>
        <h3>Conversations</h3>
        {conversations.map((conversation) => (
          <div
            key={conversation.id}
            className={`${styles.conversation} ${selectedConversation?.id === conversation.id ? styles.selected : ''}`}
            onClick={() => setSelectedConversation(conversation)}
          >
            <span className={styles.conversationName}>
              <p>ผู้ใช้ : {userNames[conversation.id] || 'ไม่ระบุชื่อ'}</p>
            </span>
            {notifications[conversation.id] > 0 && (
              <span className={styles.notificationBadge}>
                <div className={styles.greenDot}></div>
              </span>
            )}
          </div>
        ))}
        {conversations.length === 0 && <p className={styles.noConversations}>ไม่มีการสนทนา</p>}
      </div>

      <div className={styles.expertChatContainer}>
        <h2 className={styles.chatHeading}>
          Chat กับผู้ใช้: {userDetails.firstName || 'ไม่พบข้อมูลผู้ใช้'}
        </h2>

        <div className={styles.chatBox} ref={chatBoxRef}>
          {messages.length > 0 ? messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.chatMessage} ${message.senderId === auth.currentUser.uid ? styles.expert : styles.user}`}
            >
              <p>{message.text}</p>
              <span className={styles.timestamp}>
                {message.createdAt?.toDate().toLocaleString('th-TH', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )) : <p className={styles.noMessages}>ไม่มีข้อความ</p>}
        </div>

        <form onSubmit={sendMessage} className={styles.chatForm}>
          <input
            type="text"
            placeholder="พิมพ์ข้อความ..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className={styles.chatInput}
          />
          <button type="submit" className={styles.chatButton}>ส่ง</button>
        </form>
      </div>
    </div>
  );
};

export default ExpertChatPage;
