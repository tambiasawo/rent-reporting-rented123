"use client";
import { useId, useState } from "react";
import Image from "next/image";

import LoginForm from "@/components/LoginForm";
import { AuthContext } from "@/lib/context/AuthContextProvider";
import { LoginFormValues } from "@/lib/validations/form";
import { UserRentInfoContext } from "@/lib/context/UserRentInfoContextProvider";

export default function Login() {
  const userId = useId();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { storeUserData } = AuthContext();
  const { storeUserRentInfo } = UserRentInfoContext();

  async function submitHandler(data: LoginFormValues) {
    try {
      setIsLoading(true);
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Requested-By": process.env.NEXT_PUBLIC_SECRET_HEADER as string,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Invalid username or password");
      }
      const { user_data, user_metadata } = await response.json();
      storeUserData({
        id: userId,
        email: user_data.user_email,
        name: user_data.display_name,
      });
      storeUserRentInfo(user_metadata);
      window.location.href = "/";
    } catch (error: unknown) {
      setError(error as string);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="container mx-auto px-4 py-4">
      <div className="mb-10">
        <Image
          className="mx-auto"
          src="https://rented123-brand-files.s3.us-west-2.amazonaws.com/logo_white.svg"
          alt="Rented123"
          width={"80"}
          height={"80"}
        />
      </div>
      <div className="md:max-w-5xl mx-auto flex h-[400px] gap-7 flex-col md:flex-row items-center md:border rounded-md mt-5 pl-5 md:pl-0 pr-5 md:pr-0">
        <div className="w-[35%] hidden md:block h-full signIn-left rounded-tl-md rounded-bl-md" />
        <div className="md:w-[60%] w-full">
          <LoginForm
            onSubmit={submitHandler}
            isLoading={isLoading}
            error={error}
          />
        </div>
      </div>
    </main>
  );
}
