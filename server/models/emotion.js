import mongoose from "mongoose";
import Joi from "joi";

const emotionSchema = new mongoose.Schema({
 
  name: {
    type: String,
    required: true,
    },
    icon: {
      type: String,
      required: true
    }
});

const emotion = mongoose.model("emotion", emotionSchema);

const emotionValidationSchema = Joi.object({
  name: Joi.string().required().trim().messages({
    "string.empty": "Le nom est obligatoire",
  })
    , icon: Joi.string().required().trim().messages({
        "string.empty": "L'icone est obligatoire",
    })
});

const EmotionValidation = (data) => {
  return emotionValidationSchema.validate(data);
};

export { emotion, EmotionValidation };
