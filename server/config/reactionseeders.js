import mongoose from "mongoose";
import { reaction } from "../models/reaction.js";
import { User } from "../models/User.js";
import { Post } from "../models/Post.js";
import { emotion } from "../models/emotion.js";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";

dotenv.config();
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const seedReactions = async () => {
    try {
        // Récupérer des utilisateurs, posts et émotions existants
        const users = await User.find();
        const posts = await Post.find();
        const emotions = await emotion.find();

        if (!users.length || !posts.length || !emotions.length) {
            console.log("Erreur : Assurez-vous d'avoir des Users, Posts et Emotions en base !");
            return;
        }

        const reactions = [];

        for (let i = 0; i < 5; i++) {
            const randomUser = users[Math.floor(Math.random() * users.length)];
            const randomPost = posts[Math.floor(Math.random() * posts.length)];
            const randomEmotion = emotions[Math.floor(Math.random() * emotions.length)];

            reactions.push({
                user_id: randomUser._id,
                Post_id: randomPost._id,
                emotion_id: randomEmotion._id,
                image: randomEmotion.icon,
                comment: faker.lorem.sentence()
            });
        }

        await reaction.insertMany(reactions);
        console.log("Seeder terminé avec succès !");
        mongoose.connection.close();
    } catch (error) {
        console.error("Erreur lors de l'insertion des réactions :", error);
    }
};

seedReactions();
