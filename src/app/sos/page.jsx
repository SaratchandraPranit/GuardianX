"use client";
import React, { useState, useEffect } from "react";
import { getUser } from "../../../actions/userActions";
import {
  saveSOSRecording,
  sendInitialTwilioSMS,
} from "../../../actions/sosActions";
import { initializeApp, getApps } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { toast } from "sonner";

import { firebaseConfig } from "../../../utils/firebase";
import { useRouter } from "next/navigation";

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const storage = getStorage(app);

const SOSButton = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [user, setUser] = useState(null);
  const [recordingInterval, setRecordingInterval] = useState(null);
  const [autoStopTimeout, setAutoStopTimeout] = useState(null);
  const [stream, setStream] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timerInterval, setTimerInterval] = useState(null);
  const router = useRouter();
  const startRecording = async () => {
    try {
      const res = await sendInitialTwilioSMS(
        user.username,
        user.currentLocation.lat,
        user.currentLocation.lng
      );
      if (res.success) {
        toast.success("Initial SOS SMS sent successfully");
      } else {
        toast.error(res.error);
      }

      const userStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      setStream(userStream);

      const recorder = new MediaRecorder(userStream, {
        mimeType: "video/webm",
      });
      let chunks = [];

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) chunks.push(event.data);
      };

      const saveRecording = async () => {
        if (chunks.length === 0) return;

        const videoBlob = new Blob(chunks, { type: "video/mp4" });
        const videoFile = new File([videoBlob], `sos_${Date.now()}.webm`);

        const filePath = `sos_videos/${
          user?.username
        }_${Date.now()}_sos_part.mp4`;
        const storageRef = ref(storage, filePath);
        const uploadTask = uploadBytesResumable(storageRef, videoFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            toast.info(`Uploading segment: ${progress.toFixed(2)}%`);
          },
          (error) => {
            toast.error("Error uploading video segment: " + error.message);
          },
          async () => {
            const videoUrl = await getDownloadURL(storageRef);
            const res = await saveSOSRecording(
              localStorage.getItem("token"),
              videoUrl
            );

            if (res.success) {
              toast.success("SOS video segment uploaded successfully!");
            } else {
              toast.error(res.error);
            }
          }
        );

        chunks = [];
      };

      recorder.onstop = () => {
        saveRecording();
      };

      recorder.start();

      // Upload every 20 seconds
      const interval = setInterval(() => {
        if (recorder.state === "recording") {
          recorder.stop();
          recorder.start();
        }
      }, 20000);

      // Auto-stop after 5 minutes
      const timeout = setTimeout(() => {
        stopRecording();
      }, 5 * 60 * 1000);

      // Timer to track recording time
      const timer = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);

      setRecordingInterval(interval);
      setAutoStopTimeout(timeout);
      setTimerInterval(timer);
      setIsRecording(true);
      setMediaRecorder(recorder);
      setRecordingTime(0);
      toast.success("Recording started...");
    } catch (error) {
      toast.error("Error accessing camera/microphone: " + error.message);
      console.error("Media access error:", error);
    }
  };

  const stopRecording = () => {
    // Clear all intervals and timeouts
    if (recordingInterval) {
      clearInterval(recordingInterval);
      setRecordingInterval(null);
    }
    
    if (autoStopTimeout) {
      clearTimeout(autoStopTimeout);
      setAutoStopTimeout(null);
    }

    if (timerInterval) {
      clearInterval(timerInterval);
      setTimerInterval(null);
    }

    // Stop media recorder
    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      try {
        mediaRecorder.stop();
      } catch (error) {
        console.error("Error stopping media recorder:", error);
      }
      setMediaRecorder(null);
    }

    // Stop all stream tracks
    if (stream) {
      stream.getTracks().forEach((track) => {
        if (track.readyState === "live") {
          track.stop();
        }
      });
      setStream(null);
    }

    // Update state
    setIsRecording(false);
    setRecordingTime(0);
    toast.success("Recording stopped.");
  };

  async function fetchUserInfo() {
    try {
      const res = await getUser(localStorage.getItem("token"));
      if (res.success) {
        setUser(res.user);
      } else {
        toast.error(res.error);
      }
    } catch (err) {
      toast.error("Failed to fetch user details");
    }
  }

  useEffect(() => {
    fetchUserInfo();
  }, []);
  
  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem("token")) {
      toast.message("Please login to access this page");
      router.push("/login");
    }
  }, []);

  // Cleanup effect to prevent memory leaks
  useEffect(() => {
    return () => {
      // Cleanup when component unmounts
      if (recordingInterval) {
        clearInterval(recordingInterval);
      }
      if (autoStopTimeout) {
        clearTimeout(autoStopTimeout);
      }
      if (timerInterval) {
        clearInterval(timerInterval);
      }
      if (mediaRecorder && mediaRecorder.state !== "inactive") {
        try {
          mediaRecorder.stop();
        } catch (error) {
          console.error("Cleanup error:", error);
        }
      }
      if (stream) {
        stream.getTracks().forEach((track) => {
          if (track.readyState === "live") {
            track.stop();
          }
        });
      }
    };
  }, [recordingInterval, autoStopTimeout, timerInterval, mediaRecorder, stream]);

  // Format recording time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen space-y-6">
      {isRecording && (
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600 mb-2">
            🔴 RECORDING
          </div>
          <div className="text-lg text-gray-600">
            {formatTime(recordingTime)}
          </div>
          <div className="text-sm text-gray-500 mt-2">
            Auto-stop in {formatTime(300 - recordingTime)} (5:00 max)
          </div>
        </div>
      )}
      
      <button
        className={`w-[250px] h-[250px] ${
          isRecording 
            ? "bg-red-600 hover:bg-red-700 animate-pulse" 
            : "bg-red-500 hover:bg-red-600"
        } text-white font-bold text-xl rounded-full shadow-lg transition-all flex flex-col items-center justify-center`}
        onClick={isRecording ? stopRecording : startRecording}
        disabled={!user}
      >
        <p className="text-4xl mb-2">{isRecording ? "STOP" : "SOS"}</p>
        {!isRecording && (
          <p className="text-sm">Press to start emergency recording</p>
        )}
      </button>

      {!user && (
        <div className="text-center text-gray-500">
          Loading user data...
        </div>
      )}
    </div>
  );
};

export default SOSButton;
