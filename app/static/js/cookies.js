/**
 * On document load, looks to call checkUserCookie() function to check to see if a User-id cookie has been set
 */
 document.addEventListener("DOMContentLoaded", function () {
    const userCookieName = "User-id";
    checkUserCookie(userCookieName);
    });

/**
 * checks user-id cookie to see if it has been set before, if not it calls createUserCookie() to create a user id
 */
function checkUserCookie(userCookieName) {
    const cookieExists = document.cookie.match(userCookieName);
    console.log(cookieExists);
    if (cookieExists != null) {
        console.log("welcome back!!");
        console.log("your saved user id is: " + getCookie("User-id"));
    } else {
        createUserCookie(userCookieName);
    }
}
  
/**
 * 
 * @param {String} userCookieName 
 * users a randomUUID() generator function to assign the User-id cookie a unique value
 * sets the cookie expiry date to 30 days
 */
function createUserCookie(userCookieName) {
    
    let uuid = randomUUID();
    const userCookieValue = uuid;
    const userCookieDays = 30;
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + userCookieDays);
    console.log(expiryDate)
    document.cookie = userCookieName + "=" + userCookieValue + ";expires=" + expiryDate.toGMTString() + ";path=/";
    console.log("first time user log in...User-id cookie being set:")
    console.log(userCookieName + " =" + userCookieValue + " ;expires=" + expiryDate.toGMTString() + ";path=/")
}


/**
 * 
 * @param {String} cName 
 * @returns value of cookie indicated by cName
 */
function getCookie(cName) {
    const name = cName + "=";
    const cDecoded = decodeURIComponent(document.cookie); //to be careful
    const cArr = cDecoded.split('; ');
    let res;
    cArr.forEach(val => {
      if (val.indexOf(name) === 0) res = val.substring(name.length);
    })
    return res
  }