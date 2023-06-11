import { useContext } from "react";
import { InvoicesContext } from "@/hooks/useHadleContext";
import Link from "next/link";
import HandleSession from "@/app/components/HandleSession";

export default function Navigation() {
  const { user } = useContext(InvoicesContext);
  const menuItems = [
    { name: "Agregar Proveedor", link: "/add-supplier" },
    { name: "Agregar Factura", link: "/add-invoice" },
    { name: "Mostrar Facturas", link: "/show-invoices" },
  ];

  return (
    <nav className="bg-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <Link href="/" className="text-white font-bold text-lg">
              LA ESTACIÓN
            </Link>
          </div>
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <ul className="flex space-x-4">
                {menuItems.map((item) => (
                  <li key={item.link}>
                    <Link
                      href={item.link}
                      className="text-white hover:text-yellow-500 transition-colors"
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
