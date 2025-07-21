"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Mail, Phone, Lock } from "lucide-react";
import { loginUser } from "../../../actions/userActions";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    password: "",
    type: "username",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await loginUser(formData);

      if (result.success) {
        toast.success(
          `Logged in successfully! Welcome ${result.user.username}`
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

  const handleTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      type: value,
    }));
  };
  useEffect(() => {
    if (typeof window !== "undefined" && localStorage.getItem("token")) {
      router.push("/home");
    }
  });

  const getInputIcon = () => {
    switch (formData.type) {
      case "email":
        return (
          <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
        );
      case "phoneNo":
        return (
          <Phone className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
        );
      default:
        return (
          <User className="absolute left-3 top-3 h-5 w-5 text-gray-500 dark:text-gray-400" />
        );
    }
  };

  const getInputPlaceholder = () => {
    switch (formData.type) {
      case "email":
        return "Email";
      case "phoneNo":
        return "Phone Number";
      default:
        return "Username";
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-white/5 backdrop-blur-sm rounded-xl border border-gray-300 dark:border-white/10 shadow-lg">
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Login
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Sign in to continue
          </p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-4">
            <Select
              onValueChange={handleTypeChange}
              defaultValue={formData.type}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select login type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="username">Username</SelectItem>
                <SelectItem value="email">Email</SelectItem>
                <SelectItem value="phoneNo">Phone Number</SelectItem>
              </SelectContent>
            </Select>
            <div className="relative">
              {getInputIcon()}
              <Input
                type={
                  formData.type === "phoneNo"
                    ? "tel"
                    : formData.type === "email"
                    ? "email"
                    : "text"
                }
                name="slug"
                placeholder={getInputPlaceholder()}
                value={formData.slug}
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
            {isLoading ? "Logging in..." : "Sign in"}
          </Button>
        </form>
        <div className="text-center text-sm">
          <span className="text-gray-600 dark:text-gray-400">
            Don&apos;t have an account?
          </span>{" "}
          <a href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
