import mongoose from 'mongoose'; 
import Joi from 'joi'; 


const postSchema = new mongoose.Schema({
  user_id: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  content: { 
    type: String, 
    required: true,
    maxlength: 1000  
  },
  media: { 
    type: String, 
    required: false, 
  },

  tags: [
    { 
      type: String,  
      trim: true     
    }
  ],
  
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

const hashtagSchema = Joi.array().items(Joi.string().pattern(/^#\w+$/).message('Les hashtags doivent commencer par "#" et ne contenir que des lettres, des chiffres et des underscores')).max(10);

const postValidation = Joi.object({
  user_id: Joi.string().required(), 
  content: Joi.string().max(1000).required(), 
  media: Joi.string().uri().optional(), 
  tags: hashtagSchema.optional()  
});

const Post = mongoose.model('Post', postSchema)
export { Post, postValidation };
