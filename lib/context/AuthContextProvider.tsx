"use client";
import React from "react";

const Ctx = React.createContext<{
  loggedInUserData: { name: string; email: string; id: string };
  storeUserData: Function;
}>({
  loggedInUserData: { name: "", email: "", id: "" },
  storeUserData: () => {},
});

export const AuthContext = () => React.useContext(Ctx);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [loggedInUserData, setLoggedInUserData] = React.useState({
    name: "",
    email: "",
    id: "",
  });

  const storeUserData = (data: any) => {
    setLoggedInUserData(data);
    localStorage.setItem("myUser", JSON.stringify(data));
  };

  React.useEffect(() => {
    // On mount, load from localStorage
    const storedData = localStorage.getItem("myUser");
    if (storedData) {
      setLoggedInUserData(JSON.parse(storedData));
    }
  }, []);

  return (
    <Ctx.Provider value={{ loggedInUserData, storeUserData }}>
      {children}
    </Ctx.Provider>
  );
};
