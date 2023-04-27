class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame);

        scene.add.existing(this);
        this.addTime = 2000;
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
        this.direction = Math.random();
        if (this.direction < .5) {
            this.toggleFlipX();
        }
    }

    update() {
        if (this.direction >= .5) {
            this.x -= this.moveSpeed;

            if(this.x <= 0 - this.width) {
                this.x = game.config.width;
            }
        } else {
            this.x += this.moveSpeed;

            if(this.x >= game.config.width) {
                this.x = 0;
            }
        }
    }

    reset() {
        if (this.direction >= .5) {
            this.x = game.config.width;
        } else {
            this.x = 0;
        }
    }
}