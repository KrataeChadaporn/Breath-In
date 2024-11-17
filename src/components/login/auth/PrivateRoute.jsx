// src/components/PrivateRoute.js
import React from "react";
import { Route, Navigate } from "react-router-dom";
import useAuth from "../auth/useAuth";  // นำเข้า useAuth

const PrivateRoute = ({ children }) => {
  const currentUser = useAuth({ shouldRedirect: false, alertUser: true });  // ตรวจสอบการเข้าสู่ระบบ

  // ถ้าไม่มีผู้ใช้ (ไม่ได้เข้าสู่ระบบ) ให้เปลี่ยนเส้นทางไปที่หน้า login
  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  return children;  // ถ้ามีผู้ใช้ (เข้าสู่ระบบแล้ว) ให้แสดงผลหน้าที่มี children
};

export default PrivateRoute;
