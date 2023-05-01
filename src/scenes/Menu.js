class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        // load audio
        this.load.audio('sfx_select', './assets/blip_select12.wav');
        this.load.audio('sfx_explosion', './assets/explosion38.wav');
        this.load.audio('sfx_rocket', './assets/rocket_shot.wav');
        this.load.audio('sfx_explosion1', './assets/explosion1.wav');
        this.load.audio('sfx_explosion2', './assets/explosion2.wav');
        this.load.audio('sfx_explosion3', './assets/explosion3.wav');
        this.load.audio('sfx_explosion4', './assets/explosion4.wav');
        // pixelbay Royalty free music (Cosmic glow by Andrewkn)
        this.load.audio('menu_background', './assets/cosmic.mp3');  
    }

    create() {
      
        this.sound.play('menu_background', {volume: .5, loop: true});

        let menuConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 0
        }
        // show menu text
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize * 2 - borderPadding * 2,
        'ROCKET PATROL', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2 - borderUISize - borderPadding,
        '2 PLAYER CO-OP', menuConfig).setOrigin(0.5);
        this.add.text(game.config.width/2, game.config.height/2,
        'Use ←→ arrows to move & (F) to fire', menuConfig).setOrigin(0.5);
        
        menuConfig.color = '#000';
        menuConfig.backgroundColor= '#FF0000';
        this.playerText = this.add.text(game.config.width/2, game.config.height/2 + borderUISize * 2 + borderPadding * 2,
        'Press ↓ to toggle local multiplayer', menuConfig).setOrigin(0.5);
        this.playerTwoInstruct = this.add.text(game.config.width/2, game.config.height/2 + borderUISize * 4 + borderPadding * 4,
        '(L) to fire', menuConfig).setOrigin(0.5);
        menuConfig.fixedWidth = '500';
        this.playerTwoInstruct2 = this.add.text(game.config.width/2, game.config.height/2 + borderUISize * 3 + borderPadding * 3,
        'Player 2 use (<)(>) to move & (L) to fire', menuConfig).setOrigin(0.5);
        menuConfig.backgroundColor = '#00FF00';
        menuConfig.fixedWidth = 0;
        this.add.text(game.config.width/2, game.config.height/2 + borderUISize + borderPadding,
        'Press ← for Novice or → for Expert', menuConfig).setOrigin(0.5);
        // define keys
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
        keyDOWN = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.DOWN);
        this.onePlayer = true;
        
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(keyDOWN)) {
          console.log('DOWN');
          console.log(this.onePlayer);
          this.onePlayer = !this.onePlayer;

          if (this.onePlayer) {
            console.log('RED');
            this.playerText.setBackgroundColor('#FF0000');
            this.playerTwoInstruct.setBackgroundColor('#FF0000')
            this.playerTwoInstruct2.setBackgroundColor('#FF0000')
          } else {
            this.playerText.setBackgroundColor('#00FF00');
            this.playerTwoInstruct.setBackgroundColor('#00FF00')
            this.playerTwoInstruct2.setBackgroundColor('#00FF00')
          }
        }

        if (Phaser.Input.Keyboard.JustDown(keyLEFT)) {
          // easy mode
          game.settings = {
            alienshipSpeed: 5,
            spaceshipSpeed: 3,
            gameTimer: 6000,
            onePlayer: this.onePlayer
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene');    
        }
        if (Phaser.Input.Keyboard.JustDown(keyRIGHT)) {
          // hard mode
          game.settings = {
            alienshipSpeed: 6,
            spaceshipSpeed: 4,
            gameTimer: 6000,
            onePlayer: this.onePlayer
          }
          this.sound.play('sfx_select');
          this.scene.start('playScene'); 
          
        }
      }
}
