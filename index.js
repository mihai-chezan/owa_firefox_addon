const prefs = require('sdk/simple-prefs');
const webext = require("sdk/webextension");
webext.startup().then(({browser}) => {
  browser.runtime.onConnect.addListener(port => {
    if (port.name === "sync-legacy-addon-data") {
      port.postMessage(prefs.prefs);
    }
  });
});
