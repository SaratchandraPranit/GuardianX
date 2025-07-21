"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";

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
import { createTravel } from "../../../actions/travelActions";
// import { AwesomeButton } from "react-awesome-button";
// import "react-awesome-button/dist/styles.css";

import { toast } from "sonner";
export default function TourDialog() {
  const [isOpen, setIsOpen] = useState(false);

  const [tourForm, setTourForm] = useState({
    source: "",
    destination: "",
    date: "",
    time: "",
    modeOfTravel: "",
    requiredPeople: "",
    description: "",
    extraInfo: "",
  });

  const openDialog = () => setIsOpen(true);

  const closeDialog = () => setIsOpen(false);

  const handleSubmit = async () => {
    const response = await createTravel(
      tourForm,
      localStorage.getItem("token")
    );
    if (response.success) {
      toast.success("Trip created successfully");
      closeDialog();
    } else {
      toast.error(response.error);
      console.log(response.error);
    }
  };

  const handleChange = (e) => {
    setTourForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="flex justify-end">
      <Button className="p-5 px-8 mx-5" onClick={openDialog}>
        Create Trip
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Trip</DialogTitle>
            <DialogDescription>
              Fill in the trip details. Make sure all fields are filled before
              submitting.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="source" className="text-right">
                Source
              </Label>
              <Input
                id="source"
                placeholder="Enter the source"
                className="col-span-3"
                name="source"
                value={tourForm.source}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="destination" className="text-right">
                Destination
              </Label>
              <Input
                id="destination"
                placeholder="Enter the destination"
                className="col-span-3"
                name="destination"
                value={tourForm.destination}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="date" className="text-right">
                Date
              </Label>
              <Input
                type="date"
                id="date"
                className="col-span-3"
                name="date"
                value={tourForm.date}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="time" className="text-right">
                Time
              </Label>
              <Input
                type="time"
                id="time"
                className="col-span-3"
                name="time"
                value={tourForm.time}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="modeOfTravel" className="text-right">
                Mode of Travel
              </Label>
              <Input
                id="modeOfTravel"
                placeholder="Enter the mode of travel"
                className="col-span-3"
                name="modeOfTravel"
                value={tourForm.modeOfTravel}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="requiredPeople" className="text-right">
                Required People
              </Label>
              <Input
                type="number"
                id="requiredPeople"
                className="col-span-3"
                name="requiredPeople"
                value={tourForm.requiredPeople}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                placeholder="Enter a brief description of the trip"
                className="col-span-3"
                name="description"
                value={tourForm.description}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="extraInfo" className="text-right">
                Extra Information (Optional)
              </Label>
              <Textarea
                id="extraInfo"
                placeholder="Additional information (if any)"
                className="col-span-3"
                name="extraInfo"
                value={tourForm.extraInfo}
                onChange={handleChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleSubmit}>
              Create Trip
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
