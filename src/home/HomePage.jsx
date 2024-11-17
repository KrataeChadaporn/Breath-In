// src/pages/HomePage.jsx
import React, { useEffect, useState } from "react";
import Homes from "../components/homes/Homes";
import Upcomming from "../components/upcoming/Upcomming";
import Community from "../components/community/Community";
import Blog from "../components/blog/Blog";
import { latest, recommended, upcome, docter, posts } from "../dummyData";
import useAuth from "../components/login/auth/useAuth"; // นำเข้า useAuth

const HomePage = () => {
  // ใช้ useAuth เฉพาะหน้า HomePage โดยตั้งค่า alertUser = false เพราะไม่ต้องการการแจ้งเตือนในหน้านี้
  useAuth({ shouldRedirect: false, alertUser: false });

  const [items, setItems] = useState([]);
  const [item, setItem] = useState([]);
  const [rec, setRec] = useState([]);
  const [doc, setDoc] = useState([]);
  const [post, setPost] = useState([]);

  useEffect(() => {
    setItems(upcome);
    setItem(latest);
    setRec(recommended);
    setDoc(docter);
    setPost(posts);
  }, []);

  return (
    <>
      <Homes />
      <Upcomming items={items} title="โหมดจำลอง" />
      <Blog items={item} title="บทความ" />
      <Community items={{ doc, post }} title="ชุมชน" />
    </>
  );
};

export default HomePage;
