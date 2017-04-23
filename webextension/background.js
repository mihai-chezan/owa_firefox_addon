"use strict";
browser.storage.local.clear().then(() => {
browser.storage.local.get("delayBetweenChecks").then(prefs => {
  console.log("onGotPrefs: ", prefs);
  if (!prefs.delayBetweenChecks) {
	console.log("loading legacy prefs...");
	// we didin't sync legacy prefs, so we do it now
	const port = browser.runtime.connect({"name": "sync-legacy-prefs"});
	port.onMessage.addListener((legacyPrefs) => {
	  browser.storage.local.set(legacyPrefs);
	  console.log("legacy prefs received and saved into background script: ", legacyPrefs);
	});
  }
}, console.error);
}, console.error);

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
