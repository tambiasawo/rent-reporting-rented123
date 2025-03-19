import React from "react";
import { UserNav } from "./UserNav";

const Header = ({ isSignedIn }: { isSignedIn: boolean }) => {
  
  return (
    <header className="border-b ">
      <div className="flex justify-between items-center px-4 h-16 ">
        <h1 className="text-2xl md:text-3xl font-semibold text-gray-900">
          Rented123
        </h1>
        {isSignedIn && (
          <div className="container mx-auto flex items-center justify-end">
            <UserNav />
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
