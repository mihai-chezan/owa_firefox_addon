"use strict";

browser.storage.local.get("delayBetweenChecks").then(prefs => {
  console.log("onGotPrefs: ", prefs);
  if (prefs.delayBetweenChecks === undefined) {
	console.log("loading legacy prefs...");
	// we didin't sync legacy prefs, so we do it now
	browser.runtime.sendMessage({"cmd": "get-prefs"}).then((legacyPrefs) => {
	  browser.storage.local.set(legacyPrefs).then(() => {
	    console.log("legacy prefs received and saved into background script: ", legacyPrefs);
	  }, console.error);
	}, console.error);
  }
}, console.error);

const notifIcons = {
  "email": browser.extension.getURL("email-alert.png"),
  "reminder": browser.extension.getURL("calendar-alert.png"),
  "chat": browser.extension.getURL("chat-alert.png")
}

browser.runtime.onMessage.addListener(notif => {
  console.log("received onMessage on background script: ", notif);
  browser.notifications.create({
    "type": "basic",
    "iconUrl": notifIcons[notif.type],
    "title": "OWA Notification",
    "message": notif.msg
  }).catch(console.error);
});
