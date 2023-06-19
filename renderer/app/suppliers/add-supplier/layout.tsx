import React from "react";
import Head from "next/head";

export const metadata = {
  title: "Registrar Proveedor",
  description: "Registrar Proveedor",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <Head>
        <title>Registrar Proveedor</title>
      </Head>

      <div className="flex flex-col items-center justify-center py-4 min-h-screen">
      <div className="container max-w-lg px-4 py-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center text-blue-600">
            Registrar Proveedor
          </h1>
          {children}
        </div>
      </div>
    </React.Fragment>
  );
}
