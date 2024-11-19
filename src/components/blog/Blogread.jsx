import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {  blogData } from "../../dummyData"; // ใช้ชื่อที่ไม่ซ้ำกับตัวแปร blog
import "./blog.css"; // ไฟล์ CSS ที่เราจะแยกออกมา

const Blogread = () => {
  const { id } = useParams(); // รับ id จาก URL
  const [selectedBlog, setSelectedBlog] = useState(null); // เปลี่ยนชื่อ state

  useEffect(() => {
    // ค้นหาบทความใน blogData โดยใช้ id
    const foundBlog = blogData.find((blog) => blog.id === parseInt(id));
    setSelectedBlog(foundBlog);
  }, [id]);

  // ตรวจสอบว่าพบบทความหรือไม่
  if (!selectedBlog) {
    return <div>กำลังโหลด...</div>;
  }

  return (
    <div className="blogread-container">
      <div className="blogread-header">
        <img
          src={selectedBlog.cover}
          alt={selectedBlog.name}
          className="blogread-image"
        />
        <h1 className="blogread-title">{selectedBlog.name}</h1>
        <p className="blogread-date">เผยแพร่เมื่อ: {selectedBlog.time}</p>
      </div>
      <div className="blogread-content">
        <section>
          <h2>{selectedBlog.head1}</h2>
          <p>{selectedBlog.part1}</p>
        </section>
        <section>
          <h2>{selectedBlog.head2}</h2>
          <p>{selectedBlog.part2}</p>
        </section>
        <section>
          <h2>{selectedBlog.head3}</h2>
          <p>{selectedBlog.part3}</p>
        </section>
      </div>
    </div>
  );
};

export default Blogread;
