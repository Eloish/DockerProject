import mongoose from "mongoose";
import Joi from "joi";

const reactionSchema = new mongoose.Schema({
 
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
    , Post_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Post',
        required: true
    }
    , emotion_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'emotion',
        required: true
    },
    image: {
      type: String,
      required: false
    },
    comment: {
      type: String,
      required: false
    }

    });

const reaction = mongoose.model("reaction", reactionSchema);

// const reactionValidationSchema = Joi.object({
//   name: Joi.string().required().trim().messages({
//     "string.empty": "Le nom d'utilisateur est obligatoire",
//   })
// });

// const reactionValidation = (data) => {
//   return reactionValidationSchema.validate(data);
// };

export { reaction};
