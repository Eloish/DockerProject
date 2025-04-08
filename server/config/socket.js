import { Server } from "socket.io"; // Modèle des abonnements

let io;

 const initSocket = (server) => {
    io = new Server(server, {
        cors: { origin: "*" }
    });

    io.on("connection", (socket) => {
        console.log("Un utilisateur s'est connecté :", socket.id);

        socket.on("join", (userId) => {
            socket.join(userId);
            console.log(`Utilisateur ${userId} a rejoint sa room`);
        });

        socket.on("disconnect", () => {
            console.log("Un utilisateur s'est déconnecté :", socket.id);
        });
        socket.on("error", (err) => {
            console.error("WebSocket Error:", err);
        });
    });
};


/**
 * Envoie une notification à un utilisateur ou à plusieurs utilisateurs
 * @param {string | string[]} userIds - ID(s) de l'utilisateur cible
 * @param {object} notification - Contenu de la notification
 */
 const sendNotification = (userIds, notification) => {
    if (io) {
        if (Array.isArray(userIds)) {
            userIds.forEach((userId) => io.to(userId).emit("notification", notification));
        } else {
            io.to(userIds).emit("notification", notification);
        }
    }
};
export { initSocket, sendNotification };
