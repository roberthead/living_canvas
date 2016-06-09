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

function SynchronizedSound(id, uri, tail) {
  this.sound = new Sound(id, uri);
  this.tail = tail;

  this.playing = false;
  this.playInstance = null;
  this.tailInstance = null;

  this.millisecondsToNextDownbeat = function(elapsedTime) {
    return 2000 - elapsedTime % 2000;
  }

  this.trigger = function(elapsedTime, loop, volume) {
    if (!this.playing) {
      console.log('trigger ' + this.sound.id);
      this.playInstance = createjs.Sound.play(this.sound.id, { delay: this.millisecondsToNextDownbeat(elapsedTime), loop: loop });
      this.playing = true;
    } else {
      this.wrapUp(elapsedTime);
    }
    return this.playInstance;
  }

  this.wrapUp = function(elapsedTime) {
    if (this.playing) {
      console.log('wrapUp');
      this.playInstance.loop = 0;
      var that = this;
      setTimeout(function() {
        that.playInstance.volume = 0;
        },
        this.millisecondsToNextDownbeat(elapsedTime)
      );
      this.playing = false;
      if (tail) {
        this.tail.setDelay(this.millisecondsToNextDownbeat(elapsedTime));
        this.tailInstance = this.tail.play();
      }
    }
  }

  return this;
}
