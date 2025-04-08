import mongoose from 'mongoose';
import { faker } from '@faker-js/faker'; // Importation de la bibliothèque Faker pour générer des données aléatoires
import { User } from '../models/User.js'; // Remplace par le bon chemin d'importation de ton modèle User

const MONGO_URI = 'mongodb://127.0.0.1:27017/diary'; // Assure-toi que ton URI est correct

// Connexion à MongoDB
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connecté à MongoDB');
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données:', error);
  });

// Fonction pour créer des utilisateurs factices
const generateUsers = async (numberOfUsers) => {
  const users = [];
  for (let i = 0; i < numberOfUsers; i++) {
    const user = {
      pseudo: faker.internet.userName(), // Nom d'utilisateur aléatoire
      password: faker.internet.password(), // Mot de passe aléatoire
      email: faker.internet.email(), // Email aléatoire
      avatar: faker.image.avatar(), // Avatar (URL d'image aléatoire)
      createdAt: faker.date.past(), // Date aléatoire pour la création
    };
    users.push(user);
  }

  // Insérer les utilisateurs dans la base de données
  try {
    const result = await User.insertMany(users);
    console.log(`${result.length} utilisateurs insérés avec succès.`);
    mongoose.disconnect();
  } catch (error) {
    console.error('Erreur lors de l\'insertion des utilisateurs:', error);
    mongoose.disconnect();
  }
};

// Lancer la génération et l'insertion des utilisateurs (par exemple, 10 utilisateurs)
generateUsers(10);
