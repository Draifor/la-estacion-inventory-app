import useSession from "@/hooks/useSession";
import { useRouter } from "next/navigation";
import Button from "@/app/components/Button";
import showAlert from "./showAlert";

export default function HandleSession() {
  const { user, logout } = useSession();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    setTimeout(() => {
      router.push("/login");
      showAlert("success", "Sesión cerrada con éxito");
    }, 1000);
  };

  return (
    <>
      {user && (
        <div className="flex items-center space-x-4 text-center">
          <p className="text-white font-medium">
            Usuario: <span className="text-yellow-500">{user.username}</span>
          </p>
          <Button
            className="p-3 bg-red-600 hover:bg-red-700 text-white font-bold shadow-md rounded-md min-w-fit"
            onClick={handleLogout}
          >
            Cerrar sesión
          </Button>
        </div>
      )}
    </>
  );
}
