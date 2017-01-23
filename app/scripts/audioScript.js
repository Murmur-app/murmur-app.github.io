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

    if (playCount === audioJson.length) {
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

  // $('.randomPlay.pause').addClass( 'play' ).removeClass( 'pause' );
  $('.randomPlay.play').removeClass('hidden');
  $('.randomPlay.pause').addClass('hidden');
  return playing;
}

/* Random shuffling between the available audios */
const shuffle = () => {
  pauseAll();
  for (var i = 0; i < 4; i++) {
    playAudio(Math.floor(Math.random() * audioJson.length));
  }
}

/* Toggle between play and pause of global play button */
const globalPlay = () => {
  let sampleAudioCombinations = {
    0: [.12, 0, 0, 0.3, 0, 0.3, 0, 0, 0.3, 0, .78, .5],
    1: [.9, 0, 0, 0, 0.7, 0, 0.8, 0, 0.3, 0.2, 0, 0],
    2: [.32, 0, 0.3, 0, 0, 0, 0, 0.7, 0.3, 0.2, .2, .9],
    3: [0.7, 0, 0.4, 0.1, 0.6, 0, 0, 0, 0.33, 0.72, 0, 0]
  }
  let audioVolume = localStorage.getItem('audioVolumeArray');
  let audioVolumeArray = [];
  if (audioVolume) {
    audioVolumeArray = audioVolume.split(',');
  } else {
    audioVolumeArray = sampleAudioCombinations[Math.floor(Math.random() * 4)];
  }
  playCombination(audioVolumeArray);
}

/* To save the current playing combination in local storage so that user can resume what was played last */
const saveLastPlayed = () => {
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

// To close an open modal box
const closeModal = () => {
  $('.modal').addClass('animate-close');
  setTimeout(() => {
    $('.modal').removeClass('animate-close');
    $('.modal').removeClass('active');
  }, 300);
  $('.feedback-textarea')[0].value = '';
  $('.placeholder-text').removeClass('hidden');
}

/* Save the current playing combination with a name in Local storage */
const saveCombination = () => {
  const enteredName = $('#combo-input').val();
  let savedData = localStorage.getItem('savedCombination');

  if(enteredName === '') {
    return 'Name cannot be empty. Please enter a valid name.';
  }

  if (savedData) {
    let savedNames = Object.keys(jQuery.parseJSON(savedData));
    /* If already 10 combinations are stored */
    if (savedNames.length > 9) {
      // alert('Memory Full ! First delete some existing combination'); //Replace this with showing error modal
      return 'Memory Full! First delete an existing combination.';
    }
    /* If the combination with same name already exists */
    else if (savedNames.indexOf(enteredName) > -1) {
      // alert('combination with same name already exists');
      return 'Combination with the same name already exists.';
    }
  }

  let audioVolumeArray = [];
  for (let i = 0; i < audioJson.length; i++) {
    let vol = 0;
    if (!$('.audio' + i)[0].paused) {
      vol = document.getElementById('audio' + i).volume;
    }
    audioVolumeArray.push(vol);
  }
  let savedCombination = jQuery.parseJSON(savedData) || {};
  savedCombination[enteredName || 'Combo '] = audioVolumeArray;
  localStorage.setItem('savedCombination', JSON.stringify(savedCombination));
  return 'success';
}

/* Delete the existing saved combination in local storage */
const deleteCombination = (name) => {
  let savedData = localStorage.getItem('savedCombination');
  if (savedData) {
    let savedJSON = jQuery.parseJSON(savedData);
    if (savedJSON[name]) {
      delete savedJSON[name];
      localStorage.setItem('savedCombination', JSON.stringify(savedJSON));
    }
  }
}

/* Play selected combination when a name is selected from the saved list */
const playSavedCombination = (name) => {
  let savedData = localStorage.getItem('savedCombination');
  if (savedData) {
    let savedJSON = jQuery.parseJSON(savedData);
    if (savedJSON[name]) {
      playCombination(savedJSON[name]);
      return;
    }
  }
  alert('Sorry ! There was some error in data. Can\'t play this combination');
}

/* To play a combination */
const playCombination = (audioVolumeArray) => {
  for (let i = 0; i < audioVolumeArray.length; i++) {
    if (parseFloat(audioVolumeArray[i]) != 0) {
      playAudio(i, parseFloat(audioVolumeArray[i]) * 100);
    }
  }
}

/* To get array of Names of all the saved combinations */
const getCombinationsNameList = () => {
  let savedData = localStorage.getItem('savedCombination');
  if (savedData) {
    const savedNames = Object.keys(jQuery.parseJSON(savedData));
    const altMenu = $('.alt-menu');
    savedNames.forEach((name) => {
      let template = '<div class="menu-option combo-option"><div class="option"><img src="./assets/images/music-icon.svg" class="svg option-icon info-icon" /></div><div class="text">' + name + '</div><div class="option delete-sound" onClick="deleteCombination(\"' + name + '\")"><img src="./assets/images/delete-button.svg" class="svg option-icon delete-icon" /></div></div>';
      altMenu.append(template);
    })
    convertToInlineSvg();
  } else {
    return null;
  }
}

// set cursor to end of value in save combo modal
$.fn.setCursorToTextEnd = function() {
  var $initialVal = this.val();
  this.val($initialVal);
};


$(function() {
  convertToInlineSvg();
  getCombinationsNameList();

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

  // open alternate menu
  $('.alt-menu-bar').on('click', () => {
    if ($('.alt-menu').hasClass('alt-menu-hidden')) {
      $('.alt-menu').removeClass('alt-menu-hidden');
      $('.container').addClass('alt-menu-active');
      $('body').addClass('hideOverflow');
    } else {
      $('.alt-menu').addClass('alt-menu-hidden');
      $('.container').removeClass('alt-menu-active');
      $('body').removeClass('hideOverflow');
    }
  });

  // close all menu
  $('.overlay').on('click', () => {
    $('.menu').addClass('menu-hidden');
    $('.alt-menu').addClass('alt-menu-hidden');
    $('.container').removeClass('menu-active');
    $('.container').removeClass('alt-menu-active');
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
    closeModal();
  });

  // on feedback textarea active
  $('.feedback-textarea').on('focus', () => {
    $('.placeholder-text').addClass('hidden');
  });

  // on feedback textarea blur
  $('.feedback-textarea').on('blur', () => {
    if ($('.feedback-textarea')[0].value === '') {
      $('.placeholder-text').removeClass('hidden');
    }
  });

  // on feedback submit
  $('.feedback-button').on('click', () => {
    let mailBody = $('.feedback-textarea')[0].value;
    let subject = 'App feedback';
    window.open('mailto:vatsalya25@gmail.com?subject=' + subject + '&body=' + mailBody);
  });

  // open save combination modal
  $('.randomPlay.save').on('click', () => {
    $('.saveName-modal').addClass('active');
    $('.combo-error').text('');

    setTimeout(() => {
      $('#combo-input').focus();
      $('#combo-input').setCursorToTextEnd();
    }, 10);
  });

  // On clicking a saved sound in alternate menu
  $('.combo-option').on('click', (clickedCombo) => {
    let soundName = clickedCombo.target.children[1].innerText;

    if ($(clickedCombo.target).hasClass('saved-active')) {
      $(clickedCombo.target).removeClass('saved-active');

      pauseAll();
    } else {
      $('.combo-option').removeClass('saved-active');
      $(clickedCombo.target).addClass('saved-active');
      playSavedCombination(soundName);
    }
  });

  // on Saving a combination
  $('.save-button').on('click', () => {
    let msg = saveCombination();
    if(msg !== 'success') {
      $('.combo-error').text(msg);
      $('#combo-input').focus();
    } else {
      closeModal();
    }
  });

  // While typing the input combination name - remove any error messages
  $('#combo-input').on('change paste keyup', () => {
    $('.combo-error').text('');
  });

  // on clicking delete for a saved sound from the alternate menu
  $('.delete-sound').on('click', () => {
    $('.alt-menu').addClass('alt-menu-hidden');
    $('.container').removeClass('alt-menu-active');

    setTimeout(() => {
      $('.deleteSaved-modal').addClass('active');
    }, 200)
  });

  // on clicking 'NO' in the delete sound popup modal
  $('.confirm-delete.no-button').on('click', () => {
    closeModal();
  })

  // on clicking 'YES' in the delete sound popup modal
  $('.confirm-delete.yes-button').on('click', () => {
    // deleteCombination()
    closeModal();
  })
});
