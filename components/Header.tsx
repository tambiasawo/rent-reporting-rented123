import React from "react";
import Image from "next/image";

const Header = () => {
  return (
    <div className="mb-2 py-3 ">
      <Image
        className="mx-auto"
        src="https://rented123-brand-files.s3.us-west-2.amazonaws.com/logo_white.svg"
        alt="Rented123"
        width={"80"}
        height={"80"}
      />
    </div>
  );
};

export default Header;
