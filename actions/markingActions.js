"use server";

import Markings from "../models/markings";
import dbConnect from "../utils/dbConnect";

// Fetch all markings
export async function getMarkings() {
  await dbConnect();
  try {
    const markings = await Markings.find({});
    return { success: true, data: markings };
  } catch (error) {
    return { success: false, error: "Failed to fetch markings" };
  }
}

// Create a new marking
export async function createMarking({ comment, markType, location, userId }) {
  await dbConnect();
  try {
    const newMarking = new Markings({
      comment,
      markType,
      location,
      markedBy: userId,
    });
    await newMarking.save();
    return { success: true, data: newMarking };
  } catch (error) {
    return { success: false, error: "Failed to create marking" };
  }
}
