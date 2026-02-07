import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { useFetchFollowers } from "../../hooks/useFetchFollowers.js";
import { useFetchFollowing } from "../../hooks/useFetchFollowing.js";
import "./Sidebar.css";

const Sidebar = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const [isOpen, setIsOpen] = useState(true);
  const {followerData , numFollowers , loadingFollowers , error} = useFetchFollowers(`/followers/${userId}`);
  const {followingData , numFollowing , loadingFollowing , errorFetchingFollowing} = useFetchFollowing(`/following/${userId}`);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setIsOpen(false);
    navigate("/login");
  };

  return (
    <>
    {!isOpen && (
      <button
        className="sidebar-toggle floating"
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(true);
          }}
          aria-label="Open sidebar"
      >
        ☰
      </button>
    )}
    <div className={`sidebar-components ${isOpen ? "open" : ""}`}>
      {isOpen && (
        <div className="sidebar-header">
        <button 
          className="sidebar-toggle inside" 
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
          aria-label="Close sidebar">
          ✕
        </button>
        <span className="sidebar-title">Vibely</span>
      </div>)}

      <nav className="sidebar-nav">
        <Link to="/" className="sidebar-link" onClick={() => setIsOpen(false)}>
          🏠 Home
        </Link>

        {userId && (
          <Link
            to={`/profile/${userId}`}
            className="sidebar-link"
            onClick={() => setIsOpen(false)}
          >
            👤 Profile
          </Link>
        )}

        <Link
          to="/create-post"
          className="sidebar-link"
          onClick={() => setIsOpen(false)}
        >
          ✏️ Create Post
        </Link>

        <Link
          to="/saved-posts"
          className="sidebar-link"
          onClick={() => setIsOpen(false)}
        >
          💾 Saved Posts
        </Link>
        <hr />
        {userId ? (
          <button className="sidebar-link logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        ) : (
          <>
            <Link
              to="/login"
              className="sidebar-link"
              onClick={() => setIsOpen(false)}
            >
              🔑 Login
            </Link>
            <Link
              to="/register"
              className="sidebar-link"
              onClick={() => setIsOpen(false)}
            >
              📝 Register
            </Link>
          </>
        )}
      </nav>

      <hr />
      {userId && 
      <> 
        <h3 className="Followers">Followers</h3>
        {loadingFollowers && (<p className="sidebar-loading">Loading followers...</p>)}
        {error && (<p className="error">Error fetching followers</p>)}
        {!loadingFollowers && followerData.length === 0 && (
          <p className="sidebar-empty">No followers yet</p>
        )}
        {!loadingFollowers && followerData.length !== 0 && (<div className="follower-list">
          {followerData.map(follower => (
            <div className="follower-details" key={follower._id}>
              <div className="follower-profile">
                <Link to={`/profile/${follower.follower._id}`}>
                  {follower.follower?.profilePicture && (<img src={follower.follower.profilePicture} alt="" className="profile" />)}
                  <span className="name">{follower.follower.name}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>)}
        <hr />
        <h3 className="following">Following</h3>
        {loadingFollowing && (<p className="sidebar-loading">Loading following...</p>)}
        {errorFetchingFollowing && (<p className="error">Error fetching following</p>)}
        {!loadingFollowing && followingData.length === 0 && (
          <p className="sidebar-empty">No following yet</p>
        )}
        {!loadingFollowing && followingData.length!==0 && (<div className="following-list">
          {followingData.map(following => (
            <div className="following-details" key={following._id}>
              <div className="following-profile">
                {following.following?.profilePicture && (<img src={following.following.profilePicture} alt="" className="profile" />)}
                <span className="name">{following.following.name}</span>
              </div>
            </div>
          ))}
        </div>)}
      </>
      }
    </div>
    </>
  );
};

export default Sidebar;