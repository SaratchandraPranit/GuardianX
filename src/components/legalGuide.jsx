"use client";
import React from "react";
import ChatBot from "./pages/chatbot/chatBot";
import { usePathname } from "next/navigation";

function LegalGuide() {
  const pathname = usePathname();
  return (
    <>
      {pathname !== "/" && pathname !== "/chatrooms" && pathname!=="/phone" ? (
        <ChatBot />
      ) : (
        <div></div>
      )}
    </>
  );
}

export default LegalGuide;
