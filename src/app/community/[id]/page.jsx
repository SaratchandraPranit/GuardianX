"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  getAllPosts,
  createPost,
  createComment,
} from "@/../actions/communityPostActions";
import { checkMember } from "@/../actions/communityActions";
import { getUser } from "@/../actions/userActions";
import { toast } from "sonner";
import PostCard from "@/components/pages/community/postCard";
import PostForm from "@/components/pages/community/postForm";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent } from "@/components/ui/card";

function CommunityPage() {
  const params = useParams();
  const communityId = params.id;

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [isMember, setIsMember] = useState(false);
  const [activePostId, setActivePostId] = useState(null);

  const fetchUser = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      const response = await getUser(token);
      if (response.success) {
        setUser(response.user);
        const validate = await checkMember(communityId, token);

        if (validate.success) {
          toast.success("Welcome to the community");
          setIsMember(true);
        } else {
          toast.info("You are not a member of this community");
        }
      } else {
        toast.error(response.error);
      }
    }
    setLoading(false);
  };

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const response = await getAllPosts(communityId);
      if (response.success) {
        setPosts(response.posts || []);
      } else {
        toast.error(response.error || "Failed to fetch posts");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      toast.error("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (communityId) {
      fetchUser();
      fetchPosts();
    }
  }, [communityId]);

  const handleCreatePost = async (postData) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to create a post");
      return;
    }

    if (!isMember) {
      toast.error("You must be a member of this community to create posts");
      return;
    }

    try {
      const response = await createPost(communityId, postData, token);
      if (response.success) {
        toast.success("Post created successfully!");
        fetchPosts();
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error("Failed to create post");
    }
  };

  const handleComment = (postId) => {
    setActivePostId(postId);
  };

  const handleCancelComment = () => {
    setActivePostId(null);
  };

  const handleSubmitComment = async (postId, commentText) => {
    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Please login to comment");
      return;
    }

    if (!isMember) {
      toast.error("You must be a member of this community to comment");
      return;
    }

    if (!commentText || commentText.trim() === "") {
      toast.error("Comment cannot be empty");
      return;
    }

    try {
      console.log("Submitting comment:", commentText); // Debugging
      const response = await createComment(postId, commentText.trim(), token);
      if (response.success) {
        toast.success("Comment posted successfully!");
        fetchPosts(); // Refresh comments
        setActivePostId(null);
      } else {
        toast.error(response.error);
      }
    } catch (error) {
      toast.error("Failed to post comment");
    }
  };

  if (loading) {
    return (
      <div className="p-4 text-center">
        <div className="animate-pulse">Loading posts...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      {isMember ? (
        <PostForm onSubmit={handleCreatePost} />
      ) : (
        <Alert className="mb-8 border-[#dc2446] bg-white">
          <AlertDescription className="text-black">
            Join this community to create posts and participate in discussions!
          </AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {Array.isArray(posts) && posts.length > 0 ? (
          posts.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onComment={handleComment}
              isCommenting={activePostId === post._id}
              onCancelComment={handleCancelComment}
              onSubmitComment={(commentText) =>
                handleSubmitComment(post._id, commentText)
              }
            />
          ))
        ) : (
          <Card className="bg-white">
            <CardContent className="flex flex-col items-center justify-center p-12">
              <p className="text-lg text-gray-500">
                No posts in this community yet. Be the first to create one!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

export default CommunityPage;
