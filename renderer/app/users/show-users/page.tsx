"use client";
import { useState, useEffect } from "react";
import db from "@/utils/database";
import Button from "@/app/components/Button";
import { ipcRenderer } from "electron";

export default function UsersPage() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchUsers() {
      const result = await db.User.findAll();
      setUsers(result);
    }
    fetchUsers();
  }, []);

  const handleEditUser = (userId) => {
    ipcRenderer.send("open-modal", {
      name: "edit-user",
      url: `users/edit-user?id=${userId}`,
    });
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm("¿Está seguro de eliminar este usuario?")) {
      db.User.destroy({ where: { user_id: userId } });
      const updateUsers = users.filter((user) => user.user_id !== userId);
      setUsers(updateUsers);
    }
  };

  const headerTable = [
    { key: "user", label: "Usuario" },
    { key: "name", label: "Nombre" },
    { key: "Celular", label: "Celular" },
    { key: "role", label: "Rol" },
    { key: "actions", label: "Acciones" },
  ];

  return (
    <>
      <table className="w-full mt-4 text-gray-900 border border-gray-200 shadow-lg">
        <thead>
          <tr>
            {headerTable.map((column) => (
              <th
                key={column.key}
                className={"px-4 py-2 bg-gray-200 border-b border-gray-200"}
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.user_id}
              className="bg-white text-center even:bg-gray-100"
            >
              <td className="px-2 py-1 border-b border-gray-200">
                {user.username}
              </td>
              <td className="px-2 py-1 border-b border-gray-200">
                {user.name}
              </td>
              <td className="px-2 py-1 border-b border-gray-200">
                {user.cellphone}
              </td>
              <td className="px-2 py-1 border-b border-gray-200">
                {user.role}
              </td>
              <td className="flex justify-around px-2 py-1 border-b border-gray-200">
                <Button
                  type="button"
                  className="text-white font-bold py-2 px-4 rounded"
                  onClick={() => handleEditUser(user.user_id)}
                >
                  Editar
                </Button>
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
    </>
  );
}
