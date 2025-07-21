"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Phone, Lock } from "lucide-react";
import { addUser } from "../../../actions/userActions";
import { useRouter } from "next/navigation";

export default function SignupForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phoneNo: "",
    password: "",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await addUser(formData);

      if (result.success) {
        toast.success(
          `Account created successfully! Welcome ${result.user.username}`
        );
        localStorage.setItem("token", result.token);
        router.push("/");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.push("/home");
    }
  });

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl border border-gray-300 dark:border-white/10 shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Create Account
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign up to get started
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
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Input
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                className="pl-10 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                required
              />
            </div>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Input
                type="tel"
                name="phoneNo"
                placeholder="Phone number"
                value={formData.phoneNo}
                onChange={handleChange}
                className="pl-10 bg-white dark:bg-white/10 border border-gray-300 dark:border-white/10 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                required
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
              <Input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
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
            {isLoading ? "Creating account..." : "Sign up"}
          </Button>
        </form>
        <div className="text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Already have an account?
          </span>{" "}
          <a href="/login" className="text-[#dc2446] hover:underline">
            Log in
          </a>
        </div>
      </div>
    </div>
  );
}
