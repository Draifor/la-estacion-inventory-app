import { BrowserWindow, app, ipcMain } from "electron";
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

  if (isProd) {
    await mainWindow.loadURL("app://./");
  } else {
    const port = process.argv[2];
    await mainWindow.loadURL(`http://localhost:${port}/`);
    mainWindow.webContents.openDevTools();
  }

  ipcMain.on("open-file-dialog", (event, arg) => {
    console.log(arg);
  });

  ipcMain.on("save-file-dialog", (event, arg) => {
    console.log(arg);
  });

  ipcMain.on("save-file", (event, arg) => {
    console.log(arg);
  });

  ipcMain.on("open-file", (event, arg) => {
    console.log(arg);
  });

  ipcMain.on("save-file-as", (event, arg) => {
    console.log(arg);
  });

  ipcMain.on("edit-invoice", (event, {invoice_id}) => {
    const newWindow = createWindow("edit-invoice", {
      width: 800,
      height: 700,
      parent: mainWindow,
      modal: true,
    });

    newWindow.webContents.openDevTools();

    (async () => {
      console.log("invoice_id desde el main " + invoice_id)
      if (isProd) {
        await newWindow.loadURL(
          `app://./edit-invoice?id=${invoice_id}`
        );
      } else {
        const port = process.argv[2];
        await newWindow.loadURL(
          `http://localhost:${port}/edit-invoice?id=${invoice_id}`
        );
      }
    })();
    console.log(invoice_id);
  });

  ipcMain.on("close-edit-invoice", (event, arg) => {
    const win = BrowserWindow.getFocusedWindow();
    win.close();
  }
  );
})();

app.on("window-all-closed", () => {
  app.quit();
});
