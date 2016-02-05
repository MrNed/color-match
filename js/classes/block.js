var Block = function(game, color, isPoint, x, y, group) {

  if (isPoint) {
    this.point = true;
  } else {
    this.point = false;
  }

  var block = game.add.bitmapData(90, 90);
  block.ctx.rect(0, 0, 90, 90);
  block.ctx.fillStyle = color;
  block.ctx.fill();

  Phaser.Sprite.call(this, game, x, y, block);

  this.inputEnabled = true;

  group.add(this);

};

Block.prototype = Object.create(Phaser.Sprite.prototype);
Block.prototype.constructor = Block;