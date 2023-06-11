"use client";
import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import Input from "../components/Input";
import Button from "../components/Button";
import showAlert from "../components/showAlert";
import hashPassword from "@/utils/hashPassword";
import db from "@/utils/database";
import Select from "../components/Select";
import bcrypt from "bcryptjs";

const roles = [
  { value: "admin", label: "Administrador" },
  { value: "user", label: "Usuario" },
];

export default function createUser() {
  const [username, setUsername] = useState("");
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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // if (password === confirmPassword) {
    //   const response = await fetch("http://localhost:3000/api/create-user", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ userName, password }),
    //   });
    //   const data = await response.json();
    //   console.log(data);
    //   if (data.success) {
    //     showAlert("success", data.message);
    //     setTimeout(() => {
    //       window.location.href = "/";
    //     }, 1000);
    //   } else {
    //     showAlert("error", data.message);
    //   }
    // } else {
    //   showAlert("error", "Las contraseñas no coinciden");
    // }
    if (password !== confirmPassword) {
      showAlert("error", "Las contraseñas no coinciden");
      return;
    }

    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log("Contraseña cifrada:", hashedPassword);
    console.log("role", role.value);
    console.log("userName", username);
    try {
      await db.User.create({
        username: username,
        password: hashedPassword,
        role: role.value,
      });
      showAlert("success", "Usuario creado exitosamente");
      setTimeout(() => {
        router.push("/");
      }, 1000);
    } catch (error) {
      showAlert("error", error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Crear Usuario</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <div className="container max-w-lg px-4 py-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-4xl font-bold text-center text-blue-600">
            Crear Usuario
          </h1>
          <form
            className="space-y-6 border-t border-b border-gray-200 py-6"
            onSubmit={handleSubmit}
          >
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
                htmlFor="role"
                className="text-lg font-medium text-gray-600"
              >
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
          </form>
        </div>
      </div>
    </>
  );
}
