
/**
 * Plays audio then clicks button
 * @param {string} href 
 * @param {string} sound 
 */
function triggerAudioButton(href, sound) {
    var audio = document.getElementById(sound);
    audio.play();
    audio.addEventListener('ended', function () {
      if (href !== "") {
        location.href = href;
      }
    });
}

/**
 * Plays music, done here to avoid 8MB file transfer on pageload
 */
function playMusic() {
  var audio = new Audio('/static/audio/C418 - Aria Math (Minecraft Volume Beta).mp3');
  audio.play();
}