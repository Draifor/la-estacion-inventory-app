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

      <div className="flex flex-col items-center justify-center mt-7">
      <div className="container max-w-lg px-4 py-8 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          Generar Reporte
        </h1>
          {children}
        </div>
      </div>
    </React.Fragment>
  );
}
