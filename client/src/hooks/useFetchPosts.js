import { useNavigate , useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from 'axios';

import API_URL from "../config/api.js";

export const useFetchPosts = (endpoint) => {
    const [posts , setPosts] = useState([]);
    const [loading , setLoading] = useState(true);
    const [error , setError] = useState(null);
    useEffect(() => {
        const fetchPosts = async() => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                const headers = token ? { Authorization: `Bearer ${token}` } : {};

                const response = await axios.get(`${API_URL}/api/v1/posts${endpoint}`, { headers });
                const allPosts = response.data.posts || [];

                if (!response.data.success) {
                    setError("Failed to fetch posts");
                    setPosts([]);
                    return;
                } else {
                    setPosts(allPosts);
                    setError(null);
                }
            } catch (err) {
                setPosts([]);
                setError(err.response?.data?.message || err.message || "Error fetching posts");
            } finally {
                setLoading(false);
            }
        }

        if(endpoint){
            fetchPosts();
        }
    } , [endpoint]);

    return {posts , loading , error};
}