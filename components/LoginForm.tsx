"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { LoginFormSchema, type LoginFormValues } from "@/lib/validations/form";
import { EyeOff, Info } from "lucide-react";
import { Eye } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { toast } from "sonner";
import Link from "next/link";

export default function RentPaymentForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to submit form");
      }
      const userData = await response.json();
      console.log({ userData });
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to submit form");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 w-full md:w-1/2"
      >
        <div className="mb-3">
          <h1 className="text-center text-2xl md:text-3xl font-semibold text-gray-900 pb-1 md:pb-2">
            Login
          </h1>
          <p className="text-center flex items-center justify-center gap-1 text-xs">
            <Info size={"13"} />{" "}
            <span>Use your Rented123 Membership Credentials</span>
          </p>
        </div>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Input
                  placeholder="Username"
                  {...field}
                  className={cn(
                    form.formState.errors.username &&
                      "border-red-500 focus-visible:ring-red-500"
                  )}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    {...field}
                    className={cn(
                      form.formState.errors.password &&
                        "border-red-500 focus-visible:ring-red-500"
                    )}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Submitting..." : "Submit"}
        </Button>
        <div className="flex justify-between">
          <p className="underline">
            <Link
              href={"https://rented123.com/login/?action=forgot_password"}
              target="_blank"
            >
              Forgot Password?
            </Link>
          </p>
          <p className="underline">
            {" "}
            <Link href={"https://rented123.com/sign-up/silver"} target="_blank">
              Sign Up
            </Link>
          </p>
        </div>
      </form>
    </Form>
  );
}
