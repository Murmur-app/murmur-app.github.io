$("#randomPlay").on("click", function() {
  var currAudio = $("#audio1")[0];
  if (currAudio.paused) {
    $("#randomPlay").removeClass('play');
    $("#randomPlay").addClass('pause');
    currAudio.play();
  } else {
    $("#randomPlay").removeClass('pause');
    $("#randomPlay").addClass('play');
    currAudio.pause();
  }
});
