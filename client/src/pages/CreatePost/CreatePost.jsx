import { useState, useRef } from "react";
import Navbar from "../../components/Navbar/Navbar.jsx";
import axios from "axios";
import "./CreatePost.css";

import API_URL from "../../config/api.js";

const CreatePost = () => {
  const [caption, setCaption] = useState("");
  const [media, setMedia] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const fileInput = useRef(null);

  const handleFileChange = (e) => {
    setMedia(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!caption.trim()) {
      alert("Caption cannot be empty");
      return;
    }
    const token = localStorage.getItem("token");
    if(!token){
      alert("You must be logged in to craete post.");
      return;
    }
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("content", caption);

      if (media) {
        formData.append("media", media);
      }

      const response = await axios.post(
        `${API_URL}/api/v1/posts/create`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMsg("Post created successfully!");
      setCaption("");
      setMedia(null);

      if(fileInput.current) fileInput.current.value = "";
      setTimeout(() => setSuccessMsg(""), 3000);

    } catch (err) {
      console.error(err);
      alert("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="create-post-container">
      <h2>Create a Post</h2>

      {successMsg && <p className="success-msg">{successMsg}</p>}

      <form onSubmit={handleSubmit} className="create-post-form">
        <textarea
          className="caption-input"
          placeholder="Write something about your post..."
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        ></textarea>

        <input
          type="file"
          className="file-input"
          accept="image/*,video/*"
          onChange={handleFileChange}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Create Post"}
        </button>
      </form>
    </div>
    </>
  );
};

export default CreatePost;
