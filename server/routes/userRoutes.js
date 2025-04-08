import express from "express";
import {registerUser,loginUser,getUser,getAllUsers,
} from "../controllers/userController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { userValidation } from "../models/User.js";
import upload from "../middlewares/uploadMiddleware.js";
import { followUser, unfollowUser, getUserFollowData,getMyFollowData } from "../controllers/followcontroller.js";

const router = express.Router();

// Middleware de validation pour l'inscription
const validateRegister = (req, res, next) => {
  const { error } = userValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

// Route d'inscription
router.post('/register', upload.single('avatar'),validateRegister,
  registerUser // Appeler la fonction de registre après le middleware de téléchargement
);


// Route de connexion
router.post("/login", loginUser);

// Route protégée pour récupérer les infos de l'utilisateur connecté
router.get("/profile/:id", authMiddleware, getUser);

// Route protégée pour récupérer tous les utilisateurs (nécessite un rôle admin, par exemple)
router.get("/users", authMiddleware,getAllUsers);

router.post("/follow/:userIdToFollow", authMiddleware, followUser);
router.post("/unfollow", authMiddleware, unfollowUser);
router.get("/:userId/followers", authMiddleware, getUserFollowData);
router.get("/Myfollowers", authMiddleware, getMyFollowData);

export default router;