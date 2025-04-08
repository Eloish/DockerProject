import express from "express";
import { followUser, unfollowUser, getUserFollowData } from "../controllers/followcontroller.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/follow", authMiddleware, followUser);
router.post("/unfollow", authMiddleware, unfollowUser);
router.get("/:userId/followers", authMiddleware, getUserFollowData);

export default router;
