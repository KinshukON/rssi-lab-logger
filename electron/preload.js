const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    getRssi: () => ipcRenderer.invoke('get-rssi'),
    isElectron: true,
});
