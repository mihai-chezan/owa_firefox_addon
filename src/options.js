"use strict";

function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    delayBetweenChecks: document.getElementById("delayBetweenChecks").valueAsNumber,
    delayBetweenReminders: document.getElementById("delayBetweenReminders").valueAsNumber,
    disableNotifications: document.getElementById("disableNotifications").checked,
    updateFavIcon: document.getElementById("updateFavIcon").checked,
    favIconColor: document.getElementById("favIconColor").value,
    updateDocumentTitle: document.getElementById("updateDocumentTitle").checked,
    cssForUnreadEmailsDetection: document.getElementById("cssForUnreadEmailsDetection").value,
    cssForVisibleRemindersDetection: document.getElementById("cssForVisibleRemindersDetection").value,
    cssForChatNotificationsDetection: document.getElementById("cssForChatNotificationsDetection").value
  });
}

function defaultVal(value, defaultValue){
  return (typeof value === "undefined") ? defaultValue : value;
}

function hide(e) {
  e.style.visibility = "hidden";
}

function show(e) {
  e.style.visibility = "visible";
}

function setCss(txtInputId, selectId, value) {
  const val = defaultVal(value, "").trim();
  const select = document.getElementById(selectId);
  select.value = val;
  if (select.selectedIndex === -1) {
    select.selectedIndex = 1;
  }
  const txtInput = document.getElementById(txtInputId);
  txtInput.value = val;
  if (select.selectedIndex === 0) {
    hide(txtInput);
  }
}

function restoreOptions() {
  browser.storage.local.get().then((prefs) => {
    document.getElementById("delayBetweenChecks").value = defaultVal(prefs.delayBetweenChecks, 1);
    document.getElementById("delayBetweenReminders").value = defaultVal(prefs.delayBetweenReminders, 300);
    document.getElementById("disableNotifications").checked = defaultVal(prefs.disableNotifications, false);
    document.getElementById("updateFavIcon").checked = defaultVal(prefs.updateFavIcon, true);
    document.getElementById("favIconColor").value = defaultVal(prefs.favIconColor, "#0099FF");
    document.getElementById("updateDocumentTitle").checked = defaultVal(prefs.updateDocumentTitle, true);
    setCss("cssForUnreadEmailsDetection", "selectCssForUnreadEmailsDetection", prefs.cssForUnreadEmailsDetection);
    setCss("cssForVisibleRemindersDetection", "selectCssForVisibleRemindersDetection", prefs.cssForVisibleRemindersDetection);
    setCss("cssForChatNotificationsDetection", "selectCssForChatNotificationsDetection", prefs.cssForChatNotificationsDetection);
  }, console.error);
}

function dropdownChange() {
  const txtInput = this.nextElementSibling;
  txtInput.value = this.value;
  (this.selectedIndex === 0) ? hide(txtInput) : show(txtInput);
  if (this.selectedIndex === 1) {
    txtInput.focus();
  }
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
document.getElementById("selectCssForUnreadEmailsDetection").addEventListener("change", dropdownChange);
document.getElementById("selectCssForVisibleRemindersDetection").addEventListener("change", dropdownChange);
document.getElementById("selectCssForChatNotificationsDetection").addEventListener("change", dropdownChange);


