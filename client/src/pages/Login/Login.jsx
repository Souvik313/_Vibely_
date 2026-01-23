import { useState, useEffect } from "react";
import { Link , useNavigate , useParams } from "react-router-dom";
import axios from "axios";
import './Login.css';
import Navbar from "../../components/Navbar/Navbar.jsx";

import API_URL from "../../config/api.js";

const Login = () => {
    const [formData , setFormData] = useState({
        email: "",
        password: ""
    });
    const [loading , setLoading] = useState(false);
    const [error , setError] = useState(null);

    const navigate = useNavigate();

 const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError(null);

            const response = await axios.post(`${API_URL}/api/v1/auth/sign-in`,formData);

            if (response.data.success) {
                const user = response.data.data.user;
                localStorage.setItem("token", response.data.data.token);
                localStorage.setItem("userId", user._id);
                localStorage.setItem("user", JSON.stringify(user));
                console.log("✅ Login successful, user stored:", user);
                navigate("/");
                return;
            }

            const msg = response.data.message || "Login failed";
            setError(msg);

            if (msg.toLowerCase().includes("not") && msg.toLowerCase().includes("user")) {
                setTimeout(() => navigate("/register"), 2000);
            }

        } catch (err) {
            const msg = err.response?.data?.message || "An error occurred";
            setError(msg);

            if (msg.toLowerCase().includes("not") && msg.toLowerCase().includes("user")) {
                setTimeout(() => navigate("/register"), 2000);
            }

        } finally {
            setLoading(false);
        }
    };

    return (
        <>
        <Navbar />
        <div className="login-container">
            <h2 className="login-heading">Login</h2>
            <form className="login-form" onSubmit = {handleSubmit}>
                <label htmlFor="email" className="email-label">Email:</label>
                <input
                    name = "email"
                    type="email"
                    placeholder="Enter your email"
                    value = {formData.email}
                    onChange = {(e) => setFormData({...formData, email: e.target.value})}
                />

                <label htmlFor="password" className="password-label">Password:</label>
                <input
                    name = "password"
                    type="password"
                    placeholder="Enter your password"
                    value = {formData.password}
                    onChange = {(e) => setFormData({...formData, password: e.target.value})}
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                </button>
                <p className="create-account">Don't have an account? <span onClick={() => navigate("/register")}>Create one</span></p>
                {error && <p className="error-message">{error}</p>}
            </form>
        </div>
        </>
    )
}

export default Login;