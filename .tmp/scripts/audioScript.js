'use strict';

var audioJson = function () {
  var json = null;
  $.ajax({
    'async': false,
    'global': false,
    'url': 'static/audioDetails.json',
    'dataType': 'json',
    'success': function success(data) {
      json = data;
    }
  });
  return json;
}();

var audioWrapper = $('.audioSection');

audioJson.forEach(function (obj, index) {
  var audioImage = '<img src="./../assets/images/' + obj.image + '.svg" class="svg audioImage audioImage' + index + '" />';
  var audioSlider = '<div id="slider' + index + '" class="slider"></div>';
  var audioName = '<div class="audioName audioName' + index + '">' + obj.name + '</div>';
  var audio = '<audio id="audio' + index + '" class="audio audio' + index + ' hidden" loop><source src="./../assets/audio/' + obj.audio + '.mp3" type="audio/mpeg"></audio>';
  var audioObjTemplate = '<div class="audioItem audioItem' + index + '" onClick="playAudio(' + index + ')">' + audioImage + audio + audioName + audioSlider + '</div>';

  audioWrapper.append(audioObjTemplate);
});

var playAudio = function playAudio(audioIndex) {
  var audioVolume = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 50;

  var clickedAudio = $.grep(audioJson, function (obj) {
    return obj.id === audioIndex;
  });
  var currAudio = $('.audio' + audioIndex)[0];
  var slider = $('#slider' + audioIndex)[0];

  if (currAudio.paused) {
    currAudio.play();

    $('.audioItem' + audioIndex).addClass('active');

    noUiSlider.create(slider, {
      start: audioVolume,
      connect: [true, false],
      range: {
        'min': 0,
        'max': 100
      }
    });

    slider.noUiSlider.on('update', function (values, handle) {
      currAudio.volume = Math.round(values[handle]) / 100;
    });
    // $('.randomPlay.play').addClass( 'pause' ).removeClass( 'play' );
    $('.randomPlay.play').hide();
    $('.randomPlay.pause').show();
  } else {
    currAudio.pause();
    $('.audioItem' + audioIndex).removeClass('active');
    slider.noUiSlider.destroy();
    var playCount = 0;
    for (var i = 0; i < audioJson.length; i++) {
      if ($('.audio' + i)[0].paused) playCount++;
    }
    if (playCount === audioJson.length) {
      // $('.randomPlay.pause').addClass( 'play' ).removeClass( 'pause' );
      $('.randomPlay.play').show();
      $('.randomPlay.pause').hide();
    }
  }
};

/* Pause all the current playing audios and return the playing status */
/* Returns true if at least one of the audio is playing */
var pauseAll = function pauseAll() {
  var playing = false;
  var audioVolumeArray = [];
  for (var i = 0; i < audioJson.length; i++) {
    var vol = 0;
    if (!$('.audio' + i)[0].paused) {
      playAudio(i);
      vol = document.getElementById('audio' + i).volume;
      playing = true;
    }
    audioVolumeArray.push(vol);
  }
  // $('.randomPlay.pause').addClass( 'play' ).removeClass( 'pause' );
  $('.randomPlay.play').show();
  $('.randomPlay.pause').hide();
  return playing;
};

/* Random shuffling between the available audios */
var shuffle = function shuffle() {
  pauseAll();
  for (var i = 0; i < 4; i++) {
    playAudio(Math.floor(Math.random() * audioJson.length));
  }
};

/* Toggle between play and pause of global play button */
var globalPlay = function globalPlay() {
  var sampleAudioCombinations = {
    0: [.12, 0, 0, 0.3, 0, 0.3, 0, 0, 0.3, 0, .78, .5],
    1: [.9, 0, 0, 0, 0.7, 0, 0.8, 0, 0.3, 0.2, 0, 0],
    2: [.32, 0, 0.3, 0, 0, 0, 0, 0.7, 0.3, 0.2, .2, .9],
    3: [0.7, 0, 0.4, 0.1, 0.6, 0, 0, 0, 0.33, 0.72, 0, 0]
  };
  var audioVolume = localStorage.getItem('audioVolumeArray');
  var audioVolumeArray = [];
  if (audioVolume) {
    audioVolumeArray = audioVolume.split(',');
  } else {
    audioVolumeArray = sampleAudioCombinations[Math.floor(Math.random() * 4)];
  }
  for (var i = 0; i < audioVolumeArray.length; i++) {
    if (parseFloat(audioVolumeArray[i]) != 0) {
      playAudio(i, parseFloat(audioVolumeArray[i]) * 100);
    }
  }
};

/* To save the current playing combination in local storage */
var save = function save() {
  var audioVolumeArray = [];
  for (var i = 0; i < audioJson.length; i++) {
    var vol = 0;
    if (!$('.audio' + i)[0].paused) {
      vol = document.getElementById('audio' + i).volume;
    }
    audioVolumeArray.push(vol);
  }
  localStorage.setItem('audioVolumeArray', audioVolumeArray);
};

$(function () {
  var obj = {
    runMe: function runMe() {
      $('.audio-icon');
      $('.icon');
    }
  };
  $('.randomPlay.pause').hide();
  convertToInlineSvg(obj);
});
//# sourceMappingURL=audioScript.js.map
