import { useEffect, useState } from "react";
import { ipcRenderer } from "electron";

type user = {
  username: string;
  role: string;
};

export default function useSession() {
  const [user, setUser] = useState<user | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLogin, setIsLogin] = useState(false);

  useEffect(() => {
    setIsLogin(true);
    ipcRenderer.send("get-session");

    const handleSessionUpdated = (event, session) => {
      setIsLogin(!!session.user);
      setUser(session.user);
      setLoading(false);
    };

    ipcRenderer.on("session-updated", handleSessionUpdated);

    return () => {
      ipcRenderer.removeAllListeners("session-updated");
    };
  }, []);

  const login = ({ username, role }) => {
    ipcRenderer.send("login", { username, role });
  };

  const logout = () => {
    ipcRenderer.send("logout");
  };

  return { user, loading, isLogin, login, logout };
}
