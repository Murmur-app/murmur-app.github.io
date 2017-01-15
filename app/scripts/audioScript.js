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
  let audioImage = '<img src="./../assets/images/play-button.png" class="audioImage audioImage' + index + '" />';
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
  } else {
    currAudio.pause();
    slider.noUiSlider.destroy();
  }
}
