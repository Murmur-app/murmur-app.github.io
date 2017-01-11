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
  let audioSlider = '<div></div>';
  let audioName = '<div class="audioName audioName'+ index +'">'+ obj.name +'</div>'
  let audio = '<audio class="audio audio'+ index +' hidden" controls><source src="./../assets/audio/Ocean.mp3" type="audio/mpeg"></audio>';
  let audioObjTemplate = '<div class="audioContainer" onClick="playAudio('+ index +')">'+ audioImage + audio + audioSlider + audioName +'</div>';

  audioWrapper.append(audioObjTemplate);
});

const playAudio = (audioIndex) => {
  let clickedAudio = $.grep(audioJson, (obj) => {
    return obj.id === audioIndex;
  })
  console.log(clickedAudio[0]);
}
