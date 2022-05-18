//Processing Social media buttons
let shareable_link = String(document.location).split("&")[0];
//Tweet
function getT(text, url) {
  return (
    "https://twitter.com/intent/tweet?text=" +
    "Check out my latest Minecraftle Stats:" +
    "&url=" +
    shareable_link
  );
}
function tweet() {
  var url = getT();
  PopupCenter(url, "Share to Twitter", "590", "253");
}

//Facebook
function getFB(text, url) {
  return (
    "https://www.facebook.com/sharer.php?u=" +
    shareable_link +
    "Check out my stats"
  );
}
function facebook() {
  var url = getFB();
  PopupCenter(url, "Share to Facebook", "590", "253");
}
//Reddit
function getR(text, url) {
  return (
    "https://reddit.com/submit?url=" +
    shareable_link +
    "&title=" +
    "Check out my latest Minecraftle stats"
  );
}
function reddit() {
  var url = getR();
  PopupCenter(url, "Share to Reddit", "590", "253");
}

//This is a copied function (credit later: https://pastebin.com/g84Ms4Lv)
function PopupCenter(url, title, w, h) {
  // Fixes dual-screen position                         Most browsers      Firefox
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

  // Puts focus on the newWindow
  if (window.focus) {
    newWindow.focus();
  }
}
