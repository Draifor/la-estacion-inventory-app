"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useSession from "@/hooks/useSession";
import { Metadata } from "next";
import Link from "next/link";
import ImageIcon from "@/components/icons/ImageIcon";
import PlusIcon from "@/components/icons/PlusIcon";
import UserIcon from "@/components/icons/UserIcon";
import Navigation from "@/components/Navigation";

export const metadata: Metadata = {
  title: "Menú Inicial",
};

export default function Home() {
  const { user, loading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.push("/login");
    }
  }, [user, loading]);

  const menuItems = [
    {
      name: "Agregar Proveedor",
      link: "/suppliers/add-supplier",
      icon: <PlusIcon />,
    },
    {
      name: "Agregar Factura",
      link: "/invoices/add-invoice",
      icon: <PlusIcon />,
    },
    {
      name: "Mostrar Facturas",
      link: "/invoices/show-invoices",
      icon: <ImageIcon />,
    },
  ];

  const adminMenuItems = [
    {
      name: "Generar Reporte",
      link: "/reports/generate-report",
      icon: <PlusIcon />,
    },
    { name: "Agregar Usuario", link: "/users/create-user", icon: <PlusIcon /> },
    { name: "Mostrar Usuarios", link: "/users/show-users", icon: <UserIcon /> },
  ];

  // Mostrar un indicador de carga mientras se está obteniendo la sesión del usuario
  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <>
      <Navigation />
      <div className="flex flex-col items-center justify-center min-h-[90vh] max-h-[900px]">
        {user && (
          <div className="container max-w-lg px-4 py-6 bg-white shadow-lg rounded-lg">
            <h1 className="text-4xl font-bold text-center text-blue-600">
              Bienvenido a <span className="text-yellow-500">LA ESTACIÓN</span>
            </h1>
            <p className="text-2xl font-bold text-center text-gray-700 mt-4">
              Hola, {user.username}
            </p>
            <ul className="space-y-4 border-t border-b border-gray-200 py-6">
              {menuItems.map((item) => (
                <li key={item.link} className="flex items-center">
                  <Link
                    href={item.link}
                    className="flex items-center space-x-4 w-full p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 font-medium rounded-md"
                  >
                    {item.icon}
                    <span>{item.name}</span>
                  </Link>
                </li>
              ))}
              {user.role === "admin" &&
                adminMenuItems.map((item) => (
                  <li key={item.link} className="flex items-center">
                    <Link
                      href={item.link}
                      className="flex items-center space-x-4 w-full p-3 bg-blue-100 hover:bg-blue-200 text-blue-600 font-medium rounded-md"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </Link>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </>
  );
}
