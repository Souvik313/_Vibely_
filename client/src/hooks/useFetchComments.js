import { useState , useEffect } from "react";
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../config/api.js";

const useFetchComments = (id) => {
    const [comments , setComments] = useState([]);
    const [loading , setLoading] = useState(true);
    const [error , setError] = useState(null);

    useEffect(() => {
        const fetchComments = async() => {
            try{
                const response = await axios.get(`${API_URL}/api/v1/comments/post/${id}`);
                const commentsData = response.data.comments || response.data.data?.comments || [];
                setComments(commentsData);
                setLoading(false);
                setError(null);
            } catch(error) {
                setError(error.message);
                setLoading(false);
                setComments([]);
            }
        } 

        if(id){
            fetchComments();
        }
    } , [id])

    return {comments , loadingComments: loading , errorComments: error};
}

export default useFetchComments;