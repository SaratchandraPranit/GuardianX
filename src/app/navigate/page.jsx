"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import {
  APIProvider,
  Map,
  ControlPosition,
  MapControl,
  useMapsLibrary,
  useMap,
  AdvancedMarker,
  InfoWindow,
  Pin,
} from "@vis.gl/react-google-maps";
import { getUser, updateLocationUser } from "../../../actions/userActions";
import { getMarkings, createMarking } from "../../../actions/markingActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"; // Shadcn Button
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // Shadcn Dialog
import { Input } from "@/components/ui/input"; // Shadcn Input
import { Label } from "@/components/ui/label"; // Shadcn Label
import { useRouter } from "next/navigation";

export default function MapWithSearch() {
  const [user, setUser] = useState(null);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [showUserMarker, setShowUserMarker] = useState(true);
  const [markings, setMarkings] = useState([]);
  const [selectedMark, setSelectedMark] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // Dialog state
  const [markType, setMarkType] = useState(null); // To store the type of mark (unsafe or danger)
  const [comment, setComment] = useState(""); // To store the comment input
  const directionsRendererRef = useRef(null);
  const router = useRouter();
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      toast.message("Please login to access this page");
      router.push("/login");
    }
  }, []);

  const fetchMarkings = useCallback(async () => {
    const response = await getMarkings();
    if (response.success) {
      setMarkings(response.data);
    } else {
      toast.error("Failed to fetch security markings");
    }
  }, []);

  const fetchUser = useCallback(async () => {
    const response = await getUser(localStorage.getItem("token"));
    if (response.success) {
      setUser(response.user);
    } else {
      toast.error(response.error);
    }
    return response.user;
  }, []);

  const handleAddMarking = (type) => {
    if (!userLocation || !user) {
      toast.error("User location or user data is missing");
      return;
    }
    setMarkType(type); // Set the mark type
    setIsDialogOpen(true); // Open the dialog
  };

  const handleDialogSubmit = async () => {
    if (!comment.trim()) {
      toast.error("Please provide a comment about this place.");
      return;
    }

    const response = await createMarking({
      comment,
      markType,
      location: userLocation,
      userId: user._id,
    });

    if (response.success) {
      toast.success("Marking added successfully");
      fetchMarkings();
    } else {
      toast.error("Failed to add marking");
    }

    setIsDialogOpen(false); // Close the dialog
    setComment(""); // Reset the comment input
  };

  useEffect(() => {
    const fetchData = async () => {
      await fetchMarkings();
      const userdata = await fetchUser();
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const location = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            setUserLocation(location);
            if (userdata) {
              updateLocationUser(
                location.lat,
                location.lng,
                userdata?.username
              );
            }
          },
          (error) => {
            console.error("Error getting location:", error);
          }
        );
      }
    };
    fetchData();
  }, [fetchUser, fetchMarkings]);

  function Directions({ origin, destination }) {
    const map = useMap();
    const routesLibrary = useMapsLibrary("routes");
    const [directionsService, setDirectionsService] = useState(null);

    useEffect(() => {
      if (!routesLibrary || !map) return;
      setDirectionsService(new routesLibrary.DirectionsService());
      if (!directionsRendererRef.current) {
        directionsRendererRef.current = new routesLibrary.DirectionsRenderer({
          map,
        });
      }
    }, [routesLibrary, map]);

    useEffect(() => {
      if (
        !directionsService ||
        !directionsRendererRef.current ||
        !destination ||
        !origin
      )
        return;

      directionsService.route(
        {
          origin,
          destination,
          travelMode: google.maps.TravelMode.DRIVING,
        },
        (response, status) => {
          if (status === google.maps.DirectionsStatus.OK) {
            directionsRendererRef.current.setMap(map);
            directionsRendererRef.current.setDirections(response);
          } else {
            console.error("Directions request failed due to ", status);
          }
        }
      );
    }, [directionsService, destination, origin, map]);

    return null;
  }

  const PlaceAutocompleteClassic = ({ onPlaceSelect }) => {
    const map = useMap();
    const [placeAutocomplete, setPlaceAutocomplete] = useState();
    const inputRef = useRef(null);
    const places = useMapsLibrary("places");

    useEffect(() => {
      if (!places || !inputRef.current) return;

      const options = {
        fields: ["geometry", "name", "formatted_address"],
      };

      setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
    }, [places]);

    useEffect(() => {
      if (!placeAutocomplete) return;

      placeAutocomplete.addListener("place_changed", () => {
        const place = placeAutocomplete.getPlace();
        if (place.geometry) {
          if (directionsRendererRef.current) {
            directionsRendererRef.current.setMap(null);
          }
          onPlaceSelect(place);
          map.fitBounds(place.geometry.viewport);
          setShowUserMarker(false);
        }
      });
    }, [onPlaceSelect, placeAutocomplete]);

    return (
      <div className="bg-white p-1 rounded-lg shadow-md border border-gray-300">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search destination..."
          className="p-2 text-xl w-80 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
    );
  };

  return (
    <div className="justify-center w-full flex flex-col">
      <div className="ms-16 portrait:ms-8 mb-4 flex justify-end gap-2">
        <Button
          className="bg-yellow-500 text-white px-4 py-2 rounded-md"
          onClick={() => handleAddMarking(1)}
        >
          Mark place as unsafe
        </Button>
        <Button
          className="bg-red-500 text-white px-4 py-2 rounded-md"
          onClick={() => handleAddMarking(2)}
        >
          Mark place as Danger
        </Button>
      </div>
      <APIProvider
        apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}
        libraries={["marker"]}
      >
        <div className=" flex items-center justify-center">
          {userLocation && (
            <>
              <div className="w-[90vw] h-[80vh] rounded-xl overflow-hidden shadow-lg border border-gray-300">
                <Map
                  style={{ width: "100%", height: "100%" }}
                  defaultCenter={userLocation}
                  defaultZoom={15}
                  gestureHandling="greedy"
                  mapId="b0d1b3c3c1a5b6d1"
                >
                  {selectedPlace && (
                    <Directions
                      origin={userLocation}
                      destination={selectedPlace.geometry.location}
                    />
                  )}
                  {showUserMarker && (
                    <AdvancedMarker
                      title="current location"
                      position={userLocation}
                    />
                  )}
                  {markings.map((mark) => (
                    <AdvancedMarker
                      key={mark._id}
                      position={mark.location}
                      onClick={() => setSelectedMark(mark)}
                      title="Marked location"
                    >
                      <Pin
                        background={mark.markType === 1 ? "#f6e05e" : "#f56565"}
                        borderColor={
                          mark.markType === 1 ? "#f6e05e" : "#f56565"
                        }
                        glyphColor={"#0f677a"}
                      ></Pin>
                    </AdvancedMarker>
                  ))}
                  {selectedMark && (
                    <InfoWindow
                      position={selectedMark.location}
                      maxWidth={200}
                      onCloseClick={() => setSelectedMark(null)}
                    >
                      <div>
                        <p>
                          <span className="font-bold">Reason:</span>{" "}
                          {selectedMark.comment}
                        </p>
                        <p>
                          <span className="font-bold">Marked Date:</span>
                          {new Date(selectedMark.createdAt).toUTCString()}
                        </p>
                        <p>
                          <span className="font-bold">Remark:</span>
                          {selectedMark.markType === 1
                            ? "Not advised to go"
                            : "Danger zone"}
                        </p>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </div>
              <MapControl position={ControlPosition.TOP_RIGHT}>
                <PlaceAutocompleteClassic onPlaceSelect={setSelectedPlace} />
              </MapControl>
            </>
          )}
        </div>
      </APIProvider>

      {/* Shadcn Dialog for adding markings */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add a Marking</DialogTitle>
            <DialogDescription>
              Please provide a comment about this place stating why you are
              marking it as unsafe or dangerous.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="comment" className="text-right">
                Comment
              </Label>
              <Input
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                className="col-span-3"
                placeholder="Enter your comment..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleDialogSubmit}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
