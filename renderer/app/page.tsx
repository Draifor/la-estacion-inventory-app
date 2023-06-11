"use client";
import { useEffect, useContext } from "react";
import { InvoicesContext } from "@/hooks/useHadleContext";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/navigation";
import ImageIcon from "./components/icons/ImageIcon";
import PlusIcon from "./components/icons/PlusIcon";

function Home() {
  console.log("Home page rendereeeeeeeed!");
  const { user } = useContext(InvoicesContext);
  console.log("user", user);
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.push("/login");
    }
  }, [user]);
  return (
    <>
      <Head>
        <title>Menú Inicial</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen">
        {user && (
          <div className="container max-w-lg px-4 py-8 bg-white shadow-lg rounded-lg">
            <h1 className="text-4xl font-bold text-center text-blue-600">
              Bienvenido a <span className="text-yellow-500">LA ESTACIÓN</span>
            </h1>
            <p className="text-2xl font-bold text-center text-gray-700 mt-4">
              Hola, {user.username}
            </p>
            <ul className="space-y-4 border-t border-b border-gray-200 py-6">
              <li className="flex items-center">
                <Link
                  href="/show-invoices"
                  className="flex items-center space-x-4 w-full p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 font-medium rounded-md"
                >
                  <ImageIcon />
                  <span>Buscar Facturas</span>
                </Link>
              </li>
              <li className="flex items-center">
                <Link
                  href="/add-supplier"
                  className="flex items-center space-x-4 w-full p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 font-medium rounded-md"
                >
                  <PlusIcon />
                  <span>Agregar Proveedor</span>
                </Link>
              </li>
              <li className="flex items-center">
                <Link
                  href="/add-invoice"
                  className="flex items-center space-x-4 w-full p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 font-medium rounded-md"
                >
                  <PlusIcon />
                  <span>Agregar Factura</span>
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </>
  );
}

export default Home;
