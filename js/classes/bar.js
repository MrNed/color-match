var Bar = function(game, color, timeLeft) {

  if (timeLeft) {
    bar = game.add.graphics(10, 95);
    bar.beginFill(0xecf0f1);
    bar.drawRect(0, 0, 280, 10);
    bar.endFill();

    buttonMask = game.add.graphics(280, 95);
    buttonMask.beginFill(0x2c3e50);
    buttonMask.drawRect(0, 0, 280, 10);
    buttonMask.endFill();

    var timeTween = game.add.tween(buttonMask);
    timeTween.to({
      x: 10
    }, timeLeft, "Linear", true);
    timeTween.onComplete.addOnce(function() {

    }, this);
  } else {
    color = '0x' + color.substring(1);

    var bar = game.add.graphics(10, 60);
    bar.beginFill(color);
    bar.drawRect(0, 0, 280, 30);
    bar.endFill();
  }

};

Bar.prototype = Object.create(Phaser.Sprite.prototype);
Bar.prototype.constructor = Bar;