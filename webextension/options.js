"use strict";

function saveOptions(e) {
  e.preventDefault();
  browser.storage.local.set({
    delayBetweenChecks: document.querySelector("#delayBetweenChecks").value
  });
}

function restoreOptions() {

  function setCurrentChoice(result) {
    document.querySelector("#delayBetweenChecks").value = result.delayBetweenChecks || "1";
  }

  var getting = browser.storage.local.get("delayBetweenChecks");
  getting.then(setCurrentChoice, console.error);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);

