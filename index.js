require("sdk/webextension").startup().then(({browser}) => {
  browser.runtime.onMessage.addListener((msg, sender, sendResponse) => {
    if (msg.cmd === "get-prefs") {
      const allPrefs = require('sdk/simple-prefs').prefs;
      // prefs contain other non needed prefs, so filter them and send only what's needed
      sendResponse({
    	"delayBetweenChecks": allPrefs.delayBetweenChecks,
    	"delayBetweenReminders": allPrefs.delayBetweenReminders,
    	"updateFavIcon": allPrefs.updateFavIcon,
    	"updateDocumentTitle": allPrefs.updateDocumentTitle,
    	"cssForUnreadEmailsDetection": allPrefs.cssForUnreadEmailsDetection,
    	"cssForVisibleRemindersDetection": allPrefs.cssForVisibleRemindersDetection
      });
    }
  });
});
