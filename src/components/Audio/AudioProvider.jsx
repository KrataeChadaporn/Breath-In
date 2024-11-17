import { useState, useRef, useEffect } from 'react';

const useAudio = () => {
  const audioRef = useRef(new Audio()); // ใช้ useRef เพื่อเก็บ Audio instance
  const [isPlaying, setIsPlaying] = useState(false); // สถานะการเล่นเพลง

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
    return () => {
      audioObj.pause();
      audioObj.currentTime = 0;
    };
  }, []);

  return { play, pause, isPlaying, audioRef };
};

export default useAudio;
