"use client";
import { useState, useEffect } from "react";
import db from "@/utils/database";
import Button from "@/app/components/Button";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const result = await db.User.findAll();
      setUsers(result);
    }
    fetchUsers();
  }, []);

  const handleDeleteUser = (userId) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      db.User.destroy({ where: { user_id: userId } });
      const updateUsers = users.filter((user) => user.user_id !== userId);
      setUsers(updateUsers);
    }
  };

  const headerTable = [
    { key: "user", label: "Usuario", className: "text-left" },
    { key: "name", label: "Nombre", className: "text-left" },
    { key: "Celular", label: "Celular", className: "text-left" },
    { key: "role", label: "Rol" },
    { key: "actions", label: "Acciones" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container max-w-6xl px-4 py-8 mx-auto">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          Usuarios del Sistema
        </h1>
        <table className="w-full mt-4 text-gray-900 border border-gray-200 shadow-lg">
          <thead>
            <tr>
              {headerTable.map((column) => (
                <th
                  key={column.key}
                  className={`${
                    column.className ? column.className : ""
                  } px-4 py-2 bg-gray-200 border-b border-gray-200`}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.user_id} className="bg-white even:bg-gray-100">
                <td className="px-2 py-1 text-left border-b border-gray-200">
                  {user.username}
                </td>
                <td className="px-2 py-1 text-left border-b border-gray-200">
                  {user.email}
                </td>
                <td className="px-2 py-1 border-b border-gray-200">
                  {user.role}
                </td>
                <td className="px-2 py-1 border-b border-gray-200">
                  {/* Renderizo un botón para eliminar el usuario */}
                  <Button
                    type="button"
                    className="btn bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
                    onClick={() => handleDeleteUser(user.user_id)}
                  >
                    Eliminar
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
