import React from "react"
import { Link } from "react-router-dom"
import Simulator from "../selfhatrd/Simulator"

const HomeCard = ({ item: { id, cover, name, rating, time, desc, starring, genres, tags, video } }) => {
  
  return (
    <>
      <div className='box'>
        <div className='coverImage'>
          <img src={cover} alt='' />
        </div>
        <div className='content flex'>
          <div className='details row'>
            <h1>{name}</h1>
            <div className='rating flex'>
            </div>
            <p>{desc}</p>
            <div className='cast'>
              <h4>
                <span>ประเภท </span>
                {starring}
              </h4>
              <h4>
                <span>โรคจิตเวช </span>
                {genres}
              </h4>
              <h4>
                <span>เกี่ยวกับ </span>
                {tags}
              </h4>
            </div>
            {/* ปุ่มเล่นโหมดจำลอง */}
          <button className="primary-btn-sim">
            {/* ใช้ Link จาก react-router-dom เพื่อไปยังหน้าใหม่ */}
            <Link to={`/simulator/${id}`}>
              <i className="fas fa-play"></i> เล่นโหมดจำลอง
            </Link>
          </button>
          </div>
          <div className='palyButton row'>
            <Link to={`/singlepage/${id}`}>
              <button>
              <div className='img'>
              <img src='./images/play-button.png' alt='' />
              <img src='./images/play.png' className='change' alt='' />
              </div>
                รับชมคำอธิบายเพิ่มเติม
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default HomeCard
