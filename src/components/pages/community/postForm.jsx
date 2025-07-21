import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Send } from "lucide-react";

export default function PostForm({ onSubmit }) {
  const [postData, setPostData] = useState({ title: "", content: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(postData);
    setPostData({ title: "", content: "" });
  };

  return (
    <Card className="bg-white border-none shadow-lg mb-8">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <h2 className="text-2xl font-semibold text-black">Create New Post</h2>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Post Title"
              value={postData.title}
              onChange={(e) =>
                setPostData({ ...postData, title: e.target.value })
              }
              className="border-gray-200 focus:border-[#dc2446] focus:ring-[#dc2446]"
              required
            />
          </div>
          <div>
            <Textarea
              placeholder="What's on your mind?"
              value={postData.content}
              onChange={(e) =>
                setPostData({ ...postData, content: e.target.value })
              }
              className="min-h-[150px] border-gray-200 focus:border-[#dc2446] focus:ring-[#dc2446]"
              required
            />
          </div>
        </CardContent>

        <CardFooter>
          <Button
            type="submit"
            className="w-full bg-[#dc2446] text-white hover:bg-[#dc2446]/90">
            <Send className="h-4 w-4 mr-2" />
            Create Post
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
