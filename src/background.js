"use strict";

const notifIcons = {
  "email": browser.extension.getURL("email-alert.png"),
  "reminder": browser.extension.getURL("calendar-alert.png"),
  "chat": browser.extension.getURL("chat-alert.png")
}

if("onShown" in browser.notifications) {
  browser.notifications.onShown.addListener(() => {
    browser.runtime.sendMessage("@notification-sound", "new-notification");
  });
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
