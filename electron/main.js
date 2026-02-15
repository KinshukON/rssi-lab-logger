const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');



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

    // Check if we are in dev mode (running via localhost)
    const isDev = process.env.NODE_ENV === 'development';

    if (isDev) {
        mainWindow.loadURL('http://localhost:3000');
        mainWindow.webContents.openDevTools();
    } else {
        // In production, we can either serve the static export or load the live URL.
        // For this assignment, leading the live URL is often easiest for updates, 
        // but typically you'd load a local file: mainWindow.loadFile(path.join(__dirname, '../out/index.html'));
        // Let's try to load the local build first.
        mainWindow.loadFile(path.join(__dirname, '../out/index.html')).catch(() => {
            console.log('Failed to load local build, falling back to live URL? No, best to fail fast.');
        });
    }

    // external links should open in default browser
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });
}

// IPC Handler for RSSI
ipcMain.handle('get-rssi', async () => {
    return new Promise((resolve, reject) => {
        // macOS command to get Wi-Fi details
        const cmd = '/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I';

        exec(cmd, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                reject(error.message);
                return;
            }
            // Parse stdout for "agrCtlRSSI: -xx"
            const match = stdout.match(/agrCtlRSSI:\s*(-?\d+)/);
            if (match && match[1]) {
                const rssi = parseInt(match[1], 10);
                resolve(rssi);
            } else {
                reject("Could not find RSSI in airport output");
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
