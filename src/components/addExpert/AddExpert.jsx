import React, { useState } from 'react';
import { db, storage, auth } from '../../firebaseConfig';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './addExpert.css';


const AddExpert = () => {
  const [name, setName] = useState('');
  const [specialty, setSpecialty] = useState('');
  const [location, setLocation] = useState('');
  const [clinicLocation, setClinicLocation] = useState(''); // ฟิลด์ใหม่
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate;

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const handleAddExpert = async (e) => {
    e.preventDefault();

    if (!name || !specialty || !location || !clinicLocation || !phone || !email || !contact || !password || !image) {
      alert('กรุณากรอกข้อมูลให้ครบถ้วน');
      return;
    }

    setLoading(true);

    try {
      // สร้างบัญชีใน Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // อัปโหลดรูปภาพไปยัง Firebase Storage
      let imageUrl = '';
      if (image) {
        const imageRef = ref(storage, `experts/${Date.now()}_${image.name}`);
        await uploadBytes(imageRef, image);
        imageUrl = await getDownloadURL(imageRef);
      }

      // บันทึกข้อมูลผู้เชี่ยวชาญใน Firestore คอลเลกชัน "experts"
      await addDoc(collection(db, 'experts'), {
        name,
        specialty,
        location,
        clinicLocation, // เพิ่มฟิลด์ clinicLocation
        phone,
        email,
        contact,
        imageUrl,
        userId: user.uid, // เก็บ UID ของผู้เชี่ยวชาญ
        role: 'expert',
      });

      // บันทึกข้อมูลบทบาทผู้ใช้ใน Firestore คอลเลกชัน "users"
      await setDoc(doc(db, 'users', user.uid), {
        name,
        email,
        phone,
        role: 'expert', // ระบุบทบาทเป็น expert
        imageUrl,
      });

      alert('เพิ่มข้อมูลผู้เชี่ยวชาญสำเร็จ!');
      setName('');
      setSpecialty('');
      setLocation('');
      setClinicLocation(''); // รีเซ็ตฟิลด์ clinicLocation
      setPhone('');
      setEmail('');
      setContact('');
      setPassword('');
      setImage(null);
      navigate('/'); // เปลี่ยนเส้นทางไปหน้าหลักหลังจากสำเร็จ
    } catch (error) {
      console.error('Error adding expert:', error);
    
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-expert-container">
      <h2 className="add-expert-heading">เพิ่มผู้เชี่ยวชาญใหม่</h2>
      <form onSubmit={handleAddExpert} className="add-expert-form">
        <input
          type="text"
          placeholder="ชื่อ"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="add-expert-input"
        />
        <input
          type="text"
          placeholder="ความเชี่ยวชาญ"
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          required
          className="add-expert-input"
        />
        <input
          type="text"
          placeholder="สถานที่"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
          className="add-expert-input"
        />
        <input
          type="text"
          placeholder="สถานที่คลินิก" // ฟิลด์ใหม่
          value={clinicLocation}
          onChange={(e) => setClinicLocation(e.target.value)}
          required
          className="add-expert-input"
        />
        <input
          type="text"
          placeholder="เบอร์โทร"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
          className="add-expert-input"
        />
        <input
          type="email"
          placeholder="อีเมล"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="add-expert-input"
        />
        <input
          type="text"
          placeholder="ช่องทางการติดต่อเพิ่มเติม"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
          className="add-expert-input"
        />
        <input
          type="password"
          placeholder="รหัสผ่าน"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="add-expert-input"
        />
        <input
          type="file"
          onChange={handleImageChange}
          className="add-expert-input"
          required
        />
        <button type="submit" className="add-expert-button" disabled={loading}>
          {loading ? 'กำลังเพิ่ม...' : 'เพิ่มผู้เชี่ยวชาญ'}
        </button>
      </form>
    </div>
  );
};

export default AddExpert;
