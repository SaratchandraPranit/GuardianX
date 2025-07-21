"use server";
import Community from "../models/community";
import User from "../models/user";
import dbConnect from "../utils/dbConnect";
import jwt from "jsonwebtoken";

export async function getCommunities() {
  try {
    await dbConnect();
    const communities = await Community.find()
      .populate("admin", "username")
      .populate("members", "username")
      .lean();

    const formattedCommunities = communities.map((community) => ({
      ...community,
      _id: community._id?.toString() || "",
      admin: community.admin
        ? {
            _id: community.admin._id?.toString() || "",
            username: community.admin.username || "Unknown",
          }
        : null,
      members: Array.isArray(community.members)
        ? community.members.map((member) => ({
            _id: member._id?.toString() || "",
            username: member.username || "Unknown",
          }))
        : [],
      posts: Array.isArray(community.posts)
        ? community.posts.map((post) => ({
            ...post,
            _id: post._id?.toString() || "",
          }))
        : [],
    }));

    return { success: true, communities: formattedCommunities };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function createCommunity(communityData, token) {
  try {
    await dbConnect();

    if (!token) {
      throw new Error("Authentication token is required");
    }

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.user) {
      throw new Error("Invalid authentication token");
    }

    const user = await User.findById(decoded.user);
    if (!user) {
      throw new Error("User not found");
    }

    const community = new Community({
      ...communityData,
      admin: user._id,
      members: [user._id],
    });

    await community.save();

    return {
      success: true,
      message: "Community created successfully!",
      community: {
        ...community.toObject(),
        _id: community._id.toString(),
        admin: {
          _id: user._id.toString(),
          username: user.username,
        },
      },
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function joinCommunity(communityId, token) {
  try {
    await dbConnect();

    if (!token) {
      throw new Error("Authentication token is required");
    }

    if (!communityId) {
      throw new Error("Community ID is required");
    }

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.user) {
      throw new Error("Invalid authentication token");
    }

    const user = await User.findById(decoded.user);
    if (!user) {
      throw new Error("User not found");
    }

    const community = await Community.findById(communityId);
    if (!community) {
      throw new Error("Community not found");
    }

    const memberIds = community.members.map((id) => id.toString());
    if (memberIds.includes(user._id.toString())) {
      throw new Error("You are already a member of this community");
    }

    community.members.push(user._id);
    await community.save();

    return {
      success: true,
      message: "Successfully joined the community!",
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}

export async function checkMember(communityId, token) {
  try {
    await dbConnect();

    // Token validation
    if (!token) {
      throw new Error("Authentication token is required");
    }

    // Decode token to get userId
    const decoded = jwt.decode(token);
    if (!decoded || !decoded.user) {
      throw new Error("Invalid authentication token");
    }

    const userId = decoded.user;

    // Find community by ID
    const community = await Community.findById(communityId);
    if (!community) {
      throw new Error("Community not found");
    }

    // Check if user is a member
    const isMember = community.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );

    if (isMember) {
      return {
        success: true,
        message: "Welcome to the community",
        isMember: true,
      };
    }

    return {
      success: false,
      message: "You are not a member of this community",
      isMember: false,
    };
  } catch (err) {
    return {
      success: false,
      error: err.message,
      isMember: false,
    };
  }
}

export async function leaveCommunity(communityId, token) {
  try {
    await dbConnect();

    if (!token) {
      throw new Error("Authentication token is required");
    }

    if (!communityId) {
      throw new Error("Community ID is required");
    }

    const decoded = jwt.decode(token);
    if (!decoded || !decoded.user) {
      throw new Error("Invalid authentication token");
    }

    const user = await User.findById(decoded.user);
    if (!user) {
      throw new Error("User not found");
    }

    const community = await Community.findById(communityId);
    if (!community) {
      throw new Error("Community not found");
    }

    const userIdStr = user._id.toString();
    const adminIdStr = community.admin.toString();

    if (userIdStr === adminIdStr) {
      throw new Error("Admin cannot leave the community");
    }

    const memberIds = community.members.map((id) => id.toString());
    if (!memberIds.includes(userIdStr)) {
      throw new Error("You are not a member of this community");
    }

    community.members = community.members.filter(
      (memberId) => memberId.toString() !== userIdStr
    );
    await community.save();

    return {
      success: true,
      message: "Successfully left the community",
    };
  } catch (err) {
    return { success: false, error: err.message };
  }
}
