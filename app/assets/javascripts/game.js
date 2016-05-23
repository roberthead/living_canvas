function Sound(id, uri) {
  this.register = function(uri) {
    createjs.Sound.registerSound(uri, this.id);
  };

  this.play = function() {
    createjs.Sound.play(this.id);
  }

  this.id = id;
  this.register(uri);
}

function Circle(x, y, radius, color, sound) {
  this.defineEaselShape = function(x, y, radius, color) {
    var circle = new createjs.Shape();
    circle.graphics.beginFill(color).drawCircle(0, 0, radius);
    circle.x = x;
    circle.y = y;
    return circle;
  }

  this.addClickSound = function(sound) {
    this.easelShape.addEventListener("click", function(target) {
      sound.play();
    });
  }

  this.easelShape = this.defineEaselShape(x, y, radius, color);
  this.addClickSound(sound);
}

var Game = {
  canvasId: "gameCanvas",

  start: function() {
    this.sound = new Sound("Thunder", "sounds/thunder.mp3");
    this.circle = new Circle(100, 100, 50, "DeepSkyBlue");
    this.stage = new createjs.Stage(this.canvasId);
    this.stage.addChild(this.circle.easelShape);
    this.stage.update();
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
