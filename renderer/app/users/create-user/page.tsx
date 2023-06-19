"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import showAlert from "@/app/components/showAlert";
import db from "@/utils/database";
import Select from "@/app/components/Select";
import bcrypt from "bcryptjs";
import { ipcRenderer } from "electron";

const roles = [
  { value: "admin", label: "Administrador" },
  { value: "user", label: "Usuario" },
];

export default function createUser() {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [role, setRole] = useState(roles[0]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();

  const roleOptions = roles.map((role) => {
    return (
      <option key={role.value} value={role.value}>
        {role.label}
      </option>
    );
  });

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const handleUserNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleRoleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newRol = roles.find((role) => role.value === event.target.value);
    setRole(newRol);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setConfirmPassword(event.target.value);
  };

  const phoneRegex = /^\d{3} \d{3} \d{4}$/;

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (name === "") {
      showAlert("error", "El nombre no puede estar vacío");
      return;
    }

    if (username === "") {
      showAlert("error", "El nombre de usuario no puede estar vacío");
      return;
    }

    if (cellphone !== "") {
      if (!phoneRegex.test(cellphone)) {
        showAlert("error", "Ingresa un número de celular válido");
        return;
      }
    }

    if (password === "") {
      showAlert("error", "La contraseña no puede estar vacía");
      return;
    }

    if (password.length < 6) {
      showAlert("error", "La contraseña debe tener al menos 6 caracteres");
      return;
    }

    if (password !== confirmPassword) {
      showAlert("error", "Las contraseñas no coinciden");
      return;
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    try {
      await db.User.create({
        username: username,
        name: name,
        cellphone: cellphone,
        password: hashedPassword,
        role: role.value,
      });
      showAlert("success", "Usuario creado exitosamente");
      setTimeout(() => {
        ipcRenderer.send("close-modal", {reload: true});
      }, 1000);
    } catch (error) {
      showAlert("error", error.message);
    }
  };

  return (
    <>
      <form
        className="space-y-6 border-t border-b border-gray-200 py-6"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col">
          <label htmlFor="name" className="text-lg font-medium text-gray-600">
            Nombre
          </label>
          <Input
            type="text"
            id="name"
            className="mt-2 p-2 border border-gray-300 rounded-md"
            value={name}
            onChange={handleNameChange}
            isHandleChange={true}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="userName"
            className="text-lg font-medium text-gray-600"
          >
            Nombre de Usuario
          </label>
          <Input
            type="text"
            id="userName"
            className="mt-2 p-2 border border-gray-300 rounded-md"
            value={username}
            onChange={handleUserNameChange}
            isHandleChange={true}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="cellphone"
            className="text-lg font-medium text-gray-600"
          >
            Celular
          </label>
          <Input
            type="text"
            id="cellphone"
            className="mt-2 p-2 border border-gray-300 rounded-md"
            value={cellphone}
            onChange={setCellphone}
            isHandleChange={true}
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor="role" className="text-lg font-medium text-gray-600">
            Rol
          </label>
          <Select
            id={"role"}
            className="mt-2 p-2 border border-gray-300 rounded-md"
            value={role.value}
            onChange={handleRoleChange}
            isHandleChange={true}
          >
            {roleOptions}
          </Select>
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="password"
            className="text-lg font-medium text-gray-600"
          >
            Contraseña
          </label>
          <Input
            type="password"
            id="password"
            className="mt-2 p-2 border border-gray-300
            rounded-md"
            value={password}
            onChange={handlePasswordChange}
            isHandleChange={true}
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="confirmPassword"
            className="text-lg font-medium text-gray-600"
          >
            Confirmar Contraseña
          </label>
          <Input
            type="password"
            id="confirmPassword"
            className="mt-2 p-2 border
            border-gray-300 rounded-md"
            value={confirmPassword}
            onChange={handleConfirmPasswordChange}
            isHandleChange={true}
          />
        </div>
        <Button
          type="submit"
          className="w-full p-3 bg-green-600 hover:bg-green-700
          text-white font-bold shadow-md rounded-md"
        >
          Crear Usuario
        </Button>
        <Button
          className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-bold shadow-md rounded-md"
          onClick={() => {
            ipcRenderer.send("close-modal");
          }}
        >
          Cancelar
        </Button>
      </form>
    </>
  );
}
