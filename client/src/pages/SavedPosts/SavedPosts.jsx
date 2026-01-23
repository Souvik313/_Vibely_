import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar.jsx';
import './SavedPosts.css';
import API_URL from '../../config/api.js';

const SavedPosts = () => {
    const [posts , setPosts] = useState([]);
    const [loading , setLoading] = useState(true);
    const [error , setError] = useState("");

    const fetchSaved = async() => {
        const token = localStorage.getItem("token");
        if(!token){
            setError("You must be logged in to view saved posts");
            setLoading(false);
            return;
        }

        try{
            setLoading(true);
            const response = await axios.get(`${API_URL}/api/v1/users/saved-posts`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if(!response.data.success) alert("Failed to fetch saved posts for user");

            setPosts(response.data?.savedPosts);
        } catch(err){
            console.error(err);
            setError(err);
        } finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSaved();
    } , []);

  const renderMedia = (mediaUrl) => {
    if (!mediaUrl) return null;
    const lower = mediaUrl.toLowerCase();
    if (/\.(jpg|jpeg|png|gif|webp)$/.test(lower)) {
      return <img src={mediaUrl} alt="post" className="saved-media" />;
    }
    if (/\.(mp4|webm|ogg)$/.test(lower) || lower.includes("video")) {
      return (
        <video className="saved-media" controls>
          <source src={mediaUrl} />
        </video>
      );
    }
    return null;
  };

  const handleUnsave = async(postId) => {
    const token = localStorage.getItem("token");
    if(!token){
        alert("Not authenticated.");
        return;
    }
    const prevPosts = posts;
    setPosts((p) => p.filter((x) => x._id !== postId && x.id !== postId));

    try {
        await axios.delete(`${API_URL}/api/v1/users/unsave/${postId}` , {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
    } catch (err) {
        console.error(err);
        setPosts(prevPosts);
        alert("Failed to remove saved post.");
    }
  };

  if (loading) return <div className="saved-posts-container">Loading saved posts...</div>;
  if (error) return <div className="saved-posts-container error">{error}</div>;

  return (
    <>
    <Navbar />
    <div className="saved-posts-container">
      <h2>Saved Posts</h2>
      {posts.length === 0 ? (
        <p>No saved posts yet.</p>
      ) : (
        <ul className="saved-list">
          {posts.map((post) => {
            const id = post._id || post.id;
            return (
              <li key={id} className="saved-item">
                <Link to={`/post/${id}`} className="saved-link">
                  <div className="saved-body">
                    {renderMedia(post.mediaUrl || post.media?.url || post.media)}
                    <div className="saved-caption">{post.content}</div>
                  </div>
                </Link>
                <div className="post-user-details">
                    <Link to={`/profile/${post.user?._id}`}>
                      <img src={post.user?.profilePicture} alt="" className="profile-picture" />
                    </Link>
                    <span className="name">{post.user?.name}</span>
                </div>
                <hr />
                <div className="saved-actions">
                  <button onClick={() => handleUnsave(id)} className="unsave-btn">
                    Remove
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
    </>
  );
};

export default SavedPosts;