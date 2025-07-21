"use client";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import Link from "next/link";
import {
  Users,
  MessageSquare,
  Shield,
  Plus,
  Compass,
  Home,
} from "lucide-react";
import CreateCommunityModal from "@/components/pages/community/communityForm";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import {
  getCommunities,
  createCommunity,
  joinCommunity,
  leaveCommunity,
} from "../../../actions/communityActions";
import { getUser } from "../../../actions/userActions";
import { useRouter } from "next/navigation";

const CommunityCard = ({ community, onJoin, onLeave, currentUser }) => {
  const isMember = community.members?.includes(currentUser?._id);

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 border-black hover:border-black">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl font-bold text-black">{community.name}</span>
          {!isMember && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onJoin(community._id);
              }}
              className="border-black text-black hover:bg-black hover:text-white transition-all"
            >
              Join
            </Button>
          )}
          {currentUser && isMember && showJoinButton && (
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                onLeave(community._id);
              }}
              className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white transition-all"
            >
              Leave
            </Button>
          )}
        </CardTitle>
        <CardDescription className="text-black/60">
          {community.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-black/60">
          <div className="flex items-center gap-1">
            <Users size={16} />
            <span>{community.members?.length || 0} members</span>
          </div>
          <div className="flex items-center gap-1">
            <MessageSquare size={16} />
            <span>{community.posts?.length || 0} posts</span>
          </div>
          {community.isPrivate && (
            <div className="flex items-center gap-1 text-red-600">
              <Shield size={16} />
              <span>Private</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default function CommunityPage() {
  const [communities, setCommunities] = useState([]);
  const [user, setUser] = useState(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("explore");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      toast.message("Please login to access this page");
      router.push("/login");
    }
  }, []);

  const fetchUser = useCallback(async () => {
    const response = await getUser(localStorage.getItem("token"));
    if (response.success) {
      setUser(response.user);
    } else {
      toast.error(response.error);
    }
  }, []);

  const fetchCommunities = useCallback(async () => {
    const response = await getCommunities();
    if (response.success) {
      setCommunities(response.communities);
    } else {
      toast.error(response.error);
    }
    setLoading(false);
  }, []);

  const handleCreateCommunity = async (data) => {
    const token = localStorage.getItem("token");
    const response = await createCommunity(data, token);
    if (response.success) {
      toast.success(response.message);
      fetchCommunities();
      setIsCreateModalOpen(false);
    } else {
      toast.error(response.error);
    }
  };

  const handleJoinCommunity = async (communityId) => {
    const token = localStorage.getItem("token");
    const response = await joinCommunity(communityId, token);
    if (response.success) {
      toast.success(response.message);
      fetchCommunities();
    } else {
      toast.error(response.error);
    }
  };

  const handleLeaveCommunity = async (communityId) => {
    const token = localStorage.getItem("token");
    const response = await leaveCommunity(communityId, token);
    if (response.success) {
      toast.success(response.message);
      fetchCommunities();
    } else {
      toast.error(response.error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchCommunities();
  }, [fetchUser, fetchCommunities]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white p-12">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="space-y-4">
            <Skeleton className="h-12 w-48 mx-auto bg-black/10" />
            <Skeleton className="h-4 w-64 mx-auto bg-black/10" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 w-full bg-black/10" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  const filteredCommunities =
    activeTab === "explore"
      ? communities
      : communities.filter((c) => c.members?.includes(user?._id));

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tight text-black">
            Communities
          </h1>
          <p className="mt-2 text-black/60">
            Join communities and connect with others
          </p>
          {user && (
            <Button
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-6 bg-black text-white hover:bg-black/90 transition-colors"
              size="lg"
            >
              <Plus className="mr-2 h-4 w-4" />
              Create your own Community
            </Button>
          )}
        </div>

        <div className="flex items-center gap-4 mb-8">
          <Button
            variant={activeTab === "explore" ? "default" : "ghost"}
            onClick={() => setActiveTab("explore")}
            className={
              activeTab === "explore"
                ? "bg-black text-white hover:bg-black/90"
                : "text-black hover:bg-black/10"
            }
          >
            <Compass className="mr-2 h-4 w-4" />
            Explore
          </Button>
          <Button
            variant={activeTab === "joined" ? "default" : "ghost"}
            onClick={() => setActiveTab("joined")}
            className={
              activeTab === "joined"
                ? "bg-black text-white hover:bg-black/90"
                : "text-black hover:bg-black/10"
            }
          >
            <Home className="mr-2 h-4 w-4" />
            Your Communities
          </Button>
        </div>

        <Separator className="mb-8 bg-black/10" />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <AnimatePresence mode="wait">
            {filteredCommunities.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="col-span-full text-center py-16 text-black/60"
              >
                {activeTab === "explore"
                  ? "No communities found. Be the first to create one!"
                  : "You haven't joined any communities yet."}
              </motion.div>
            ) : (
              filteredCommunities.map((community, index) => (
                <Link href={`/community/${community._id}`} key={community._id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <CommunityCard
                      community={community}
                      onJoin={handleJoinCommunity}
                      onLeave={handleLeaveCommunity}
                      currentUser={user}
                      showJoinButton={activeTab === "explore"}
                    />
                  </motion.div>
                </Link>
              ))
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {isCreateModalOpen && (
            <CreateCommunityModal
              isOpen={isCreateModalOpen}
              onClose={() => setIsCreateModalOpen(false)}
              onSubmit={handleCreateCommunity}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
