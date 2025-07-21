"use server";
import dbConnect from "../utils/dbConnect";
import jwt from "jsonwebtoken";
import User from "../models/user";
import twilio from "twilio";
export async function saveSOSRecording(token, recordingUrl) {
  try {
    await dbConnect();
    const decoded = jwt.decode(token);

    const user = await User.findById(decoded.user);

    if (!user) {
      return { success: false, error: "User not found" };
    }

    user.sosrecording.push({ recordingUrl });
    await user.save();
    try {
      const twilioClient = twilio(
        process.env.NEXT_PUBLIC_ACCSID,
        process.env.NEXT_PUBLIC_AUTH_TOKEN
      );
      let msg1 = {
        to: "++917032038148",
        from: "+18317039533",
        body: `Current location is:https://maps.google.com/?q=${user.currentLocation.lat},${user.currentLocation.lng}.Current recording URL: ${recordingUrl}`,
      };
      let msg2 = {
        to: "++919392130068",
        from: "+18317039533",
        body: `Current location is:https://maps.google.com/?q=${user.currentLocation.lat},${user.currentLocation.lng}.Current recording URL: ${recordingUrl}`,
      };
      let msg3 = {
        to: "++919030989001",
        from: "+18317039533",
        body: `Current location is:https://maps.google.com/?q=${user.currentLocation.lat},${user.currentLocation.lng}.Current recording URL: ${recordingUrl}`,
      };
      try {
        const response1 = await twilioClient.messages.create(msg1);
        const response2 = await twilioClient.messages.create(msg2);
      } catch (err) {
        return {
          success: false,
          error: err.message,
        };
      }
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }

    return { success: true };
  } catch (error) {
    console.error("Error saving SOS recording URL:", error);
    return { success: false, error: "Failed to save recording URL" };
  }
}
export async function sendInitialTwilioSMS(username, lat, lng) {
  try {
    const twilioClient = twilio(
      process.env.NEXT_PUBLIC_ACCSID,
      process.env.NEXT_PUBLIC_AUTH_TOKEN
    );
    let msg1 = {
      to: "++917032038148",
      from: "+18317039533",
      body: `SOS Alert! ${username} has triggered an SOS alert. Please check on them immediately. Current location is:https://maps.google.com/?q=${lat},${lng}`,
    };
    let msg2 = {
      to: "++919392130068",
      from: "+18317039533",
      body: `SOS Alert! ${username} has triggered an SOS alert. Please check on them immediately. Current location is:https://maps.google.com/?q=${lat},${lng}`,
    };
    let msg3 = {
      to: "++919030989001",
      from: "+18317039533",
      body: `SOS Alert! ${username} has triggered an SOS alert. Please check on them immediately. Current location is:https://maps.google.com/?q=${lat},${lng}`,
    };

    try {
      const response1 = await twilioClient.messages.create(msg1);
      const response2 = await twilioClient.messages.create(msg2);
      const response3 = await twilioClient.messages.create(msg3);
      return { success: true };
    } catch (err) {
      return {
        success: false,
        error: err.message,
      };
    }
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}
