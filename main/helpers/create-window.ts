import {
  screen,
  BrowserWindow,
  BrowserWindowConstructorOptions,
  Menu,
  MenuItem,
} from "electron";
import Store from "electron-store";

export default (
  windowName: string,
  options: BrowserWindowConstructorOptions
): BrowserWindow => {
  const key = "window-state";
  const name = `window-state-${windowName}`;
  const store = new Store({ name });
  const defaultSize = {
    width: options.width,
    height: options.height,
  };
  let state = {};
  let win;

  const restore = () => store.get(key, defaultSize);

  const getCurrentPosition = () => {
    const position = win.getPosition();
    const size = win.getSize();
    return {
      x: position[0],
      y: position[1],
      width: size[0],
      height: size[1],
    };
  };

  const windowWithinBounds = (windowState, bounds) => {
    return (
      windowState.x >= bounds.x &&
      windowState.y >= bounds.y &&
      windowState.x + windowState.width <= bounds.x + bounds.width &&
      windowState.y + windowState.height <= bounds.y + bounds.height
    );
  };

  const resetToDefaults = () => {
    const bounds = screen.getPrimaryDisplay().bounds;
    return Object.assign({}, defaultSize, {
      x: (bounds.width - defaultSize.width) / 2,
      y: (bounds.height - defaultSize.height) / 2,
    });
  };

  const ensureVisibleOnSomeDisplay = (windowState) => {
    const visible = screen.getAllDisplays().some((display) => {
      return windowWithinBounds(windowState, display.bounds);
    });
    if (!visible) {
      // Window is partially or fully not visible now.
      // Reset it to safe defaults.
      return resetToDefaults();
    }
    return windowState;
  };

  const saveState = () => {
    if (!win.isMinimized() && !win.isMaximized()) {
      Object.assign(state, getCurrentPosition());
    }
    store.set(key, state);
  };

  state = ensureVisibleOnSomeDisplay(restore());

  const menuOptions = {
    file: {
      label: "Archivo",
      submenu: [
        {
          label: "Nueva Factura",
          accelerator: "CmdOrCtrl+N",
          eventName: "new-invoice",
        },
        {
          label: "Nuevo Proveedor",
          accelerator: "CmdOrCtrl+Shift+N",
          eventName: "new-supplier",
        },
        {
          label: "Nuevo Producto",
          accelerator: "CmdOrCtrl+Shift+P",
          eventName: "new-product",
        },
        {
          label: "Nuevo Cliente",
          accelerator: "CmdOrCtrl+Shift+C",
          eventName: "new-customer",
        },
        {
          label: "Nuevo Usuario",
          accelerator: "CmdOrCtrl+Shift+U",
          eventName: "new-user",
        },
        {
          label: "Nuevo Gasto",
          accelerator: "CmdOrCtrl+Shift+E",
          eventName: "new-expense",
        },
      ],
    },
    edit: {
      label: "Editar",
      submenu: [
        {
          label: "Deshacer",
          accelerator: "CmdOrCtrl+Z",
          role: "undo",
        },
        {
          label: "Rehacer",
          accelerator: "Shift+CmdOrCtrl+Z",
          role: "redo",
        },
        { type: "separator" },
        {
          label: "Cortar",
          accelerator: "CmdOrCtrl+X",
          role: "cut",
        },
        {
          label: "Copiar",
          accelerator: "CmdOrCtrl+C",
          role: "copy",
        },
        {
          label: "Pegar",
          accelerator: "CmdOrCtrl+V",
          role: "paste",
        },
        {
          label: "Seleccionar Todo",
          accelerator: "CmdOrCtrl+A",
          role: "selectAll",
        },
      ],
    },
    view: {
      label: "Ver",
      submenu: [
        {
          label: "Recargar",
          accelerator: "CmdOrCtrl+R",
          eventName: "reload",
        },
        {
          label: "Pantalla Completa",
          accelerator: process.platform === "darwin" ? "Ctrl+Command+F" : "F11",
          eventName: "toggle-fullscreen",
        },
        {
          label: "Herramientas de Desarrollo",
          accelerator:
            process.platform === "darwin" ? "Alt+Command+I" : "Ctrl+Shift+I",
          eventName: "toggle-devtools",
        },
      ],
    },
    window: {
      label: "Ventana",
      submenu: [
        {
          label: "Minimizar",
          accelerator: "CmdOrCtrl+M",
          role: "minimize",
        },
        {
          label: "Cerrar",
          accelerator: "CmdOrCtrl+W",
          role: "close",
        },
      ],
    },
    help: {
      label: "Ayuda",
      submenu: [
        {
          label: "Aprender Más",
          eventName: "learn-more",
        },
      ],
    },
  };

  const menu = new Menu();

  function createMenuItem(option) {
    const menuItem = new MenuItem({
      label: option.label,
      submenu: option.submenu.map((submenuItem) => {
        return new MenuItem({
          label: submenuItem.label,
          accelerator: submenuItem.accelerator,
          click: () => {
            win.webContents.send(submenuItem.eventName);
          },
          role: submenuItem.role,
        });
      }),
    });

    return menuItem;
  }

  Object.values(menuOptions).forEach((option) => {
    menu.append(createMenuItem(option));
  });

  // menu.append(
  //   new MenuItem({
  //     label: menuOptions.help.label,
  //     role: "help",
  //     submenu: [
  //       {
  //         label: menuOptions.help.label,
  //         click: () => {
  //           require("electron").shell.openExternal("https://electronjs.org");
  //         },
  //       },
  //     ],
  //   })
  // );

  Menu.setApplicationMenu(menu);

  const browserOptions: BrowserWindowConstructorOptions = {
    ...state,
    ...options,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      ...options.webPreferences,
    },
  };
  win = new BrowserWindow(browserOptions);

  // win.maximize();
  win.on("close", saveState);

  console.log("Holiiiii");
  return win;
};
