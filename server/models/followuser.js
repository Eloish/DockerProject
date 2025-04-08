import mongoose from "mongoose";
import Joi from "joi";
const userFollowSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
}, { timestamps: true });

const UserFollow = mongoose.model("UserFollow", userFollowSchema);

const userfollowValidationSchema = Joi.object({
  userIdToFollow: Joi.string().hex().length(24).required()
});

const FollowValidation = (data) => {
  return userfollowValidationSchema.validate(data);
};

export { UserFollow ,FollowValidation};
