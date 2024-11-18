import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword , signOut  } from "firebase/auth";
import { auth } from "../../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import "./login.css";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    birthDate: "",
    phone: "",
    email: "",
    password: "",
  });

  const [error, setError] = useState(null); // State for handling errors
  const [showConsent, setShowConsent] = useState(false); // State for displaying the consent modal
  const [consentGiven, setConsentGiven] = useState(false); // State for tracking if consent is given
  const [modalConsentGiven, setModalConsentGiven] = useState(false); // Track consent in modal
  const navigate = useNavigate();

  // Handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleConsent = () => {
    setShowConsent(true); // Show the consent modal
  };

  const closeConsent = () => {
    if (modalConsentGiven) {
      setShowConsent(false); // Hide the consent modal if checkbox is ticked
      setConsentGiven(true); // Automatically check the main form checkbox
    } else {
      alert("กรุณายืนยันแบบแสดงความยินยอมก่อนปิดหน้าต่างนี้");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear error messages

    // Check for consent
    if (!consentGiven) {
      setError("กรุณายอมรับแบบแสดงความยินยอมก่อน");
      return;
    }

    // Validate form data
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      setError("โปรดกรอกอีเมลที่ถูกต้อง");
      return;
    }
    if (formData.password.length < 6) {
      setError("รหัสผ่านต้องมีความยาวอย่างน้อย 6 ตัวอักษร");
      return;
    }

    try {
      // Create user with Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Save additional user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        firstName: formData.firstName,
        lastName: formData.lastName,
        birthDate: formData.birthDate,
        phone: formData.phone,
        email: formData.email,
        createdAt: new Date(),
      });
      await signOut(auth); // บังคับให้ผู้ใช้ล็อกเอาท์
      alert("ลงทะเบียนสำเร็จ!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error during registration:", error);
      setError(error.message || "เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองอีกครั้ง");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-image">
        <img src="/images/23.jpg" alt="Register Illustration" />
      </div>

      <div className="auth-form">
        <h2>สมัครสมาชิก</h2>
        {error && <p style={{ color: "red" }}>{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>ชื่อ</label>
          <input
            type="text"
            name="firstName"
            placeholder="กรอกชื่อของคุณ"
            required
            onChange={handleChange}
          />
          <label>นามสกุล</label>
          <input
            type="text"
            name="lastName"
            placeholder="กรอกนามสกุลของคุณ"
            required
            onChange={handleChange}
          />
          <label>วัน/เดือน/ปีเกิด</label>
          <input type="date" name="birthDate" required onChange={handleChange} />
          <label>เบอร์โทรติดต่อ</label>
          <input
            type="tel"
            name="phone"
            placeholder="กรอกเบอร์โทรศัพท์"
            required
            onChange={handleChange}
          />
          <label>อีเมล</label>
          <input
            type="email"
            name="email"
            placeholder="กรอกอีเมลของคุณ"
            required
            onChange={handleChange}
          />
          <label>รหัสผ่าน</label>
          <input
            type="password"
            name="password"
            placeholder="กรอกรหัสผ่านของคุณ"
            required
            onChange={handleChange}
          />
          <div className="consent-container">
            <label htmlFor="consent">
              <input
                type="checkbox"
                id="consent"
                checked={consentGiven}
                onChange={() => setConsentGiven(!consentGiven)}
              />
              <span> ยอมรับแบบแสดงความยินยอม </span>
              <span onClick={handleConsent} className="consent-link">
                อ่านเงื่อนไข
              </span>
            </label>
          </div>
          <button type="submit" className="auth-button">
            ยืนยัน
          </button>
        </form>
        <p>
          หากคุณมีบัญชีอยู่แล้ว{" "}
          <Link to="/login" className="auth-link">
            คลิกตรงนี้!!!
          </Link>
        </p>
      </div>

      {/* Consent Modal */}
      {showConsent && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>แบบแสดงความยินยอมให้เก็บ รวบรวม ใช้ เปิดเผยข้อมูล</h2>
            <p>
              ข้าพเจ้าตกลงยินยอมให้มหาวิทยาลัยเชียงใหม่ เก็บรวบรวม ใช้ หรือ เปิดเผยข้อมูลส่วนบุคคล...
            </p>
            <ul>
            <li>1. วัตถุประสงค์ของการเก็บรวบรวม ใช้ หรือเปิดเผยข้อมูลส่วนบุคคล เพื่อประโยชน์ต่อกระบวนการประเมินสุขภาพจิตเบื้องต้นและคัดกรองความเสี่ยงต่อปัญหาสุขภาพจิต และติดตามดูแลช่วยเหลือผู้ที่เสี่ยงมีปัญหาสุขภาพจิต หากภายหลังมีการเปลี่ยนแปลงวัตถุประสงค์ในการเก็บรวบรวมข้อมูลส่วนบุคคล ผู้ให้บริการจะประกาศให้ผู้ใช้บริการทราบ</li>
              <li>2. “ข้อมูลส่วนบุคคล” หมายถึง ข้อมูลเกี่ยวกับบุคคลซึ่งทำให้สามารถระบุตัวบุคคลนั้นได้ไม่ว่าทางตรงหรือทางอ้อม เช่น ชื่อ สกุล เพศ อายุ ที่อยู่ เบอร์โทรศัพท์ รหัสนักศึกษา ปัจจัยความเสี่ยง (เช่น ความคิดฆ่าตัวตาย การทำร้ายตัวเอง เป็นต้น) ข้อมูลภาวะสุขภาพ</li>
              <li>3. มหาวิทยาลัยเชียงใหม่ ผู้ให้บริการ รวบรวม จัดเก็บ ใช้ ข้อมูล ซึ่งประกอบด้วย ข้อมูลส่วนบุคคล ข้อมูลการประเมินสุขภาพจิตเบื้องต้น ได้แก่ ประเมินภาวะซึมเศร้า ประเมินความเสี่ยงต่อการฆ่าตัวตายประเมินพลังใจ ประเมินภาวะความเครียด และแบบประเมินต่าง ๆ ด้านสุขภาพจิต ซึ่งเป็นการประเมินที่ไม่มีค่าใช้จ่ายใดๆ เพื่อประโยชน์ในการจัดทำฐานข้อมูล พัฒนาระบบและกลไกการดูแลนักศึกษาและบุคลากรด้านสุขภาพจิต และติดตามดูแลช่วยเหลือผู้ที่เสี่ยงมีปัญหาสุขภาพจิต</li>
              <li>4. ผู้ใช้บริการมีสิทธิถอนความยินยอมเกี่ยวกับข้อมูลส่วนบุคคลของผู้ใช้บริการเมื่อใดก็ได้ เว้นแต่การถอนความยินยอมนั้นจะกระทบต่อการให้บริการหรืออยู่นอกเหนือการควบคุมของผู้ให้บริการ</li>
              <li>5. การตกลงให้เก็บ รวบรวม ใช้ เปิดเผยข้อมูลส่วนบุคคลนี้มีผลใช้บังคับตามระยะเวลาที่กฎหมายกำหนดไว้</li>
              <li>6. สิทธิของผู้ใช้บริการเกี่ยวกับข้อมูลส่วนบุคคลที่เกี่ยวกับการเพิกถอน การขอเข้าถึงและรับสำเนาข้อมูลส่วนบุคคล การคัดค้านการเก็บข้อมูล ใช้หรือเปิดเผย สิทธิในการเคลื่อนย้ายข้อมูล สิทธิในการลบข้อมูล สิทธิในการระงับการใช้ข้อมูล ให้เป็นไปตามนโยบายการคุ้มครองข้อมูลส่วนบุคคลของมหาวิทยาลัยเชียงใหม่และตามที่กฎหมายกำหนด</li>
              <li>7. ผู้ใช้บริการรับทราบว่า ผู้ใช้บริการสามารถติดต่อผู้ให้บริการ ผ่านช่องทางไปรษณีย์อิเล็กทรอนิกส์: cmumind@gmail.com</li>
            </ul>
            <div className="modal-checkbox-container">
              <input
                type="checkbox"
                id="modal-consent"
                checked={modalConsentGiven}
                onChange={() => setModalConsentGiven(!modalConsentGiven)}
              />
              <label htmlFor="modal-consent">ยอมรับและเข้าใจเงื่อนไขข้างต้น</label>
            </div>
            <button onClick={closeConsent} className="auth-button">
              ปิด
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Register;
