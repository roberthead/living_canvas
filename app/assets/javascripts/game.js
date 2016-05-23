var Game = {
  canvasId: "gameCanvas",
  soundID: "Thunder",

  init: function() {
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
      Game.playSound("Thunder");
    });

    this.stage.addChild(circle);
  },

  loadSound: function() {
    createjs.Sound.registerSound("sounds/thunder.mp3", this.soundID);
  },

  playSound: function(soundID) {
    Game.log(this.soundID);
    createjs.Sound.play(soundID);
  },

  log: function(content) {
    console.log(content);
  }
};
