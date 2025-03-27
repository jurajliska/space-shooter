var config = {
    type: Phaser.AUTO,
    width: 1000,
    height: 600,
    physics: {
        default: "arcade",
        arcade: {
            gravity: {y: 0},
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
}

var game = new Phaser.Game(config);

let player;
let asteroids;
let cursors;

function preload() {
    this.load.image("background", "assets/bg.jpg");
    this.load.image("rocket", "assets/rocket.png");
    this.load.image("asteroid", "assets/asteroid.png");
    this.load.image("bullet", "assets/bullet.png");
}

function create() {
    this.add.image(500, 300, "background");

    player = this.physics.add.sprite(500, 500, "rocket").setScale(0.3);
    player.setCollideWorldBounds(true);

    asteroids = this.physics.add.group();

    var asteroid = asteroids.create(500, 20, "asteroid").setScale(0.3);

    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.collider(player, asteroids);
}

function update() {

    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0);
    }
    
    if (cursors.up.isDown){
        player.setVelocityY(-200);
    } else if (cursors.down.isDown) {
        player.setVelocityY(200);
    } else {
        player.setVelocityY(0);
    }
}