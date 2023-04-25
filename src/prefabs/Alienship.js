class Alienship extends Spaceship {
    constructor(scene, x, y, texture, frame, pointValue) {
        super(scene, x, y, texture, frame, pointValue);
        this.moveSpeed = game.settings.alienshipSpeed;
    }
}