"use strict";

function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    delayBetweenChecks: document.querySelector("#delayBetweenChecks").value,
    delayBetweenReminders: document.querySelector("#delayBetweenReminders").value,
    updateFavIcon: document.querySelector("#updateFavIcon").checked,
    updateDocumentTitle: document.querySelector("#updateDocumentTitle").checked,
    cssForUnreadEmailsDetection: document.querySelector("#cssForUnreadEmailsDetection").value,
    cssForVisibleRemindersDetection: document.querySelector("#cssForVisibleRemindersDetection").value,
    cssForChatNotificationsDetection: document.querySelector("#cssForChatNotificationsDetection").value
  });
}

function defaultVal(value, defaultValue){
  return (value === undefined) ? defaultValue : value;
}

function restoreOptions() {
  browser.storage.local.get().then((prefs) => {
    document.querySelector("#delayBetweenChecks").value = defaultVal(prefs.delayBetweenChecks, 1);
    document.querySelector("#delayBetweenReminders").value = defaultVal(prefs.delayBetweenReminders, 300);
    document.querySelector("#updateFavIcon").checked = defaultVal(prefs.updateFavIcon, true);
    document.querySelector("#updateDocumentTitle").checked = defaultVal(prefs.updateDocumentTitle, true);
    document.querySelector("#cssForUnreadEmailsDetection").value = defaultVal(prefs.cssForUnreadEmailsDetection, "");
    document.querySelector("#cssForVisibleRemindersDetection").value = defaultVal(prefs.cssForVisibleRemindersDetection, "");
    document.querySelector("#cssForChatNotificationsDetection").value = defaultVal(prefs.cssForChatNotificationsDetection, "");
  }, console.error);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

