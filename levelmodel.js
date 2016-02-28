var Level= function(game,background,level, lives, killsToDo) {
    this.game = game;
    this.background=background;
    this.rightMenu=background.rightMenu;
    this.level=level;
    this.lives = lives;
    this.score = 0;
    this.killsToDo = killsToDo;
}
Level.prototype = {

    removeLife: function() {
      this.lives--;
      this.rightMenu.updateLives(this.lives);
      // End game if out of lives.
      if (this.lives <= 0) {
          this.restoreDefaults();
          this.background.endGame();
      }
    },
    updateText: function() {
        this.rightMenu.updateLevel(this.level);
        this.rightMenu.updateLives(this.lives);
        this.rightMenu.updateScore(this.score);
    },
    increaseCount: function() {
        this.score++;
        this.rightMenu.updateScore(this.score);
    },
    restoreDefaults:function() {
        this.lives=3;
        this.score=0;
    }
};