import React from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MapPin, Calendar, Users } from "lucide-react";

export const TravelCard = ({
  travel,
  isOwner,
  onApply,
  onViewApplication,
  onViewDetails,
}) => {
  return (
    <Card className="w-full group relative overflow-hidden bg-white border border-gray-300 shadow-md hover:shadow-xl rounded-xl transition-all duration-300 ease-in-out">
      <CardHeader className="space-y-3 p-5">
        <CardTitle className="text-xl font-semibold text-gray-900">
          <div className="flex items-center justify-between">
            <span className="transition-colors duration-300">
              {travel.source} → {travel.destination}
            </span>
          </div>
        </CardTitle>
        <div className="h-1 w-20 bg-[#dc2446] rounded opacity-80" />
      </CardHeader>

      <CardContent className="space-y-4 px-5">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center space-x-2 text-gray-700">
            <Calendar className="w-5 h-5 text-[#dc2446]" />
            <span className="font-medium">{travel.date}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-700">
            <MapPin className="w-5 h-5 text-[#dc2446]" />
            <span className="font-medium">{travel.modeOfTravel}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-700">
            <Users className="w-5 h-5 text-[#dc2446]" />
            <span className="font-medium">{travel.requiredPeople} needed</span>
          </div>
        </div>
      </CardContent>

      <CardFooter className="flex gap-3 px-5 pb-5 pt-4">
        <Button
          className="flex-1 bg-[#dc2446] text-white hover:bg-white hover:text-[#dc2446] hover:border-[#dc2446] border transition-all duration-300 font-medium rounded-lg"
          onClick={isOwner ? onViewApplication : onApply}>
          {isOwner ? "View Applications" : "Apply"}
        </Button>
        <Button
          variant="outline"
          className="flex-1 border-black text-black hover:bg-black hover:text-white transition-all duration-300 font-medium rounded-lg"
          onClick={onViewDetails}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
};
