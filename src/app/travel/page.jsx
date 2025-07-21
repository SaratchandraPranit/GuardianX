"use client";

import { useEffect, useState, useCallback } from "react";
import TourDialog from "@/components/pages/tourDialog";
import {
  getTravels,
  createApplication,
  acceptApplication,
  rejectApplication,
} from "../../../actions/travelActions";
import { toast } from "sonner";
import { TravelCard } from "@/components/pages/travel/travel-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { getUser } from "../../../actions/userActions";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Page() {
  const [travels, setTravels] = useState([]);
  const [selectedTravel, setSelectedTravel] = useState(null);
  const [user, setUser] = useState(null);
  const [applyDialog, setApplyDialog] = useState(false);
  const [viewApplicationDialog, setViewApplicationDialog] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      toast.message("Please login to access this page");
      router.push("/login");
    }
  }, []);

  const fetchTravels = useCallback(async () => {
    const response = await getTravels();
    if (response.success) {
      setTravels(response.travels);
    } else {
      toast.error(response.error);
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

  async function handleApplication() {
    if (!selectedTravel) return;

    const response = await createApplication(
      selectedTravel._id,
      message,
      localStorage.getItem("token")
    );
    if (response.success) {
      toast.success(response.message);
      setApplyDialog(false);
      setSelectedTravel(null);
    } else {
      toast.error(response.error);
    }
  }

  async function acceptApplicationStatus(applicationId) {
    if (!selectedTravel) return;

    const response = await acceptApplication(selectedTravel._id, applicationId);
    if (response.success) {
      toast.success(response.message);
      setViewApplicationDialog(false);
      setSelectedTravel(null);
    } else {
      toast.error(response.error);
    }
  }

  async function rejectApplicationStatus(applicationId) {
    if (!selectedTravel) return;

    const response = await rejectApplication(selectedTravel._id, applicationId);
    if (response.success) {
      toast.success(response.message);
      setViewApplicationDialog(false);
      setSelectedTravel(null);
    } else {
      toast.error(response.error);
    }
  }

  useEffect(() => {
    fetchTravels();
    fetchUser();
  }, [fetchTravels, fetchUser]);

  return (
    <div className="container flex flex-col w-full gap-5 mx-auto py-10 portrait:py-0">
      <div className="flex flex-col  w-full bg-[#dc2446] p-6 shadow-md  items-start">
        <h1 className="text-4xl text-white font-bold">Travel Buddy</h1>
      </div>

      <TourDialog />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {travels.map((travel) => (
          <TravelCard
            key={travel._id}
            travel={travel}
            isOwner={user?._id === travel.creator._id}
            onApply={() => {
              setSelectedTravel(travel);
              setApplyDialog(true);
            }}
            onViewApplication={() => {
              setSelectedTravel(travel);
              setViewApplicationDialog(true);
            }}
            onViewDetails={() => setSelectedTravel(travel)}
          />
        ))}
      </div>

      {/* Travel Details Dialog */}
      <Dialog
        open={!!selectedTravel && !applyDialog && !viewApplicationDialog}
        onOpenChange={(open) => {
          if (!open) setSelectedTravel(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedTravel?.source} to {selectedTravel?.destination}
            </DialogTitle>
            <DialogDescription>Travel Details</DialogDescription>
          </DialogHeader>
          {selectedTravel && (
            <div className="space-y-2">
              <p>
                <strong>Date:</strong> {selectedTravel.date}
              </p>
              <p>
                <strong>Time:</strong> {selectedTravel.time}
              </p>
              <p>
                <strong>Mode of Travel:</strong> {selectedTravel.modeOfTravel}
              </p>
              <p>
                <strong>Required People:</strong>{" "}
                {selectedTravel.requiredPeople}
              </p>
              <p>
                <strong>Description:</strong> {selectedTravel.description}
              </p>
              {selectedTravel.extraInfo && (
                <p>
                  <strong>Extra Info:</strong> {selectedTravel.extraInfo}
                </p>
              )}
              <p>
                <strong>Status:</strong> {selectedTravel.status}
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Apply Dialog */}
      <Dialog
        open={applyDialog}
        onOpenChange={(open) => {
          setApplyDialog(false);
          setSelectedTravel(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Apply as Travel Buddy</DialogTitle>
          </DialogHeader>
          <Textarea
            placeholder="Enter your message to the travel buddy"
            onChange={(e) => setMessage(e.target.value)}
            value={message}
          />
          <Button onClick={handleApplication}>Apply</Button>
        </DialogContent>
      </Dialog>

      {/* View Applications Dialog */}
      <Dialog
        open={viewApplicationDialog}
        onOpenChange={(open) => {
          setViewApplicationDialog(open);
          if (!open) setSelectedTravel(null);
        }}
      >
        <DialogContent className="max-w-md p-6 rounded-lg shadow-lg">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-800">
              View Applications
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            {selectedTravel?.applications.map(
              (application) =>
                application.status !== "rejected" && (
                  <div
                    key={application._id}
                    className="border rounded-lg p-4 shadow-sm bg-gray-50"
                  >
                    <p className="text-gray-700">
                      <strong className="text-gray-900">Applicant:</strong>{" "}
                      {application.applicant.username}
                    </p>
                    <p className="text-gray-700">
                      <strong className="text-gray-900">Application:</strong>{" "}
                      {application.application}
                    </p>
                    <div className="mt-2 flex gap-2">
                      {application.status === "pending" ? (
                        <>
                          <Button
                            onClick={() =>
                              acceptApplicationStatus(application._id)
                            }
                          >
                            Accept
                          </Button>
                          <Button
                            onClick={() =>
                              rejectApplicationStatus(application._id)
                            }
                          >
                            Reject
                          </Button>
                        </>
                      ) : (
                        <Button onClick={() => router.push("/chatrooms")}>
                          Chat
                        </Button>
                      )}
                    </div>
                  </div>
                )
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
