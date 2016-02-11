var titleColors = ['white', 'emerald', 'sun_flower', 'blue', 'alizarin']
    titleIndex = 0;

var Menu = function(game) {

  this.init = function(config) {

    if (!config) {
      config = {

      };
    }

    this.config = config;

    game.renderer.renderSession.roundPixels = true;

  };

  this.create = function() {

    var title = this.add.sprite(this.world.centerX, 100, 'sprites', 'title_white.png');
    title.anchor.set(0.5);

    this.time.events.add(1, function() {
      this.time.events.loop(5000, function() {
          titleIndex++;

          if (titleIndex == 5) {
            titleIndex = 0;
          }

          title.frameName = 'title_' + titleColors[titleIndex] + '.png';
      }, this);
    }, this);

    var playBtn = this.add.button(this.world.centerX, this.world.centerY, 'sprites', function() {
       this.state.start('Game', true, false, this.config);
    }, this, 'play_active.png', 'play.png', 'play_active.png');
    playBtn.anchor.set(0.5);
    playBtn.input.useHandCursor = true;

  };

};