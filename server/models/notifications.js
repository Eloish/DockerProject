import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    recipient: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }, // La personne qui reçoit la notification
    sender: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }, // La personne qui a déclenché l'action
    type: { 
        type: String, 
        enum: ["post", "reaction", "follow"], 
        required: true 
    }, // Type de notification
    post_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Post", 
        required: false 
    }, // Optionnel : ID du post concerné
    is_read: { 
        type: Boolean, 
        default: false 
    }, // Marquer si la notification a été lue
    createdAt: { 
        type: Date, 
        default: Date.now 
    } // Date de création
});

const Notification = mongoose.model("Notification", notificationSchema);
export { Notification };
