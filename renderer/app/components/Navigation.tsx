"use client";
import useSession from "@/hooks/useSession";
import Link from "next/link";
import DropdownMenu from "@/app/components/DropdownMenu";
import HandleSession from "@/app/components/HandleSession";
import { ipcRenderer } from "electron";
import { useRouter } from "next/navigation";

export default function Navigation() {
  const { user } = useSession();
  const router = useRouter();

  const adminMenuItems = [
    { name: "Generar Reporte", link: "/reports/generate-report" },
  ];

  const openModalFunction = (link) => {
    return () => {
      ipcRenderer.send("open-modal", {
        name: link,
        url: link,
      });
    };
  };

  const menuDropdownItems = [
    {
      firstLabel: "Proveedores",
      items: [
        {
          label: "Agregar Proveedor",
          onClick: openModalFunction("suppliers/add-supplier"),
        },
      ],
    },
    {
      firstLabel: "Facturas",
      items: [
        { label: "Agregar Factura", onClick: openModalFunction("invoices/add-invoice") },
        {
          label: "Mostrar Facturas",
          onClick: () => router.push("/invoices/show-invoices"),
        },
      ],
    },
    {
      firstLabel: "Usuarios",
      isAdmin: true,
      items: [
        { label: "Agregar Usuario", onClick: openModalFunction("users/create-user") },
        {
          label: "Mostrar Usuarios",
          onClick: () => router.push("/users/show-users"),
        },
      ],
    },
  ];

  return (
    <div>
      <nav className="bg-gray-700">
        <div className="container mx-auto px-4 w-11/12 max-w-6xl">
          <div className="flex justify-between items-center h-16">
            <div className="flex-shrink-0">
              <Link href="/" className="text-white font-bold text-lg">
                LA ESTACIÓN
              </Link>
            </div>

            <div className="hidden md:flex items-center space-x-8">
              <ul className="flex space-x-4">
                {menuDropdownItems.map((item) => (
                  <li key={item.firstLabel} className="text-center m-0">
                    <DropdownMenu
                      title={item.firstLabel}
                      items={item.items}
                      className="text-white tex hover:text-yellow-500 transition-colors"
                      isVisible={item.isAdmin ? user?.role === "admin" : true}
                    />
                  </li>
                ))}
                {user?.role === "admin" &&
                  adminMenuItems.map((item) => (
                    <li key={item.link} className="text-center m-0">
                      <Link
                        href={item.link}
                        className="text-white tex hover:text-yellow-500 transition-colors"
                      >
                        {item.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </div>
              <HandleSession />
          </div>
        </div>
      </nav>
    </div>
  );
}
