var pageMod = require("sdk/page-mod");
var notifications = require("sdk/notifications");
var self = require("sdk/self");
var prefs = require('sdk/simple-prefs');
var icons = {
   email : self.data.url("email-alert.png"),
   reminder : self.data.url("calendar-alert.png"),
   chat : self.data.url("chat-alert.png")
}

pageMod.PageMod({
   include : /https?:\/\/.*\/owa\/.*/,
   contentStyleFile : self.data.url("fix_style.css"),
   contentScriptWhen : 'ready',
   contentScriptFile : self.data.url("icon_notifications.js"),
   attachTo : [ "existing", "top" ],
   onAttach : function (worker) {
      worker.port.on("notify", function (type, msg) {
         notifications.notify({
            text : msg,
            iconURL : icons[type],
            onClick : function () {
               worker.tab.activate();
            }
         });
      });
      prefs.on("", function (prefName) {
         worker.port.emit("prefChange", prefName, prefs.prefs);
      });
      worker.port.emit("startMonitor", prefs.prefs);
   }
});
