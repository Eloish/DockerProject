import { Post,postValidation } from '../models/Post.js';
import asyncHandler from "express-async-handler";
import { User } from '../models/User.js';
import { UserFollow } from '../models/followuser.js';
import { sendNotification } from '../config/socket.js';

import jwt from 'jsonwebtoken';

const getPosts = asyncHandler(async (req, res) => {
    try {
        // Utilisation de l'agrégation pour compter le nombre de réactions par post
        const posts = await Post.aggregate([
            {
                // Jointure avec la collection Reaction pour obtenir les réactions liées au post
                $lookup: {
                    from: 'reactions',  // Nom de la collection Reaction
                    localField: '_id',   // Champ local (_id du post)
                    foreignField: 'Post_id',  // Champ de la réaction qui fait référence au post
                    as: 'reactions',   // Créer un tableau "reactions" contenant les réactions liées
                },
            },
            {
                // Ajout d'un champ reactionsCount qui compte le nombre d'éléments dans le tableau reactions
                $addFields: {
                    reactionsCount: { $size: { $ifNull: ['$reactions', []] } },  // Utilisation de $ifNull pour gérer les cas où reactions est nul
                },
            },
            {
                // Optionnel : si tu veux seulement les champs principaux du post et le count
                $project: {
                media: 1,
                tags:1,// On garde le titre
                    content: 1, // On garde le contenu
                    reactionsCount: 1,  // Et on garde le nombre de réactions
                    _id: 1,  // On garde l'ID du post
                },
            },
        ]);

        // Retourner les posts avec le nombre de réactions
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ message: error.message });  // Retourner une erreur si l'agrégation échoue
    }
});






// Ajouter un nouveau post
const addPost = asyncHandler(async (req, res) => {
  req.body.user_id = req.user;

  // Vérifier si tags est une chaîne et la convertir en tableau
  if (typeof req.body.tags === "string") {
    req.body.tags = req.body.tags.split(",").map(tag => tag.trim());
  } else if (!Array.isArray(req.body.tags)) {
    req.body.tags = [];
  }

  // Vérifier que chaque tag commence par "#" (au cas où l'utilisateur les entre mal)
  req.body.tags = req.body.tags.map(tag => 
    tag.startsWith("#") ? tag : `#${tag}`
  );

  const { error } = postValidation.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const { user_id, content, tags } = req.body;
  const media = req.file ? `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}` : "";

  try {
    const newPost = new Post({
      user_id,
      content,
      media,
      tags,
    });

    await newPost.save();

     const userFollow = await UserFollow.findOne({ user: req.user.id });

        if (userFollow && userFollow.followers.length > 0) {
            sendNotification(userFollow.followers, {
                message: `${req.user.pseudo} a publié un nouveau post`,
                post_id: newPost._id
            });
        }

    res.status(201).json({
      message: 'Post créé avec succès',
      post: newPost,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur lors de la création du post' });
  }
});

//checkpost
const checkPost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post introuvable' });
    } else {
      res.status(200).json(post);
    } 
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
);
const getuserPosts = asyncHandler(async (req, res) => {
  try {
    
    // Vérifier si le token est présent dans les en-têtes de la requête
    const token = req.headers.authorization?.split(' ')[1]; // Extraire le token (bearer token)
    if (!token) {
      return res.status(401).json({ message: 'Accès refusé, token manquant' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Vérifier avec la clé secrète du JWT
    const userId = decoded.userId;

    // Récupérer les posts associés à l'utilisateur connecté
    const posts = await Post.find({ user_id: userId });
    // Retourner les posts
    console.log(decoded);
    res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des posts',error });
  }
});
//deletePost
const deletePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: 'Post introuvable' });
    } else {
      await Post.findByIdAndDelete(id);
      res.status(200).json({ message: 'Post supprimé avec succès' });
    }
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
}
);


const searchPosts = asyncHandler(async (req, res) => {
    const { query } = req.query; // On récupère la chaîne de recherche

    if (!query) {
        return res.status(400).json({ error: "Veuillez entrer un terme de recherche" });
    }

    try {
        let posts = [];

        // Vérifier si la requête contient un hashtag
        if (query.includes("#")) {
            // Extraire tous les hashtags de la requête
            const tagsArray = query.split(" ")
                .filter(word => word.startsWith("#")) // Garde seulement les mots commençant par #
                .map(tag => tag.trim());

            if (tagsArray.length > 0) {
                posts = await Post.find({ tags: { $all: tagsArray } }).populate("user_id", "pseudo");
            }
        } 
        
        // Sinon, recherche par pseudo
        if (posts.length === 0) {
            const user = await User.findOne({ pseudo: { $regex: new RegExp(query, "i") } });

            if (user) {
                posts = await Post.find({ user_id: user._id }).populate("user_id", "pseudo");
            }
        }

        res.status(200).json(posts);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la recherche de posts" });
    }
});

export { getPosts,addPost,checkPost,deletePost,searchPosts,getuserPosts };