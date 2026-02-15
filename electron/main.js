const { app, BrowserWindow, ipcMain, shell, dialog } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    const isDev = process.env.NODE_ENV === 'development';
    const appUrl = process.env.APP_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://rssi-lab-logger.vercel.app';

    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        // Load from deployed URL for cloud sync (auth, API)
        mainWindow.loadURL(appUrl).catch((err) => {
            console.error('Failed to load app URL:', err);
            dialog.showErrorBox('Load Error', 'Failed to load application.\n' + err.message);
        });
    }

    const { Menu } = require('electron');
    const menu = Menu.buildFromTemplate([
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' }
            ]
        },
        {
            label: 'Window',
            submenu: [
                { role: 'minimize' },
                { role: 'close' }
            ]
        }
    ]);
    Menu.setApplicationMenu(menu);

    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    mainWindow.webContents.on('render-process-gone', (event, details) => {
        console.error('Render process gone:', details);
        dialog.showErrorBox('Crash', 'The application crashed: ' + details.reason);
    });
}

// IPC Handler for RSSI — uses spawn (no shell) for security
const AIRPORT_PATH = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport';

ipcMain.handle('get-rssi', async () => {
    return new Promise((resolve, reject) => {
        const child = spawn(AIRPORT_PATH, ['-I'], {
            shell: false,
        });

        let stdout = '';
        let stderr = '';

        child.stdout?.on('data', (data) => { stdout += data; });
        child.stderr?.on('data', (data) => { stderr += data; });

        child.on('error', (err) => {
            reject(err.message);
        });

        child.on('close', (code) => {
            if (code !== 0) {
                reject(stderr || `airport exited with code ${code}`);
                return;
            }
            const match = stdout.match(/agrCtlRSSI:\s*(-?\d+)/);
            if (match && match[1]) {
                const rssi = parseInt(match[1], 10);
                if (rssi >= -100 && rssi <= 0) {
                    resolve(rssi);
                } else {
                    reject('RSSI out of valid range (-100 to 0)');
                }
            } else {
                reject('Could not find RSSI in airport output');
            }
        });
    });
});

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
