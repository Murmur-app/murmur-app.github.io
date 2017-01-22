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
  let audioImage = '<img src="./assets/images/audio-icons/' + obj.image + '.svg" class="svg audioImage audioImage' + index + '" />';
  let audioSlider = '<div id="slider' + index + '" class="slider"></div>';
  let audioName = '<div class="audioName audioName' + index + '">' + obj.name + '</div>'
  let audio = '<audio id="audio' + index + '" class="audio audio' + index + ' hidden" loop><source src="./assets/audio/' + obj.audio + '.mp3" type="audio/mpeg"></audio>';
  let audioObjTemplate = '<div class="audioItem audioItem' + index + '" onClick="playAudio(' + index + ')">' + audioImage + audio + audioName + audioSlider + '</div>';

  audioWrapper.append(audioObjTemplate);
});

const playAudio = (audioIndex, audioVolume = 50) => {
  let clickedAudio = $.grep(audioJson, (obj) => {
    return obj.id === audioIndex;
  })
  const currAudio = $('.audio' + audioIndex)[0];
  const slider = $('#slider' + audioIndex)[0];

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

    slider.noUiSlider.on('update', (values, handle) => {
      currAudio.volume = Math.round(values[handle]) / 100;
    });
    // $('.randomPlay.play').addClass( 'pause' ).removeClass( 'play' );
    $('.randomPlay.play').addClass('hidden');
    $('.randomPlay.pause').removeClass('hidden');
  } else {
    currAudio.pause();
    $('.audioItem' + audioIndex).removeClass('active');
    slider.noUiSlider.destroy();
    let playCount = 0;
    for (let i = 0; i < audioJson.length; i++) {
      if ($('.audio' + i)[0].paused) playCount++;
    }

    if(playCount === audioJson.length) {
      // $('.randomPlay.pause').addClass( 'play' ).removeClass( 'pause' );
      $('.randomPlay.play').removeClass('hidden');
      $('.randomPlay.pause').addClass('hidden');
    }
  }
}

/* Pause all the current playing audios and return the playing status */
/* Returns true if at least one of the audio is playing */
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

  sessionStorage.setItem('audioVolumeArray', audioVolumeArray);
  // $('.randomPlay.pause').addClass( 'play' ).removeClass( 'pause' );
  $('.randomPlay.play').removeClass('hidden');
  $('.randomPlay.pause').addClass('hidden');
  return playing;
}

/* Random shuffling between the available audios */
const shuffle = () => {
  pauseAll();
  for (var i = 0; i < 4; i++) {
    playAudio(Math.floor(Math.random()*audioJson.length));
  }
}

/* Toggle between play and pause of global play button */
const globalPlay = () => {
  let sampleAudioCombinations = {
    0: [.12,0,0,0.3,0,0.3,0,0,0.3,0,.78,.5],
    1: [.9,0,0,0,0.7,0,0.8,0,0.3,0.2,0,0],
    2: [.32,0,0.3,0,0,0,0,0.7,0.3,0.2,.2,.9],
    3: [0.7,0,0.4,0.1,0.6,0,0,0,0.33,0.72,0,0]
  }
  let audioVolume = localStorage.getItem('audioVolumeArray');
  let audioVolumeArray = [];
  if(audioVolume) {
    audioVolumeArray = audioVolume.split(',');
  }
  else {
    audioVolumeArray = sampleAudioCombinations[Math.floor(Math.random()*4)];
  }
  for (let i = 0; i < audioVolumeArray.length; i++) {
    if(parseFloat(audioVolumeArray[i]) != 0) {
      playAudio(i, parseFloat(audioVolumeArray[i])*100);
    }
  }
}

/* To save the current playing combination in local storage */
const save = () => {
  let audioVolumeArray = [];
  for (let i = 0; i < audioJson.length; i++) {
    let vol = 0;
    if (!$('.audio' + i)[0].paused) {
      vol = document.getElementById('audio' + i).volume;
    }
    audioVolumeArray.push(vol);
  }
  localStorage.setItem('audioVolumeArray', audioVolumeArray);
}

$(function() {
  convertToInlineSvg();

  // open menu
  $('.menu-bar').on('click', () => {
    if ($('.menu').hasClass('menu-hidden')) {
      $('.menu').removeClass('menu-hidden');
      $('.container').addClass('menu-active');
      $('body').addClass('hideOverflow');
    } else {
      $('.menu').addClass('menu-hidden');
      $('.container').removeClass('menu-active');
      $('body').removeClass('hideOverflow');
    }
  });

  // close menu
  $('.overlay').on('click', () => {
    $('.menu').addClass('menu-hidden');
    $('.container').removeClass('menu-active');
  });

  // open about modal
  $('.about-option').on('click', (obj) => {
    $('.menu').addClass('menu-hidden');
    $('.container').removeClass('menu-active');

    setTimeout(() => {
      $('.about-modal').addClass('active');
    }, 200)
  });

  // open feedback modal
  $('.feedback-option').on('click', (obj) => {
    $('.menu').addClass('menu-hidden');
    $('.container').removeClass('menu-active');

    setTimeout(() => {
      $('.feedback-modal').addClass('active');
    }, 200)
  });

  // close modal
  $('.modal-close').on('click', () => {
    $('.modal').addClass('animate-close');
    setTimeout(() => {
      $('.modal').removeClass('animate-close');
      $('.modal').removeClass('active');
    }, 300);
    $('.feedback-textarea')[0].value = '';
    $('.placeholder-text').removeClass('hidden');
  });

  // on feedback active
  $('.feedback-textarea').on('focus', () => {
    $('.placeholder-text').addClass('hidden');
  });

  // on feedback blur
  $('.feedback-textarea').on('blur', () => {
    if($('.feedback-textarea')[0].value === '') {
      $('.placeholder-text').removeClass('hidden');
    }
  });

  // on feedback submit
  $('.feedback-button').on('click', () => {
    let mailBody = $('.feedback-textarea')[0].value;
    let subject = 'App feedback';
    console.log(subject + '\n' + mailBody);
    window.open('mailto:vatsalya25@gmail.com?subject='+ subject +'&body='+ mailBody);
  });
});
