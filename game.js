var Game = function () {
    // Set the width and height of the scene.
    this._width = document.body.clientWidth;
    this._height = document.body.clientHeight;

    this._scaleFactor = 1920 / this._width;
    if (Math.ceil(this._height * this._scaleFactor) < 1200) {
        this._scaleFactor = 1200 / this._height;
    }
    ;
    this._width = this.scale(1920);
    this._height = this.scale(1200);
    this._streakLimit = 3;
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
    scale: function (size) {
        return Math.round(size / this._scaleFactor);
    },
    defaultValues: function () {
        this.heads = [];
        this._streak = 1;
    },
    build: function () {
        this.background = new Background(this);
        this.levelModel = new Level(this, this.background, 1, 3, 10);
        // Draw the background.
        this.background.setupBg();
        // Setup the start screen.
        this.background.setupMenu();
        this.sound = new Howl({
            urls: ['sounds/shot.wav', 'error.wav'],
            sprite: {
                shot: [0, 1000]
            }
        });

        // Begin the first frame.
        requestAnimationFrame(this.tick.bind(this));
    },

    nop: function (item) {
        this.stage.removeChild(item);
    },
    getImagePath: function (isEnemy, nImages) {
        var rand = Math.floor((Math.random() * nImages) + 1);
        var folder = isEnemy ? 'enemies' : 'friends';
        return 'assets/vaadin/' + folder + '/' + rand + '.png';
    },
    /**
     * Start the gameplay.
     */
    throwHeadsRandom: function () {
        var isEnemy = Math.random() >= 0.5;
        if (isEnemy) {
            this.throwHeads(true, this.onHit, this.headCollapse);
        } else {
            this.throwHeads(false, this.onHitWrong, this.nop)
        }


    },
    startGame: function () {
        this.defaultValues();
        this.levelModel.updateText();
        // Setup timer to throw random rocks.
        this.throwHeadsRandom();
    },
    headCollapse: function (item) {
        this.stage.removeChild(item);
        this.levelModel.removeLife();
    },

    throwHeads: function (isEnemy, onHit, headCollapse) {
        var img = this.getImagePath(isEnemy, 3);
        //var rand = Math.ceil(1000 + (Math.random() * 4) * 1000);
        var rand = 500;
        this.timer = setTimeout(function () {
            var texture = new PIXI.Texture.fromImage(img);
// create a texture from an image path
            var head = new PIXI.Sprite(texture);
// center the sprites anchor point
            head.anchor.x = 0.5;
            head.anchor.y = 0.5;
            head.width=this.scale(head.width);
            head.height=this.scale(head.height);
            // move the sprite t the center of the screen
            head.position.x = this.scale(100)+Math.round(Math.random() * (this._width-this.scale(100)));
            //head.position.x = this.scale(400);
            head.position.y = this.scale(200);

            head.interactive = true;
            head.buttonMode = true;
            head.defaultCursor = "crosshair";
            head.alpha = 0.5;
            head.click = onHit.bind(this, head);
            head.tap = onHit.bind(this, head);
            // Tween the rock with an easing function to simulate physics.
            this.heads.push(head);
            var y1 = Math.round(this._height * 0.2 + Math.random() * this._height/2);
            var y1 = this.scale(700);

            head._tween1 = createjs.Tween.get(head)
                .to({alpha: 1, y: y1}, 3000, createjs.Ease.cubicOut)
                .call(headCollapse.bind(this, head));

            this.stage.addChild(head);
            this.throwHeadsRandom();
        }.bind(this), rand);
    },

    tick: function (time) {
        this.renderer.render(this.stage);
        requestAnimationFrame(this.tick.bind(this));
    },
    onAssetsLoaded: function () {
        var streakPiece = new PIXI.Sprite(this.resources.gund.texture);
        // this will log the correct width and height as the image was preloaded into the pixi.js cache
        streakPiece.texture.baseTexture.on('loaded', function () {
            console.log(streakPiece.width, streakPiece.height);
        });
        streakPiece.width = this.game.scale(streakPiece.width);
        streakPiece.height = this.game.scale(streakPiece.height);
        streakPiece.anchor.x = 0.0;
        streakPiece.anchor.y = 0.0;
        streakPiece.position.x = this.game._width - streakPiece.width / 2;
        streakPiece.position.y = -streakPiece.height / 2;
        streakPiece.alpha = 0.3;
        var x = this.game._width - streakPiece.width;
        var y = 0;
        createjs.Tween.get(streakPiece)
            .to({x: x, y: y, alpha: 0.8}, 3000, createjs.Ease.quadOut)
            .call(function (streakPiece) {
                this.stage.removeChild(streakPiece);
            }.bind(this.game, streakPiece));

        this.game.animateMsg('AWESOME!!!', this.game._width / 2, this.game.scale(200));
        this.game.stage.addChild(streakPiece);
    },
    animateStreak: function () {
        var sprites = {};
        // create a new loader
        this.loader = new PIXI.loaders.Loader();
        this.loader.game = this;
        // use callback
        this.loader.add('gund', "assets/vaadin/joonas.png");
        this.loader.on('complete', this.onAssetsLoaded);
        //begin load
        this.loader.load(function (loader, resources) {
            sprites.gund = new PIXI.Sprite(resources.gund.texture);
        });

    },
    animateMsg: function (text, x, y) {
        console.log("X Y:" + x + " " + y);
        rampage = new PIXI.Text(text, {
            font: 'bold '+this.scale(100)+'px Arial',
            fill: '#ff0000',
            align: 'center',
            stroke: 'black',
            strokeThickness: 2
        });
        rampage.anchor.x = 0.5;
        rampage.anchor.y = 0.5;
        rampage.position.x = x;
        rampage.position.y = y;
        rampage.alpha = 0.0;
        createjs.Tween.get(rampage)
            .to({alpha: 1}, 300, createjs.Ease.quadOut)
            .to({alpha: 1}, 1000, createjs.Ease.quadOut)
            .call(function (rampage) {
                this.stage.removeChild(rampage);
            }.bind(this, rampage));
        this.stage.addChild(rampage)
    },
    onHit: function (item) {
        //explode
        // Create several smaller rocks.
        // Setup the rock sprite.
        if (this._streakLimit == this._streak) {
            this._streak = 0;
            this.animateStreak();
        }
        this.sound.play('shot');
        createjs.Tween.get(item).to({alpha: 0.3}, 200, createjs.Ease.cubicOut);
        for (var i = 0; i < 3; i++) {
            for (var j = 0; j < 2; j++) {
                var piece = new PIXI.Sprite.fromImage("assets/blood1.png");
                piece.width = this.scale(Math.round(piece.texture.width * 0.43));
                piece.height = this.scale(Math.round(piece.texture.height * 0.43));
                piece.anchor.x = 0.5;
                piece.anchor.y = 0.5;
                piece.position.x = item.position.x;
                piece.position.y = item.position.y;

                var side = 1;
                if (j != 0) {
                    side = -1;
                }
                var x = item.position.x +this.scale( 30 * side);
                var y = item.position.y - this.scale(30 * i);
                var t = 800 + Math.round(Math.random() * 100);

                createjs.Tween.get(piece)
                    .to({x: x, y: y, rotation: 1, alpha: 0.9}, t, createjs.Ease.quadOut)
                    .call(function (obj) {
                        this.stage.removeChild(obj);
                    }.bind(this, piece));
                this.stage.addChild(piece);

            }
        }
        this._streak += 1;
        if (this._streak == this._streakLimit) {
            this.streak = 0;
        }
        //remove
        createjs.Tween.removeTweens(item);
        this.stage.removeChild(item);
        // Add the rock to the stage.
        this.stage.addChild(piece);
        this.levelModel.increaseCount();
    },
    onHitWrong: function (item) {
        createjs.Tween.removeTweens(item);
        this.animateMsg('WRONG TARGET!',this._width / 2, this.scale(600));
        this.stage.removeChild(item);
        this.levelModel.removeLife();
    }
};
