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
}
