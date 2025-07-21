"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  FaHome,
  FaPlane,
  FaLifeRing,
  FaUsers,
  FaUser,
  FaMapMarkerAlt,
  FaComments,
} from "react-icons/fa";
import Link from "next/link";
function Navbar() {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();
  return (
    <>
      {pathname !== "/" && (
        <div
          className="navbar h-[100%] ml-2 z-10 fixed flex flex-col justify-center"
          onMouseEnter={() => setIsVisible(true)}
          onMouseLeave={() => setIsVisible(false)}>
          <div className="hidden md:block fixed left-0 top-0 w-2 h-full bg-transparent z-10" />

          <div
            className={`
        flex md:flex-col md:rounded-lg shadow-black shadow-xl justify-around 
        items-center bg-[#dc2446] text-white p-2 w-full md:w-[75px] 
        fixed bottom-0 left-0 md:relative md:bottom-auto md:top-0 md:pl-4 md:h-[90%]
        md:transition-transform md:duration-300 md:ease-in-out
        ${isVisible ? "md:translate-x-0" : "md:translate-x-[-95%]"}
 
      `}>
            <div
              className={`w-full flex-1 text-center md:text-left p-2 flex items-center md:flex-row md:gap-4 `}>
              <Link href="/home">
                <FaHome
                  className={`mx-auto  ${
                    pathname === "/home"
                      ? "bg-white text-5xl rounded-md mx-auto md:h-[50%] p-2 text-[#dc2446]"
                      : "text-3xl"
                  }`}
                />
              </Link>
            </div>
            <div className="w-full flex-1 text-center md:text-left p-2 flex items-center md:flex-row md:gap-4">
              <Link href="/travel">
                <FaPlane
                  className={`mx-auto  ${
                    pathname === "/travel"
                      ? "bg-white text-5xl rounded-md mx-auto md:h-[50%] p-2 text-[#dc2446]"
                      : "text-3xl"
                  }`}
                />
              </Link>
            </div>
            <div className="w-full flex-1 text-center md:text-left p-2 flex items-center md:flex-row md:gap-4">
              <Link href="/navigate">
                <FaMapMarkerAlt
                  className={`mx-auto  ${
                    pathname === "/navigate"
                      ? "bg-white text-5xl rounded-md mx-auto md:h-[50%] p-2 text-[#dc2446]"
                      : "text-3xl"
                  }`}
                />
              </Link>
            </div>
            <div className="w-full flex-1 text-center md:text-left flex items-center md:flex-row md:gap-4">
              <Link href="/sos">
                <p className="mx-auto font-black text-xl rounded-full">SOS</p>
              </Link>
            </div>
            <div className="w-full flex-1 text-center md:text-left p-2 flex items-center md:flex-row md:gap-4">
              <Link href="/chatrooms">
                <FaComments
                  className={`mx-auto  ${
                    pathname === "/chatrooms"
                      ? "bg-white text-5xl rounded-md mx-auto md:h-[50%] p-2 text-[#dc2446]"
                      : "text-3xl"
                  }`}
                />
              </Link>
            </div>
            <div className="w-full flex-1 text-center md:text-left p-2 flex items-center md:flex-row md:gap-4">
              <Link href="/community">
                <FaUsers
                  className={`mx-auto ${
                    pathname === "/community"
                      ? "bg-white text-5xl  rounded-md mx-auto md:h-[50%] p-2 text-[#dc2446]"
                      : "text-3xl "
                  }`}
                />
              </Link>
            </div>
            <div className="w-full flex-1 text-center md:text-left p-2 flex items-center md:flex-row md:gap-4">
              <Link href="/profile">
                <FaUser
                  className={`mx-auto  ${
                    pathname === "/profile"
                      ? "bg-white text-5xl rounded-md mx-auto md:h-[50%] p-2 text-[#dc2446]"
                      : "text-3xl"
                  }`}
                />
              </Link>
            </div>
          </div>
        </div>
      )}{" "}
      <div></div>
    </>
  );
}

export default Navbar;
