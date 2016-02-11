var Game = function() {
    // Set the width and height of the scene.
   // this._width = document.body.clientWidth;
   // this._height = document.body.clientHeight;
    this._width = 1920;
    this._height = 1440;
    this._streakLimit=2;
    this._center = {
        x: Math.round(this._width / 2),
        y: Math.round(this._height / 2)
    };

    // Setup the rendering surface.
    this.renderer = new PIXI.autoDetectRenderer(this._width, this._height);
    document.body.appendChild(this.renderer.view);

    // Create the main stage to draw on.
    this.stage = new PIXI.Stage();
    // Store rocks.
    this.heads = [];
    // Start running the game.
    this.build();
};

Game.prototype = {
    /**
     * Build the scene and begin animating.
     */

    defaultValues: function() {
        this.rocks = [];
        this._streak = 0;
        this.count=0;
        this.lives=3;
    },
    build: function () {
        // Draw the background.
        this.setupBg();

        // Setup the start screen.
        this.setupMenu();
        this.sound = new Howl({
            src: ['shot.wav'],
            sprite: {
                shot: [0, 1000]
            }
        });

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
        var name = new PIXI.Text('True Patriot', {
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
            this.stage.removeChild(button);
            this.stage.removeChild(name);
            this.startGame();
        }.bind(this);
    },

    /**
     * Start the gameplay.
     */
    startGame: function () {
        this.defaultValues();
        // Setup timer to throw random rocks.
        this.throwHeads();

// create a text object that will be updated...
        this.countingText = new PIXI.Text('SCORE: 0', {
            font: 'bold 50px Arial',
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
        this.livesText = new PIXI.Text('Lives: '+this.lives, {
            font: 'bold 50px Arial',
            fill: '#3e1707',
            align: 'center',
            stroke: '#FF0000',
            strokeThickness: 7
        });

        this.livesText.position.x = 50;
        this.livesText.position.y = 100;
        this.livesText.anchor.x = 0.1;
        this.stage.addChild(this.livesText)

    },
    endGame: function () {
        this.defaultValues();
        clearTimeout(this.timer);
        // Clear the stage.
        for (var i=0; i<this.heads.length; i++) {
            if (this.heads[i]) {
                createjs.Tween.removeTweens(this.heads[i]);
                this.stage.removeChild(this.heads[i]);
            }
        }
        this.stage.removeChild(this.countingText);
        this.stage.removeChild(this.livesText);
        this.setupMenu();
    },
    throwHeads: function () {
        //var rand = Math.ceil(1000 + (Math.random() * 4) * 1000);
        var rand =2000;
        this.timer = setTimeout(function () {
            var texture = new PIXI.Texture.fromImage('assets/2.png');
// create a texture from an image path
            var head = new PIXI.Sprite(texture);
// center the sprites anchor point
            head.anchor.x = 0.5;
            head.anchor.y = 0.5;
            // move the sprite t the center of the screen
            head.position.x = Math.round(Math.random() * this._width);
            head.position.y = 150;
            head.interactive = true;
            head.buttonMode = true;
            head.defaultCursor = "crosshair";
            head.alpha = 0.5;
            head.click = this.onHit.bind(this,head);
            head.tap = this.onHit.bind(this, head);
            // Tween the rock with an easing function to simulate physics.
            var y1 = Math.round(50 + Math.random() * 500);
            head._tween1 = createjs.Tween.get(head)
                .to({alpha:1,y: y1}, 3000,createjs.Ease.cubicOut)
                .call(function(item) {
                    this.stage.removeChild(item);
                    this.lives -= 1;
                    // update the text with a new string
                    this.livesText.text = "LIVES:" + this.lives;
                    this.livesText.updateText();
                    // End game if out of lives.
                    if (this.lives <= 0) {
                        this.endGame();
                    }
                }.bind(this,head));
            this.heads.push(head);
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
    animateStreak: function() {

        var assetsToLoad = ["assets/gund1.png"];
        // create a new loader
        this.loader = new PIXI.AssetLoader(assetsToLoad);
        // use callback
        this.loader.onComplete = onAssetsLoaded.bind(this);
        //begin load
        this.loader.load();

        function onAssetsLoaded() {

            var texture = PIXI.Texture.fromImage("assets/gund1.png");
            var streakPiece = new PIXI.Sprite(texture);
            // this will log the correct width and height as the image was preloaded into the pixi.js cache
            console.log(streakPiece.width + ', ' + streakPiece.height);
            streakPiece.texture.baseTexture.on('loaded', function(){    console.log(streakPiece.width, streakPiece.height);});
            streakPiece.anchor.x =0.0;
            streakPiece.anchor.y =0.0;
            streakPiece.position.x=this._width-streakPiece.width/2;
            streakPiece.position.y=-streakPiece.height/2;
            streakPiece.alpha=0.3;
            var x=this._width-streakPiece.width;
            var y = 0;
            createjs.Tween.get(streakPiece)
                .to({x:x,y:y,alpha:0.8}, 1500,createjs.Ease.quadOut)
                .call(function(streakPiece) {
                    this.stage.removeChild(streakPiece);
                }.bind(this,streakPiece));

            rampage = new PIXI.Text('RAMPAGE!!!', {
                font: 'bold 100px Arial',
                fill: '#ff0000',
                align: 'center',
                stroke: 'black',
                strokeThickness: 2
            });
            rampage.anchor.x=0.5;
            rampage.anchor.y=0.5;
            rampage.position.x = this._width/2;
            rampage.position.y= 150;
            rampage.alpha=0.2;
            createjs.Tween.get(streakPiece)
                .to({alpha:1}, 1000,createjs.Ease.quadOut)
                .to({alpha:1}, 1000,createjs.Ease.quadOut)
                .call(function(rampage) {
                    this.stage.removeChild(rampage);
                }.bind(this,rampage));
            this.stage.addChild(rampage)
            this.stage.addChild(streakPiece);
        }





    },
    onHit: function (item) {
        //explode
        // Create several smaller rocks.
        // Setup the rock sprite.
        if(this._streakLimit==this._streak) {
            this._streak=0;
         this.animateStreak();
        }
        this.sound.play('shot');
        createjs.Tween.get(item).to({alpha:0.3}, 200,createjs.Ease.cubicOut);
        for (var i=0; i<3;i++) {
            for(var j=0;j<2;j++) {
                var piece = new PIXI.Sprite.fromImage("assets/blood1.png");
                piece.width = Math.round(piece.texture.width * 0.43);
                piece.height = Math.round(piece.texture.height * 0.43);
                piece.anchor.x = 0.5;
                piece.anchor.y = 0.5;
                piece.position.x = item.position.x;
                piece.position.y = item.position.y;

                // Tween the rock.
                var side=1;
                if(j!=0) {
                    side =-1;
                }
                var x = item.position.x + 30 * side;
                var y = item.position.y - 30 * i;
                var t = 800 + Math.round(Math.random() * 100);

                var tween = createjs.Tween.get(piece)
                    .to({x: x, y: y, rotation: 1, alpha: 0.9}, t, createjs.Ease.quadOut )
                    .call(function (obj) {
                        this.stage.removeChild(obj);
                    }.bind(this, piece));
                this.stage.addChild(piece);

            }
        }
        this._streak+=1;
        if(this._streak==this._streakLimit) {
            this.streak=0;
            console.log("STREAK!");
        }
        //remove
        createjs.Tween.removeTweens(item);
        this.stage.removeChild(item);
        // Add the rock to the stage.
        this.stage.addChild(piece);
        this.count += 1;
        // update the text with a new string
        this.countingText.text = "SCORE:" + this.count;
        this.countingText.updateText();
    },
    onHitWrong: function () {
        this.lives -= 1;
        // update the text with a new string
        this.livesText.text = "LIVES:" + this.lives;
        this.livesText.updateText();
        // End game if out of lives.
        if (this.lives <= 0) {
            this.endGame();
        }
    }
};
