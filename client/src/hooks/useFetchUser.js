import { useState, useEffect } from "react";
import { Link , useNavigate } from "react-router-dom";
import axios from "axios";

import API_URL from "../config/api.js";

export const fetchUser = (endpoint) => {
    const [userData , setUserData] = useState(null);
    const [loadingUser , setLoadingUser] = useState(true);
    const [error , setError] = useState(null);

    useEffect(() => {
        const fetchUserData = async() => {
            try{
                const response = await axios.get(`${API_URL}/api/v1/users${endpoint}`)
                const data = response.data.user;
                setUserData(data);
                setLoadingUser(false);
            } catch(err) {
                setError(err);
                setLoadingUser(false);
            }
        }

        if(endpoint){
            fetchUserData();
        }
    } , [endpoint]);

    return {userData , loadingUser , error};
};
