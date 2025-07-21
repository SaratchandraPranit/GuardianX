"use client";

import { useState, useEffect } from "react";
import {
  MicOff,
  Volume2,
  PhoneOff,
  MoreVertical,
  PhoneCall,
  User,
} from "lucide-react";
import { motion } from "framer-motion";
import useSound from "use-sound";
import { IoKeypad } from "react-icons/io5";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function FakeCallScreen() {
  const [screen, setScreen] = useState("input");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [gender, setGender] = useState("Male");
  const [timer, setTimer] = useState(0);
  const [playRingtone, { stop }] = useSound("/ringtone.mp3", {
    volume: 1,
    loop: false,
  });
  const [playCallConnected] = useSound("/call-connected.mp3", { volume: 0.5 });

  useEffect(() => {
    let ringtoneInterval;

    if (screen === "incoming") {
      const playWithDelay = () => {
        playRingtone();
        ringtoneInterval = setTimeout(playWithDelay, 28000);
      };

      playWithDelay();
    }

    return () => {
      clearTimeout(ringtoneInterval);
      stop();
    };
  }, [screen, playRingtone, stop]);

  useEffect(() => {
    let interval;
    if (screen === "active") {
      playCallConnected();
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 2000);
    }
    return () => clearInterval(interval);
  }, [screen, playCallConnected]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  const enterFullScreen = () => {
    const element = document.documentElement;
    if (element.requestFullscreen) {
      element.requestFullscreen();
    } else if (element.mozRequestFullScreen) {
      element.mozRequestFullScreen();
    } else if (element.webkitRequestFullscreen) {
      element.webkitRequestFullscreen();
    } else if (element.msRequestFullscreen) {
      element.msRequestFullscreen();
    }
  };

  const exitFullScreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen();
    } else if (document.mozCancelFullScreen) {
      document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      document.webkitExitFullscreen();
    } else if (document.msExitFullscreen) {
      document.msExitFullscreen();
    }
  };

  return (
    <div className="flex items-center justify-center h-[90vh]">
      {screen === "input" && (
        <Card className="w-[320px]">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Enter Caller Details
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <Input
                type="tel"
                placeholder="Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <div className="flex gap-4">
                <Button
                  variant={gender === "Male" ? "default" : "outline"}
                  onClick={() => setGender("Male")}
                  className="flex-1"
                >
                  Male
                </Button>
                <Button
                  variant={gender === "Female" ? "default" : "outline"}
                  onClick={() => setGender("Female")}
                  className="flex-1"
                >
                  Female
                </Button>
              </div>
              <Button
                className="w-full"
                onClick={() => {
                  setScreen("incoming");
                  enterFullScreen();
                }}
              >
                Create Call
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {screen === "incoming" && (
        <Card className="w-[320px] h-[640px] portrait:w-screen portrait:h-[90vh] bg-gray-900 text-white">
          <CardContent className="flex flex-col items-center justify-between h-full p-6">
            <div className="text-center">
              <p className="text-lg font-semibold">Incoming Call</p>
              <p className="text-3xl font-bold mt-1">{name || "Suraj"}</p>
              <p className="text-md text-gray-400">
                {phone || "+91 9392130068"}
              </p>
            </div>
            <motion.div
              className="flex justify-around w-full"
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            >
              <Button
                variant="destructive"
                size="icon"
                className="rounded-full h-16 w-16"
                onClick={() => {
                  setScreen("input");
                  exitFullScreen();
                }}
              >
                <PhoneOff size={32} />
              </Button>
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  repeat: Number.POSITIVE_INFINITY,
                  duration: 1.2,
                }}
              >
                <Button
                  variant="default"
                  size="icon"
                  className="rounded-full h-16 w-16 bg-green-600 hover:bg-green-700"
                  onClick={() => setScreen("active")}
                >
                  <PhoneCall size={32} />
                </Button>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      )}

      {screen === "active" && (
        <Card className="w-[320px] h-[640px] portrait:w-screen portrait:h-[90vh] bg-gray-900 text-white">
          <CardContent className="flex flex-col items-center justify-between h-full p-6">
            <div className="text-center">
              <p className="text-lg font-semibold">On Call</p>
              <div className="w-16 h-16 rounded-full bg-gray-700 mx-auto my-4 flex items-center justify-center">
                <User className="w-10 h-10 text-gray-400" />
              </div>
              <p className="text-3xl font-bold mt-1">{name || "Suraj"}</p>
              <p className="text-md text-gray-400">
                {phone || "+91 9392130068"}
              </p>
              <p className="text-lg mt-2">{formatTime(timer)}</p>
            </div>

            <div className="grid grid-cols-2 gap-6 w-full mt-4">
              <Button className="flex flex-col items-center">
                <MicOff size={32} />
                <p className="text-sm mt-1">Mute</p>
              </Button>
              <Button className="flex flex-col items-center">
                <Volume2 size={32} />
                <p className="text-sm mt-1">Speaker</p>
              </Button>
              <Button className="flex flex-col items-center">
                <IoKeypad size={32} />
                <p className="text-sm mt-1">Keypad</p>
              </Button>
              <Button className="flex flex-col items-center">
                <MoreVertical size={32} />
                <p className="text-sm mt-1">Options</p>
              </Button>
            </div>

            <Button
              variant="destructive"
              size="icon"
              className="rounded-full h-16 w-16 mt-4"
              onClick={() => {
                setScreen("input");
                exitFullScreen();
              }}
            >
              <PhoneOff size={32} />
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
