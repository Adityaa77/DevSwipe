const socket = require("socket.io");
const crypto = require("crypto");
const { Chat } = require("../models/Chat");

// Generate a secret room ID (same for both users)
const getSecretRoomId = (userId, targetUserId) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("$"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = socket(server, {
    cors: {
      origin: "http://localhost:5173",
    },
  });

  io.on("connection", (socket) => {
    // User joins a private chat room
    socket.on("joinChat", ({ Name, userId, targetUserId }) => {
      const roomId = getSecretRoomId(userId, targetUserId);
      console.log(`${Name} joined Room: ${roomId}`);
      socket.join(roomId);
    });

    // When user sends a message
    socket.on(
      "sendMessage",
      async ({ Name, LastName, userId, targetUserId, text }) => {
        try {
          const roomId = getSecretRoomId(userId, targetUserId);
          console.log(`${Name}: ${text}`);

          // Find existing chat between the two users
          let chat = await Chat.findOne({
            participants: { $all: [userId, targetUserId] },
          });

          // Create new chat if not found
          if (!chat) {
            chat = new Chat({
              participants: [userId, targetUserId],
              messages: [],
            });
          }

          // Push the new message
          chat.messages.push({
            senderId: userId,
            text,
          });

          await chat.save();

          // Emit message to both participants
          io.to(roomId).emit("messageReceived", {
            Name,
            LastName,
            text,
          });
        } catch (err) {
          console.log(err);
        }
      }
    );

    socket.on("disconnect", () => {});
  });
};

module.exports = initializeSocket;
