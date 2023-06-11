import { useContext } from "react";
import { InvoicesContext } from "@/hooks/useHadleContext";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import showAlert from "./showAlert";

export default function HandleSession() {
  const router = useRouter();
  const { user, setUser } = useContext(InvoicesContext);
  console.log("user", user);

  const handleLogout = () => {
    setUser(null);
    setTimeout(() => {
      router.push("/login");
      showAlert("success", "Sesión cerrada con éxito");
    }, 1000);
  };

  return (
    <>
      {user && (
        <div className="flex items-center space-x-4">
          <p className="text-white font-medium">
            Usuario: <span className="text-yellow-500">{user.username}</span>
          </p>
          <Button
            className="p-3 bg-red-600 hover:bg-red-700 text-white font-bold shadow-md rounded-md"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </div>
      )}
    </>
  );
}