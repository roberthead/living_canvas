// Sound class
function Sound(id, uri) {
  var myself = this;
  this.id = id;
  this.playInstance = null;

  this.register = function(uri) {
    createjs.Sound.registerSound(uri, this.id);
  };

  this.play = function(event) {
    this.playInstance = createjs.Sound.play(myself.id);
  }

  this.setVolume = function(volume) {
    this.playInstance.volume = volume;
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
}
