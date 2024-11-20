import React from "react";
import "./clinic.css";

const Clinic = () => {
  return (
    <div className="clinic-page">
  <header className="clinic-header">
    <h1>คลินิคพักใจ</h1>
  </header>

  <div className="clinic-container">
    <div className="contact-info">
      <h2>ข้อมูลติดต่อ</h2>
      <p><strong>ชื่อคลินิก:</strong> คลินิคพักใจ</p>
      <p><strong>เบอร์โทร:</strong> 053-234-4563</p>
      <p><strong>Facebook:</strong> <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">คลินิคพักใจ เชียงใหม่</a></p>
      <p><strong>Line:</strong> <a href="https://line.me" target="_blank" rel="noopener noreferrer">@clinicpakjai</a></p>
      <p><strong>ที่อยู่:</strong> 239 มหาวิทยาลัยเชียงใหม่, เชียงใหม่, ประเทศไทย</p>
      <div className="social-media">
  <img src="../images/clinic/6.jpg" alt="Social 1" />
  <img src="../images/clinic/7.jpg" alt="Social 2" />
  <img src="../images/clinic/8.jpg" alt="Social 3" />
</div>


    </div>

    <div className="contact-form">
      <h2>จองคิวรักษา</h2>
      <form>
        <input type="text" placeholder="ชื่อ" required />
        <input type="text" placeholder="เบอร์โทรศัพท์" required />
        <input type="email" placeholder="อีเมล" required />
        <textarea placeholder="รายละเอียดเพิ่มเติม" required></textarea>
        <button type="submit">จองคิว</button>
      </form>
    </div>
  </div>

  <div className="map-section">
    <h2>ที่ตั้งของเรา</h2>
    <iframe
      title="Chiang Mai University Map"
      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3777.268942057945!2d98.9432037153792!3d18.796143387282012!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30da3a7487b67969%3A0x58fb49773e11fc4c!2sChiang%20Mai%20University!5e0!3m2!1sen!2sth!4v1690197420027!5m2!1sen!2sth"
      width="100%"
      height="450"
      style={{ border: 0 }}
      allowFullScreen=""
      loading="lazy"
    ></iframe>
  </div>
</div>

  );
};

export default Clinic;
