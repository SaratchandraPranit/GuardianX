"use client";
import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { MessageSquare, User, Clock } from "lucide-react";

export default function PostCard({
  post,
  onComment,
  isCommenting,
  onCancelComment,
  onSubmitComment,
}) {
  const [commentText, setCommentText] = useState("");

  const handleCommentSubmit = () => {
    onSubmitComment(commentText);
    setCommentText("");
  };

  return (
    <Card className="bg-white border-none shadow-lg">
      <CardHeader className="space-y-2">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-[#dc2446]" />
          <span className="text-sm text-gray-600">
            {post.author?.username || "Unknown"}
          </span>
          <span className="text-gray-400">•</span>
          <Clock className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
        </div>
        <h3 className="text-xl font-semibold text-black">{post.title}</h3>
      </CardHeader>

      <CardContent>
        <p className="text-gray-700 leading-relaxed">{post.content}</p>

        <div className="mt-6 space-y-4">
          <div className="flex items-center space-x-2">
            <MessageSquare className="h-5 w-5 text-[#dc2446]" />
            <span className="font-medium text-black">
              Comments ({post.comments?.length || 0})
            </span>
          </div>

          {post.comments?.map((comment, index) => (
            <div key={index} className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-800 mb-2">{comment.comment}</p>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="h-4 w-4" />
                <span>{new Date(comment.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>

      <CardFooter className="flex flex-col items-stretch">
        {!isCommenting ? (
          <Button
            variant="outline"
            className="w-full border-[#dc2446] text-[#dc2446] hover:bg-[#dc2446] hover:text-white"
            onClick={() => onComment(post._id)}>
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Comment
          </Button>
        ) : (
          <div className="w-full space-y-4">
            <Textarea
              placeholder="Write your comment..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full min-h-[100px] border-gray-200 focus:border-[#dc2446] focus:ring-[#dc2446]"
            />
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={onCancelComment}
                className="text-gray-500 hover:text-gray-700">
                Cancel
              </Button>
              <Button
                onClick={handleCommentSubmit}
                className="bg-[#dc2446] text-white hover:bg-[#dc2446]/90">
                Post Comment
              </Button>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
