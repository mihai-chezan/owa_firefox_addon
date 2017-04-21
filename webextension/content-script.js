var prefs;
var newEventsTimer, remindersTimer;
var unreadEmailsCount = 0;
var visibleRemindersCount = 0;
var chatNotificationsCount = 0;
var documentTitle = document.title;

var owaIcon = document.createElement("link");
owaIcon.rel = "icon";
owaIcon.type = "image/png";
owaIcon.sizes = "64x64";
owaIcon.href = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABmJLR0QA/wD/AP+gvaeTAAAACXBIWXMAAAsTAAALEwEAmpwYAAABvUlEQVQ4y6WTz0tUURTHP/e9N04MBqNJQRDYDKK5tEAINxHRsk24sWWL6G+wheImWriYaBVuRHMZGrVxIQ4pxRQtZiU5OjNU2nOycV6D8+bNPS7e/MAZfC38woUL55zPvffc71EiIpxDRlDw6NhjdeswEGA1Nrbjkso5fM47bO6USO6WKP+rgQjyciwY8OxDlpn3ebAMMFUrGjbA0/+/gWEoCJtnJi2nC8wm92mgy65mYSJGvC/SekJTIsQvXWDbPm7e5kexytr3IihAC28eDRDvi3Q20VBwMH2LufEYrx72g/Y/SIkGV3Pn+kXKz0dJZoosff19uokAD4Z7SKz/YupdnsKLUZ4uZiBk8GTsKiPXuukOm8RmvrBX9Lg7EO0EWKbCd4WgRQB/JdZ/svTNZmPbgZAByo+0AYS36UNeT9/k3mCU+ZQNYQu0xjIVG9myX1yX6gQoqlromUzR39tFxq74TdRQ9QQqtVaVJyhF5xMANJD5457yw+PbV7h/I9oEiMDQ5UgLUNP1E9qNVFckZDJYL2iXagxT7m+FVK7Ep6zDx90Sm1kH7WrfyomzrYwEaO+oIivpQlCKqPOO8wknR+1GRWhuAQAAAABJRU5ErkJggg==";
document.head.appendChild(owaIcon);

var img = document.createElement("img");
img.src = owaIcon.href;

function drawIcon(context, x, y, w, h, radius) {
   var r = x + w;
   var b = y + h;
   context.beginPath();
   context.fillStyle = "red";
   context.lineWidth = "1";
   context.moveTo(x + radius, y);
   context.lineTo(r - radius, y);
   context.quadraticCurveTo(r, y, r, y + radius);
   context.lineTo(r, y + h - radius);
   context.quadraticCurveTo(r, b, r - radius, b);
   context.lineTo(x + radius, b);
   context.quadraticCurveTo(x, b, x, b - radius);
   context.lineTo(x, y + radius);
   context.quadraticCurveTo(x, y, x + radius, y);
   context.fill();
}

function generateTabIcon(number) {
   var canvas = document.createElement("canvas");
   canvas.width = img.width;
   canvas.height = img.height;
   var ctx = canvas.getContext("2d");

   ctx.drawImage(img, 0, 0);

   if (number) {
      drawIcon(ctx, 2, -2, 16, 14, 0);
      ctx.font = "bold 10px Arial";
      ctx.textBaseline = "top";
      ctx.textAlign = "center";
      ctx.fillStyle = "white";
      ctx.fillText(number, 9, 2);
   }

   return canvas.toDataURL("image/png");
}

function setFavicon(count) {
   if (!prefs.updateFavIcon) {
      return;
   }
   var icon = generateTabIcon(Math.min(count, 99));
   var s = document.querySelectorAll("link[rel*='icon'][type='image/png']");

   if (s.length !== 1 || s[0].href !== icon) {
      for (var i = s.length - 1; i >= 0; i--) {
         s[i].remove();
      }
      owaIcon.href = icon;
      document.head.appendChild(owaIcon);
   }
}

function setDocumentTitle(emails, reminders, chats) {
   if (!prefs.updateDocumentTitle) {
      return;
   }
   var countPrefix = "";
   if (emails > 0 || reminders > 0 || chats > 0) {
      countPrefix = "(" + emails + "/" + reminders;
      if (chats > 0) {
         countPrefix = countPrefix + "/" + chats;
      }
      countPrefix = countPrefix + ") ";
   }
   document.title = countPrefix + documentTitle;
}

function extractNumber(text) {
   if (text) {
      var digits = text.match(/\d/gi);
      if (digits) {
         return parseInt(digits.join(""), 10);
      }
   }
   return 0;
}

function getCountFromNodes(nodes) {
   var count = 0;
   if (nodes) {
      for (var i = nodes.length - 1; i >= 0; i--) {
         count += extractNumber(nodes[i].innerHTML);
      }
   }
   return count;
}

function getItemsWithActiveCount(folder) {
   return folder.querySelectorAll("[id*='.ucount']");
}

function getCountFromFolders(folders) {
   var count = 0;
   for (var i = folders.length - 1; i >= 0; i--) {
      count += getCountFromNodes(getItemsWithActiveCount(folders[i]));
   }
   return count;
}

function countUnreadEmails() {
   var nodes;
   if (prefs.cssForUnreadEmailsDetection) {
      // custom css
      return getCountFromNodes(document.querySelectorAll(prefs.cssForUnreadEmailsDetection));
   }
   if ((nodes = document.querySelectorAll("#spnUC #spnCV")).length > 0) {
      // OWA 2010
      return getCountFromNodes(nodes);
   }
   if ((nodes = document.querySelectorAll("[aria-label='Folder Pane']")).length > 0) {
      // OWA 2013
      return getCountFromFolders(nodes);
   }
   return 0;
}

function countVisibleReminders() {
   var nodes;
   if (prefs.cssForVisibleRemindersDetection) {
      // custom css
      return getCountFromNodes(document.querySelectorAll(prefs.cssForVisibleRemindersDetection));
   }
   if ((nodes = document.querySelectorAll("#spnRmT.alertBtnTxt")).length > 0) {
      // OWA 2010
      return extractNumber(nodes[0].innerHTML);
   }
   if ((nodes = document.querySelectorAll("[aria-label='New Notification']")).length > 2) {
      // OWA 2013
      return extractNumber(nodes[3].title);
   }
   if ((nodes = document.querySelectorAll(".o365cs-notifications-notificationCounter")).length > 0) {
      // 365 check
      return extractNumber(nodes[0].innerHTML);
   }
   return 0;
}

function countChatNotifications() {
   // it finds twice the real number so split it by two
   return (document.querySelectorAll(".o365cs-notifications-chat-accept").length >> 1);
}

function singularOrPlural(word, count) {
   return word + ((count === 1) ? "" : "s");
}

function buildNotificationMessage(type, count) {
   return "You have " + count + " new " + singularOrPlural(type, count);
}

function buildEmailNotificationMessage(count) {
   return buildNotificationMessage("email", count);
}

function buildReminderNotificationMessage(count) {
   return buildNotificationMessage("reminder", count);
}

function triggerNotification(type, text) {
  //self.port.emit("notify", type, msg);
  browser.runtime.sendMessage({
    "type": "notify",
    "obj": {
      "type": type,
      "msg": text
    }
  });
}

function checkForNewMessages() {
   var newUnreadEmailsCount = countUnreadEmails();
   var newVisibleRemindersCount = countVisibleReminders();
   var newChatNotificationsCount = countChatNotifications();
   var noChange = (newUnreadEmailsCount === unreadEmailsCount) && (newVisibleRemindersCount === visibleRemindersCount) && (newChatNotificationsCount === chatNotificationsCount);
   if (noChange) {
      return;
   }
   setFavicon(newUnreadEmailsCount + newVisibleRemindersCount + newChatNotificationsCount);
   setDocumentTitle(newUnreadEmailsCount, newVisibleRemindersCount, newChatNotificationsCount);
   if (newUnreadEmailsCount > unreadEmailsCount) {
      triggerNotification("email", buildEmailNotificationMessage(newUnreadEmailsCount - unreadEmailsCount));
   }
   if (newVisibleRemindersCount > visibleRemindersCount) {
      triggerNotification("reminder", buildReminderNotificationMessage(newVisibleRemindersCount
            - visibleRemindersCount));
   }
   if (newChatNotificationsCount > chatNotificationsCount) {
      triggerNotification("chat", "New chat " + singularOrPlural("notification", newChatNotificationsCount) + "!");
   }

   unreadEmailsCount = newUnreadEmailsCount;
   visibleRemindersCount = newVisibleRemindersCount;
   chatNotificationsCount = newChatNotificationsCount;
}

function notifyReminders() {
   if (visibleRemindersCount > 0) {
      triggerNotification("reminder", "You have " + visibleRemindersCount + " " + singularOrPlural("reminder", visibleRemindersCount));
   }
   if (chatNotificationsCount > 0) {
      triggerNotification("chat", "You have open chat " + singularOrPlural("notification", chatNotificationsCount));
   }
}

function setNewPrefs(newPrefs) {
   prefs = newPrefs;
   if (prefs.delayBetweenChecks < 1) {
      prefs.delayBetweenChecks = 1;
   }
   if (prefs.delayBetweenReminders > 0 && prefs.delayBetweenReminders < 4) {
      prefs.delayBetweenReminders = 4;
   }
}

function stopTimers() {
   if (newEventsTimer) {
      clearInterval(newEventsTimer);
   }
   if (remindersTimer) {
      clearInterval(remindersTimer);
   }
}

function startMonitor() {
  stopTimers();
  newEventsTimer = setInterval(checkForNewMessages, prefs.delayBetweenChecks * 1000);
  if (prefs.delayBetweenReminders) {
     remindersTimer = setInterval(notifyReminders, prefs.delayBetweenReminders * 1000);
  }
}

function onGotPrefs(prefs) {
  console.log("onGotPrefs: ", prefs);
  setNewPrefs(prefs);
  startMonitor();
}

function getPrefsAndStart() {
  browser.storage.local.get().then(onGotPrefs, console.error);
}

function onPrefChanged(changes, area) {
  console.log("onPrefChanged: ", changes);
  if (changes.updateFavIcon !== undefined && !changes.updateFavIcon.newValue) {
    setFavicon(0);
  }
  if (changes.updateDocumentTitle !== undefined && !changes.updateDocumentTitle.newValue) {
    setDocumentTitle(0);
  }
  getPrefsAndStart();
}

browser.storage.onChanged.addListener(onPrefChanged);

getPrefsAndStart();



