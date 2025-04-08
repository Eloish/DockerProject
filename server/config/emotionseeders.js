import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { emotion } from "../models/emotion.js"; // Assure-toi que le chemin est correct

// Connexion à MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/diary", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connexion à MongoDB réussie"))
  .catch((err) => console.error(" Erreur de connexion à MongoDB :", err));

// Liste des émotions avec les émojis correspondants
const emotionNames = [
  { name: "happy", icon: "😄" },
  { name: "angry", icon: "😡" },
  { name: "neutral", icon: "😐" },
  { name: "surprise", icon: "😯" },
  { name: "sad", icon: "😢" },
  { name: "fear", icon: "😨" },
  { name: "disgust", icon: "🤢" }
];

const seedEmotions = async () => {
  try {
    await emotion.deleteMany(); // Supprime les anciennes données pour éviter les doublons

    // Utilisation de la liste des émotions pour insérer avec les émojis correspondants
    const emotions = emotionNames.map((emotion) => ({
      name: emotion.name,
      icon: emotion.icon, // Utilisation de l'émoji spécifique
    }));

    await emotion.insertMany(emotions);
    console.log("Emotions insérées avec succès !");
  } catch (error) {
    console.error("Erreur lors de l'insertion des émotions :", error);
  } finally {
    mongoose.connection.close(); // Ferme la connexion après insertion
  }
};

// Exécuter le script
seedEmotions();
