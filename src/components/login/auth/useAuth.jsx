// src/components/login/auth/useAuth.js
import { useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";  // ตรวจสอบให้แน่ใจว่า path ถูกต้อง
import { useNavigate } from "react-router-dom";

const useAuth = ({ shouldRedirect = true, alertUser = true }) => {
  const { currentUser } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser && shouldRedirect) {
      if (alertUser) {
        alert("กรุณาเข้าสู่ระบบก่อนใช้งานเว็บไซต์");
      }
      navigate("/login");
    }
  }, [currentUser, navigate, shouldRedirect, alertUser]);

  return currentUser;
};

export default useAuth;
