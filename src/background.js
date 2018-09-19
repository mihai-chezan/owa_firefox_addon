"use strict";

const notifIcons = {
  "email": browser.extension.getURL("email-alert.png"),
  "reminder": browser.extension.getURL("calendar-alert.png"),
  "chat": browser.extension.getURL("chat-alert.png")
}

browser.runtime.onMessage.addListener(notif => {
  console.log("received onMessage on background script: ", notif);
  browser.notifications.create("owa-" + type, {
    "type": "basic",
    "iconUrl": notifIcons[notif.type],
    "title": "OWA Notification",
    "message": notif.msg
  }).catch(console.error);
});
