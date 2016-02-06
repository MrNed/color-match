var game = new Phaser.Game(300, 420, Phaser.Canvas, 'game_cont');

game.state.add('Boot', Boot);
game.state.add('Preload', Preload);
// game.state.add('Menu', BasicGame.Menu);
game.state.add('Game', BasicGame);

game.state.start('Boot');