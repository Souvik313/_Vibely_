import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../components/Navbar/Navbar.jsx";
import axios from "axios";
import "./EditProfile.css";

import API_URL from "../../config/api.js";

const EditProfile = () => {
  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
  const token = localStorage.getItem("token");
  const [initialData , setInitialData] = useState({
    name: "",
    bio: ""
  });
  const [formData, setFormData] = useState({
    name: "",
    bio: "",
    profilePicture: null,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [previewImg, setPreviewImg] = useState("");

  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/v1/users/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const user = response.data?.user || response.data;
      setFormData({
        name: user.name || "",
        bio: user.bio || "",
        profilePicture: null,
      });
      setInitialData({
        name: user.name || "",
        bio: user.bio || "",
      })
      if (user.profilePicture) {
        setPreviewImg(
          user.profilePicture.startsWith("http")
            ? user.profilePicture
            : `${API_URL}/${user.profilePicture}`
        );
      }
    } catch (err) {
      console.error(err);
      setError("Failed to load user data");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (!userId || !token) {
      navigate("/login");
      return;
    }
    fetchUserData();
  }, [userId, token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setFormData((prev) => ({
      ...prev,
      profilePicture: file,
    }));

    const reader = new FileReader();
    reader.onloadend = () => setPreviewImg(reader.result);
    reader.readAsDataURL(file);
  };


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      setError("Username is required");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const data = new FormData();
      data.append("name", formData.name);
      data.append("bio", formData.bio);

      if (formData.profilePicture) {
        data.append("profilePicture", formData.profilePicture);
      }

      const response = await axios.patch(
        `${API_URL}/api/v1/users/update/${userId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setSuccessMsg("Profile updated successfully!");
      setTimeout(() => {
        setSuccessMsg("");
        navigate(`/profile/${userId}`);
      }, 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const isUnchanged =
    formData.name === initialData.name &&
    formData.bio === initialData.bio &&
    !formData.profilePicture;

  if (loading) return <div className="edit-profile-container">Loading...</div>;
  return (
    <>
    <Navbar />
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>

      {error && <div className="error-msg">{error}</div>}
      {successMsg && <div className="success-msg">{successMsg}</div>}

      <form onSubmit={handleSubmit} className="edit-profile-form">
        <div className="profile-pic-section">
          {previewImg && (
            <img src={previewImg} alt="profile preview" className="profile-preview" />
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="file-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="name">Username</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="bio">Bio</label>
          <textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleInputChange}
            className="form-textarea"
            placeholder="Tell us about yourself..."
            rows="4"
          ></textarea>
        </div>

        <div className="form-actions">
          <button type="submit" disabled={saving || isUnchanged} className="save-btn">
            {saving ? "Saving..." : "Save Changes"}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/profile/${userId}`)}
            className="cancel-btn"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
    </>
  );
};

export default EditProfile;