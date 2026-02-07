import { useState , useEffect } from "react";
import {useFetchPosts} from '../../hooks/useFetchPosts.js';
import { fetchUser } from "../../hooks/useFetchUser.js";
import PostSkeleton from "../PostSkeleton/PostSkeleton.jsx";
import { Link , useParams } from "react-router-dom";
import './Body.css';

const Body = ({searchQuery}) => {
    const {postId} = useParams();
    const {posts , loading , error} = useFetchPosts(`/all-posts`);
    
    const allPosts = Array.isArray(posts)
        ?(posts.length > 0 ? posts : null)
        :(posts && typeof posts === 'object' ? posts : null)

    const getYouTubeEmbedUrl = (url) => {
    if (!url) return "";
    try {
        if (url.includes("youtu.be/")) {
            const videoId = url.split("youtu.be/")[1].split("?")[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }

        if (url.includes("watch?v=")) {
            const videoId = url.split("watch?v=")[1].split("&")[0];
            return `https://www.youtube.com/embed/${videoId}`;
        }

        return url; 
    } catch {
        return url;
    }
};
    if(loading) {
        return (
            <div className="feed">
            {[...Array(3)].map((_, i) => (
                <PostSkeleton key={i} />
            ))}
            </div>
            );
        }
    if(error) return <div className="error-loading">Error loading posts!</div>
    if(!allPosts || allPosts.length === 0) return <div className="no-posts">No posts have been made yet 👀</div>

    const normalizedQuery = searchQuery.trim().toLowerCase();
    const filteredPosts = 
        normalizedQuery.length < 3 ?
        posts :
        posts.filter((post) =>
            post.content
            ?.toLowerCase()
            .startsWith(normalizedQuery.slice(0,3))
    );

    return(
    <div className="posts-container">
        {filteredPosts.length === 0 ? (<div>No matching posts found</div>) : 
        filteredPosts.map((post) => (
        <Link to = {`/post/${post._id}`} key={post._id} className="post-card">
            {post.media && (
                <div className="media-wrapper">
  
        {/* IMAGE */}
        {post.mediaType === "image" && (
            <img 
            src={post.media.startsWith("http") ? post.media : `http://localhost:5000/${post.media}`} 
            alt="post" 
            className="post-media" 
            />
        )}
        {post.mediaType === "video" && (
            <video 
            className="post-media" 
            playsInline 
            >
            <source 
                src={post.media.startsWith("http") ? post.media : `http://localhost:5000/${post.media}`} 
                type="video/mp4" 
            />
            Your browser does not support the video tag.
            </video>
        )}

        {/* YOUTUBE VIDEO */}
        {post.mediaType === "youtube" && (
        <iframe
            className="post-media"
            src={getYouTubeEmbedUrl(post.media)}
            width={"100"}
            height={"300"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title="YouTube video"
        />
        )}
        </div>
            )}
            <div className="post-details">
                <div className="post-details-header">
                <img src={post.user.profilePicture} alt="profile" className="poster-image" />
                <p className="post-content">{post.content}</p>
            </div>
            <div className="post-details-footer">
                <span className="poster-name">{post.user.name}</span>•<span className="post-date">{new Date(post.createdAt).toLocaleDateString()}</span>
            </div>
            </div>   
        </Link>
    ))}
</div>
    )
};

export default Body;