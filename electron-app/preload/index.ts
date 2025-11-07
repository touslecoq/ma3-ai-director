import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // Backend communication
  getBackendStatus: () => ipcRenderer.invoke('get-backend-status'),
  pingBackend: () => ipcRenderer.invoke('ping-backend'),
  
  // Menu actions listener
  onMenuAction: (callback: (action: string) => void) => {
    ipcRenderer.on('menu-action', (_event, action) => callback(action));
  },
  
  // Remove listener
  removeMenuActionListener: () => {
    ipcRenderer.removeAllListeners('menu-action');
  }
});

// Type definitions for the exposed API
export interface ElectronAPI {
  getBackendStatus: () => Promise<{ running: boolean; port: number }>;
  pingBackend: () => Promise<{ success: boolean; error?: string }>;
  onMenuAction: (callback: (action: string) => void) => void;
  removeMenuActionListener: () => void;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
