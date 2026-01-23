import { useState, useRef } from "react";
import { Link, useNavigate , useParams } from "react-router-dom";
import axios from "axios";
import {useFetchPosts} from "../../hooks/useFetchPosts.js";
import {fetchUser} from "../../hooks/useFetchUser.js";
import {useFetchFollowers} from "../../hooks/useFetchFollowers.js";
import { useFetchFollowing } from "../../hooks/useFetchFollowing.js";
import nav_icon from "../../assets/nav_icon.png"; // fallback icon
import Navbar from "../../components/Navbar/Navbar.jsx";
import './Profile.css';
import API_URL from "../../config/api.js";

const Profile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const loggedInUserId = localStorage.getItem("userId");

  const { posts, loading, error } = useFetchPosts(`/posts/${userId}`);
  const { userData, loadingUser, errorFetchUser } = fetchUser(`/user/${userId}`);
  const { followerData, numFollowers, loadingFollowers, errorFollowers } = useFetchFollowers(`/followers/${userId}`);
  const { followingData, numFollowing, loadingFollowing, errorFetchingFollowing } = useFetchFollowing(`/following/${userId}`);

  const fileInputRef = useRef(null);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [saving, setSaving] = useState(false);
  const startChat = async (receiverId) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/v1/conversations/`,
        { receiverId },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      const conversation = res.data.conversation;
      navigate(`/chat/${conversation._id}`);
    } catch (err) {
      console.error("Start chat failed:", err);
      alert("Could not start chat with this user");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const openFileChooser = () => fileInputRef.current.click();

  const onFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Only image files allowed");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be under 5MB");
      return;
    }

    setSelectedFile(file);
    setNewProfilePic(URL.createObjectURL(file)); // live preview
  };

  const saveProfilePicture = async () => {
    if (!selectedFile) return;
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("profilePicture", selectedFile);

      const res = await axios.patch(
        `${API_URL}/api/v1/users/update/${userId}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setNewProfilePic(res.data.updatedUser.profilePicture);
      setSelectedFile(null);
      alert("Profile picture updated!");
    } catch (err) {
      console.error("UPLOAD ERROR:", err.response?.data || err);
      alert("Failed to upload profile picture!");
    } finally {
      setSaving(false);
    }
  };

  const cancelChange = () => {
    setNewProfilePic(null);
    setSelectedFile(null);
  };

  const username = userData?.name || "User";
  const email = userData?.email || "";
  const profilePicture = newProfilePic || userData?.profilePicture || nav_icon;
  const userBio = userData?.bio || "";
  const joinedDate = userData ? new Date(userData.createdAt).toLocaleDateString() : "";

  if (loading || loadingUser || loadingFollowers) return <div>Loading...</div>;
  if (errorFetchUser) return <div>Error loading user profile!</div>;
  if (error) return <div>Error loading posts!</div>;
  if (errorFollowers) return <div>Error loading followers!</div>;

  return (
    <>
    <Navbar />
    <div className="user-details">
      <div className="profile-header">
        <img src={profilePicture} alt="profile-picture" className="profile-picture" />

        <h2 className="name">{username}</h2>

        {loggedInUserId === userId && (
          <button className="change-profile-pic" onClick={openFileChooser}>
            Change profile picture
          </button>
        )}

        {loggedInUserId === userId && (
          <button className="change-profile-pic" onClick={() => navigate("/edit-profile")}>
            Edit
          </button>
        )}
        {loggedInUserId !== userId && (
          <button className="chat-button" onClick={() => startChat(userId)}>
            💬 Chat
          </button>
        )}

        <input
          type="file"
          ref={fileInputRef}
          style={{ display: "none" }}
          accept="image/*"
          onChange={onFileChange}
        />

        {selectedFile && loggedInUserId === userId && (
          <div className="profile-pic-actions">
            <button className="save-profile-btn" onClick={saveProfilePicture} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </button>
            <button className="cancel-profile-btn" onClick={cancelChange}>
              Cancel
            </button>
          </div>
        )}

        {loggedInUserId === userId && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}

        <p className="user-email">{email}</p>
        <p className="user-bio">{userBio}</p>
        <p className="num-posts">{posts?.length > 0 ? `${posts.length} posts` : "No posts yet."}</p>
        <p className="num-followers">{numFollowers} followers</p>
        <p className="num-following">{numFollowing} following</p>
        <p className="joined-on">Joined on: {joinedDate}</p>
      </div>

      <div className="posts-container">
        <h3 className="posts-heading">Posts</h3>
        <hr className="posts-divider" />
        {posts?.length > 0 ? (
          posts.map((post) => (
            <Link to={`/post/${post._id}`} key={post._id} className="post-card">
              {post.media && (
                post.mediaType === "image" ? (
                  <img
                    src={post.media}
                    alt="post-media"
                    className="post-media"
                  />
                ) : post.mediaType === "video" ? (
                  <video
                    src={post.media}
                    className="post-media"
                    muted
                  />
                ) : null
              )}
              <p className="post-content">{post.content}</p>
              <p className="post-date">Posted on: {new Date(post.createdAt).toLocaleDateString()}</p>
            </Link>
          ))
        ) : (
          <p>No posts have been made yet.</p>
        )}

        {loggedInUserId === userId && (
          <div className="create-post-wrapper">
            <button className="create-post-btn" onClick={() => navigate("/create-post")}>
              + Create Post
            </button>
          </div>
          
        )}
      </div>
    </div>
    </>
  );
};

export default Profile;

