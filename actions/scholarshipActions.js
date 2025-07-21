"use server";

import Scholarship from "../models/scholarship";
import dbConnect from "../utils/dbConnect";

export async function createScholarship(formData) {
  try {
    await dbConnect();

    const scholarship = {
      title: formData.get("title"),
      description: formData.get("description"),
      applyLink: formData.get("applyLink"),
      deadline: formData.get("deadline"),
      eligibility: formData.get("eligibility"),
      tags: formData
        .get("tags")
        ?.toString()
        .split(",")
        .map((tag) => tag.trim()),
    };

    await Scholarship.create(scholarship);

    return { success: true };
  } catch (err) {
    console.error("Error creating scholarship:", err);
    return { success: false, error: "Failed to create scholarship" };
  }
}

export async function getScholarships() {
  await dbConnect();
  const scholarships = await Scholarship.find().sort({ createdAt: -1 });
  return JSON.parse(JSON.stringify(scholarships));
}
