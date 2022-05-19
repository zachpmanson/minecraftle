function triggerAudioButton(href, sound) {
    var audio = document.getElementById(sound);
    audio.play();
    audio.addEventListener('ended', function () {
      location.href = href;
    })
}