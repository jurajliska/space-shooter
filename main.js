class BigAsteroids extends Phaser.Physics.Arcade.Sprite {
    constructor (scene, x, y, texture) {
        super(scene, x, y, texture);

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.damage = 0;
    }
}

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
let bigAsteroids;
let cursors;
let bullets;
let flame;

let isPress = false;
let score = 0;
let delay = 2000;
let asteroidTimer;
let bigAsteroidTimer;

let scoreText;
let gameOverText;


function preload() {
    this.load.image("background", "assets/bg.jpg");
    this.load.image("rocket", "assets/rocket.png");
    this.load.image("asteroid", "assets/asteroid.png");
    this.load.image("bullet", "assets/bullet.png");
    this.load.image("flame", "assets/flame.png");
}

function create() {
    this.add.image(500, 300, "background");

    player = this.physics.add.sprite(500, 500, "rocket").setScale(0.3);
    player.setCollideWorldBounds(true);

    flame = this.physics.add.sprite(player.x, player.y + 50, "flame");

    asteroids = this.physics.add.group();
    bigAsteroids = this.physics.add.group();
    bullets = this.physics.add.group();
    

    asteroidTimer = this.time.addEvent({delay: delay, callback: createAsteroid, callbackScope: this, loop: true});
    bigAsteroidTimer = this.time.addEvent({delay: 5000, callback: createBigAsteroid, callbackScope: this, loop: true})
    
    cursors = this.input.keyboard.createCursorKeys();

    this.physics.add.overlap(bullets, asteroids, destroy, null, this);
    this.physics.add.overlap(bullets, bigAsteroids, bigDestroy, null, this);
    this.physics.add.collider(player, asteroids, gameOver, null, this);
    this.physics.add.collider(player, bigAsteroids, gameOver, null, this);
    //this.physics.add.collider(asteroids, bigAsteroids);

    scoreText = this.add.text(20, 20, "Score: 0", {fontSize: "24px", fill: "#fff"});
    gameOverText = this.add.text(350, 250, "Game over!", {fontSize: "64px", fill: "#fff"});
    gameOverText.setVisible(false);
}

function update() {

    if (cursors.left.isDown) {
        player.setVelocityX(-200);
    } else if (cursors.right.isDown) {
        player.setVelocityX(200);
    } else {
        player.setVelocityX(0);
    }
    
    if (cursors.up.isDown) {
        player.setVelocityY(-200);
        flame.setVisible(true);
    } else if (cursors.down.isDown) {
        player.setVelocityY(200);
    } else {
        player.setVelocityY(0);
        flame.setVisible(false);
    }

    flame.setPosition(player.x, player.y + 45);
    
    if (cursors.space.isDown) {
        if (isPress === false) {
            fire();
            isPress = true;
        }
    } else {
        isPress = false;
    }

    bullets.children.iterate(function (child) {
        if (child.y < 20) {
            child.disableBody(true, true);
        } else return;
    })

    asteroids.children.iterate(function (child) {
        if (child.y > 570) {
            child.disableBody(true, true);
        } else return;
    })

    bigAsteroids.children.iterate(function (child) {
        if (child.y > 590) {
            child.disableBody(true, true);
        } else return;
    })

    asteroidTimer.timeScale = 1 + score/50;
    bigAsteroidTimer.timeScale = 1 + score/50;
}

function createAsteroid() {
    let asteroid = asteroids.create(Phaser.Math.Between(50, 950), 0, "asteroid").setScale(0.3);
    asteroid.setVelocityY(100 + score/2);
}

function createBigAsteroid()  {
    let bigAsteroid = new BigAsteroids(this, Phaser.Math.Between(50, 950), 0, "asteroid").setScale(0.55);
    bigAsteroids.add(bigAsteroid);

    bigAsteroid.setVelocityY(50 + score/4);
}

function fire() {
    let bullet = bullets.create(player.x, player.y - 50, "bullet");
    bullet.setVelocityY(-300);
}

function destroy(bullet, asteroid) {
    bullet.disableBody(true, true);
    asteroid.disableBody(true, true);

    score += 10;
    scoreText.setText("Score: " + score);
}

function bigDestroy(bullet, asteroid) {
    bullet.disableBody(true, true);
    
    asteroid.damage++;
    if (asteroid.damage === 3) {
        asteroid.disableBody(true, true);
        score += 30;
        scoreText.setText("Score: " + score);
    }
}

function gameOver() {
    this.physics.pause();
    asteroidTimer.paused = true;
    bigAsteroidTimer.paused = true;

    player.setTint(0xff0000);

    gameOverText.setVisible(true);
}