import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

let sharedAudio = null; // เก็บตัวแปร sharedAudio สำหรับการเล่นต่อเนื่อง

const AudioPlayer = () => {
  const location = useLocation(); // ใช้ตรวจสอบ URL ปัจจุบัน
  const [currentTrack, setCurrentTrack] = useState(null); // เก็บ track ที่กำลังเล่น

  useEffect(() => {
    const group1 = ["/simustar/1", "/simulast"]; // กลุ่มแรก
    const group2 = ["/Learn", "/final-self"]; // กลุ่มที่สอง

    let newAudioSource = null;

    // ตรวจสอบ URL และกำหนดเพลงใหม่ถ้าจำเป็น
    if (group1.includes(location.pathname)) {
      newAudioSource = "/video/music1.mp3"; // เพลงสำหรับกลุ่มแรก
    } else if (group2.includes(location.pathname)) {
      newAudioSource = "/video/music2.mp3"; // เพลงสำหรับกลุ่มที่สอง
    }

    // หากเพลงใหม่ไม่ตรงกับเพลงปัจจุบัน ให้เปลี่ยนเพลง
    if (newAudioSource && newAudioSource !== currentTrack) {
      // หยุดเพลงเก่า
      if (sharedAudio) {
        sharedAudio.pause();
        sharedAudio.currentTime = 0;
      }

      // สร้างเพลงใหม่
      sharedAudio = new Audio(newAudioSource);
      sharedAudio.loop = true;
      sharedAudio
        .play()
        .then(() => setCurrentTrack(newAudioSource)) // อัปเดต track ปัจจุบัน
        .catch((err) => console.error("Error playing audio:", err));
    }

    // Cleanup เมื่อ component ถูก unmount
    return () => {
      if (!group1.includes(location.pathname) && !group2.includes(location.pathname)) {
        // หยุดเพลงถ้าออกจากสองกลุ่มนี้
        if (sharedAudio) {
          sharedAudio.pause();
          sharedAudio.currentTime = 0;
          sharedAudio = null;
        }
      }
    };
  }, [location.pathname, currentTrack]); // อัปเดตเมื่อ URL หรือ track เปลี่ยน

  return null; // Component นี้ไม่ต้องแสดงอะไร
};

export default AudioPlayer;