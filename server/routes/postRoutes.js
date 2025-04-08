import express from 'express';
import { getPosts,addPost,checkPost,deletePost,searchPosts,getuserPosts } from '../controllers/postController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import upload from '../middlewares/uploadMiddleware.js';
import { addReaction, deleteReaction, getReactionsForPost } from '../controllers/reactioncontroller.js';
const router = express.Router();

router.get('/posts', authMiddleware, getPosts);
router.post('/post', authMiddleware, upload.single('media'), addPost);
router.get('/search', authMiddleware, searchPosts);
router.get('/post/:id', authMiddleware, checkPost);
router.delete('/post/:id', authMiddleware, deletePost);

router.post('/Addreaction', authMiddleware,upload.single('image'), addReaction);

// Route pour supprimer une réaction
router.delete('/reaction/:reactionId', authMiddleware, deleteReaction);
router.get('/Myposts', getuserPosts);
// Route pour récupérer les réactions d'un post
router.get('/reactions/:post_id', getReactionsForPost);

export default router;