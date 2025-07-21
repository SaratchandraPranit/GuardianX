"use server";
import jwt from "jsonwebtoken";
import MessageRoom from "../models/messageRoom";
import User from "../models/user";
import dbConnect from "../utils/dbConnect";

// Helper function to convert Mongoose document to plain object
function toPlainObject(doc) {
  return doc ? JSON.parse(JSON.stringify(doc)) : null;
}

export async function fetchUserRooms(token) {
  try {
    await dbConnect();
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.user) throw new Error("Invalid token");

    const userId = decoded.user;
    const user = toPlainObject(
      await User.findById(userId).populate("messageRooms")
    );
    if (!user) throw new Error("User not found");

    const rooms = toPlainObject(
      await MessageRoom.find({ _id: { $in: user.messageRooms } }).populate({
        path: "participants",
        select: "username _id",
      })
    );

    const formattedRooms = rooms.map((room) => ({
      title: room.title,
      participantCount: room.participants.length,
      participants: room.participants.map((p) => ({
        id: p._id.toString(),
        username: p.username,
      })),
      roomId: room._id.toString(),
    }));

    return formattedRooms;
  } catch (error) {
    console.error("Error fetching user rooms:", error);
    return [];
  }
}

export async function fetchMessages(roomId) {
  try {
    await dbConnect();
    const room = toPlainObject(
      await MessageRoom.findById(roomId).populate("messages.sender", "username")
    );

    if (!room) throw new Error("Room not found");

    return room.messages.map((msg) => ({
      sender: msg.sender._id.toString(),
      username: msg.sender.username,
      message: msg.message,
      time: msg.time,
    }));
  } catch (err) {
    console.error("Error fetching messages:", err);
    return [];
  }
}

export async function sendMessage(roomId, message, token) {
  try {
    await dbConnect();
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.user) throw new Error("Invalid token");

    const user = await User.findById(decoded.user);
    if (!user) throw new Error("User not found");

    const room = await MessageRoom.findById(roomId);
    if (!room) throw new Error("Chat room not found");

    room.messages.push({
      sender: user._id.toString(),
      message: message,
      time: new Date().toISOString(),
    });

    await room.save();
    return {
      message: "Message sent successfully",
      success: true,
    };
  } catch (err) {
    console.error("Error sending message:", err);
    return {
      message: "Error sending message",
      success: false,
    };
  }
}

export async function getRoomDetails(roomId) {
  try {
    await dbConnect();
    const room = toPlainObject(
      await MessageRoom.findById(roomId).populate("participants", "username")
    );

    if (!room) throw new Error("Room not found");

    return {
      success: true,
      room: {
        roomId: room._id.toString(),
        participants: room.participants.map((p) => ({
          id: p._id.toString(),
          username: p.username,
        })),
        title: room.title,
      },
    };
  } catch (err) {
    console.error("Error fetching room details:", err);
    return { success: false, error: err.message };
  }
}
