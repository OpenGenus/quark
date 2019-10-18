

var Sound = (function($) {
  var format = $.browser.webkit ? ".mp3" : ".wav";
  var soundPath = "sounds/";
  var sounds = {};

  function loadSoundChannel(name) {

    var sound = $('<audio autoplay />').get(0);
    sound.src = soundPath + name + format;
    sound.crossOrigin = 'anonymous';
    //console.log(sound);
    return sound;
  }
  
  function Sound(name, maxChannels) {
    return {
      play: function() {

        Sound.play(name, maxChannels);
      },

      stop: function() {
        Sound.stop(name);
      }
    }
  }

  return $.extend(Sound, {
    play: function(name, maxChannels) {
      // Note: Too many channels crash browsers
      maxChannels = maxChannels || 4;

      if(!sounds[name]) {
        sounds[name] = [loadSoundChannel(name)];
      }

      var freeChannels = $.grep(sounds[name], function(sound) {


        return sound.currentTime == sound.duration || sound.currentTime == 0
      });

      if(freeChannels[0]) {
        try {
          freeChannels[0].currentTime = 0;

        } catch(e) {
        }
        console.log(freeChannels[0]);
        var playPromise =  freeChannels[0].play();
            if (playPromise !== undefined) {
              playPromise.then(function() {
                // Automatic playback started!
              }).catch(function(error) {
                //console.log(playPromise);
               // console.log(error);
                // Automatic playback failed.
                // Show a UI element to let the user manually start playback.
              });
            }


         freeChannels[0].play();

      } else {
        if(!maxChannels || sounds[name].length < maxChannels) {
          var sound = loadSoundChannel(name);
          sounds[name].push(sound);
          console.log(sound);
          sound.play();
          


        }
      }
    },

    stop: function(name) {
      if(sounds[name]) {
        sounds[name].stop();
      }
    }
  });
}(jQuery));
