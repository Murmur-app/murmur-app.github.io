const audioJson = (function() {
        var json = null;
        $.ajax({
          'async': false,
          'global': false,
          'url': 'static/audioDetails.json',
          'dataType': 'json',
          'success': function (data) {
            json = data;
          }
        });
        return json;
    })();

const audioWrapper = $('.audioSection');

audioJson.forEach((obj, index) => {
  let audioImage = '<img src="./../assets/images/play-button.png" class="audioImage audioImage'+ index +'" />';
  let audioSlider = '<div id="slider" class="slider"><input id="slider-input1" class="slider-input1" type="range" min="0" value="0" max="100" /></div>';
  let audioName = '<div class="audioName audioName'+ index +'">'+ obj.name +'</div>'
  let audio = '<audio class="audio audio'+ index +' hidden" controls><source src="./../assets/audio/Ocean.mp3" type="audio/mpeg"></audio>';
  let audioObjTemplate = '<div class="audioContainer" onClick="playAudio('+ index +')">'+ audioImage + audio + audioSlider + audioName +'</div>';

  audioWrapper.append(audioObjTemplate);
});

const playAudio = (audioIndex) => {
  let clickedAudio = $.grep(audioJson, (obj) => {
    return obj.id === audioIndex;
  })
  var currAudio = $('.audio' + audioIndex)[0];
  if (currAudio.paused) {
    currAudio.play();
  } else {
    currAudio.pause();
  }
  console.log(clickedAudio[0]);
}


$('#randomPlay').on('click', function() {
  var currAudio = $('#audio1')[0];
  if (currAudio.paused) {
    $('#randomPlay').removeClass('play');
    $('#randomPlay').addClass('pause');
    currAudio.play();
  } else {
    $('#randomPlay').removeClass('pause');
    $('#randomPlay').addClass('play');
    currAudio.pause();
  }
});
