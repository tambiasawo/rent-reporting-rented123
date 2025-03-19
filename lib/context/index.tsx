import React from "react";
import { AuthContextProvider } from "./AuthContextProvider";
import { UserRentInfoContextProvider } from "./UserRentInfoContextProvider";

const ContextWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <AuthContextProvider>
        <UserRentInfoContextProvider>{children}</UserRentInfoContextProvider>
      </AuthContextProvider>
    </div>
  );
};

export default ContextWrapper;
