// ssMain is the stylesheet's index based on load order. See document.styleSheets. E.g. 0=reset.css, 1=main.css.
var ssMain = 0;
var cssRules = document.all ? "rules" : "cssRules";

function changeCssStyle(selector, cssProp, cssVal) {
  for (
    i = 0, len = document.styleSheets[ssMain][cssRules].length;
    i < len;
    i++
  ) {
    if (document.styleSheets[ssMain][cssRules][i].selectorText === selector) {
      document.styleSheets[ssMain][cssRules][i].style[cssProp] = cssVal;
      return;
    }
  }
}
