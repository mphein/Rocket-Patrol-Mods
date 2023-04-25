class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        this.load.image('desert', './assets/desert.png');
        this.load.image('alienship', './assets/alienship.png');
        // load spritesheet
        this.load.spritesheet('explosion','./assets/explosion.png', {
            frameWidth: 64,
            frameHeight: 32,
            startFrame: 0,
            endFrame: 9
        });
    }
  
    create() {
        // place the tile sprite
        //this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        this.desert = this.add.tileSprite(0, -20, 640, 480, 'desert').setOrigin(0, 0);
        // green UI background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00FF00).setOrigin(0, 0);

        // add spaceships (x4)
        this.ship01 = new Spaceship(this, game.config.width + borderUISize * 6, borderUISize * 4, 'spaceship', 0, 30).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize * 6 + borderPadding * 4, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship02 = new Alienship(this, game.config.width + borderUISize * 3, borderUISize * 5 + borderPadding*3, 'alienship', 0, 40).setOrigin(0,0);
        this.ship04 = new Alienship(this, game.config.width + borderUISize * 3, borderUISize * 8 + borderPadding*6, 'alienship', 0, 20).setOrigin(0,0);

        // white borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(.5, 0);

        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', {
                start: 0,
                end: 9,
                first: 0
            }),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;
        
        // display score
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding * 2, this.p1Score, scoreConfig);

        // display high score
        this.highScoreRight = this.add.text(game.config.width - borderUISize * 4 - borderPadding, borderUISize + borderPadding * 2, highScore, scoreConfig);
        
        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, ()=> {
            this.timer.setText('0');
            updateTime.destroy();
            this.add.text(game.config.width/2, game.config.height/2, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        // FIRE UI
        this.displayFire = this.add.text(game.config.width/2, borderUISize + borderPadding * 2, 'FIRE', scoreConfig).setOrigin(.5, 0);
        this.displayFire.alpha = 0;        

        // speed up spaceships after gameTimer/2
        this.spaceshipBoosters = this.time.delayedCall(game.settings.gameTimer / 2, ()=> {
            console.log('BOOST');
            this.ship01.moveSpeed = this.ship01.moveSpeed * 2;
            this.ship02.moveSpeed = this.ship02.moveSpeed * 2;
            this.ship03.moveSpeed = this.ship03.moveSpeed * 2;
            this.ship04.moveSpeed = this.ship04.moveSpeed * 2;
        });

        // display time remaining
        this.timeLeft = game.settings.gameTimer;
        this.timer = this.add.text(game.config.width/2 - borderUISize*4, borderUISize + borderPadding * 2, this.timeLeft/1000, scoreConfig).setOrigin(.5,0);
        let updateTime = this.time.addEvent({delay:1000, callback: this.updateTimer, callbackScope: this, loop: true});

        // randomize SFX
        this.explodeSFX = ['sfx_explosion1','sfx_explosion2','sfx_explosion3','sfx_explosion4']
    }

    update() {
        // display 'FIRE UI'
        if (this.p1Rocket.isFiring) {
            this.displayFire.alpha = 1;
        } else {
            this.displayFire.alpha = 0;
        }
        

        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }

        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
          }

        this.desert.tilePositionX -= 1;
        if (!this.gameOver){
            this.p1Rocket.update();
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }   

        // check collisions
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
        if (this.checkCollision(this.p1Rocket, this.ship04)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship04);
        }
    }


    checkCollision(rocket, ship) {
        // Simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
            return true;
        } else {
            return false;
        }
    }

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0,0);
        boom.anims.play('explode');
        boom.on('animationcomplete', () => {
            ship.reset();
            ship.alpha = 1;
            boom.destroy();
        });

        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        if (this.p1Score > highScore) {
            this.highScoreRight.text = this.p1Score;
            highScore = this.p1Score;
        }

        // choose a random explosion sound from explodeSFX array
        this.sound.play(this.explodeSFX[Math.floor(Math.random() * 4)]);
    }
    
    // updates the timer when called by updateTime timed addEvent
    updateTimer() {
        this.timeLeft -= 1000;
        this.timer.setText(this.timeLeft/1000);
    }
}