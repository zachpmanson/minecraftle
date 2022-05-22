function triggerAudioButton(href, sound) {
    var audio = document.getElementById(sound);
    audio.play();
    audio.addEventListener('ended', function () {
      location.href = href;
    });
}

function playMusic() {
  var audio = new Audio('/static/audio/C418 - Aria Math (Minecraft Volume Beta).mp3');
  audio.play();
}