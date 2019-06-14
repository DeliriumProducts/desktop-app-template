import { app } from 'electron';
import serve from 'electron-serve';
import { createWindow, exitOnChange } from './helpers';

const isProd = process.env.NODE_ENV === 'production';

if (isProd) {
  serve({ directory: 'app' });
} else {
  exitOnChange();

  const userDataPath = app.getPath('userData');
  app.setPath('userData', `${userDataPath} (development)`);
}

(async () => {
  // Can't use app.on('ready',...)
  // https://github.com/sindresorhus/electron-serve/issues/15
  await app.whenReady();
  const mainWindow = createWindow('main', {
    width: 1000,
    height: 600
  });

  mainWindow.setMenuBarVisibility(false);

  if (isProd) {
    mainWindow.loadURL('app://./');
  } else {
    const homeUrl = 'http://localhost:3000';
    mainWindow.loadURL(homeUrl);
    mainWindow.webContents.openDevTools();
  }
  mainWindow.removeMenu();
})();

app.on('window-all-closed', () => {
  app.quit();
});
