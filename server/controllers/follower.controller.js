import Follower from "../models/follower.model.js";
import User from "../models/user.model.js";
export const getAllFollowers = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const followers = await Follower.find({ following: userId })
            .populate("follower", "name profilePicture");

        return res.status(200).json({
            success: true,
            message: "Followers fetched successfully",
            followers: followers
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getAllFollowing = async (req, res, next) => {
    try {
        const userId = req.params.userId;

        const following = await Follower.find({ follower: userId })
            .populate("following", "name profilePicture");

        return res.status(200).json({
            success: true,
            message: "Users you are following fetched successfully",
            following: following
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const createNewFollowing = async(req , res , next) => {
    try{
        const followerId = req.user._id;
        const followingId = req.params.id;
        if(followerId === followingId){
            return res.status(400).json({
                success: false,
                message: "You can't follow yourself"
            })
        }

        console.log("FOLLOWING ID RECEIVED:",followingId);
        console.log("TYPE:", typeof followingId);

        const targetUser = await User.findById(followingId);
        if(!targetUser){
            return res.status(400).json({
                success: false,
                message: "No such user found"
            })
        }

        const alreadyFollowing = await Follower.findOne({
            follower: followerId, 
            following: followingId
        })

        if(alreadyFollowing){
            return res.status(400).json({
                success: false,
                message: "You are already following this user"
            })
        }

        const follow = await Follower.create({
            follower: followerId,
            following: followingId
        })

        res.status(200).json({
            success: true,
            message: "Followed user successfully",
            follow
        })

    } catch(error) {
        console.log(error);
        next(error);
    }
}

export const unfollowUser = async (req, res, next) => {
    try {
        const followerId = req.user._id;
        const followingId = req.params.id;

        if (followerId === followingId) {
            return res.status(400).json({
                success: false,
                message: "You cannot unfollow yourself."
            });
        }

        const relation = await Follower.findOne({
            follower: followerId,
            following: followingId
        });

        if (!relation) {
            return res.status(400).json({
                success: false,
                message: "You are not following this user."
            });
        }

        const unFollowed = await Follower.findByIdAndDelete(relation._id);
        return res.status(200).json({
            success: true,
            message: "Unfollowed successfully.",
            unFollowed: unFollowed
        });

    } catch (error) {
        console.log(error);
        next(error);
    }
};