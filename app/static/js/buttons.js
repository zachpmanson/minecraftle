/**
 * Plays audio then clicks button
 * @param {string} href
 * @param {string} sound
 */
var audio = null; // Global variable to store the audio object

function triggerAudioButton(href, sound) {
  var audio = document.getElementById(sound);
  audio.play();
  audio.addEventListener("ended", function () {
    if (href !== "") {
      location.href = href;
    }
  });
}

/**
 * Plays music, done here to avoid 8MB file transfer on pageload
 */
function playMusic() {
  if (audio) {
    if (audio.paused) {
      // If the audio is paused, resume it from the current position
      audio.play();
    } else {
      // If the audio is playing, pause it and remember the current position
      audio.pause();
    }
  } else {
    // If there's no audio instance, create a new one and play it
    audio = new Audio(
      "/static/audio/C418 - Aria Math (Minecraft Volume Beta).mp3"
    );
    
    audio.play();
  }
}
