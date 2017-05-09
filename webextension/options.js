"use strict";

function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    delayBetweenChecks: document.querySelector("#delayBetweenChecks").value,
    delayBetweenReminders: document.querySelector("#delayBetweenReminders").value,
    disableNotifications: document.querySelector("#disableNotifications").checked,
    updateFavIcon: document.querySelector("#updateFavIcon").checked,
    updateDocumentTitle: document.querySelector("#updateDocumentTitle").checked,
    cssForUnreadEmailsDetection: document.querySelector("#cssForUnreadEmailsDetection").value,
    cssForVisibleRemindersDetection: document.querySelector("#cssForVisibleRemindersDetection").value,
    cssForChatNotificationsDetection: document.querySelector("#cssForChatNotificationsDetection").value
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
  const select = document.querySelector(selectId);
  select.value = val;
  if (select.selectedIndex === -1) {
    select.selectedIndex = 1;
  }
  const txtInput = document.querySelector(txtInputId);
  txtInput.value = val;
  if (select.selectedIndex === 0) {
    hide(txtInput);
  }
}

function restoreOptions() {
  browser.storage.local.get().then((prefs) => {
    document.querySelector("#delayBetweenChecks").value = defaultVal(prefs.delayBetweenChecks, 1);
    document.querySelector("#delayBetweenReminders").value = defaultVal(prefs.delayBetweenReminders, 300);
    document.querySelector("#disableNotifications").checked = defaultVal(prefs.disableNotifications, false);
    document.querySelector("#updateFavIcon").checked = defaultVal(prefs.updateFavIcon, true);
    document.querySelector("#updateDocumentTitle").checked = defaultVal(prefs.updateDocumentTitle, true);
    setCss("#cssForUnreadEmailsDetection", "#selectCssForUnreadEmailsDetection", prefs.cssForUnreadEmailsDetection);
    setCss("#cssForVisibleRemindersDetection", "#selectCssForVisibleRemindersDetection", prefs.cssForVisibleRemindersDetection);
    setCss("#cssForChatNotificationsDetection", "#selectCssForChatNotificationsDetection", prefs.cssForChatNotificationsDetection);
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


