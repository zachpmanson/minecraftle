//Processing Social media buttons
let shareable_link = String(document.location).split("&")[0];

/**
 * Generates twitter post link structure with pre build tweet message.
 * @returns {String} A shareable twitter link to be appended to a popup tab
 */
function getT() {
  return (
    "https://twitter.com/intent/tweet?text=" +
    "Check out my latest Minecraftle Stats:" +
    "&url=" +
    shareable_link
  );
}

/**
 * Collects twitter post link structure and calls a popup window function to post it
 */
function tweet() {
  var url = getT();
  PopupCenter(url, "Share to Twitter", "590", "253");
}

/**
 * Generates facebook post link structure with pre build post message.
 * @returns {String} A shareable facebook link to be appended to a popup tab
 */
function getFB() {
  return (
    "https://www.facebook.com/sharer.php?u=" +
    shareable_link +
    "Check out my latest Minecraftle Stats:"
  );
}

/**
 * Collects facebook post link structure and calls a popup window function to post it
 */
function facebook() {
  var url = getFB();
  PopupCenter(url, "Share to Facebook", "590", "253");
}

/**
 * Generates reddit post link structure with pre build post message.
 * @returns {text} A shareable reddit link to be appended to a popup tab
 */
function getR() {
  return (
    "https://reddit.com/submit?url=" +
    shareable_link +
    "&title=" +
    "Check out my latest Minecraftle Stats:"
  );
}

/**
 * Collects reddit post link structure and calls a popup window function to post it
 */
function reddit() {
  var url = getR();
  PopupCenter(url, "Share to Reddit", "590", "253");
}

/**
 * Constructs a new popup tab in center of the users screen to with input links to automatically post messages
 * to social media.
 * @param {String} url
 * @param {String} title
 * @param {int} w
 * @param {int} h
 */
function PopupCenter(url, title, w, h) {
  var dualScreenLeft =
    window.screenLeft != undefined ? window.screenLeft : screen.left;
  var dualScreenTop =
    window.screenTop != undefined ? window.screenTop : screen.top;

  var width = window.innerWidth
    ? window.innerWidth
    : document.documentElement.clientWidth
    ? document.documentElement.clientWidth
    : screen.width;
  var height = window.innerHeight
    ? window.innerHeight
    : document.documentElement.clientHeight
    ? document.documentElement.clientHeight
    : screen.height;

  var left = width / 2 - w / 2 + dualScreenLeft;
  var top = height / 2 - h / 2 + dualScreenTop;
  var newWindow = window.open(
    url,
    title,
    "scrollbars=yes, width=" +
      w +
      ", height=" +
      h +
      ", top=" +
      top +
      ", left=" +
      left
  );

  if (window.focus) {
    newWindow.focus();
  }
}
