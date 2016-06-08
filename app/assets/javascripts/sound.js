// Sound class
function Sound(id, uri) {
  var myself = this;
  this.id = id;
  this.playInstance = null;
  this.delay = 0;

  this.register = function(uri) {
    createjs.Sound.registerSound(uri, this.id);
  };

  this.play = function(event) {
    console.log("Play " + myself.id);
    this.playInstance = createjs.Sound.play(myself.id, { delay: myself.delay });
  }

  this.setVolume = function(volume) {
    this.playInstance.volume = volume;
  }

  this.setDelay = function(delay) {
    this.delay = delay;
  }

  this.register(uri);
  return this;
}

function HorizontalSound(id, uri, x) {
  this.sound = new Sound(id, uri);
  this.playing = false;
  this.x = x;

  this.respondToLocation = function(x) {
    maxDistance = 960 * 0.618;
    distance = Math.abs(x - this.x)
    if (distance < maxDistance) {
      if (!this.playing) {
        console.log('play!');
        this.sound.play();
        this.playing = true;
        this.sound.playInstance.paused = false;
        this.sound.playInstance.loop = -1;
        this.sound.playInstance.pan = (this.x / 960) * 1.5 - 0.75;
      }
      this.sound.playInstance.volume = Math.pow(Math.round((1 - (distance / maxDistance)) * 100) / 100, 1.5);
    } else {
      if (this.playing) {
        this.sound.playInstance.volume = 0;
        this.sound.playInstance.paused = true;
        this.playing = false;
      }
    }
  }

  return this;
}

function SynchronizedSound(id, uri) {
  this.sound = new Sound(id, uri);
  this.playing = false;
  this.playInstance = null;
  this.tailInstance = null;

  this.nextDownbeat = function(elapsedTime) {
    return Math.ceil((new Date().getTime() - elapsedTime) / 2000) * 2000;
  }

  this.millisecondsToNextDownbeat = function(elapsedTime) {
    return elapsedTime + this.nextDownbeat();
  }

  this.trigger = function() {
    if (!this.playing) {
      console.log('trigger drumTrack');
      this.playInstance = createjs.Sound.play(this.sound.id, { delay: this.millisecondsToNextDownbeat(), loop: -1 });
      this.playing = true;
    }
  }

  this.wrapUp = function(tailSound) {
    if (this.playing) {
      console.log('wrapUp');
      this.playInstance.loop = 0;
      var that = this;
      setTimeout(function() {
        that.playInstance.volume = 0;
        },
        this.millisecondsToNextDownbeat()
      );
      // this.playInstance.volume = 0;
      this.playing = false;
      tailSound.setDelay(this.millisecondsToNextDownbeat());
      this.tailInstance = tailSound.play();
    }
  }

  return this;
}
