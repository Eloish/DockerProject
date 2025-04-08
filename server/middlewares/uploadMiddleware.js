import multer from 'multer';
import path from 'path';

// Définir le stockage des fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Les fichiers seront stockés dans le dossier "uploads"
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`); // Renomme le fichier avec un timestamp
    }
});

// Filtrer les types de fichiers (autoriser uniquement les images)
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|svg/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    }
    cb(new Error('Only images (JPEG, PNG,jpg) are allowed!'));
};

// Initialiser Multer avec la configuration
const upload = multer({ storage, fileFilter });

export default upload;
