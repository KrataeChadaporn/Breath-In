// src/services/moodService.js
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../firebase'; // ชี้ไปยัง firebase.js

// ฟังก์ชันสำหรับบันทึกข้อมูลอารมณ์ลง Firebase
export const saveMoodData = async (type, label) => {
  try {
    await addDoc(collection(db, 'moodHistory'), { type, label, date: new Date().toISOString() });
    console.log('Mood data saved successfully.');
  } catch (error) {
    console.error('Error saving mood data:', error);
  }
};
