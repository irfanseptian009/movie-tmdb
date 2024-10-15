"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import store from "./store";
import { Provider as ReduxProvider } from "react-redux";
import Navbar from "../components/Navbar";
import "../app/globals.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <ReduxProvider store={store}>
            <Navbar />
            {children}
          </ReduxProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
