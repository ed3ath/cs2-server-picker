"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("electron"),
    app = _require.app,
    BrowserWindow = _require.BrowserWindow,
    ipcMain = _require.ipcMain;

var _require2 = require("child_process"),
    exec = _require2.exec;

var path = require("path");

var fs = require("fs");

var axios = require("axios");

var Store = require("electron-store");

var store = new Store();
var win = null;
var args = process.argv.slice(1),
    serve = args.some(function (val) {
  return val === "--serve";
});

function createWindow() {
  // Create the browser window.
  win = new BrowserWindow({
    x: 0,
    y: 0,
    title: "CS2 Server Picker (v".concat(process.env.npm_package_version, ")"),
    width: 1380,
    height: 780,
    minWidth: 1280,
    minHeight: 720,
    center: true,
    resizable: true,
    autoHideMenuBar: true,
    webPreferences: {
      nodeIntegration: true,
      allowRunningInsecureContent: serve,
      contextIsolation: false
    }
  });

  if (serve) {
    var debug = require("electron-debug");

    debug();

    require("electron-reloader")(module);

    win.loadURL("http://localhost:4200");
  } else {
    // Path when running electron executable
    var pathIndex = "./index.html";

    if (fs.existsSync(path.join(__dirname, "../dist/index.html"))) {
      // Path when running electron in local folder
      pathIndex = "../dist/index.html";
    }

    var url = new URL(path.join("file:", __dirname, pathIndex));
    win.loadURL(url.href);
  } // Emitted when the window is closed.


  win.on("closed", function () {
    // Dereference the window object, usually you would store window
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null;
  });
  win.center();
  return win;
}

try {
  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  // Added 400 ms to fix the black background issue while using transparent window. More detais at https://github.com/electron/electron/issues/15947
  app.on("ready", function () {
    return setTimeout(createWindow, 400);
  }); // Quit when all windows are closed.

  app.on("window-all-closed", function () {
    // On OS X it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });
  app.on("activate", function () {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
      createWindow();
    }
  });
  ipcMain.on("getServers", function _callee(e) {
    return regeneratorRuntime.async(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            e.preventDefault();
            _context.prev = 1;
            _context.next = 4;
            return regeneratorRuntime.awrap(getServers());

          case 4:
            e.returnValue = _context.sent;
            _context.next = 10;
            break;

          case 7:
            _context.prev = 7;
            _context.t0 = _context["catch"](1);
            console.log(_context.t0); // console.error("Error getting servers:", error);
            // event.reply("servers", []);

          case 10:
          case "end":
            return _context.stop();
        }
      }
    }, null, null, [[1, 7]]);
  });
  ipcMain.on("blockServer", function _callee3(e, server) {
    return regeneratorRuntime.async(function _callee3$(_context3) {
      while (1) {
        switch (_context3.prev = _context3.next) {
          case 0:
            e.preventDefault();
            _context3.prev = 1;
            _context3.next = 4;
            return regeneratorRuntime.awrap(Promise.all(server.relays.map(function _callee2(relay) {
              return regeneratorRuntime.async(function _callee2$(_context2) {
                while (1) {
                  switch (_context2.prev = _context2.next) {
                    case 0:
                      if (!relay.ipv4) {
                        _context2.next = 3;
                        break;
                      }

                      _context2.next = 3;
                      return regeneratorRuntime.awrap(blockIp(relay.ipv4));

                    case 3:
                    case "end":
                      return _context2.stop();
                  }
                }
              });
            })));

          case 4:
            storeServer(server.key);
            e.returnValue = true;
            _context3.next = 12;
            break;

          case 8:
            _context3.prev = 8;
            _context3.t0 = _context3["catch"](1);
            console.log(_context3.t0);
            e.returnValue = false;

          case 12:
          case "end":
            return _context3.stop();
        }
      }
    }, null, null, [[1, 8]]);
  });
  ipcMain.on("unBlockServer", function _callee5(e, server) {
    return regeneratorRuntime.async(function _callee5$(_context5) {
      while (1) {
        switch (_context5.prev = _context5.next) {
          case 0:
            e.preventDefault();
            _context5.prev = 1;
            _context5.next = 4;
            return regeneratorRuntime.awrap(Promise.all(server.relays.map(function _callee4(relay) {
              return regeneratorRuntime.async(function _callee4$(_context4) {
                while (1) {
                  switch (_context4.prev = _context4.next) {
                    case 0:
                      if (!relay.ipv4) {
                        _context4.next = 3;
                        break;
                      }

                      _context4.next = 3;
                      return regeneratorRuntime.awrap(unblockIP(relay.ipv4));

                    case 3:
                    case "end":
                      return _context4.stop();
                  }
                }
              });
            })));

          case 4:
            removeServer(server.key);
            e.returnValue = true;
            _context5.next = 12;
            break;

          case 8:
            _context5.prev = 8;
            _context5.t0 = _context5["catch"](1);
            console.log(_context5.t0);
            e.returnValue = false;

          case 12:
          case "end":
            return _context5.stop();
        }
      }
    }, null, null, [[1, 8]]);
  });
} catch (e) {// Catch Error
  // throw e;
}

function getServers() {
  var response, pops, servers;
  return regeneratorRuntime.async(function getServers$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(axios.get("https://api.steampowered.com/ISteamApps/GetSDRConfig/v1/?appid=730"));

        case 3:
          response = _context6.sent;
          pops = response.data.pops;
          servers = [];

          if (pops) {
            Object.keys(pops).forEach(function (key) {
              servers.push(_objectSpread({
                key: key
              }, pops[key], {
                blocked: hasServer(key)
              }));
            });
          }

          return _context6.abrupt("return", servers);

        case 10:
          _context6.prev = 10;
          _context6.t0 = _context6["catch"](0);
          throw new Error("Failed to fetch servers");

        case 13:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 10]]);
}

function blockIp(ip) {
  return new Promise(function (resolve, reject) {
    var command = "netsh advfirewall firewall add rule name=BlockedIP_".concat(ip.replace(/\./g, "_"), " dir=out action=block protocol=ANY remoteip=").concat(ip);
    exec(command, function (error) {
      if (error) {
        reject(error);
        return;
      }

      resolve(true);
    });
  });
}

function unblockIP(ip) {
  return new Promise(function (resolve, reject) {
    var command = "netsh advfirewall firewall delete rule name=BlockedIP_".concat(ip.replace(/\./g, "_"));
    exec(command, function (error) {
      if (error) {
        reject(error);
        return;
      }

      resolve(true);
    });
  });
}

function storeServer(server) {
  var blockedServers = store.get("blockedServers", []);
  blockedServers.push(server);
  store.set("blockedServers", blockedServers);
  console.log(server, store.get("blockedServers", []));
}

function removeServer(server) {
  var blockedServers = store.get("blockedServers", []);
  var updatedBlockedServers = blockedServers.filter(function (blockedServer) {
    return blockedServer !== server;
  });
  store.set("blockedServers", updatedBlockedServers);
}

function hasServer(server) {
  var blockedServers = store.get("blockedServers", []);
  return blockedServers.some(function (blockedServer) {
    return blockedServer === server;
  });
}