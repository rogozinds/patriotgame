var RightMenu = function () {
};

RightMenu.prototype = {

    setup: function (game) {
        this.scoreText = new PIXI.Text('', {
            font: 'bold '+game.scale(50)+'px Arial',
            fill: '#3e1707',
            align: 'center',
            stroke: '#a4410e',
            strokeThickness: 7
        });

        this.scoreText.position.x = game.scale(50);
        this.scoreText.position.y = game.scale(50);
        this.scoreText.anchor.x = 0.1;

        // create a text object that will be updated...
        this.livesText = new PIXI.Text('', {
            font: 'bold '+game.scale(50)+'px Arial',
            fill: '#3e1707',
            align: 'center',
            stroke: '#FF0000',
            strokeThickness: 7
        });

        this.livesText.position.x = game.scale(50);
        this.livesText.position.y = game.scale(100);
        this.livesText.anchor.x = 0.1;

        this.levelText = new PIXI.Text('', {
            font: 'bold '+game.scale(50)+'px Arial',
            fill: '#3e1707',
            align: 'center',
            stroke: '#a4410e',
            strokeThickness: 7
        });

        this.levelText.position.x = game.scale(50);
        this.levelText.position.y = game.scale(150);
        this.levelText.anchor.x = 0.1;
    },
    addToStage: function (stage) {
        stage.addChild(this.livesText);
        stage.addChild(this.scoreText);
        stage.addChild(this.levelText);
    },
    removeFromStage: function (stage) {
        stage.removeChild(this.livesText);
        stage.removeChild(this.scoreText);
        stage.removeChild(this.levelText);
    },
    updateLevel: function(level) {
        this.levelText.text='Level : '+level;
        this.levelText.updateText();
    },
    updateScore: function(score) {
        this.scoreText.text='Score : '+score;
        this.scoreText.updateText();
    },
    updateLives: function(lives){
        this.livesText.text = 'Lives : '+lives;
        this.livesText.updateText();
    }
};