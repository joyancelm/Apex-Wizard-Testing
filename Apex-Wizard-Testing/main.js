var player;
var cursors;
var playerProjectile;
var enemyProjectile;
var playerHealth;
var playerContainer;
var gridEngineConfig;
var enemies;
var playerHealthValue;
var enemyHealth;
var enemyHealthValue;
var enemyContainer;

var gameplayScene = new Phaser.Class({
    
    Extends: Phaser.Scene,
    
    initialize:
    
    function gameplayScene ()
    {
        Phaser.Scene.call(this, { key: 'gameplayScene'});
    },
    
    
    preload: function ()
    {
        
        this.load.spritesheet('playerProjectile', 'assets/lightboltv1.png', {frameWidth: 16, frameHeight: 16});
        this.load.spritesheet('enemyProjectile', 'assets/fireballv1.png', {frameWidth: 16, frameHeight: 16});
        this.load.tilemapTiledJSON('map','assets/demo.json');
        this.load.tilemapTiledJSON('env','assets/items.json');
        this.load.image('tiles','assets/level64.png');
        this.load.image('items','assets/level32.png');
        this.load.audio('sf', 'assets/soundefx')

        this.load.spritesheet('player', 'assets/New Piskel.png', { frameWidth: 32, frameHeight: 32});
        
        
        this.load.spritesheet('enemy', 'assets/demonv1.png', {
        frameWidth: 32, frameHeight: 32});
        
    },
    
    create: function ()
    {        
        //Tilemap Code
        this.cameras.main.setBounds(0, 0, 1024, 2048);
        
        const map = this.make.tilemap ({ key: 'map' });
        const tileset = map.addTilesetImage('level64','tiles');
        
        const ground = map.createStaticLayer('Ground', tileset);
        const walls = map.createStaticLayer('Walls',tileset);
        map.setCollision([1]);
        map.setCollision([2]);
        map.setCollision([3]);
        map.setCollision([4]);
        map.setCollision([5]);
        map.setCollision([17]);
        map.setCollision([9]);
        map.setCollision([13]);
        map.setCollision([17]);
        map.setCollision([22]);
        map.setCollision([4]);
        map.setCollision([6]);
        map.setCollision([28]);
        map.setCollision([21]);
        map.setCollision([25]);
        map.setCollision([26]);
        map.setCollision([27]);
        map.setCollision([28]);
        map.setCollision([29]);
        
        const map2 = this.make.tilemap({ key: 'env' });
        const tileset2 = map2.addTilesetImage('level32','items');
        
        const items = map2.createStaticLayer('Tile Layer 1', tileset2 );
        map2.setCollision([1]);
        map2.setCollision([2]);
        map2.setCollision([3]);
        map2.setCollision([4]);
        map2.setCollision([5]);
        map2.setCollision([6]);
        map2.setCollision([7]);
        map2.setCollision([8]);
        map2.setCollision([9]);
        map2.setCollision([10]);
        map2.setCollision([11]);
        
        
        
        player = this.physics.add.sprite(33, 33, 'player');
        this.physics.add.collider(player,walls);
        this.physics.add.collider(player,items);
        
        player.setCollideWorldBounds(true);
        

        //Camera Follow stuff
        this.cameras.main.startFollow(player, true, 0.09, 0.09);
    
        //this.cameras.main.setZoom(2);
        
        playerProjectile = this.physics.add.group();
        enemyProjectile = this.physics.add.group();
        playerProjectile.enableBody = true;
        enemyProjectile.enableBody = true;
        
        
        this.physics.add.collider(playerProjectile, walls, projectileDisable, null, this);
        this.physics.add.collider(playerProjectile, items, projectileDisable, null, this);
        this.physics.add.collider(enemyProjectile, walls, projectileDisable, null, this);
        this.physics.add.collider(enemyProjectile, items, projectileDisable, null, this);
        
        playerHealthValue = 100;
        this.playerHealth = this.add.text(player.x - 32, player.y - 32, playerHealthValue + "/100");
        this.playerHealth.setColor("#34eb49");
        //playerContainer = this.add.container(0,0, [player, playerHealth]);
        // ignore for now
//        gridEngineConfig = {
//            characters: [
//                {
//                    id: 'player',
//                    sprite: player,
//                    playerContainer,
//                    
//                }
//            ]
//        }
        
        //enemies = [];
        enemy = this.physics.add.sprite(this.sys.game.config.width/2, this.sys.game.config.height/2, 'enemy');
        enemy.enableBody = true;
        
        //enemy.setCollideWorldBounds(true);
        this.physics.add.collider(enemy, walls);
        this.physics.add.collider(enemy, items);
        //enemy.create(this.sys.game.config.width/2, this.sys.game.config.height/2, 'enemy');
        //enemies.push ( new Enemy());
        enemyHealthValue = 100;
        this.enemyHealth = this.add.text(enemy.x - 32, enemy.y - 32, enemyHealthValue + "/100");
        this.enemyHealth.setColor("#e63629");
        //enemyContainer = this.add.container(0,0, [enemy, enemyHealth]);
        
        this.physics.add.overlap(player, enemy, playerTakeDamageCollide, null, this);
        this.physics.add.overlap(player, enemyProjectile, playerTakeDamage, null, this);
        this.physics.add.overlap(enemy, playerProjectile, enemyTakeDamage, null, this);
        
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 7, end: 9 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'idle',
            frames: [ { key: 'player', frame: 2 } ],
            frameRate: 60
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'up',
            frames: this.anims.generateFrameNumbers('player', { start: 15, end: 16 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'down',
            frames: this.anims.generateFrameNumbers('player', { start: 12, end: 14 }),
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'leftUp',
            frames: [ { key: 'player', frame: 10 } ],
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'rightUp',
            frames: [ { key: 'player', frame: 3 } ],
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'leftDown',
            frames: [ { key: 'player', frame: 11 } ],
            frameRate: 10,
            repeat: -1
        });
        
        this.anims.create({
            key: 'rightDown',
            frames: [ { key: 'player', frame: 4 } ],
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'projectile',
            frames: this.anims.generateFrameNumbers('projectile',{start:4,end:5}),
            duration: 10
            
            
        });
        cursors = this.input.keyboard.createCursorKeys();
        
        this.time.addEvent({ delay: 5000, callback: function() {if (enemy.active) {enemy.setVelocityX(Phaser.Math.Between(-320, 320));
                                                                enemy.setVelocityY(Phaser.Math.Between(-320,320));}}, callbackscope: this, loop: true});
        
        this.time.delayedCall(5500, function enemyMove() {if (enemy.active) {enemy.setVelocityX(0);
                enemy.setVelocityY(0);
                var activeProjectile = enemyProjectile.create(enemy.x + 16, enemy.y, "enemyProjectile");
                this.physics.moveToObject(activeProjectile, player, 500);
    this.time.delayedCall(5000, enemyMove, [], this);}}, [], this); 
    },
    
    update: function()
    {
        if (cursors.left.isDown && cursors.up.isDown) {
            player.setVelocityX(-160);
            player.setVelocityY(-160);
            player.anims.play('leftUp', true);
            if (cursors.shift.isDown)
            {
                console.log("works");
                player.setVelocityX(-320);
                player.setVelocityY(-320);
                this.time.delayedCall(100, function() {
                    player.setVelocityX(-160);
                    player.setVelocityY(-160);}, [], this);
            }
        } else if (cursors.left.isDown && cursors.down.isDown) {
            player.setVelocityY(160);
            player.setVelocityX(-160);
            player.anims.play('leftDown', true);
            if (cursors.shift.isDown)
            {
                player.setVelocityX(-320);
                player.setVelocityY(320);
                this.time.delayedCall(100, function() {
                    player.setVelocityX(-160);
                    player.setVelocityY(160);}, [], this);
           }
        } else if (cursors.right.isDown && cursors.up.isDown) {
            player.setVelocityY(-160);
            player.setVelocityX(160);
            player.anims.play('rightUp', true);
            if (cursors.shift.isDown)
            {
                player.setVelocityX(320);
                player.setVelocityY(-320);
                this.time.delayedCall(100, function() {
                    player.setVelocityX(160);
                    player.setVelocityY(-160);}, [], this);
           }
        } else if (cursors.right.isDown && cursors.down.isDown) {
            player.setVelocityY(160);
            player.setVelocityX(160);
            player.anims.play('rightDown', true);
            if (cursors.shift.isDown)
            {
                player.setVelocityX(320);
                player.setVelocityY(320);
                this.time.delayedCall(100, function() {
                    player.setVelocityX(160);
                    player.setVelocityY(160);}, [], this);
           }
        } else if (cursors.left.isDown) {
            player.setVelocityX(-160);
            player.setVelocityY(0);
            player.anims.play('left', true);
            if (cursors.shift.isDown)
            {
                player.setVelocityX(-320);
                this.time.delayedCall(100, function() {player.setVelocityX(-160);}, [], this);
           }
        } else if (cursors.right.isDown) {
            player.setVelocityX(160);
            player.setVelocityY(0);
            player.anims.play('right', true);
            if (cursors.shift.isDown)
            {
                player.setVelocityX(320);
                this.time.delayedCall(100, function() {player.setVelocityX(160);}, [], this);
            }
        } else if (cursors.up.isDown) {
            player.setVelocityY(-160);
            player.setVelocityX(0);
            player.anims.play('up', true);
            if (cursors.shift.isDown)
            {
                player.setVelocityY(-320);
                this.time.delayedCall(100, function() {player.setVelocityY(-160);}, [], this);
           }
        } else if (cursors.down.isDown) {
            player.setVelocityY(160);
            player.setVelocityX(0);
            player.anims.play('down', true);
            if (cursors.shift.isDown)
            {
                player.setVelocityY(320);
                this.time.delayedCall(100, function() {player.setVelocityY(160);}, [], this);
           }
        } else {
            player.setVelocityX(0);
            player.setVelocityY(0);
            player.anims.play('idle');
            this.time.delayedCall(100, function() {
                if (!cursors.right.isDown && !cursors.left.isDown && !cursors.up.isDown && !cursors.down.isDown && playerProjectile.countActive() <= 5 && enemy.active)
                {
                    var activeProjectile = playerProjectile.create(player.x + 10, player.y, "playerProjectile");
                    var target = this.physics.closest(player);
                    this.physics.moveToObject(activeProjectile, enemy, 500);
                }}, [], this);
        }
        
        this.playerHealth.setPosition(player.x - 32, player.y - 32);
        this.enemyHealth.setPosition(enemy.x - 32, enemy.y - 32);
    }

});

function projectileDisable(projectile, collision) {
    projectile.disableBody(true, true);

}
function playerTakeDamage (player, enemyProjectile) {
    playerHealthValue -= 10;
    this.playerHealth.setText(playerHealthValue + '/100');
    if (playerHealthValue == 0) {
        this.physics.pause();
    }
    enemyProjectile.disableBody(true, true);
}

function playerTakeDamageCollide (player, enemy) {
    playerHealthValue -= 10;

    this.playerHealth.setText(playerHealthValue + '/100');
    if (playerHealthValue == 0) {
        this.physics.pause();
        
    }
}


function enemyTakeDamage (enemy, playerProjectile) {
    enemyHealthValue -= 10;
    //playerProjectile.anims.play('projectile');


    this.enemyHealth.setText(enemyHealthValue + '/100');
    this.time.delayedCall(10, function (){playerProjectile.disableBody(true, true)},[],this);
    this.play.audio(sfx)

    if (enemyHealthValue == 0) {
        enemy.disableBody(true, true);
        this.enemyHealth.setText('');
    }
}
// IGNORE
//Enemy = function(){
//    this.x = gameplayScene.randomX;        
//    this.y = gameplayScene.randomY;        
//    this.minSpeed = -75;        
//    this.maxSpeed = 75;        
//    this.vx = Math.random()*(this.maxSpeed - this.minSpeed+1)-this.minSpeed;        
//    this.vy = Math.random()*(this.maxSpeed - this.minSpeed+1)-this.minSpeed;        
//    this.enemySprite = gameplayScene.physics.add.group();
//    enemySprite.create(this.x,this.y,"enemy");        
//    //this.enemySprite.anchor.setTo(0.5, 0.5);        
//    this.enemySprite.body.collideWorldBounds = true;              
//    this.enemySprite.body.velocity.x = this.vx;        
//    this.enemySprite.body.velocity.y = this.vy;        
//    this.enemySprite.body.immovable = true;    }

var config = {
    type: Phaser.AUTO,
    width: 640,
    height: 640,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [gameplayScene]
};

var game = new Phaser.Game(config);