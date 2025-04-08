import mongoose from 'mongoose';
import { User } from '../models/User.js'; // Assure-toi que le chemin est correct
import { Post } from '../models/Post.js'; // Assure-toi que le chemin est correct
import { faker } from '@faker-js/faker';

const seedPosts = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect('mongodb://127.0.0.1:27017/diary', { useNewUrlParser: true, useUnifiedTopology: true });

    // Récupérer tous les utilisateurs de la base de données
    const users = await User.find();

    if (users.length === 0) {
      console.log('Aucun utilisateur trouvé dans la base de données.');
      return;
    }

    // Supprimer les anciennes publications pour éviter les doublons
    await Post.deleteMany({});

    // Générer des posts fictifs
    const posts = [];

    for (let i = 0; i < 20; i++) { 
      const randomUser = users[Math.floor(Math.random() * users.length)]; 

      const post = {
        user_id: randomUser._id, 
        content: faker.lorem.paragraphs(1), 
        media: faker.image.personPortrait(),
        tags: Array.from({ length: faker.number.int({ min: 1, max: 5 }) }, () => `#${faker.hacker.noun()}`), // Générer entre 1 et 5 hashtags
      };

      posts.push(post);
    }

    await Post.insertMany(posts);

    console.log('Les posts ont été insérés avec succès!');
    mongoose.connection.close();
  } catch (error) {
    console.error('Erreur lors de l\'insertion des posts:', error);
    mongoose.connection.close();
  }
};

// Exécution du seeder
seedPosts();
