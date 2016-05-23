var Game = {
  canvasId: "gameCanvas",
  soundId: "Thunder",

  start: function() {
    this.loadSound();
    this.stage = new createjs.Stage(this.canvasId);
    this.drawCircle();
    this.stage.update();
  },

  drawCircle: function() {
    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;

    circle.addEventListener("click", function(target) {
      Game.playSound(Game.soundId);
    });

    this.stage.addChild(circle);
  },

  loadSound: function() {
    createjs.Sound.registerSound("sounds/thunder.mp3", Game.soundId);
  },

  playSound: function(soundId) {
    Game.log(soundId);
    createjs.Sound.play(soundId);
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
