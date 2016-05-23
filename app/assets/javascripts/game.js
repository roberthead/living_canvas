var Game = {
  canvasId: "gameCanvas",

  init: function() {
    this.stage = new createjs.Stage(this.canvasId);
    this.drawCircle();
    this.stage.update();
  },

  drawCircle: function() {
    var circle = new createjs.Shape();
    circle.graphics.beginFill("DeepSkyBlue").drawCircle(0, 0, 50);
    circle.x = 100;
    circle.y = 100;
    this.stage.addChild(circle);
  }
};
