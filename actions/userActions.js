"use server";
import dbConnect from "../utils/dbConnect";
import User from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { z } from "zod";

const signupSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters long"),
  phoneNo: z
    .string()
    .min(10, "Phone number must be at least 10 characters long"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export async function addUser({ username, password, email, phoneNo }) {
  try {
    const validatedData = signupSchema.safeParse({
      username,
      password,
      email,
      phoneNo,
    });
    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.errors.map((err) => err.message).join(", "),
      };
    }

    await dbConnect();

    const existingUser = await User.findOne({ $or: [{ email }, { phoneNo }] });
    if (existingUser) {
      return {
        success: false,
        error: "User with this email or phone number already exists",
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      password: hashedPassword,
      email,
      phoneNo,
    });

    const token = jwt.sign(
      { user: user._id.toString() },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      success: true,
      user: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
      token,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}

export async function loginUser({ type, slug, password }) {
  try {
    await dbConnect();
    let user;

    if (type === "email") {
      user = await User.findOne({ email: slug }).lean();
    } else if (type === "phoneNo") {
      user = await User.findOne({ phoneNo: slug }).lean();
    } else {
      user = await User.findOne({ username: slug }).lean();
    }

    if (!user) return { success: false, error: "User not found" };

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return { success: false, error: "Invalid credentials" };

    const token = jwt.sign(
      { user: user._id.toString() },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: "7d" }
    );

    return {
      success: true,
      user: {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
      },
      token,
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function getUser(token) {
  try {
    await dbConnect();
    const decoded = jwt.decode(token);

    let query = User.findById(decoded.user).lean();

    const userExists = await User.exists({ _id: decoded.user });
    if (userExists && userExists.wellwishers?.length > 0) {
      query = query.populate("wellwishers");
    }

    const user = await query;

    if (!user) return { success: false, error: "User not found" };

    return {
      success: true,
      user: {
        ...user,
        _id: user._id.toString(),
      },
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function createWellWisher(userId, nickname, passcode) {
  try {
    await dbConnect();
    const user = await User.findById(userId);

    if (!user) return { success: false, error: "User not found" };

    user.wellwishers.push({ nickname, passcode });
    await user.save();

    return { success: true };
  } catch (err) {
    console.error("Error saving well-wisher:", err);
    return { success: false, error: err.message };
  }
}
export async function loginWellWisher(username, passcode, nickname) {
  try {
    await dbConnect();
    const user = await User.findOne({ username });
    if (!user) return { success: false, error: "User not found" };

    const wellWisher = user.wellwishers.find(
      (w) => w.passcode === passcode && w.nickname === nickname
    );
    if (!wellWisher) return { success: false, error: "Invalid credentials" };

    const token = jwt.sign(
      { username: user.username, nickname },
      process.env.NEXT_PUBLIC_JWT_SECRET,
      { expiresIn: "7d" }
    );

    return { success: true, token };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getWellWisherData(token) {
  try {
    console.log("Token received:", token);

    if (!token || typeof token !== "string") {
      return { success: false, error: "Invalid or missing token" };
    }

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.username || !decoded.nickname) {
      return { success: false, error: "Invalid token" };
    }

    await dbConnect();
    const user = await User.findOne({ username: decoded.username });
    console.log(user);
    if (!user) return { success: false, error: "User not found" };

    const wellWisher = user.wellwishers?.find(
      (w) => w.nickname === decoded.nickname
    );
    if (!wellWisher) return { success: false, error: "Wellwisher not found" };

    return {
      success: true,
      username: user.username,
      wellWisher: JSON.parse(JSON.stringify(wellWisher)),
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
export async function updateEmailWellWisher(email, passcode, user) {
  try {
    await dbConnect();
    let curruser = await User.find({ username: user });
    curruser = curruser[0];
    console.log(curruser);

    if (!curruser) return { success: false, error: "User not found" };
    const wellWisher = curruser.wellwishers.find(
      (w) => w.passcode === passcode
    );
    console.log(wellWisher);
    if (!wellWisher) return { success: false, error: "Invalid credentials" };
    wellWisher.email = email;
    await curruser.save();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
export async function updatePhnoWellWisher(phoneNo, passcode, user) {
  try {
    await dbConnect();

    let curruser = await User.find({ username: user });
    curruser = curruser[0];
    console.log(curruser);

    if (!curruser) return { success: false, error: "User not found" };
    const wellWisher = curruser.wellwishers.find(
      (w) => w.passcode === passcode
    );
    if (!wellWisher) return { success: false, error: "Invalid credentials" };
    wellWisher.phoneNo = phoneNo;
    await curruser.save();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function updateLocationUser(lat, lng, user) {
  try {
    await dbConnect();
    let curruser = await User.find({ username: user });
    curruser = curruser[0];
    console.log(curruser);

    if (!curruser) return { success: false, error: "User not found" };
    curruser.currentLocation = { lat, lng };
    await curruser.save();
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

export async function getLocationUser(user) {
  try {
    await dbConnect();
    let curruser = await User.find({ username: user });
    curruser = curruser[0];
    console.log(curruser);

    if (!curruser) return { success: false, error: "User not found" };
    return {
      success: true,
      location: {
        lat: curruser.currentLocation.lat,
        lng: curruser.currentLocation.lng,
      },
    };
  } catch (error) {
    return { success: false, error: error.message };
  }
}
