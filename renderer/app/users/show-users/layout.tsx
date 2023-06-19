import React from "react";
import Head from "next/head";
import Navigation from "@/app/components/Navigation";

export const metadata = {
  title: "Usuarios del Sistema",
  description: "Usuarios del Sistema",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      <Head>
        <title>Usuarios del Sistema</title>
      </Head>
      <Navigation />

      <div className="flex flex-col min-h-screen">
        <div className="container max-w-6xl px-4 py-8 mx-auto">
          <h1 className="text-4xl font-bold text-center text-blue-600">
            Usuarios del Sistema
          </h1>
          {children}
        </div>
      </div>
    </React.Fragment>
  );
}
