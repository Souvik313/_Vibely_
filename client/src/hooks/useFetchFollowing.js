import { useState , useEffect } from "react";
import { Link , useParams } from "react-router-dom";
import axios from "axios";
import API_URL from "../config/api.js";

export const useFetchFollowing = (endpoint) => {
    const [followingData , setFollowingData] = useState([]);
    const [numFollowing , setNumFollowing] = useState(0);
    const [loadingFollowing , setLoadingFollowing] = useState(true);
    const [error , setError] = useState(null);

    useEffect(() => {
        if(!endpoint) return;

        const fetchFollowing = async() => {
            try{
                const response = await axios.get(`${API_URL}/api/v1/follows${endpoint}` , {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                });
                const following = response.data.following;
                setFollowingData(following);
                setNumFollowing(following.length);
                setLoadingFollowing(false);
                setError(null);
            } catch(error){
                setError(error.message);
                setLoadingFollowing(false);
            }
        }

        if(endpoint){
            fetchFollowing();
        }
    } , [endpoint]);

    return {followingData , numFollowing , loadingFollowing , errorFetchingFollowing: error};
}