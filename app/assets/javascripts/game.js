// Sound class
function Sound(id, uri) {
  var myself = this;
  this.id = id;

  this.register = function(uri) {
    createjs.Sound.registerSound(uri, this.id);
  };

  this.play = function(event) {
    createjs.Sound.play(myself.id);
  }

  this.register(uri);
}

// Circle class
function Circle(x, y, radius, color, sound) {
  this.defineEaselShape = function(x, y, radius, color) {
    var circle = new createjs.Shape();
    circle.graphics.beginFill(color).drawCircle(0, 0, radius);
    circle.x = x;
    circle.y = y;
    return circle;
  }

  this.addClickSound = function(sound) {
    this.easelShape.addEventListener("click", sound.play);
  }

  this.easelShape = this.defineEaselShape(x, y, radius, color);
  this.addClickSound(sound);
}

// Game singleton
var Game = {
  canvasId: "gameCanvas",
  circleCount: 0,

  start: function() {
    this.stage = new createjs.Stage(this.canvasId);
    this.addCircle("DeepSkyBlue", "sounds/thunder.mp3");
    this.addCircle("Red", "sounds/thunder.mp3");
    this.stage.update();
  },

  addCircle: function(color, soundUri) {
    this.circleCount++;
    this.sound = new Sound("Sound" + this.circleCount, soundUri);
    this.circle = new Circle(200 * this.circleCount, 100, 50, color, this.sound);
    this.stage.addChild(this.circle.easelShape);
  },

  log: function(content) {
    console.log(content);
  }
};

(function(window, document, undefined) {
  function start() {
    Game.start();
  }

  window.addEventListener('load', start, false);
})(window, document);
