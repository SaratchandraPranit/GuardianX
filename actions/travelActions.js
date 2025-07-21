"use server";
import Travel from "../models/travel";
import User from "../models/user";
import dbConnect from "../utils/dbConnect";
import jwt from "jsonwebtoken";
import MessageRoom from "../models/messageRoom";
export async function createTravel(travelData, token) {
  try {
    await dbConnect();

    const travel = new Travel(travelData);
    const decoded = jwt.decode(token);
    const user = await User.findById(decoded.user);

    travel.creator = user._id;
    const chatRoom = await MessageRoom.create({
      title: `${travel.source}-${travel.destination}`,
    });
    chatRoom.participants.push(user._id);
    travel.chatRoom = chatRoom._id;
    user.messageRooms.push(chatRoom._id);
    await chatRoom.save();
    await travel.save();
    await user.save();

    return {
      success: true,
      message: "Travel created successfully!",
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getTravels() {
  try {
    await dbConnect();
    const travels = await Travel.find()
      .populate("creator", "username")
      .populate("applications.applicant", "username")
      .lean();

    const formattedTravels = travels.map((travel) => ({
      ...travel,
      _id: travel._id.toString(),
      creator: {
        _id: travel.creator?._id.toString(),
        username: travel.creator?.username || "Unknown",
      },
      applications: travel.applications.map((app) => ({
        _id: app._id.toString(),
        applicant: {
          _id: app.applicant?._id.toString(),
          username: app.applicant?.username || "Unknown",
        },
        application: app.application,
        status: app.status,
      })),
    }));

    return { success: true, travels: formattedTravels };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function createApplication(travelId, message, token) {
  try {
    await dbConnect();
    const decoded = jwt.decode(token);
    const travel = await Travel.findById(travelId);

    travel.applications.push({
      applicant: decoded.user,
      application: message,
    });

    await travel.save();

    return {
      success: true,
      message: "Application submitted! The creator will be notified.",
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
export async function acceptApplication(travelId, applicationId) {
  try {
    await dbConnect();

    const travel = await Travel.findById(travelId).populate(
      "applications.applicant"
    );
    if (!travel) throw new Error("Travel not found");

    const application = travel.applications.find(
      (app) => app._id.toString() === applicationId
    );
    if (!application) throw new Error("Application not found");

    application.set("status", "accepted");
    await travel.save();

    const messageRoom = await MessageRoom.findById(travel.chatRoom);
    if (!messageRoom.participants.includes(application.applicant)) {
      messageRoom.participants.push(application.applicant);
      const user = await User.findById(application.applicant);
      user.messageRooms.push(messageRoom._id);
      await user.save();
    }

    await messageRoom.save();

    return {
      success: true,
      message: "Application accepted!",
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function rejectApplication(travelId, applicationId) {
  try {
    await dbConnect();
    const travel = await Travel.findById(travelId);
    if (!travel) throw new Error("Travel not found");

    const application = travel.applications.find(
      (app) => app._id.toString() === applicationId
    );
    if (!application) throw new Error("Application not found");

    application.status = "rejected";
    await travel.save();

    return {
      success: true,
      message: "Application rejected!",
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
