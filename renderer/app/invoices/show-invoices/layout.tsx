import React from "react";
import { Metadata } from "next";
import Navigation from "@/components/Navigation";
import Menu from "@/components/Menu";

export const metadata: Metadata = {
  title: "Facturas Diarias",
  description: "Facturas Diarias",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <Navigation />

      <div className="flex flex-col min-h-screen">
        <div className="container max-w-6xl px-4 py-8 mx-auto">
          <h1 className="text-4xl font-bold text-center text-blue-600">
            Facturas Diarias
          </h1>
          <Menu />
          {children}
        </div>
      </div>
    </React.Fragment>
  );
}
