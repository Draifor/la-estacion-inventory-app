import { BrowserWindow, app, ipcMain, session } from "electron";
import serve from "electron-serve";
import { createWindow } from "./helpers";

const isProd: boolean = process.env.NODE_ENV === "production";

if (isProd) {
  serve({ directory: "app" });
} else {
  app.setPath("userData", `${app.getPath("userData")} (development)`);
}

(async () => {
  await app.whenReady();

  const mainWindow = createWindow("main", {
    width: 1000,
    height: 600,
  });

  mainWindow.maximize();

  const port = !isProd ? process.argv[2] : "";
  const mainURL = isProd ? "app://./" : `http://localhost:${port}/`;

  await mainWindow.loadURL(mainURL);

  if (!isProd) {
    mainWindow.webContents.openDevTools();
  }

  const defaultSession = session.defaultSession;

  ipcMain.on("get-session", async (event, arg) => {
    try {
      const sessionCookies = await defaultSession.cookies.get({
        url: mainURL,
        name: "session",
      });
      const session = sessionCookies[0]
        ? JSON.parse(sessionCookies[0].value)
        : null;
      event.reply("session-updated", { user: session ? session.user : null });
    } catch (error) {
      console.log(error);
    }
  });

  ipcMain.on("login", async (event, { username, role }) => {
    try {
      const session = {
        user: {
          username,
          role,
        },
      };
      await defaultSession.cookies.set({
        url: mainURL,
        name: "session",
        value: JSON.stringify(session),
      });
      event.reply("session-updated", { user: session.user });
    } catch (error) {
      console.log(error);
    }
  });

  ipcMain.on("logout", async (event) => {
    try {
      await defaultSession.cookies.remove(mainURL, "session");
      event.reply("session-updated", { user: null });
    } catch (error) {
      console.log(error);
    }
  });

  ipcMain.on("open-modal", (event, { name, url }) => {
    const newWindow = createWindow(name, {
      width: 800,
      height: 700,
      parent: mainWindow,
      modal: true,
    });

    (async () => {
      await newWindow.loadURL(`${mainURL + url}`);
    })();
    if (!isProd) newWindow.webContents.openDevTools();
  });

  ipcMain.on("close-modal", (event, arg) => {
    const win = BrowserWindow.getFocusedWindow();
    win.close();
    if (arg?.reload) mainWindow.webContents.reload();
  });
})();

app.on("window-all-closed", () => {
  app.quit();
});
