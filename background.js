var Background = function (game) {
    this.game=game;
};

Background.prototype = {

    setupMenu: function () {
        var game =this.game;
        // Create game name display.
        var name = new PIXI.Text('True Patriot', {
            font: 'bold 100px Arial',
            fill: '#7da6de',
            stroke: 'black',
            strokeThickness: 8
        });
        name.anchor.x = 0.5;
        name.anchor.y = 0.5;
        name.position.x = game._center.x;
        name.position.y = 100;

        // Create the button graphic.
        var button = new PIXI.Graphics();
        button.lineStyle(10, 0x000000);
        button.beginFill(0xFFD800);
        button.drawCircle(game._center.x, game._center.y, 150);
        button.endFill();

        // Create the play icon.
        var icon = new PIXI.Graphics();
        icon.beginFill(0x000000);
        icon.moveTo(game._center.x + 100, game._center.y);
        icon.lineTo(game._center.x - 60, game._center.y - 80);
        icon.lineTo(game._center.x - 60, game._center.y + 80);
        icon.endFill();

        // Add the button to the stage.
        button.addChild(icon);
        game.stage.addChild(button);
        game.stage.addChild(name);

        // Turn this into a button.
        button.interactive = true;
        button.buttonMode = true;

        button.click = this.onHitStart.bind(game,button,name);
        button.tap = this.onHitStart.bind(game,button,name);
    },
    onHitStart:function(button,name){
        this.stage.removeChild(button);
        this.stage.removeChild(name);
        this.startGame();
    },
    /**
     * Setup the background image.
     */
    setupBg: function () {
        // return;
        // Create the texture.
        var game =this.game;
        var bg = new PIXI.Sprite.fromImage('assets/bg.jpg');

        // Position the background in the center;
        bg.anchor.x = 0.5;
        bg.anchor.y = 0.5;
        bg.position.x = game._center.x;
        bg.position.y = game._center.y;
        // Mount onto the stage.
        game.stage.addChild(bg);
    },
    endGame: function () {
     var game = this.game;
    clearTimeout(game.timer);
    // Clear the stage.
    for (var i = 0; i < game.heads.length; i++) {
        if (game.heads[i]) {
            createjs.Tween.removeTweens(game.heads[i]);
            game.stage.removeChild(game.heads[i]);
        }
    }
    game.defaultValues();
    game.stage.removeChild(game.countingText);
    game.stage.removeChild(game.livesText);
    this.setupMenu();
}
};
