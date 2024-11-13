import React from "react";
import "./commu.css"; 

const Community = ({ title, items }) => {
  const { doc: experts, post: posts } = items; // Destructure `doc` and `post` from `items`

  return (
    <div className="community-container">

      <div className="expert-section">
        <h2>คุยกับผู้เชี่ยวชาญ</h2>
        <ul>
          {experts.map((expert) => (
            <li key={expert.id}>
              <div className="expert-card">
                <img src={expert.image} alt={expert.name} />
                <div className="expert-info">
                  <h3 className="expert-name">{expert.name}</h3>
                  <p>จังหวัด: {expert.province}</p>
                </div>
                <div className="options">
                  <button>ปรึกษา</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>


      <div className="community-section">
        <h2>โพสต์ของชุมชน</h2>
        <ul>
          {posts.map((post) => (
            <li key={post.id}>
              <div className="post-card">
                <h4>{post.username}</h4>
                <p>{post.message}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Community;
