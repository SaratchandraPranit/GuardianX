import mongoose from "mongoose";

const markingSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true,
  },
  markedBy: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  markType: {
    type: Number,
    default: 1,
    required: true,
  },
  location: {
    lat: {
      type: Number,
      default: 0,
      required: true,
    },
    lng: {
      type: Number,
      default: 0,
      required: true,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Markings =
  mongoose.models?.Markings || mongoose.model("Markings", markingSchema);

export default Markings;
