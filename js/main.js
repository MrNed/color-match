if (document.readyState === 'complete' || document.readyState === 'interactive') {
  start();
} else {
  document.addEventListener('DOMContentLoaded', start, false);
}

function start() {
  var game = new Phaser.Game(300, 420, Phaser.Canvas, 'game_cont');

  game.state.add('Boot', Boot);
  game.state.add('Preload', Preload);
  game.state.add('Menu', Menu);
  game.state.add('BestScore', BestScore);
  game.state.add('Info', Info);
  game.state.add('Game', BasicGame);

  game.state.start('Boot');
};

var setCookie = function(cname, cvalue, exdays) {

  var d = new Date();
  d.setTime(d.getTime() + (exdays*24*60*60*1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + "; " + expires;

};

var getCookie = function(cname) {

  var name = cname + "=",
      ca = document.cookie.split(';');

  for ( var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }

    if  (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }

  return "";

};

var spliceOne = function(a, i) {
  var l = a.length;

  if (l) {
    while (i<l) {
      a[i++] = a[i];
    }

    --a.length;
  }

};

var createBackMenuBtn = function(game) {

  var manuBtn = game.add.button(10, 22, 'sprites', function() {
    game.state.start('Menu');
  }, this, 'menu_active.png', 'menu.png', 'menu_active.png');
  manuBtn.anchor.set(0, 0.5);
  manuBtn.input.useHandCursor = true;

};