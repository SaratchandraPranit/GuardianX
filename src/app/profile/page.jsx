"use client";
import React, { useEffect, useState } from "react";
import { getUser, createWellWisher } from "../../../actions/userActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [nickname, setNickname] = useState("");
  const [passcode, setPasscode] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      toast.message("Please login to access this page");
      router.push("/login");
    }
  }, []);

  async function fetchUser() {
    try {
      const response = await getUser(localStorage.getItem("token"));
      if (response.success) {
        setUser(response.user);
      } else {
        toast.error(response.error || "Failed to fetch user");
      }
    } catch (err) {
      toast.error("Error fetching user");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUser();
  }, []);

  const generatePasscode = () => {
    const randomCode = Math.floor(100000 + Math.random() * 900000).toString();
    setPasscode(randomCode);
  };

  const handleCreateWellWisher = async () => {
    if (!nickname) {
      toast.error("Nickname is required");
      return;
    }
    const userId = user._id;
    try {
      const response = await createWellWisher(userId, nickname, passcode);
      if (response.success) {
        toast.success("Wellwisher created successfully");
        fetchUser();
        setNickname("");
        setPasscode("");
        setIsOpen(false);
      } else {
        toast.error(response.error || "Failed to create wellwisher");
      }
    } catch (err) {
      toast.error("Error creating wellwisher");
    }
  };

  async function logoutApp() {
    try {
      localStorage.removeItem("token");
      router.push("/login");
      toast.message("Logged out successfully");
    } catch (err) {
      toast.error("Error logging out");
    }
  }

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">Loading...</div>
      </div>
    );

  if (!user)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-lg">User not found</div>
      </div>
    );

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header Section */}
        <div className="border-b border-red-600/20 pb-6">
          <h2 className="text-3xl font-bold">User Profile</h2>
        </div>

        {/* User Info Section */}
        <div className="border border-zinc-800 rounded-lg p-6  backdrop-blur">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2 border-r border-zinc-800 pr-4">
              <p className="text-zinc-400">Username</p>
              <p className="font-semibold">{user.username}</p>
            </div>
            <div className="space-y-2">
              <p className="text-zinc-400">Email</p>
              <p className="font-semibold">{user.email}</p>
            </div>
            <div className="space-y-2 border-r border-zinc-800 pr-4">
              <p className="text-zinc-400">Phone No</p>
              <p className="font-semibold">{user.phoneNo}</p>
            </div>
            <div className="space-y-2">
              <p className="text-zinc-400">Message Rooms</p>
              <p className="font-semibold">{user.messageRooms.length}</p>
            </div>
          </div>
        </div>

        {/* Wellwishers Section */}
        <div className="border border-zinc-800 rounded-lg p-6  backdrop-blur">
          <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
            <h3 className="text-xl font-semibold">Wellwishers</h3>
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
              <DialogTrigger asChild>
                <Button
                  onClick={(e) => {
                    setIsOpen(true);
                    generatePasscode();
                  }}
                  className="bg-black text-white hover:bg-black/90">
                  Add Wellwisher
                </Button>
              </DialogTrigger>
              <DialogContent className="border border-red-600/20 ">
                <DialogHeader>
                  <DialogTitle>Add a Wellwisher</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter nickname"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="border-zinc-700"
                  />
                  <p>
                    <span className="text-zinc-400">Generated Passcode:</span>{" "}
                    <span className="text-red-500 font-mono">
                      {passcode || "Click to generate"}
                    </span>
                  </p>
                </div>
                <DialogFooter>
                  <Button
                    onClick={handleCreateWellWisher}
                    className="bg-red-600 hover:bg-red-700">
                    Create Wellwisher
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          {user.wellwishers && user.wellwishers.length > 0 ? (
            <div className="space-y-3">
              {user.wellwishers.map((wellwisher, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-4 border border-zinc-800/50 rounded-lg hover:border-zinc-700 transition-colors">
                  <span className="font-semibold">{wellwisher.nickname}</span>
                  <span className="text-red-500 font-mono">
                    {wellwisher.passcode}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-zinc-400 text-center py-8 border border-dashed border-zinc-800 rounded-lg">
              No wellwishers added yet.
            </p>
          )}
        </div>

        {/* Logout Section */}
        <div className="flex justify-endpt-4">
          <Button
            onClick={logoutApp}
            className="bg-[#dd0000]  mb-24  hover:bg-[#cc0000]">
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
