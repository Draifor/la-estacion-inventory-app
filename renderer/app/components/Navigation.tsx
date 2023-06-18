import { useContext } from "react";
import { InvoicesContext } from "@/hooks/useHadleContext";
import Link from "next/link";
import DropdownMenu from "@/app/components/DropdownMenu";
import HandleSession from "@/app/components/HandleSession";

export default function Navigation() {
  const { user } = useContext(InvoicesContext);

  const adminMenuItems = [
    { name: "Generar Reporte", link: "/generate-report" },
    { name: "Agregar Usuario", link: "/create-user" },
    { name: "Mostrar Usuarios", link: "/show-users" },
  ];

  const menuDropdownItems = [
    {
      firstLabel: "Proveedores",
      items: [{ label: "Agregar Proveedor", link: "/add-supplier" }],
    },
    {
      firstLabel: "Facturas",
      items: [
        { label: "Agregar Factura", link: "/add-invoice" },
        { label: "Mostrar Facturas", link: "/show-invoices" },
      ],
    },
    {
      firstLabel: "Usuarios",
      items: [
        { label: "Agregar Usuario", link: "/create-user" },
        { label: "Mostrar Usuarios", link: "/show-users" },
      ],
    },
  ];

  return (
    <nav className="bg-gray-700">
      <div className="container mx-auto px-4 w-11/12 max-w-6xl">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-white font-bold text-lg">
              LA ESTACIÓN
            </Link>
          </div>
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <ul className="flex space-x-4">
                {menuDropdownItems.map((item) => (
                  <li key={item.firstLabel} className="text-center m-0">
                    <DropdownMenu
                      title={item.firstLabel}
                      items={item.items}
                      className="text-white tex hover:text-yellow-500 transition-colors"
                    />
                  </li>
                ))}
                {user.role === "admin" &&
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
              <HandleSession />
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
