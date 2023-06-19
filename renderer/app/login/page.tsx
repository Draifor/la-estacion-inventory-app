"use client";
import { useEffect, useState } from "react";
import useSession from "@/hooks/useSession";
import Head from "next/head";
import { useRouter } from "next/navigation";
import Input from "@/app/components/Input";
import Button from "@/app/components/Button";
import db from "@/utils/database";
import showAlert from "@/app/components/showAlert";
import bcrypt from "bcryptjs";

export default function Login() {
  const { user, loading, login } = useSession();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  useEffect(() => {
    console.log("user", user);
    if (loading) return;
    if (user) {
      router.push("/");
    }
  }, [user, loading]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!username) {
      showAlert("warning", "Debe ingresar un nombre de usuario");
      return;
    }
    if (!password) {
      showAlert("warning", "Debe ingresar una contraseña");
      return;
    }

    const fetchLogin = async () => {
      try {
        const user = await db.User.findOne({
          where: {
            username,
          },
        });
        console.log("result", user);
        console.log(user);
        if (user) {
          const isMatch = await bcrypt.compare(password, user.password);
          console.log("isMatch", isMatch);
          if (isMatch) {
            login({ username: user.username, role: user.role });
            // setTimeout(() => {
            showAlert("success", `Bienvenido ${user.username}`);
              router.push("/");
            // }, 1000);
          } else {
            showAlert("error", "Contraseña incorrecta");
          }
        } else {
          showAlert("error", "Usuario o contraseña incorrectos");
        }
      } catch (error) {
        console.log(error);
        showAlert("error", "Error al iniciar sesión");
      }
    };
    fetchLogin();
  };

  // Mostrar un indicador de carga mientras se está obteniendo la sesión del usuario
  if (loading) {
    return <div className="text-4xl font-bold text-center text-blue-600">Cargando...</div>;
  }

  return (
    <>
      <Head>
        <title>Iniciar Sesión</title>
      </Head>
      <div className="flex flex-col items-center justify-center min-h-[600px]">
        <div className="container max-w-lg px-4 py-8 bg-white shadow-lg rounded-lg">
          <h1 className="text-4xl font-bold text-center text-blue-600">
            Bienvenido a <span className="text-yellow-500">LA ESTACIÓN</span>
          </h1>
          <p className="text-2xl font-bold text-center text-gray-700 mt-4">
            Sistema de Inventarios
          </p>
          <form
            className="space-y-6 border-t border-b border-gray-200 py-6"
            onSubmit={handleSubmit}
          >
            <div className="flex flex-col">
              <label
                htmlFor="username"
                className="text-lg font-medium text-gray-600"
              >
                Nombre de Usuario
              </label>
              <Input
                type="text"
                id="username"
                className="mt-2 p-2 border border-gray-300 rounded-md"
                value={username}
                onChange={handleUsernameChange}
                isHandleChange={true}
                autoFocus={true}
              />
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
                className="mt-2 p-2 border border-gray-300 rounded-md"
                value={password}
                onChange={handlePasswordChange}
                isHandleChange={true}
              />
            </div>
            <Button type="submit" className="w-full p-3">
              Iniciar Sesión
            </Button>
          </form>
        </div>
      </div>
    </>
  );
}
