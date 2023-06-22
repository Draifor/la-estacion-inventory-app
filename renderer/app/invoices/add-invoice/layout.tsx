import React from "react";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Registrar Factura",
  description: "Registrar Factura",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <div className="flex flex-col items-center justify-center py-4 min-h-screen">
        <div className="container max-w-lg px-4 py-6 bg-white shadow-lg rounded-lg">
          <h1 className="text-4xl font-bold text-center text-blue-600">
            Registrar Factura
          </h1>
          {children}
        </div>
      </div>
    </React.Fragment>
  );
}
