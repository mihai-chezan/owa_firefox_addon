require("sdk/webextension").startup().then(({browser}) => {
  browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.cmd === "get-prefs") {
      sendResponse(require('sdk/simple-prefs').prefs);
    }
  });
});
