import { UserFollow,FollowValidation} from "../models/followuser.js";
import asyncHandler from "express-async-handler";
import { sendNotification } from "../config/socket.js"; // Import de la fonction de notification

export const followUser = asyncHandler(async (req, res) => {
    const userIdToFollow = req.params.userIdToFollow;
    const userId = req.user;

    if (userId.toString() === userIdToFollow) {
        return res.status(400).json({ error: "Tu ne peux pas te suivre toi-même !" });
    }

    let userFollow = await UserFollow.findOne({ user: userId });
    let targetFollow = await UserFollow.findOne({ user: userIdToFollow });

    if (!userFollow) userFollow = new UserFollow({ user: userId, following: [] });
    if (!targetFollow) targetFollow = new UserFollow({ user: userIdToFollow, followers: [] });

    if (!userFollow.following.includes(userIdToFollow)) {
        userFollow.following.push(userIdToFollow);
        targetFollow.followers.push(userId);

        await userFollow.save();
        await targetFollow.save();

        sendNotification(userIdToFollow, {
            message: "🚀 Tu as un nouveau follower !",
            followerId: userId.toString(),
        });

        return res.status(200).json({ message: "Utilisateur suivi avec succès !" });
    } else {
        return res.status(400).json({ error: "Tu suis déjà cet utilisateur !" });
    }
});


export const unfollowUser = asyncHandler(async (req, res) => {
    const { error } = FollowValidation.validate(req.body);
    if (error) return res.status(400).json({ error: error.details[0].message });

    const { userIdToFollow } = req.body;
    const userId = req.user._id;

    let userFollow = await UserFollow.findOne({ user: userId });
    let targetFollow = await UserFollow.findOne({ user: userIdToFollow });

    if (!userFollow || !targetFollow) {
        return res.status(400).json({ error: "Relation de suivi inexistante." });
    }

    userFollow.following = userFollow.following.filter(id => id.toString() !== userIdToFollow);
    targetFollow.followers = targetFollow.followers.filter(id => id.toString() !== userId);

    await userFollow.save();
    await targetFollow.save();

    res.status(200).json({ message: "Utilisateur désabonné avec succès !" });
});

// 📌 Fonction pour obtenir la liste des followers et followings
export const getUserFollowData = asyncHandler(async (req, res) => {
    const { userId } = req.params;

    const userFollow = await UserFollow.findOne({ user: userId })
        .populate("followers", "pseudo")
        .populate("following", "pseudo");

    if (!userFollow) return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.status(200).json({
        followers: userFollow.followers,
        following: userFollow.following
    });
});
export const getMyFollowData = asyncHandler(async (req, res) => {
    const userId  = req.user;
    console.log(userId);
    const userFollow = await UserFollow.findOne({ user: userId })
        .populate("followers", "pseudo")
        .populate("following", "pseudo");

    if (!userFollow) return res.status(404).json({ error: "Utilisateur non trouvé" });

    res.status(200).json({
        followers: userFollow.followers,
        following: userFollow.following
    });
});
