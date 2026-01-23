import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './Register.css';
import Navbar from "../../components/Navbar/Navbar.jsx";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({ 
      ...formData, 
      [e.target.name]: e.target.value 
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await axios.post(
        "http://localhost:5000/api/v1/auth/sign-up", 
        formData,
        { withCredentials: true }
      );
      const user = res.data.data.user;
      localStorage.setItem("token" , res.data.data.token);
      localStorage.setItem("userId" , user._id);
      localStorage.setItem("user", JSON.stringify(user));
      console.log("✅ Registration successful, user stored:", user);
      setSuccess("Account created successfully!");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create Account</h2>

        {error && <p className="auth-error">{error}</p>}
        {success && <p className="auth-success">{success}</p>}
        <label htmlFor="name" className="name-label">Full Name:</label>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email" className="email-label">Email Address:</label>
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password" className="password-label">Create Password:</label>
        <input
          type="password"
          name="password"
          placeholder="Create Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p className="switch-auth">
          Already have an account?{" "}
          <span onClick={() => navigate("/login")}>Login</span>
        </p>
      </form>
    </div>
    </>
  );
};

export default Register;
