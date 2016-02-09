var Game = function() {
    // Set the width and height of the scene.
   // this._width = document.body.clientWidth;
   // this._height = document.body.clientHeight;
    this._width = 1024;
    this._height = 768;
    this.count=0;
    this.lives=0;
    this._center = {
        x: Math.round(this._width / 2),
        y: Math.round(this._height / 2)
    };

    // Setup the rendering surface.
    this.renderer = new PIXI.autoDetectRenderer(this._width, this._height);
    document.body.appendChild(this.renderer.view);

    // Create the main stage to draw on.
    this.stage = new PIXI.Stage();

    // Start running the game.
    this.build();
};

Game.prototype = {
    /**
     * Build the scene and begin animating.
     */
    build: function () {
        // Draw the background.
        this.setupBg();

        // Setup the start screen.
        this.setupMenu();

        // Begin the first frame.
        requestAnimationFrame(this.tick.bind(this));
    },
    /**
     * Setup the background image.
     */
    setupBg: function () {
        // return;
        // Create the texture.
        var bg = new PIXI.Sprite.fromImage('assets/bg.jpg');

        // Position the background in the center;
        bg.anchor.x = 0.5;
        bg.anchor.y = 0.5;
        bg.position.x = this._center.x;
        bg.position.y = this._center.y;

        // Mount onto the stage.
        this.stage.addChild(bg);
    },
    /**
     * Build the main menu screen.
     */
    setupMenu: function () {
        // Create game name display.
        var name = new PIXI.Text('Stone Samurai', {
            font: 'bold 100px Arial',
            fill: '#7da6de',
            stroke: 'black',
            strokeThickness: 8
        });
        name.anchor.x = 0.5;
        name.anchor.y = 0.5;
        name.position.x = this._center.x;
        name.position.y = 100;

        // Create the button graphic.
        var button = new PIXI.Graphics();
        window.test = button;
        button.lineStyle(10, 0x000000);
        button.beginFill(0xFFD800);
        button.drawCircle(this._center.x, this._center.y, 150);
        button.endFill();

        // Create the play icon.
        var icon = new PIXI.Graphics();
        icon.beginFill(0x000000);
        icon.moveTo(this._center.x + 100, this._center.y);
        icon.lineTo(this._center.x - 60, this._center.y - 80);
        icon.lineTo(this._center.x - 60, this._center.y + 80);
        icon.endFill();

        // Add the button to the stage.
        button.addChild(icon);
        this.stage.addChild(button);
        this.stage.addChild(name);

        // Turn this into a button.
        button.interactive = true;
        button.buttonMode = true;
        button.click = function () {
            document.body.style.cursor = 'default';
            this.stage.removeChild(button);
            this.stage.removeChild(name);
            this.startGame();
        }.bind(this);
    },

    /**
     * Start the gameplay.
     */
    startGame: function () {
        // Setup timer to throw random rocks.
        this.throwHeads();

// create a text object that will be updated...
        this.countingText = new PIXI.Text('SCORE: 0', {
            font: 'bold italic 14px',
            fill: '#3e1707',
            align: 'center',
            stroke: '#a4410e',
            strokeThickness: 7
        });

        this.countingText.position.x = 50;
        this.countingText.position.y = 50;
        this.countingText.anchor.x = 0.1;
        this.stage.addChild(this.countingText)

        // create a text object that will be updated...
        var livesText = new PIXI.Text('Lives: 0', {
            font: 'bold italic 14px',
            fill: '#3e1707',
            align: 'center',
            stroke: '#a4410e',
            strokeThickness: 7
        });

        livesText.position.x = 50;
        livesText.position.y = 100;
        livesText.anchor.x = 0.1;
        this.stage.addChild(livesText)

    },
    endGame: function () {
    },
    throwHeads: function () {
        var rand = Math.ceil(1000 + (Math.random() * 4) * 1000);
        this.timer = setTimeout(function () {
            var texture = new PIXI.Texture.fromImage('assets/2.png');
// create a texture from an image path
            var head = new PIXI.Sprite(texture);
// center the sprites anchor point
            head.anchor.x = 0.5;
            head.anchor.y = 0.5;
            // move the sprite t the center of the screen
            head.position.x = 200;
            head.position.y = 150;
            head.interactive = true;
            head.buttonMode = true;
            head.alpha = 0.2;
            head.click = this.onHit.bind(this);
            head.tap = this.onHit.bind(this);
            // Tween the rock with an easing function to simulate physics.
            var y1 = Math.round(50 + Math.random() * 500);
            head._tween1 = createjs.Tween.get(head)
                .to({alpha:1,y: y1}, 5000,createjs.Ease.cubicOut)
                .call(function(stone) {
                    this.stage.removeChild(stone);
                }.bind(this,head));

            this.stage.addChild(head);
            this.throwHeads();
        }.bind(this), rand);
    },

    tick: function (time) {
        // Update tweens.
        //createjs.Tween.update
        // TWEEN.update(time);
        // Render the stage for the current frame.
        this.renderer.render(this.stage);
        // Begin the next frame.
        requestAnimationFrame(this.tick.bind(this));
    }
    ,
    onHit: function () {
        this.count += 1;
        // update the text with a new string
        this.countingText.text = "Score:" + this.count;
        this.countingText.updateText();
    },
    onHitWrong: function () {
        this.lives -= 1;
        // update the text with a new string
        this.livesText.text = "Lives:" + this.lives;
        this.livesText.updateText();
    }
};
