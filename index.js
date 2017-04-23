require("sdk/webextension").startup().then(({browser}) => {
  browser.runtime.onConnect.addListener(port => {
    if (port.name === "sync-legacy-prefs") {
      port.postMessage(require('sdk/simple-prefs').prefs);
    }
  });
});
