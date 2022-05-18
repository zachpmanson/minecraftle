
const userCookieName = "user_id";

/**
 * checks user-id cookie to see if it has been set before, if not it calls 
 * createUserCookie() to create a user id
 */
function checkUserCookie() {
    const cookieExists = document.cookie.match(userCookieName);
    console.log(cookieExists);
    if (cookieExists !== null) {
        console.log("Welcome back! Your user_id is: " + getCookie("user_id"));
    } else {
        createUserCookie(userCookieName);
    }
}

/**
 * users a randomUUID() generator function to assign the User-id cookie a unique value
 * sets the cookie expiry date to 30 days
 * @param {String} userCookieName 
 */
function createUserCookie(userCookieName) {
    let uuid = self.crypto.randomUUID();
    const userCookieDays = 30;
    let expiryDate = new Date();
    expiryDate.setDate(expiryDate.getDate() + userCookieDays);
    console.log(expiryDate)
    let cookieValue = userCookieName + "=" + uuid + ";expires=" + expiryDate.toGMTString() + ";path=/";
    document.cookie = cookieValue;
    console.log("Generated new user_id: "+ cookieValue);
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

/**
 * On document load, looks to call checkUserCookie() function to check to see if
 * user_id exists
 */
 document.addEventListener("DOMContentLoaded", ()=>{
    checkUserCookie();
});
