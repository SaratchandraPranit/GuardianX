"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState, useEffect, useCallback } from "react";
import { X } from "lucide-react";
import { toast } from "sonner";

import {
  createScholarship,
  getScholarships,
} from "../../../actions/scholarshipActions";

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = useState([]);
  const [selectedScholarship, setSelectedScholarship] = useState(null);
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");

  const loadScholarships = useCallback(async () => {
    const loadedScholarships = await getScholarships();
    setScholarships(loadedScholarships);
  }, []);

  useEffect(() => {
    loadScholarships();
  }, [loadScholarships]);

  const handleTagInput = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleCreateScholarship = async (formData) => {
    try {
      formData.append("tags", JSON.stringify(tags));
      const res = await createScholarship(formData);
      setTags([]);
      loadScholarships();
      if (res.success) {
        toast.success("Scholarship created successfully");
      } else {
        toast.error("Failed to create scholarship");
      }
    } catch (err) {
      toast.error("Failed to create scholarship");
    }
  };

  return (
    <div className="container mx-auto p-4 mt-12">
      <h1 className="text-2xl font-bold mb-4">Scholarships</h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Create Scholarship</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Scholarship</DialogTitle>
            <DialogDescription>
              Fill in the details for the new scholarship opportunity.
            </DialogDescription>
          </DialogHeader>
          <form action={handleCreateScholarship}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">
                  Title
                </Label>
                <Input id="title" name="title" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="applyLink" className="text-right">
                  Apply Link
                </Label>
                <Input id="applyLink" name="applyLink" className="col-span-3" />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="deadline" className="text-right">
                  Deadline
                </Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="eligibility" className="text-right">
                  Eligibility
                </Label>
                <Textarea
                  id="eligibility"
                  name="eligibility"
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="tags" className="text-right">
                  Tags
                </Label>
                <div className="col-span-3">
                  <Input
                    id="tags"
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={handleTagInput}
                    placeholder="Type a tag and press Enter"
                    className="mb-2"
                  />
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-primary text-primary-foreground px-2 py-1 rounded-full text-sm flex items-center">
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 focus:outline-none">
                          <X size={14} />
                        </button>
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Create Scholarship</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scholarships.map((scholarship) => (
          <Card
            key={scholarship._id}
            className="cursor-pointer"
            onClick={() => setSelectedScholarship(scholarship)}>
            <CardHeader>
              <CardTitle>{scholarship.title}</CardTitle>
              <CardDescription>
                Deadline: {new Date(scholarship.deadline).toLocaleDateString()}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="line-clamp-3">{scholarship.description}</p>
            </CardContent>
            <CardFooter>
              <p className="text-sm text-muted-foreground">
                Tags: {scholarship.tags.join(", ")}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedScholarship && (
        <Dialog
          open={!!selectedScholarship}
          onOpenChange={() => setSelectedScholarship(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{selectedScholarship.title}</DialogTitle>
              <DialogDescription>
                Deadline:{" "}
                {new Date(selectedScholarship.deadline).toLocaleDateString()}
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <h3 className="font-semibold">Description:</h3>
              <p>{selectedScholarship.description}</p>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Eligibility:</h3>
              <p>{selectedScholarship.eligibility}</p>
            </div>
            <div className="mt-4">
              <h3 className="font-semibold">Tags:</h3>
              <p>{selectedScholarship.tags.join(", ")}</p>
            </div>
            <DialogFooter>
              <Button asChild>
                <a
                  href={selectedScholarship.applyLink}
                  target="_blank"
                  rel="noopener noreferrer">
                  Open Application
                </a>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
