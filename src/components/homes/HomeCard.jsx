import React from "react";
import { Link } from "react-router-dom";
import "./home.css"

const HomeCard = ({
  item: { id, cover, name, desc, starring, genres, tags ,a },
}) => {
  const getSimulatorLink = () => {
    if (a === "OCD") {
      console.log(a)
      return `/simulator/ocd/${id}`;
    } else if (a === "Self-Hatred") {
      console.log(a)
      return `/simulator/self-hatred/${id}`;
    }
    console.log(a)
    return `/simulator/${id}`; // ค่าเริ่มต้น
  };
  return (
    <>
      <div className="box">
        {/* ภาพหน้าปก */}
        <div className="coverImage">
          <img src={cover} alt={name} />
        </div>

        {/* เนื้อหาหลัก */}
        <div className="content flex">
          <div className="details row">
            <h1>{name}</h1>
            <p>{desc}</p>

            {/* รายละเอียดเพิ่มเติม */}
            <div className="cast">
              <h4>
                <span>ประเภท: </span>
                {starring}
              </h4>
              <h4>
                <span>โรคจิตเวช: </span>
                {genres}
              </h4>
              <h4>
                <span>เกี่ยวกับ: </span>
                {tags}
              </h4>
            </div>

            {/* ปุ่มเล่นโหมดจำลอง */}
            <div className="action-buttons">
              <Link to={getSimulatorLink()} className="primary-btn-sim">
                <i className="fas fa-play"></i> เล่นโหมดจำลอง
              </Link>
            </div>
          </div>

          {/* ปุ่มรับชมคำอธิบายเพิ่มเติม */}
          <div className="palyButton row">
            <Link to={`/singlepage/${id}`}>
              <button>
                <div className="img">
                  <img src="./images/play-button.png" alt="Play Button" />
                  <img src="./images/play.png" className="change" alt="Play" />
                </div>
                รับชมคำอธิบายเพิ่มเติม
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomeCard;
