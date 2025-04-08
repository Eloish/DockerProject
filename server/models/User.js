import mongoose from "mongoose";
import Joi from "joi";

const userSchema = new mongoose.Schema({
  pseudo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  avatar: {
    type: String,
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

const userValidationSchema = Joi.object({
  pseudo: Joi.string().required().trim().messages({
    "string.empty": "Le nom d'utilisateur est obligatoire",
  }),
  password: Joi.string().required().min(6).messages({
    "string.empty": "Le mot de passe est obligatoire",
    "string.min": "Le mot de passe doit contenir au moins 6 caractères",
  }),
  email: Joi.string().email().required().trim().messages({
    "string.empty": "L'email est obligatoire",
    "string.email": "L'email n'est pas valide",
  }),
  avatar: Joi.string().allow("").optional(), // Image optionnelle
});

const userValidation = (data) => {
  return userValidationSchema.validate(data);
};

export { User, userValidation };
