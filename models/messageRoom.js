import mongoose from "mongoose";

const messageRoomSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  ],
  messages: [
    {
      sender: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
      },
      message: {
        type: String,
        required: true,
      },
      time: {
        type: String,
        required: true,
      },
    },
  ],
  title: {
    type: String,
    required: true,
  },
});
const MessageRoom =
  mongoose.models?.MessageRoom ||
  mongoose.model("MessageRoom", messageRoomSchema);
export default MessageRoom;
