"use strict";

// Ask to the legacy part to dump the needed data and send it back
// to the background page...
const port = browser.runtime.connect({name: "sync-legacy-addon-data"});
port.onMessage.addListener((msg) => {
  if (msg) {
    // Where it can be saved using the WebExtensions storage API.
    browser.storage.local.set(msg);
    console.log("prefs received and saved into background script: ", msg);
  }
});

function showNotification(notif) {
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("email-alert.png"),
    "title": "Time for cake!",
    "message": notif.msg
  }).catch(console.error);    
}

const dispatch = {
  "notify": showNotification
};

browser.runtime.onMessage.addListener(msg => {
  console.log("received onMessage on background script: ", msg);
  dispatch[msg.type](msg.obj);
});
