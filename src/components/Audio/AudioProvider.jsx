import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const useAudio = (playOnPages) => {
  const audioRef = useRef(new Audio()); // ใช้ useRef เพื่อเก็บ Audio instance
  const [isPlaying, setIsPlaying] = useState(false); // สถานะการเล่นเพลง
  const location = useLocation(); // ดึงเส้นทางปัจจุบัน

  // ฟังก์ชันเริ่มเล่นเพลง
  const play = (src) => {
    if (audioRef.current.src !== src) {
      audioRef.current.src = src; // กำหนดแหล่งเพลงใหม่
    }
    audioRef.current.play().catch((err) => {
      console.error("Error playing audio:", err);
    });
    setIsPlaying(true);
  };

  // ฟังก์ชันหยุดเพลง
  const pause = () => {
    audioRef.current.pause();
    setIsPlaying(false);
  };

  // ใช้ loop เพื่อให้เพลงเล่นต่อเนื่อง
  useEffect(() => {
    const audioObj = audioRef.current;
    audioObj.loop = true; // ทำให้เพลงเล่นวนลูป

    if (playOnPages.includes(location.pathname)) {
      play(audioRef.current.src || "/Users/kratae/Documents/Hackathon/Breath In/public/video/music1.mp3"); // เริ่มเล่นเพลงหากอยู่ในหน้าที่กำหนด
    } else {
      pause(); // หยุดเพลงหากอยู่นอกหน้าที่กำหนด
    }
return () => {
      audioObj.pause();
      audioObj.currentTime = 0;
    };
  }, [location.pathname, playOnPages]);

  return { play, pause, isPlaying, audioRef };
};
export default useAudio;