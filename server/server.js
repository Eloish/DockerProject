// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import connectDB from "./config/db.js";
// import authMiddleware from "./middlewares/authMiddleware.js";
// import { date, monPath } from "./middlewares/middleware.js";
// import userRoutes from "./routes/userRoutes.js";
// import crypto from "crypto"; // Import du module crypto
// import fs from "fs"; // Import du module fs
// import multer from 'multer';
// dotenv.config();

// // Vérification de l'existence de JWT_SECRET et génération si nécessaire
// if (!process.env.JWT_SECRET) {
//   const secret = crypto.randomBytes(64).toString("hex");
//   process.env.JWT_SECRET = secret;
//   fs.writeFileSync(".env", `\nJWT_SECRET=${secret}\n`, { flag: "a" });
//   console.log("JWT_SECRET généré et enregistré dans .env");
// }

// connectDB();

// const app = express();
// const port = process.env.PORT;

// app.use(express.urlencoded({ extended: true }));

// app.use(express.json());

// app.use('/uploads', express.static('uploads'));
// // app.use(cors());
// app.use(monPath);
// app.use("/user", userRoutes);

// app.listen(port, () =>
//   console.log(`Le serveur est à l'écoute sur le port ${port}`)
// );


import express from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import multer from 'multer';
import cors from 'cors';
import crypto from 'crypto';
import fs from 'fs';
import authMiddleware from "./middlewares/authMiddleware.js";
import { date, monPath } from "./middlewares/middleware.js";
import userRoutes from './routes/userRoutes.js';
import http from "http";
import postroutes from './routes/postRoutes.js';
import { initSocket } from './config/socket.js';

const upload = multer();  

dotenv.config();
if (!process.env.JWT_SECRET) {
  const secret = crypto.randomBytes(64).toString("hex");
  process.env.JWT_SECRET = secret;
  fs.writeFileSync(".env", `\nJWT_SECRET=${secret}\n`, { flag: "a" });
  console.log("JWT_SECRET généré et enregistré dans .env");
}
connectDB();
const app = express();
app.use(cors({
  origin: ['http://localhost:3000', 'http://frontend:80'], // depending on where React is running
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(cors({
  origin: 'http://frontend:80',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use((req, res, next) => {
  console.log("Request from:", req.headers.origin);
  next();
});


const server = http.createServer(app);
const port = process.env.PORT;
initSocket(server);
app.use(express.json());

// Middleware for parsing application/x-www-form-urlencoded (standard form data)
app.use(express.urlencoded({ extended: true }));
// Serve static files from the "uploads" folder
app.use('/uploads', express.static('uploads'));

// app.use(cors());
app.use(monPath);
app.use("/user", userRoutes);
app.use("/post", postroutes);

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

