//Processing Social media buttons

function getURL(text, url){
   return "https://twitter.com/intent/tweet?text=" + document.title + "&url=" + document.location; 
}
function tweet(){
    var url = getURL();
    PopupCenter(url, "Share to Twitter", "590", "253");
}

//This is a copied function (credit later)
function PopupCenter(url, title, w, h) {
    // Fixes dual-screen position                         Most browsers      Firefox
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : screen.left;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : screen.top;
 
    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;
 
    var left = ((width / 2) - (w / 2)) + dualScreenLeft;
    var top = ((height / 2) - (h / 2)) + dualScreenTop;
    var newWindow = window.open(url, title, 'scrollbars=yes, width=' + w + ', height=' + h + ', top=' + top + ', left=' + left);
 
    // Puts focus on the newWindow
    if (window.focus) {
        newWindow.focus();
    }
}