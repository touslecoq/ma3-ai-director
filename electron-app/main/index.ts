import { app, BrowserWindow, ipcMain, Menu } from 'electron';
import * as path from 'path';
import { spawn, ChildProcess } from 'child_process';

// Python backend process
let pythonProcess: ChildProcess | null = null;

// Main window
let mainWindow: BrowserWindow | null = null;

// Development mode check
const isDev = process.env.NODE_ENV === 'development';

/**
 * Start Python backend server
 */
function startPythonBackend(): void {
  console.log('Starting Python backend...');
  
  const pythonPath = isDev
    ? path.join(__dirname, '../../ai-engine/main.py')
    : path.join(process.resourcesPath, 'ai-engine/main.py');
  
  pythonProcess = spawn('python3', [pythonPath], {
    stdio: 'pipe',
    cwd: path.dirname(pythonPath)
  });

  pythonProcess.stdout?.on('data', (data) => {
    console.log(`[Python]: ${data.toString()}`);
  });

  pythonProcess.stderr?.on('data', (data) => {
    console.error(`[Python Error]: ${data.toString()}`);
  });

  pythonProcess.on('close', (code) => {
    console.log(`Python backend exited with code ${code}`);
    pythonProcess = null;
  });

  console.log('Python backend started');
}

/**
 * Stop Python backend server
 */
function stopPythonBackend(): void {
  if (pythonProcess) {
    console.log('Stopping Python backend...');
    pythonProcess.kill();
    pythonProcess = null;
  }
}

/**
 * Create main application window
 */
function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 700,
    title: 'GrandMA3 AI Director',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, '../preload/index.js')
    },
    backgroundColor: '#1a1a1a',
    show: false, // Don't show until ready
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow?.show();
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Create application menu
  createMenu();
}

/**
 * Create application menu
 */
function createMenu(): void {
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Project',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'new-project');
          }
        },
        {
          label: 'Open Project',
          accelerator: 'CmdOrCtrl+O',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'open-project');
          }
        },
        {
          label: 'Save Project',
          accelerator: 'CmdOrCtrl+S',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'save-project');
          }
        },
        { type: 'separator' },
        { role: 'quit' }
      ]
    },
    {
      label: 'MA3',
      submenu: [
        {
          label: 'Connect to Console',
          accelerator: 'CmdOrCtrl+Shift+C',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'connect-ma3');
          }
        },
        {
          label: 'Disconnect',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'disconnect-ma3');
          }
        },
        { type: 'separator' },
        {
          label: 'Import Show Structure',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'import-show');
          }
        }
      ]
    },
    {
      label: 'Media',
      submenu: [
        {
          label: 'Upload Video',
          accelerator: 'CmdOrCtrl+U',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'upload-video');
          }
        },
        {
          label: 'Upload Audio',
          accelerator: 'CmdOrCtrl+M',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'upload-audio');
          }
        }
      ]
    },
    {
      label: 'Audio',
      submenu: [
        {
          label: 'Start Monitoring',
          accelerator: 'Space',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'toggle-audio');
          }
        }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' },
        { type: 'separator' },
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' }
      ]
    },
    {
      label: 'Help',
      submenu: [
        {
          label: 'Documentation',
          click: async () => {
            const { shell } = require('electron');
            await shell.openExternal('https://github.com/yourusername/grandma3-ai-director');
          }
        },
        { type: 'separator' },
        {
          label: 'About',
          click: () => {
            mainWindow?.webContents.send('menu-action', 'show-about');
          }
        }
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// IPC Handlers

ipcMain.handle('get-backend-status', async () => {
  return {
    running: pythonProcess !== null,
    port: 8000
  };
});

ipcMain.handle('ping-backend', async () => {
  try {
    // In production, would actually ping the backend
    return { success: true };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
});

// App lifecycle events

app.whenReady().then(() => {
  console.log('App ready, starting services...');
  
  // Start Python backend
  startPythonBackend();
  
  // Wait a moment for backend to start, then create window
  setTimeout(() => {
    createWindow();
  }, 2000);

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    stopPythonBackend();
    app.quit();
  }
});

app.on('before-quit', () => {
  stopPythonBackend();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

console.log('Electron main process initialized');
