import mongoose from "mongoose";

const scholarshipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  applyLink: {
    type: String,
    required: true,
  },
  deadline: {
    type: Date,
    required: true,
  },
  eligibility: {
    type: String,
    required: true,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  tags: {
    type: [String],
  },
});

const Scholarship =
  mongoose.models?.Scholarship ||
  mongoose.model("Scholarship", scholarshipSchema);

export default Scholarship;
