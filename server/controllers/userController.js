import { User, userValidation } from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler"; // Utilisation de asyncHandler

// Fonction d'inscription optimisée
const registerUser = asyncHandler(async (req, res) => {
  const { error } = userValidation(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  const { pseudo, email, password } = req.body;
  const avatar = req.file ? `/uploads/${req.file.filename}` : "";


  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "Cet email est déjà utilisé." });
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const newUser = new User({
    pseudo,
    email,
    password: hashedPassword,
    avatar,
  });
  const savedUser = await newUser.save();

  const token = jwt.sign({ userId: savedUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.status(201).json({
    user: {
      id: savedUser._id,
      username: savedUser.username,
      email: savedUser.email,
      image: savedUser.image,
    },
    token,
  });
});

// Fonction de connexion optimisée
const loginUser = asyncHandler(async (req, res) => {
  const pseudo = req.body.username;
  const password = req.body.password;

  const user = await User.findOne({ pseudo });
  if (!user) {
    return res
      .status(401)
      .json({ message: "Username ou mot de passe incorrect." });
  }

  const validPassword = await bcrypt.compare(password, user.password);
  if (!validPassword) {
    return res
      .status(401)
      .json({ message: "Username ou mot de passe incorrect." });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
});

// Fonction pour récupérer l'utilisateur connecté
const getUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    return res.status(404).json({ message: "Utilisateur non trouvé." });
  }
  res.json(user);
});

// Fonction pour récupérer tous les utilisateurs
const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

export { registerUser, loginUser, getUser, getAllUsers };
