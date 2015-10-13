function createEnemies(iHowMany){

    for(var i = 0; i < iHowMany;i++)
    {
        var x = game.rnd.integerInRange(0, CANVAS_WIDTH-80);
        var y = game.rnd.integerInRange(0, CANVAS_HEIGHT-80);
        //var type = game.rnd.integerInRange(0,2);
        var type = 3;
        var enemy = this.enemiesGroup.getFirstDead();
        if(enemy === null){
            enemy = new Enemy(game,x,y,type);
            this.enemiesGroup.add(enemy);
        }
        //animal.animations.add('myanimation', [ type, type+5, type+10, type+5], 8, true);
        //animal.play('myanimation', 5, true, false);
        enemy.body.setSize(20, 32, 5, 16);

       // enemy.body.gravity.y = 250;
        Phaser.Math.snapTo(enemy.body.y, 70);
        enemy.revive();
        enemy.x = x;
        enemy.y = y;
        enemy.health = 3;
        //animal.enableBody = true;
        enemy.frame = type;
        enemy.EnemyType = type;

    }
}
var Enemy = function(pgame,x,y,enemytype){
    switch(enemytype)
    {   case 0:Phaser.Sprite.call(this,pgame,x,y,'enemy');
                break;
        case 1:Phaser.Sprite.call(this,pgame,x,y,'enemyBomber');
            this.scale.setTo(2);
            this.anchor.setTo(0.5,0.5);
                break;
        case 2:Phaser.Sprite.call(this,pgame,x,y,'enemy');
                break;
        case 3:Phaser.Sprite.call(this,pgame,x,y,'enemyBomber');
                     this.scale.setTo(2);
            this.anchor.setTo(0.5,0.5);
    break;}
            this.animations.add('left', [0, 1, 2, 3], 10, true);
            this.animations.add('turn', [4], 20, true);
            this.animations.add('right', [5, 6, 7, 8], 10, true);


    this.enemytype = enemytype;
    this.isFollowing = false;
    this.isAiming = false;
    this.isEnraged = false;
    counter = this.game.rnd.between(0,100);
    this.enemyDirection = null;
    // this.EnemyType = 0;
    this.frame = enemytype;
    pgame.physics.enable(this,Phaser.Physics.ARCADE);
    switch(this.enemytype) {
        case 0:
            this.body.gravity.y = 250;
            game.time.events.loop(Phaser.Timer.SECOND * 3, enemyPatrol, this);
            game.time.events.loop(Phaser.Timer.SECOND * this.game.rnd.realInRange(1, 8), enemyFireBullet, this);
            break;
        case 1:
            this.body.gravity.y = 250;
            game.time.events.loop(Phaser.Timer.SECOND * 3, enemyPatrol, this);
            game.time.events.loop(Phaser.Timer.SECOND * this.game.rnd.realInRange(1, 8), enemyFireBullet, this);
            break;
        case 2:
        this.body.gravity.y = 0;
            this.hasBlown = false;
            boomerGroup.add(this);
            game.time.events.loop(Phaser.Timer.SECOND,enemyFly,this);
            //game.time.events.loop(Phaser.Timer.SECOND)
            break;
        case 3:
            this.body.gravity.y = 250;
            game.time.events.loop(Phaser.Timer.SECOND * 3, enemyPatrol, this);
            break;

    }
    //this.game.rnd.realInRange(1,8)

};
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

// animal update move around
Enemy.prototype.update = function() {
    if (this.alive) {

        // move animals around
        switch (this.enemytype) {
            case 0:
                // animalPatrol()
                if (this.game.physics.arcade.distanceBetween(this, player) < 300)
                {
                    this.isFollowing = true;
                    if(this.body.onFloor()){ game.physics.arcade.moveToXY(this, player.body.x, player.body.y  , 100);}
                }
                else{
                    this.isFollowing = false;
                }
                //Phaser.Math.snapTo(enemy.body.x, 70) 3rd parameter of movetoxy
                // game.physics.arcade.moveToObject(animal,player,70);
                break;
            case 1:
                if (this.game.physics.arcade.distanceBetween(this, player) < 300)
                {
                    this.isFollowing = true;
                }
                if(this.isFollowing)
                {
                    if(this.game.physics.arcade.distanceBetween(this,player) < 300) {
                        this.body.velocity.x = 0;
                    }
                    else{
                        if (this.body.onFloor()) {
                            game.physics.arcade.moveToXY(this, player.body.x, this.body.y, 100);
                        }
                    }
                }
                break;
            case 2:
                if(this.isFollowing == true)
                {
                    if(this.hasBlown == false)
                    game.physics.arcade.moveToXY(this, player.body.x + 50, this.body.y, 200);
                }
                break;
            //TODO give straffing speed and enraged straffing speed
            case 3:
                this.isFollowing = true;



        }
    }

};
function enemyFly(){
    if(this.body.x - 700  < player.x   && this.isFollowing == false){
        this.body.velocity.x = -75;
        if(this.body.y < 100)
        {
            this.body.velocity.y = 100;
        }
        else{
            this.body.velocity.y = -100;
        }
        if(this.body.x - 100 < player.x)
        {
            this.isFollowing = true;
        }
    }

    if(this.isFollowing == true)
    {
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
    }


}
function enemyPatrol() {

    //counter +=1;
   var baddieMover = game.rnd.integerInRange(1, 2);
    var xRSpeed = 100;
    var xLSpeed = -100;

    // simple if statement to choose if and which way the baddie moves
    if (this.body.x < 100 && baddieMover == 2) {
        baddieMover = 1;
    }
    else if (this.body.x > 600 && baddieMover == 1){
        baddieMover = 2;
    }
    if(this.isFollowing == false) {
        if (baddieMover == 1) {
            this.body.velocity.x = 100;
            {
                this.animations.play('right');
                this.enemyDirection = 'right';
            }


        }
        else if (baddieMover == 2) {
            this.body.velocity.x = -100;
            this.animations.play('left');
            this.enemyDirection = 'left';
        }
        else {
            this.body.velocity.x = 0;
            this.animations.stop();
        }
    }
    //REMINDER HERES WHERE I CHANGED THE FUCKING VELOCITY
    else{
        if(player.x > this.x)
            {this.body.velocity.x = 100;
            this.animations.play('right')
            this.enemyDirection = 'right';
        }
        else{

            this.body.velocity.x = -100;
            this.animations.play('left');
            this.enemyDirection = 'left';
        }
    }

}
function enemyFireBullet() {

    if(this.alive) {
        switch(this.enemytype) {
            case 0:

                bulle = enemyBullets.getFirstExists(false);

                if (bulle) {

                    bulle.reset(this.body.x - 28, this.body.y + 0);
                    bulle.body.setSize(20, 20, 18, 16);
                    if (this.enemyDirection == 'left') {
                        bulle.body.velocity.x = -150
                    }
                    else {
                        bulle.body.velocity.x = 150
                    }

                    bulle.lifespan = 10000;
                }
                break;
            case 1:

                bulle = enemyDynamite.getFirstExists(false);
                if(this.isFollowing)
                    if (bulle) {
                        bulle.reset(this.body.x - 28, this.body.y + 0);
                        bulle.body.rotation = 0;
                        bulle.hasBlown = false;
                        bulle.body.setSize(30, 35, -2, 9);
                        if (this.enemyDirection == 'left') {
                            bulle.body.velocity.x = -150;
                            bulle.body.velocity.y = -100;
                        }
                        else {
                            bulle.body.velocity.x = 150;
                            bulle.body.velocity.y = -200;
                        }

                        bulle.body.gravity.y = 200;
                        bulle.lifespan = 10000;
                    }
                break;

        }
    }

}