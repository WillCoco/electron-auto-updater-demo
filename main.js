/**
 * Created by xuke on 2017/10/14.
 */
var electron = require('electron');  // 控制应用生命周期的模块。
var app = electron.app;
var BrowserWindow = electron.BrowserWindow;  // 创建原生浏览器窗口的模块
var url = require('url');
var path = require('path');
var Menu = electron.Menu;
var autoUpdater = require("electron-updater").autoUpdater;

// 保持一个对于 window 对象的全局引用，不然，当 JavaScript 被 GC，
// window 会被自动地关闭
var mainWindow = null;
//检查


function createWindow() {
  // 创建浏览器窗口。
  mainWindow = new BrowserWindow({width: 800, height: 600});

//检查
  autoUpdater.on('checking-for-update', () => {
      mainWindow.webContents.on('did-finish-load', function() {
        mainWindow.webContents.send('tocheck', autoUpdater.currentVersion);
      });
  })

//可用
  autoUpdater.on('update-available', (info) => {
    mainWindow.webContents.send('update_available', info);
    mainWindow.webContents.on('did-finish-load', function() {
      mainWindow.webContents.send('update_available', info);
    });
  })

//不可用
  autoUpdater.on('update-not-available', (info) => {
    mainWindow.webContents.send('update_available', info);
    mainWindow.webContents.on('did-finish-load', function() {
      mainWindow.webContents.send('update_available', info);
    });
  })

//错误
  autoUpdater.on('error', (err) => {
    mainWindow.webContents.send('error', err);
    console.log(err,444)
    mainWindow.webContents.on('did-finish-load', function() {
      mainWindow.webContents.send('error', err);
    });
  })

//下载中
  autoUpdater.on('download-progress', (progressObj) => {
    let log_message = "Download speed: " + progressObj.bytesPerSecond;
    log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
    log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
    // mainWindow.webContents.on('did-finish-load', function() {
      mainWindow.webContents.send('loading', log_message);
    // });
  })

  autoUpdater.on('update-downloaded', (ev, info) => {
    // Wait 5 seconds, then quit and install
    setTimeout(function() {
      autoUpdater.quitAndInstall();
    }, 5000)
  })

  // 加载应用的 index.html
  // mainWindow.loadURL('file://' + __dirname + '/index.html');
  mainWindow.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file',
    slashes: true
  }));

  // 打开开发工具
  mainWindow.openDevTools();

  // 当 window 被关闭，这个事件会被发出
  mainWindow.on('closed', function() {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 但这次不是。
    mainWindow = null;
  });

  autoUpdater.checkForUpdatesAndNotify();
}

// 当所有窗口被关闭了，退出。
app.on('window-all-closed', function() {
  // 在 OS X 上，通常用户在明确地按下 Cmd + Q 之前
  // 应用会保持活动状态
  if (process.platform != 'darwin') {
    app.quit();
  }
});

// 当 Electron 完成了初始化并且准备创建浏览器窗口的时候
// 这个方法就被调用
app.on('ready', createWindow);


app.on('activate', function() {
  if (mainWindow === null) {
    createWindow();
  }
});
