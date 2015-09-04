function playerSettings() {
    var left = game.input.keyboard.addKey(Phaser.Keyboard.A);


    player = game.add.sprite(32, 32, 'dude');
    game.physics.enable(player, Phaser.Physics.ARCADE);

    player.body.bounce.x = 1;
    player.body.collideWorldBounds = true;
    player.body.setSize(20, 32, 5, 16);

    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('turn', [4], 20, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);

    game.camera.follow(player);
    //KEYMAPPING
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    a = game.input.keyboard.addKey(Phaser.Keyboard.A);
    D = game.input.keyboard.addKey(Phaser.Keyboard.D);
    S = game.input.keyboard.addKey(Phaser.Keyboard.S);
}

function playerControls() {
    if (cursors.right.isDown) {
        fireBullet(facing);
    }
    if (cursors.up.isDown) {
        fireBullet(facing);
    }
    if (cursors.left.isDown) {
        fireBullet(facing);
    }
    if (cursors.down.isDown) {
        fireBullet(facing);
    }
    if (a.isDown) {
        player.body.velocity.x = -150;

        if (facing != 'left') {
            player.animations.play('left');
            facing = 'left';
        }
    }
    else if (D.isDown) {
        player.body.velocity.x = 150;

        if (facing != 'right') {
            player.animations.play('right');
            facing = 'right';
        }
    }
    else {
        if (facing != 'idle') {
            player.animations.stop();

            if (facing == 'left') {
                player.frame = 0;
            }
            else {
                player.frame = 5;
            }

            facing = 'idle';
        }
    }
    //include in jump if statement......disabling for debug
    // && player.body.onFloor() in jumpButton selection
    if (jumpButton.isDown && game.time.now > jumpTimer) {
        player.body.velocity.y = -250;
        //jumpTimer = game.time.now + 750;
    }
}
function createBullets() {
    //Bullet!
    bullets = game.add.group();
    bullets.enableBody = true;
    bullets.physicsBodyType = Phaser.Physics.ARCADE;
    bullets.createMultiple(30, 'spriteBullet');
    bullets.setAll('anchor.x', 0);
    bullets.setAll('anchor.y', 0);
    bullets.setAll('outOfBoundsKill', true);
    bullets.setAll('checkWorldBounds', true);
}
function fireBullet(facing) {
    var shotDirX = 0;
    var shotDirY = 0;
    var shootingDown = false;
    var isProne = false;
    if (game.time.now > bulletTime) {
        bullet = bullets.getFirstExists(false);

        if (bullet) {
            if (cursors.right.isDown && cursors.up.isDown) {
                shotDirX = 1000;
                shotDirY = -250;
            }
            else if (cursors.right.isDown && S.isDown) {
                shotDirX = 1000;
                //shotDirY = 250;
                isProne = true;
            }
            else if (cursors.right.isDown && cursors.down.isDown) {
                shotDirX = 1000;
                shotDirY = 250;
                //shotDirY = this.game.rnd.between(-10,10);
            }
            else if (cursors.right.isDown) {
                shotDirX = 1000;
                //shotDirY = this.game.rnd.between(-10,10);
            }
            else if (cursors.left.isDown && cursors.up.isDown) {
                shotDirX = -1000;
                shotDirY = -250;
            }
            else if (cursors.left.isDown && cursors.down.isDown) {
                shotDirX = -1000;
                shotDirY = 250;
            }
            else if (cursors.left.isDown && S.isDown) {
                shotDirX = -1000;
                // shotDirY = 250;
                isProne = true;
            }
            else if (cursors.left.isDown) {
                shotDirX = -1000;
            }
            else if (cursors.up.isDown) {
                shotDirY = -1000;
            }
            else if (cursors.down.isDown) {
                shotDirY = 1000;
                shootingDown = true;
            }
            if (isProne && player.body.onFloor()) {
                bullet.reset(player.body.x - 28, player.body.y + 0);
            }
            else {
                if (shootingDown == true) {
                    bullet.reset(player.body.x - 28, player.body.y + 0);
                }
                else {
                    bullet.reset(player.body.x - 28, player.body.y - 18);
                }
            }

        }

        bullet.lifespan = 20000;
        // bullet.rotation = player.rotation;
        // bullet.anchor.setTo(.5,.5);
        // game.physics.arcade.velocityFromRotation(player.rotation, 800, bullet.body.velocity);
        // this.physics.enable(this.bullet, Phaser.Physics.ARCADE);

        //SIZE CHECK// COLLISION BOX//
        this.bullet.body.setSize(20, 20, 18, 16);
        this.bullet.body.velocity.x = shotDirX;
        this.bullet.body.velocity.y = shotDirY;
        //this.bullet.body.velocity.x = 5;
        //this.bullet.body.velocity.y = 5;
        //bullet.body.rotation = 60;
        bulletTime = game.time.now + 100;
        //isProne = false;
    }
}