"use server";
import Community from "../models/community";
import CommunityPost from "../models/communityPost";
import User from "../models/user";
import dbConnect from "../utils/dbConnect";
import jwt from "jsonwebtoken";

export async function getAllPosts(communityId) {
  try {
    await dbConnect();

    const communityPosts = await CommunityPost.find({
      community: communityId,
    })
      .populate([
        {
          path: "author",
          select: "username _id",
        },
        {
          path: "comments.user",
          select: "username _id",
        },
      ])
      .sort({ createdAt: -1 }); // Corrected sorting

    if (!communityPosts || communityPosts.length === 0) {
      throw new Error("No posts found for this community");
    }

    const transformedPosts = communityPosts.map((post) => ({
      _id: post._id.toString(),
      title: post.title,
      content: post.content,
      author: {
        _id: post.author?._id.toString(),
        username: post.author?.username || "Unknown",
      },
      comments: post.comments?.map((comment) => ({
        _id: comment._id.toString(),
        comment: comment.comment,
        user: {
          _id: comment.user?._id.toString(),
          username: comment.user?.username || "Unknown",
        },
        createdAt: comment.createdAt,
      })),
      createdAt: post.createdAt,
    }));

    return { success: true, posts: transformedPosts };
  } catch (err) {
    console.error("Error in getAllPosts:", err);
    return { success: false, error: err.message };
  }
}

export async function createPost(communityId, postData, token) {
  try {
    await dbConnect();

    if (!token) {
      throw new Error("Authentication token is required");
    }

    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    const user = await User.findById(decoded.user);
    if (!user) {
      throw new Error("User not found");
    }

    const community = await Community.findById(communityId);
    if (!community) {
      throw new Error("Community not found");
    }

    const post = new CommunityPost({
      title: postData.title,
      content: postData.content,
      author: user._id,
      community: communityId,
      comments: [],
    });

    await post.save();

    if (!community.posts) {
      community.posts = [];
    }
    community.posts.push(post._id);
    await community.save();

    return {
      success: true,
      message: "Post created successfully!",
      post: {
        _id: post._id.toString(),
        title: post.title,
        content: post.content,
        author: {
          _id: user._id.toString(),
          username: user.username,
        },
        comments: [],
        createdAt: post.createdAt,
      },
    };
  } catch (err) {
    console.error("Error in createPost:", err);
    return { success: false, error: err.message };
  }
}

export async function createComment(postId, newComment, token) {
  try {
    await dbConnect();

    if (!token) {
      throw new Error("Authentication token is required");
    }

    if (!postId) {
      throw new Error("Post ID is required");
    }

    if (
      !newComment ||
      typeof newComment !== "string" ||
      newComment.trim() === ""
    ) {
      throw new Error("Comment text is required");
    }

    const decoded = jwt.verify(token, process.env.NEXT_PUBLIC_JWT_SECRET);
    if (!decoded || !decoded.user) {
      throw new Error("Invalid authentication token");
    }

    const user = await User.findById(decoded.user);
    if (!user) {
      throw new Error("User not found");
    }

    const post = await CommunityPost.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }

    const commentToAdd = {
      user: user._id,
      comment: newComment.trim(),
      createdAt: new Date(),
    };

    post.comments.push(commentToAdd);
    await post.save();

    return {
      success: true,
      message: "Comment posted successfully!",
    };
  } catch (err) {
    console.error("Error in createComment:", err);
    return { success: false, error: err.message };
  }
}
