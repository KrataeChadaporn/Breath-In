import React, { useState } from "react"
import "./header.css"

const Header = () => {
  const [Mobile, setMobile] = useState(false)
  return (
    <>
      <header>
        <div className='container flexSB'>
          <nav className='flexSB'>
            <div className='logo'>
              <img src='./images/logo.png' alt='' />
            </div>
            {/*<ul className='flexSB'>*/}
            <ul className={Mobile ? "navMenu-list" : "flexSB"} onClick={() => setMobile(false)}>
              <li>
                <a href='/'>หน้าหลัก</a>
              </li>
              <li>
                <a href='/'>เมนู</a>
              </li>
              <li>
                <a href='/'>บทความ</a>
              </li>
              <li>
                <a href='/'>ติดตามอารมณ์</a>
              </li>
              <li>
                <a href='/'>ชุมชน</a>
              </li>
              {/* <li>
                <a href='/'>Contact</a>
              </li> */}
            </ul>
            <button className='toggle' onClick={() => setMobile(!Mobile)}>
              {Mobile ? <i className='fa fa-times'></i> : <i className='fa fa-bars'></i>}
            </button>
          </nav>
          <div className='account flexSB'>
            <i className='fa fa-search'></i>
            <i class='fas fa-bell'></i>
            <i className='fas fa-user'></i>
            <button>เข้าสู่ระบบ</button>
          </div>
        </div>
      </header>
    </>
  )
}

export default Header
