"use client";
import React from "react";

const Ctx = React.createContext<{
  userRentInfo: any;
  storeUserRentInfo: Function;
}>({
  userRentInfo: {},
  storeUserRentInfo: () => {},
});

export const UserRentInfoContext = () => React.useContext(Ctx);

export const UserRentInfoContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [userRentInfo, setUserRentInfo] = React.useState({});

  const storeUserRentInfo = (data: any) => {
    setUserRentInfo(data);
    localStorage.setItem("userRentInfo", JSON.stringify(data));
  };

  React.useEffect(() => {
    // On mount, load from localStorage
    const storedData = localStorage.getItem("userRentInfo");
    if (storedData) {
      setUserRentInfo(JSON.parse(storedData));
    }
  }, []);

  return (
    <Ctx.Provider value={{ userRentInfo, storeUserRentInfo }}>
      {children}
    </Ctx.Provider>
  );
};
