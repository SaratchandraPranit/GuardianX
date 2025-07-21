"use client";
import React from "react";
import { Users, MessageSquare, Shield } from "lucide-react";

export default function CommunityCard({
  community,
  onJoin,
  onLeave,
  currentUser,
}) {
  if (!community) return null;

  const isMember =
    currentUser &&
    community.members?.some((member) => member._id === currentUser._id);
  const isAdmin = currentUser && community.admin?._id === currentUser._id;

  return (
    <div className="group border border-neutral-200 p-6 bg-white hover:border-black transition-colors">
      <h3 className="text-xl font-medium text-black">{community.name}</h3>
      <p className="text-neutral-600 mt-2 text-sm">{community.description}</p>

      <div className="mt-6 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-sm text-neutral-600">
            <Users size={16} />
            <span>{community.members?.length || 0}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-neutral-600">
            <MessageSquare size={16} />
            <span>{community.posts?.length || 0}</span>
          </div>
          {isAdmin && (
            <div className="flex items-center space-x-1 text-sm text-[#dc2446]">
              <Shield size={16} />
              <span>Admin</span>
            </div>
          )}
        </div>
        {currentUser && !isAdmin && (
          <button
            onClick={(e) => {
              e.preventDefault();
              if (!community._id) return;
              isMember ? onLeave(community._id) : onJoin(community._id);
            }}
            className={`px-4 py-2 text-sm font-medium transition-colors ${
              isMember
                ? "bg-[#dc2446] text-white hover:bg-[#b51e3a]"
                : "bg-black text-white hover:bg-neutral-900"
            }`}>
            {isMember ? "Leave" : "Join"} Community
          </button>
        )}
      </div>
    </div>
  );
}
