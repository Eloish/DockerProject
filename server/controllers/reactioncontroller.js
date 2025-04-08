
import asyncHandler from 'express-async-handler';
import { reaction } from '../models/reaction.js';
import { emotion } from '../models/emotion.js';
import { Post } from '../models/Post.js';
import { sendNotification } from '../config/socket.js';
import upload from '../middlewares/uploadMiddleware.js'; // Importer la configuration Multer

// Ajouter une réaction
const addReaction = asyncHandler(async (req, res) => {
    console.log(req.file);
    const image = req.file ? `/uploads/${req.file.filename}` : "";
    
    try {
         const newReaction = new reaction({
            user_id: req.user, // Assurer que le middleware d'authentification définit req.user.id
            Post_id:req.body.post_id,
            emotion_id:req.body.emotion_id,
            image:image,
            comment:req.body.comment,
        });
        await newReaction.save();
        const post = await Post.findById(req.body.post_id);
        if (post && post.user_id.toString() !== req.user) {
            sendNotification(post.user_id.toString(), {
                message: `${req.user.pseudo} a réagi à votre post`,
                post_id
            });
        }

        // Répondre à la requête
        res.status(201).json({
            message: "Réaction ajoutée avec succès",
            reaction: newReaction
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de l'ajout de la réaction" });
    }
});
// Supprimer une réaction
const deleteReaction = asyncHandler(async (req, res) => {
    const { reactionId } = req.params;

    try {
        // Trouver et supprimer la réaction
        const reactionToDelete = await reaction.findByIdAndDelete(reactionId);
        if (!reactionToDelete) {
            return res.status(404).json({ error: "Réaction non trouvée" });
        }

        res.status(200).json({ message: "Réaction supprimée avec succès" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la suppression de la réaction" });
    }
});
// Récupérer les réactions d'un post
const getReactionsForPost = asyncHandler(async (req, res) => {
    const { post_id } = req.params;

    try {
        const reactions = await reaction.find({ Post_id: post_id }
)           .populate('user_id','pseudo') // Remplacer par les informations de l'utilisateur (pseudo)
            .populate('emotion_id'); // Remplacer par le nom de l'émotion
        if (!reactions || reactions.length === 0) {
            return res.status(404).json({ message: "Aucune réaction pour ce post" });
        }

        res.status(200).json(reactions);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erreur lors de la récupération des réactions",error });
    }
});


export { addReaction,deleteReaction,getReactionsForPost };

        // Créer une nouvelle réaction
       

        // Sauvegarder la réaction dans la base de données