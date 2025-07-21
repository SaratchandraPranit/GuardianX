"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  getLocationUser,
  getWellWisherData,
  updateEmailWellWisher,
  updatePhnoWellWisher,
} from "../../../actions/userActions";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  APIProvider,
  Map,
  Marker,
  useMapsLibrary,
} from "@vis.gl/react-google-maps";

const Page = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [wellwisher, setWellwisher] = useState(null);
  const [email, setEmail] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [editEmail, setEditEmail] = useState(false);
  const [editPhone, setEditPhone] = useState(false);
  const [location, setLocation] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);
  const [duration, setDuration] = useState(null);
  const [eta, setEta] = useState(null);
  const fetched = useRef(false);
  const mapsLibrary = useMapsLibrary("routes");

  async function fetchWellWisherData() {
    const token = localStorage.getItem("wellwisher");

    if (!token) {
      toast.error("No authentication token found.");
      return;
    }

    setLoading(true);
    try {
      const res = await getWellWisherData(token);
      const passengerLocation = await getLocationUser(res.username);
      setLocation(passengerLocation.location);

      if (res.success) {
        setUser(res.username);
        setWellwisher(res.wellWisher);
        setEmail(res.wellWisher.email || "");
        setPhoneNo(res.wellWisher.phoneNo || "");
        toast.message("Data fetched successfully.");

        // Get current location
        navigator.geolocation.getCurrentPosition((position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        });
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchDistanceAndTime() {
    const service = new google.maps.DistanceMatrixService();

    service.getDistanceMatrix(
      {
        origins: [{ lat: userLocation.lat, lng: userLocation.lng }],
        destinations: [{ lat: location.lat, lng: location.lng }],
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (response, status) => {
        if (status === "OK") {
          const result = response.rows[0].elements[0];
          setDistance(result.distance.text);
          setDuration(result.duration.text);

          const etaTime = new Date();
          etaTime.setSeconds(etaTime.getSeconds() + result.duration.value);
          setEta(etaTime.toLocaleTimeString());
        } else {
          console.error("Error fetching distance data:", status);
        }
      }
    );
  }
  async function handleEditEmail() {
    try {
      const res = await updateEmailWellWisher(email, wellwisher.passcode, user);
      if (res.success) {
        toast.success("Email updated successfully.");
        fetchWellWisherData();
        setEditEmail(false);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleEditPhoneNo() {
    try {
      const res = await updatePhnoWellWisher(
        phoneNo,
        wellwisher.passcode,
        user
      );
      if (res.success) {
        toast.success("Phone number updated successfully.");
        fetchWellWisherData();
        setEditPhone(false);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error(err.message);
    }
  }

  useEffect(() => {
    if (!fetched.current) {
      fetchWellWisherData();
      fetched.current = true;
    }
  }, []);

  useEffect(() => {
    if (userLocation && location) {
      fetchDistanceAndTime();
    }
  }, [userLocation, location]);

  return (
    <div className="flex flex-wrap justify-center gap-4 items-center min-h-screen portrait:max-h-[50vh]">
      {loading ? (
        <Loader2 className="w-6 h-6 animate-spin" />
      ) : (
        <Card className="w-[400px] shadow-lg">
          <CardHeader>
            <CardTitle>{user || "Wellwisher"}</CardTitle>
          </CardHeader>
          <CardContent>
            {wellwisher && (
              <div>
                <div>
                  <h2 className="text-lg font-semibold">
                    Nickname: {wellwisher.nickname}
                  </h2>
                  <h3 className="text-md text-gray-600">
                    Passcode: {wellwisher.passcode}
                  </h3>
                </div>
                <div>
                  <div className="mt-4">
                    <p className="font-bold">To reach {user}</p>
                    <p>Distance: {distance || "Calculating..."}</p>
                  </div>
                  <div className="mt-2">
                    <p>Estimated Time: {duration || "Calculating..."}</p>
                  </div>
                  <div className="mt-2">
                    <p>ETA: {eta || "Calculating..."}</p>
                  </div>
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium">Email:</label>
                  {editEmail ? (
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="email"
                        placeholder="Enter email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <Button onClick={handleEditEmail}>Save</Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditEmail(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between border rounded p-2 mt-1">
                      <span>{email || "Not provided"}</span>
                      <Button
                        variant="outline"
                        onClick={() => setEditEmail(true)}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium">Phone No:</label>
                  {editPhone ? (
                    <div className="flex gap-2 mt-1">
                      <Input
                        type="text"
                        placeholder="Enter phone number"
                        value={phoneNo}
                        onChange={(e) => setPhoneNo(e.target.value)}
                      />
                      <Button onClick={handleEditPhoneNo}>Save</Button>
                      <Button
                        variant="outline"
                        onClick={() => setEditPhone(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between border rounded p-2 mt-1">
                      <span>{phoneNo || "Not provided"}</span>
                      <Button
                        variant="outline"
                        onClick={() => setEditPhone(true)}
                      >
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
      <div className="rounded-lg portrait:mb-8 portrait:-mt-14">
        {location && (
          <APIProvider apiKey={process.env.NEXT_PUBLIC_MAPS_API_KEY}>
            <Map
              style={{ width: "400px", height: "450px" }}
              defaultCenter={{ lat: location.lat, lng: location.lng }}
              defaultZoom={12}
              gestureHandling={"greedy"}
              disableDefaultUI={true}
            >
              <Marker position={{ lat: location.lat, lng: location.lng }} />
            </Map>
          </APIProvider>
        )}
      </div>
    </div>
  );
};

export default Page;
