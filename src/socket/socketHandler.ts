import { Server as HttpServer } from "http";
import { Server, Socket } from "socket.io";
import { User } from "../models/userModel";
import { Room } from "../models/roomModel";
import { Message } from "../models/messageModel";

interface ISendMessagePayload {
  roomName: string;
  username: string;
  messageText: string;
}

export const initSocket = (server: HttpServer): Server => {
  const io = new Server(server, { cors: { origin: "*" } });

  io.on("connection", (socket: Socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on("join_room", (roomName: string) => {
      socket.join(roomName);
      console.log(`Socket joined room: ${roomName}`);
    });

    socket.on("send_message", async (data: ISendMessagePayload) => {
      const { roomName, username, messageText } = data;

      try {
        let room = await Room.findOne({ name: roomName });
        if (!room) room = await Room.create({ name: roomName });

        let user = await User.findOne({ username });
        if (!user) user = await User.create({ username });

        const newMessage = await Message.create({
          room: room._id,
          sender: user._id,
          messageText,
        });

        const broadcastPayload = {
          id: newMessage._id,
          messageText: newMessage.messageText,
          createdAt: newMessage.createdAt,
          sender: { username: user.username },
        };

        io.to(roomName).emit("receive_message", broadcastPayload);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected.");
    });
  });

  return io;
};