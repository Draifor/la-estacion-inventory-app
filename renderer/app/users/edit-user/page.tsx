"use client";
import { useState, useEffect } from "react";
import db from "@/utils/database";
import showAlert from "@/components/showAlert";
import Select from "@/components/Select";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { ipcRenderer } from "electron";
import bcrypt from "bcryptjs";

const roles = [
  { value: "admin", label: "Administrador" },
  { value: "user", label: "Usuario" },
];

export default function EditInvoice({ searchParams }) {
  const { id } = searchParams;
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [cellphone, setCellphone] = useState("");
  const [role, setRole] = useState(roles[0]);
  const [oldPassword, setOldPassword] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordChanged, setIsPasswordChanged] = useState(false);

  useEffect(() => {
    fetchUser();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setUsername(user.username);
      setCellphone(user.cellphone);
      setRole(roles.find((role) => role.value === user.role));
    }
  }, [user]);

  const fetchUser = async () => {
    try {
      const result = await db.User.findOne({
        where: {
          user_id: id,
        },
      });
      setUser(result.dataValues);
    } catch (error) {
      showAlert("error", "No se pudo obtener la información del usuario");
    }
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleRoleChange = (event) => {
    const newRol = roles.find((role) => role.value === event.target.value);
    setRole(newRol);
  };

  const handleOldPasswordChange = (event) => {
    setOldPassword(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
  };

  const phoneRegex = /^\d{3} \d{3} \d{4}$/;

  const validatefields = async () => {
    if (name.trim() === "") {
      showAlert("warning", "Ingresa el nombre del usuario");
      return;
    }
    if (username.trim() === "") {
      showAlert("warning", "Ingresa el nombre de usuario");
      return;
    }
    if (username.trim().length < 3) {
      showAlert(
        "warning",
        "El nombre de usuario debe tener al menos 3 caracteres"
      );
      return;
    }
    if (cellphone && cellphone?.trim() !== "") {
      if (!phoneRegex.test(cellphone)) {
        showAlert("warning", "Ingresa un número de celular válido");
        return;
      }
    }
    let hash = user.password;
    if (isPasswordChanged) {
      if (oldPassword.trim() === "") {
        showAlert("warning", "Ingresa la contraseña actual");
        return;
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        showAlert("warning", "La contraseña actual no es correcta");
        return;
      }
      if (password.trim() === "") {
        showAlert("warning", "Ingresa la nueva contraseña");
        return;
      }
      if (password.length < 6) {
        showAlert("warning", "La contraseña debe tener al menos 6 caracteres");
        return;
      }
      if (confirmPassword.trim() === "") {
        showAlert("warning", "Confirma la nueva contraseña");
        return;
      }
      if (password !== confirmPassword) {
        showAlert("warning", "Las contraseñas no coinciden");
        return;
      }
      const salt = bcrypt.genSaltSync(10);
      hash = bcrypt.hashSync(password, salt);
    }
    return {
      user_id: id,
      name,
      username,
      cellphone,
      role: role.value,
      password: hash,
    };
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const updatedUser = await validatefields();
    if (!updatedUser) return;
    setUser(updatedUser);
    const result = await db.User.update(updatedUser, {
      where: {
        user_id: id,
      },
    });
    setTimeout(() => {
      if (result) {
        showAlert("success", "Usuario actualizado exitosamente");
        setTimeout(() => {
          ipcRenderer.send("close-modal", { reload: true });
        }, 1000);
      } else {
        showAlert("error", "No se pudo actualizar el usuario");
      }
    }, 1000);
  };

  const roleOptions = roles.map((role) => {
    return (
      <option key={role.value} value={role.value}>
        {role.label}
      </option>
    );
  });

  console.log("id", id);
  console.log("user", user);

  return (
    <div className="flex flex-col items-center justify-center my-8 min-h-screen">
      <div className="container max-w-lg px-4 py-6 bg-white shadow-lg rounded-lg">
        <h1 className="text-4xl font-bold text-center text-blue-600">
          Editar Usuario
        </h1>
        <form
          onSubmit={handleSubmit}
          className="space-y-6 border-t border-b border-gray-200 py-6"
        >
          <div className="flex flex-col md:flex-row md:space-x-8">
            <label
              htmlFor="username"
              className="text-lg font-medium text-gray-600 md:w-1/2"
            >
              Usuario
            </label>
            <Input
              type="text"
              id="username"
              className="mt-1 p-2 border border-gray-300 rounded-md md:w-1/2"
              value={username}
              onChange={handleUsernameChange}
              isHandleChange={true}
            />
          </div>
          <div className="flex flex-col md:flex-row md:space-x-8">
            <label
              htmlFor="name"
              className="text-lg font-medium text-gray-600 md:w-1/2"
            >
              Nombre
            </label>
            <Input
              type="text"
              id="name"
              className="mt-1 p-2 border border-gray-300 rounded-md md:w-1/2"
              value={name}
              onChange={handleNameChange}
              isHandleChange={true}
            />
          </div>
          <div className="flex flex-col md:flex-row md:space-x-8">
            <label
              htmlFor="cellphone"
              className="text-lg font-medium text-gray-600 md:w-1/2"
            >
              Celular
            </label>
            <Input
              type="text"
              id="cellphone"
              className="mt-1 p-2 border border-gray-300 rounded-md md:w-1/2"
              value={cellphone}
              onChange={setCellphone}
              isHandleChange={true}
            />
          </div>
          <div className="flex flex-col md:flex-row md:space-x-8">
            <label
              htmlFor="supplier"
              className="text-lg font-medium text-gray-600 md:w-2/5"
            >
              Rol
            </label>
            <Select
              id="role"
              className="mt-1 p-2 border border-gray-300 rounded-md"
              value={
                role ? role.value : roles.find((role) => role.value === "user")
              }
              onChange={handleRoleChange}
              isHandleChange={true}
            >
              {roleOptions}
            </Select>
          </div>
          {isPasswordChanged ? (
            <>
              <div className="flex flex-col md:flex-row md:space-x-8">
                <label
                  htmlFor="oldPassword"
                  className="text-lg font-medium text-gray-600 md:w-1/2"
                >
                  Contraseña Actual
                </label>
                <Input
                  type="password"
                  id="oldPassword"
                  className="mt-1 p-2 border border-gray-300 rounded-md md:w-1/2"
                  value={oldPassword}
                  onChange={handleOldPasswordChange}
                  isHandleChange={true}
                />
              </div>
              <div className="flex flex-col md:flex-row md:space-x-8">
                <label
                  htmlFor="password"
                  className="text-lg font-medium text-gray-600 md:w-1/2"
                >
                  Nueva Contraseña
                </label>
                <Input
                  type="password"
                  id="password"
                  className="mt-1 p-2 border border-gray-300 rounded-md md:w-1/2"
                  value={password}
                  onChange={handlePasswordChange}
                  isHandleChange={true}
                />
              </div>
              <div className="flex flex-col md:flex-row md:space-x-8">
                <label
                  htmlFor="confirmPassword"
                  className="text-lg font-medium text-gray-600 md:w-1/2"
                >
                  Confirmar Contraseña
                </label>
                <Input
                  type="password"
                  id="confirmPassword"
                  className="mt-1 p-2 border border-gray-300 rounded-md md:w-1/2"
                  value={confirmPassword}
                  onChange={handleConfirmPasswordChange}
                  isHandleChange={true}
                />
              </div>
            </>
          ) : (
            <Button
              className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-bold shadow-md rounded-md"
              onClick={() => {
                setIsPasswordChanged(true);
              }}
            >
              Cambiar Contraseña
            </Button>
          )}
          <div className="flex flex-col md:flex-row gap-3">
            <Button
              type="submit"
              className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-bold shadow-md rounded-md"
            >
              Actualizar
            </Button>
            <Button
              className="w-full p-3 bg-green-600 hover:bg-green-700 text-white font-bold shadow-md rounded-md"
              onClick={() => {
                ipcRenderer.send("close-modal");
              }}
            >
              Cancelar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
