import React, { useState, useEffect, useContext } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore'; // Import setDoc
import { db } from '../../firebaseConfig';
import { AuthContext } from '../login/auth/AuthContext'; // Adjust path as needed
import './profile.css';


const UserProfile = () => {
  const { currentUser } = useContext(AuthContext); // Get current user from context
  const [isEditing, setIsEditing] = useState(false);
  const [formValues, setFormValues] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (currentUser) {
      const fetchUserData = async () => {
        try {
          const userRef = doc(db, 'users', currentUser.uid); // Fetch data from Firebase
          const userSnap = await getDoc(userRef);
          if (userSnap.exists()) {
            setFormValues(userSnap.data()); // Set form values with user data from Firebase
          } else {
            setError('User data not found');
          }
        } catch (err) {
          setError('Error fetching user data');
        }
      };

      fetchUserData();
    }
  }, [currentUser]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = async () => {
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await setDoc(userRef, formValues); // Save the updated data back to Firebase
      setIsEditing(false);
    } catch (err) {
      setError('Error saving user data');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (error) return <p>{error}</p>;

  return (
    <div className="doctor-profile-container">
      <div className="doctor-info-section">
        <h2>ข้อมูลส่วนตัว</h2>
        {isEditing ? (
          <>
            <div className="info-item">
              <strong>ชื่อ:</strong>
              <input
                type="text"
                name="firstName"
                value={formValues.firstName || ''}
                onChange={handleChange}
                className="edit-input"
              />
            </div>
            <div className="info-item">
              <strong>นามสกุล:</strong>
              <input
                type="text"
                name="lastName"
                value={formValues.lastName || ''}
                onChange={handleChange}
                className="edit-input"
              />
            </div>
            <div className="info-item">
              <strong>เบอร์:</strong>
              <input
                type="text"
                name="phone"
                value={formValues.phone || ''}
                onChange={handleChange}
                className="edit-input"
              />
            </div>
           
            <div className="button-group">
              <button className="save-button" onClick={handleSaveClick}>
                บันทึก
              </button>
              <button className="cancel-button" onClick={handleCancelClick}>
                ยกเลิก
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="info-item">
              <strong>ชื่อ:</strong> <span>{formValues.firstName}</span>
            </div>
            <div className="info-item">
              <strong>นามสกุล:</strong> <span>{formValues.lastName}</span>
            </div>
            <div className="info-item">
              <strong>เบอร์:</strong> <span>{formValues.phone}</span>
            </div>
            
            <button className="edit-button" onClick={handleEditClick}>
              แก้ไขข้อมูล
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
