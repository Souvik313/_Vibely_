import { useState , useEffect } from "react";
import { Link , useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api.js";

export const useFetchFollowers = (endpoint) => {
    const [followerData , setFollowerData] = useState([]);
    const [numFollowers , setNumFollowers] = useState(0);
    const [loadingFollowers , setLoadingFollowers] = useState(true);
    const [error , setError] = useState(null);
    useEffect(() => {
        if(!endpoint) return;

        const fetchFollowerData = async() => {
            try{
                const response = await axios.get(`${API_URL}/api/v1/follows${endpoint}`);
                const followers = response.data.followers;
                const numberOfFollowers = followers.length;
                setFollowerData(followers);
                setNumFollowers(numberOfFollowers);
                setLoadingFollowers(false);

            } catch (error) {
                setError(error);
                setLoadingFollowers(false);
            }
        }

        if(endpoint){
            fetchFollowerData();
        }
    } , [endpoint]);

    return {followerData , numFollowers , loadingFollowers , error};
}