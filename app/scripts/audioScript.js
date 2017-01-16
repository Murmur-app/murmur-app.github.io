const audioJson = (function() {
  var json = null;
  $.ajax({
    'async': false,
    'global': false,
    'url': 'static/audioDetails.json',
    'dataType': 'json',
    'success': function(data) {
      json = data;
    }
  });
  return json;
})();

const audioWrapper = $('.audioSection');

audioJson.forEach((obj, index) => {
  let audioImage = '<img src="./../assets/images/' + obj.image + '.png" class="audioImage audioImage' + index + '" />';
  let audioSlider = '<div id="slider' + index + '" class="slider"></div>';
  let audioName = '<div class="audioName audioName' + index + '">' + obj.name + '</div>'
  let audio = '<audio id="audio' + index + '" class="audio audio' + index + ' hidden" loop><source src="./../assets/audio/'+ obj.audio +'.mp3" type="audio/mpeg"></audio>';
  let audioObjTemplate = '<div class="audioContainer" onClick="playAudio(' + index + ')">' + audioImage + audio + audioSlider + audioName + '</div>';

  audioWrapper.append(audioObjTemplate);
});

const playAudio = (audioIndex) => {
  let clickedAudio = $.grep(audioJson, (obj) => {
    return obj.id === audioIndex;
  })
  const currAudio = $('.audio' + audioIndex)[0];
  const slider = $('#slider' + audioIndex)[0];

  if (currAudio.paused) {
    currAudio.play();

    noUiSlider.create(slider, {
      start: 50,
      connect: [true, false],
      range: {
        'min': 0,
        'max': 100
      }
    });

    slider.noUiSlider.on('update', (values, handle) => {
      currAudio.volume = Math.round(values[handle])/100;
    });
    $(".randomPlay.play").addClass( "pause" ).removeClass( "play" );
  }
  else {
    currAudio.pause();
    slider.noUiSlider.destroy();
    let playCount = 0;
    for (let i = 0; i < audioJson.length; i++) {
      if ($('.audio' + i)[0].paused) playCount++;
    }
    if(playCount === audioJson.length)
      $(".randomPlay.pause").addClass( "play" ).removeClass( "pause" );
  }
}

/* Pause all the current playing audios and return the playing status */
const pauseAll = () => {
  let playing = false;
  let audioVolumeArray = [];
  for (let i = 0; i < audioJson.length; i++) {
    let vol = 0;
    if (!$('.audio' + i)[0].paused) {
      playAudio(i);
      vol = document.getElementById('audio' + i).volume;
      playing = true;
    }
    audioVolumeArray.push(vol);
  }
  sessionStorage.setItem("audioVolumeArray", audioVolumeArray);
  $(".randomPlay.pause").addClass( "play" ).removeClass( "pause" );
  return playing;
}

/* Random shuffling between the available audios */
const shuffle = () => {
  let maxAudio = 4;
  pauseAll();
  for (var i = 0; i < audioJson.length; i++) {
    if((Math.random() > .5) && maxAudio) {
      playAudio(i);
      maxAudio--;
    }
  }
}

/* Toggle between play and pause of global play button */
const globalPlay = () => {
  if(!pauseAll()) {
    shuffle();
  }
}

/* To save the current playing combination in local storage */
const save = () => {
  document.getElementById('audio0').volume
  let audioVolumeArray = [];
  for (let i = 0; i < audioJson.length; i++) {
    let vol = 0;
    if (!$('.audio' + i)[0].paused) {
      vol = document.getElementById('audio' + i).volume;
    }
    audioVolumeArray.push(vol);
  }
  localStorage.setItem("audioVolumeArray", audioVolumeArray);
}
