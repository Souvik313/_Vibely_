import { useState, useEffect } from "react";
import { Link , useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import './PostCard.css';
import like_icon from '../../assets/like_icon.png';
import dislike_icon from '../../assets/dislike_icon.png';
import liked_icon from '../../assets/liked_icon.png';
import disliked_icon from '../../assets/disliked_icon.png';
import check_icon from '../../assets/check_icon.png';
import down_arrow from '../../assets/down-arrow.png';
import three_dots_icon from '../../assets/three-dots-icon.png';
import { useFetchPosts } from "../../hooks/useFetchPosts";
import { useFetchFollowers } from "../../hooks/useFetchFollowers.js";
import useFetchComments from "../../hooks/useFetchComments.js";
import Navbar from "../Navbar/Navbar.jsx";
import API_URL from "../../config/api.js";
const PostCard = () => {
    const { postId } = useParams();
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");
    const [post , setPost] = useState(null);
    const [loading , setLoading] = useState(true);
    const [showDropdown , setShowDropdown] = useState(false);
    const [threeDotsClicked , setThreeDotsClicked] = useState(false);
    const [savePost , setSavePost] = useState(false);
    const [error , setError] = useState(null);
    const [likePost , setLikePost] = useState(false);
    const [dislikePost , setDislikePost] = useState(false);
    const [commentDisliked , setCommentDisliked] = useState(false);
    const [commentLiked , setCommentLiked] = useState(false);
    const [commentText , setCommentText] = useState("");
    const [replyText , setReplyText] = useState("");
    const [replyFormOpenForComment , setReplyFormOpenForComment] = useState(null);
    const [replyOpen , setReplyOpen] = useState(false);
    const [replies , setReplies] = useState([]);
    const [following , setFollowing] = useState(false);
    const [showDeleteComment , setShowDeleteCommment] = useState(false);
    const {comments , loadingComments , errorComments} = useFetchComments(`${postId}`);
    const followerUrl = post?.user?._id 
    ? `/followers/${post.user._id}` 
    : null;
    const {followerData , numFollowers , loadingFollowers , errorFollowers} = useFetchFollowers(followerUrl);
    const numComments = comments ? comments.length : 0;

    useEffect(() => {
        const fetchPost = async() => {
            try{
                const reqPost = await axios.get(`${API_URL}/api/v1/posts/${postId}`);
                setPost(reqPost.data.post);
                setLoading(false);
                setError(null);
            } catch (err) {
                setError(err.message);
                setLoading(false);
                setPost(null);
            }
        }
        fetchPost();
    } , []);

    useEffect(() => {
        const userId = localStorage.getItem("userId");
        if(followerData && followerData.some(follower => follower.follower._id === userId)){
            setFollowing(true);
        } else {
            setFollowing(false);
        }
    }, [followerData]);

    useEffect(() => {
        if (!post) return;  // ⬅ prevent crash until post loads

        const userId = localStorage.getItem("userId");
        if (!userId) {
            setLikePost(false);
            return;
        }

        setLikePost(post.likes?.includes(userId));
    }, [post]);

    useEffect(() => {
        if(!post) return;

        if(post.dislikes && post.dislikes.includes(localStorage.getItem("userId").toString())){
            setDislikePost(true);
        } else {
            setDislikePost(false);
        }
    } , [post]);

    useEffect(() => {
        if(!post) return;

        const checkPostSaved = async() => {
            try{
                const response = await axios.get(`${API_URL}/api/v1/users/saved-posts` , {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                const savedPosts = response.data.savedPosts;
                if(savedPosts && savedPosts.some(savedPost => savedPost._id === post._id)){
                    setSavePost(true);
                }
                else{
                    setSavePost(false);
                }
            } catch(error) {
                console.log(error.message);
                setSavePost(false);
            }
        }

        if(post){
            checkPostSaved();
        }
    } , [post]);

    useEffect(() => {
        if(!post || !comments) return;
        const userId = localStorage.getItem("userId");
        if(!userId) return;

        try{
            if(comments && comments.some(comment => comment.user._id.toString() === userId.toString())){
                setShowDeleteCommment(true);
            } else {
                setShowDeleteCommment(false);
            }
        } catch(error) {
            console.log(error);
        }
    } , [post , comments])

    useEffect(() => {
        if(!post || !comments) return;
        const userId = localStorage.getItem("userId");
        if(!userId) return;

        try{
            if(comments && comments.some(comment => comment.dislikes.includes(userId))){
                setCommentDisliked(true);
            } else {
                setCommentDisliked(false);
            }
        } catch(error){
            console.log(error);
        }
    } , [post , comments])

    const extractYouTubeID = (url) => {
    const regExp = 
      /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
    const match = url.match(regExp);
    return match ? match[1] : null;
    };

    const handlePostComment = async() => {
        if(commentText.trim() === "") return;
        try{
            const token = localStorage.getItem("token");
            const response = await axios.post(`${API_URL}/api/v1/comments/${postId}` , {
                text: commentText
            },{
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            setCommentText("");

        } catch(error){
            console.log(error);
        }
    }

    const handleFollowClick = async () => {
        const userId = post?.user?._id;
        const loggedUserId = localStorage.getItem("userId");

        if (!userId) return;

        // If user is already following → toggle dropdown
        if (following) {
            setShowDropdown(!showDropdown);
            return;
        }

        const token = localStorage.getItem("token");
        if (!token) {
            alert("Please log in to follow users");
            return;
        }

        if (loggedUserId === userId) {
            alert("You can't follow yourself");
            return;
        }

        try {
            const response = await axios.post(
                `${API_URL}/api/v1/follows/${userId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                setFollowing(true);
            }
        } catch (error) {
            alert("Error following user");
        }
    };

    const handleUnfollow = async() => {
        const posterId = post?.user?._id;
        const token = localStorage.getItem("token");
        if(!token){
            alert("User not logged in. Please login first");
            return;
        }
        try{
            const response = await axios.delete(`${API_URL}/api/v1/follows/${posterId}` , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            if(response.data.success){
                setFollowing(false);
                setShowDropdown(false);
            }
        } catch(error){
            alert("Error unfollowing user");
            console.log(error);
        }
    }

    const handleAddLike = async() => {
        const userId = localStorage.getItem("userId");
        if(!userId) return;
        try{
            await axios.post(`${API_URL}/api/v1/posts/like/${post._id}` , {} , {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            alert("Liked post!")
            setLikePost(true);
            setDislikePost(false);
        } catch(error){
            setLikePost(false);
            console.log(error);
            alert("Failed to like post!!");
        }
    }

    const handleAddDislike = async() => {
            const userId = localStorage.getItem("userId");
            if(!userId) return;
            try{
                await axios.post(`${API_URL}/api/v1/posts/dislike/${post._id}` , {} , {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                alert("Disliked post successfully");
                setDislikePost(true);
                setLikePost(false);
            } catch(error){
                setDislikePost(false);
                console.log(error);
                alert(error.message);
            }
    }

    const handleSavePost = async() => {
        const userId = localStorage.getItem("userId");
        if(!userId) return;

        try {
            await axios.post(`${API_URL}/api/v1/users/save/${post._id}` , {} , {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setSavePost(true);
            alert("Saved post successfully!")
        } catch (error) {
            console.log(error.message);
            alert("Failed to save post!!");
        }
    }

    const handleUnsavePost = async() => {
        if(!post) return;
        const userId = localStorage.getItem("userId");
        if(!userId) {
            alert("You are not logged in!")
            navigate("/login");
        }
        try{
            await axios.delete(`${API_URL}/api/v1/users/unsave/${post._id}` , {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setSavePost(false);
            alert("Removed post from saved posts!");
        } catch(error) {
            console.log(error);
            alert("Error unsaving post!!")
        }
    }

    const handleDeleteComment = (commentId) => {
        if(!post) return;
        if(!userId) return;
        if(!comments) return;
        const deleteComment = async() => {
            try{
            await axios.delete(`${API_URL}/api/v1/comments/${commentId}` , {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            alert("Comment deleted successfully");
        } catch(error) {
            console.log(error.message);
            alert("Could not delete comment!!");
        }
        }

        if(commentId){
            deleteComment();
        }
    }

    const handlePostReply = async(commentId) => {
        if(replyText.trim() === "") return;
        try{
            const token = localStorage.getItem("token");
            if(!token) return;
            await axios.post(`${API_URL}/api/v1/comments/reply/${commentId}` , {text: replyText} , {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert("Reply posted successfully");
            setReplyText("");
        } catch(error) {
            console.log(error.message);
            alert("Failed to post reply!!!")
            setReplyText("");
        }
    }

    const handleFetchRepliesForComment = async (commentId) => {
    try {
        const response = await axios.get(
        `${API_URL}/api/v1/comments/replies/${commentId}`,
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
        }
        );
        const fetchedReplies = response.data.replies;
        setReplies(fetchedReplies);
    } catch (error) {
        console.log(error.response?.data || error.message);
    }
    };

    const handleDislikeComment = async(commentId) => {
        if(!post) return;
        const userId = localStorage.getItem("userId");
        if(!userId){
            return;
        }
        try{
            await axios.post(`${API_URL}/api/v1/comments/dislike/${commentId.toString()}` , {} , {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setCommentDisliked(true);
            alert("Comment disliked successfully!");
        } catch(error) {
            setCommentDisliked(false);
            console.log(error);
            alert("Failed to dislike comment!!");
        }
    }

    const handleLikeComment = async(commentId) => {
        if(!post) return;
        const userId = localStorage.getItem("userId");
        if(!userId){
            return;
        }
        try{
            await axios.post(`${API_URL}/api/v1/comments/like/${commentId.toString()}` , {} , {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`
                }
            });
            setCommentLiked(true);
            alert("Comment liked successfully!");
        } catch(error) {
            setCommentLiked(false);
            console.log(error);
            alert("Failed to like comment");
        }

    }
    const handleDeletePost = async() => {
        const postId = post._id;
        const token = localStorage.getItem("token");
        if(!token) return;
        try{
            await axios.delete(`${API_URL}/api/v1/posts/${postId}` , {
                headers: {
                    Authorization : `Bearer ${token}`
                }
            });
            alert("Post deleted successfully!");
            navigate("/");
        } catch(error) {
            alert("Error deleting post");
            console.log(error);
        }
    }

    if(loading) return <div>Loading post...</div>
    if(error) return <div>Error fetching post!</div>
    if(!post) return <div>No such post found!</div>
    return (
        <>
        <Navbar />
        <div className="post-card-container">
            <div className="post-container">
                {post.media && (
                    <div className="media-wrapper">
                        {/* IMAGE */}
                        {post.mediaType === "image" && (
                            <img 
                            src={post.media.startsWith("http") ? post.media : `http://localhost:5000/${post.media}`}
                            alt="Post media"
                            />
                        )}

                        {/* YOUTUBE */}
                        {post.mediaType === "youtube" && (
                            <iframe 
                                width="300" 
                                height="300"
                                src={`https://www.youtube.com/embed/${extractYouTubeID(post.media)}`}
                                title="YouTube video player"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                            ></iframe>
                        )}


                        {/* VIDEO */}
                        {post.mediaType === "video" && (
                            <video width="500" height="281" controls>
                                <source 
                                src={post.media.startsWith("http") ? post.media : `http://localhost:5000/${post.media}`} />
                            </video>
                        )}

                    </div>
                )}
                <div className="post-details">
                    <p className="post-content">{post.content}</p>
                    <div className="post-meta">
                        <div className="creator-block">
                            <img src={post.user.profilePicture} alt="profile" className="creator-pic" onClick={() => navigate(`/profile/${post.user._id}`)}/>
                            <span className="creator">{localStorage.getItem("userId") === post.user._id ? "You" : post.user.name}</span>
                            <span className="followers">{numFollowers} followers</span>
                        </div>

                        <div className="follow-btn-wrapper" style={{ position: 'relative', display: 'inline-block' }}>
                        <button
                            className={`follow-btn ${following ? "following" : ""}`}
                            onClick={handleFollowClick}
                            disabled={!post?.user?._id || localStorage.getItem("userId") === post.user._id}
                        >
                            {following ? (
                                <>
                                    <img src={check_icon} alt="Following" />
                                    Following
                                    <img src={down_arrow} alt="Dropdown arrow" />
                                </>
                            ) : (
                                "Follow"
                            )}
                        </button>

                        {/* Dropdown */}
                        {showDropdown && following && (
                            <div className="follow-dropdown">
                                <button className="unfollow-btn" onClick={handleUnfollow}>
                                    Unfollow
                                </button>
                            </div>
                        )}
                    </div>

                        <img src={likePost ? liked_icon : like_icon} alt="" className="like" onClick={handleAddLike}/><span className="num-likes">{post.likesCount}</span>
                        <img src={dislikePost ? disliked_icon : dislike_icon} alt="" className="dislike" onClick={handleAddDislike}/><span className="numDislikes">{post.dislikesCount}</span>
                        <div className="post-options">
                                <img src={three_dots_icon} alt="" className="three-dots" onClick={() => setThreeDotsClicked(prevState => !prevState)}/>
                                {threeDotsClicked && (
                                    <button
                                        className="save-post"
                                        onClick={() => (!savePost ? handleSavePost() : handleUnsavePost())}
                                    >
                                        {!savePost ? "Save post" : "Unsave post"}
                                    </button>
                                )}

                        </div>

                    </div>
                    <hr />
                    <div className="comments-section">
                        <h3>{numComments} Comments</h3>
                        <div className="add-comment">
                            {localStorage.getItem("token") ? (
                                <div>
                                <input type="text" placeholder="Add a comment..." value={commentText} onChange = {(e) => setCommentText(e.target.value)} />
                                {commentText.trim() !== "" && (
                                    <div>
                                        <button className="post-comment-btn" onClick={handlePostComment}>Post</button>
                                        <button className="cancel-comment-btn" onClick={() => setCommentText("")}>Cancel</button>
                                    </div>
                                )}
                                </div>
                            ) : (
                                <p>Please log in to add a comment.</p>
                            )}
                        </div>
                        <div className="comment-list">
                            {loadingComments && <div>Loading comments...</div>}
                            {errorComments && <div>Error fetching comments!</div>}
                            {comments && comments.map((comment) => (
                                <div key={comment._id} className="comment-info">
                                    <img src={comment.user.profilePicture} alt="" className="commenter-image" />
                                    <div className="comment-body">

                                        <div className="comment-header">
                                            <span className="comment-user">{comment.user.name}</span>
                                            <span className="comment-date">{new Date(comment.createdAt).toLocaleString()}</span>
                                        </div>
                                        <div className="text">
                                            <span className="comment-text">{comment.text}</span>
                                        </div>
                                        <div className="comment-actions">
                                            <img src={like_icon} alt="" className="like-comment" onClick={handleLikeComment}/>
                                            <span className="numLikes">{comment.likes.length || 0}</span>
                                            <img src={comment.dislikes.includes(userId) ? disliked_icon : dislike_icon} alt="" className="dislike-comment" onClick={() => handleDislikeComment(comment._id)}/>
                                            <span className="numDislikes">{comment.dislikes.length || 0}</span>
                                            <button className="reply-btn" onClick={() =>
                                                {
                                                    setReplyOpen(prevState => !prevState);
                                                    setReplyFormOpenForComment(comment._id);
                                                    handleFetchRepliesForComment(comment._id)
                                                }}>{`Replies`}</button>
                                                
                                                {replyFormOpenForComment === comment._id && replyOpen && (<div className="reply-matter">
                                                    <div className="reply-form">
                                                        <input type="text" placeholder="Add a reply" value={replyText} onChange={(e) => setReplyText(e.target.value)} className="reply-input" />
                                                        {replyText !== "" && (
                                                            <div className="reply-actions">
                                                                <button className="reply-button" onClick = {() => handlePostReply(comment._id)}>Reply</button>
                                                            <button className="cancel-reply" onClick={() => setReplyText("")}>Cancel</button>
                                                            </div>
                                                            )}
                                                            
                                                    </div>
                                                    <div className="replies-container">
                                                        <h3 className="repies-heading">Replies</h3>
                                                        {replies.length === 0 ? "No replies yet" : (
                                                            replies.map((reply) => (
                                                                <div className="single-reply" key={reply._id}>
                                                                    <img src={reply.user.profilePicture} alt="" className="reply-user-picture" />
                                                                    <p className="reply-username">{reply.user.name}</p>
                                                                    <p className="replied-at">{new Date(reply.createdAt).toLocaleString()}</p>
                                                                    <p>{reply.text}</p>
                                                                </div>
                                                            ))
                                                        )}
                                                    </div>
                                                </div>)}
                                            {comment.user._id === userId && (
                                                <button className="delete-comment" onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
            {localStorage.getItem("userId") === post.user._id  && 
                <button className="delete-post-btn" onClick={handleDeletePost}>Delete post</button>}
        </div>
        </>
    );
}

export default PostCard;