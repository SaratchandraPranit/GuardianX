"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Lock } from "lucide-react";
import { loginWellWisher } from "../../../actions/userActions";
import { useRouter } from "next/navigation";

export default function WellwisherSignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    nickname: "",
    passcode: "",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const res = await loginWellWisher(
        formData.username,
        formData.passcode,
        formData.nickname
      );

      if (res.success) {
        toast.success(`Welcome, ${formData.nickname}!`);
        localStorage.setItem("wellwisher", res.token);
        router.push("/wellwisherdashboard");
      } else {
        toast.error(res.error);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("wellwisher")) {
      router.push("/wellwisherdashboard");
    }
  }, []);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl border border-gray-300 dark:border-white/10 shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Login as Wellwisher
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            One step closer to real-time updates of your loved ones
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Input
                type="text"
                name="username"
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
                className="pl-10 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                required
              />
            </div>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Input
                type="text"
                name="nickname"
                placeholder="Nickname"
                value={formData.nickname}
                onChange={handleChange}
                className="pl-10 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Input
                type="password"
                name="passcode"
                placeholder="Passcode"
                value={formData.passcode}
                onChange={handleChange}
                className="pl-10 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                required
              />
            </div>
          </div>
          <Button
            type="submit"
            className="w-full bg-[#dc2446] hover:bg-[#bd2a45] text-white py-2 rounded-lg shadow-md"
            disabled={isLoading}>
            {isLoading ? "Logging inn" : "Login in "}
          </Button>
        </form>
      </div>
    </div>
  );
}
