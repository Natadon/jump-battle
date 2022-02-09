class GameScene extends Phaser.Scene {
    constructor() {
        super('Game');    
        
        this.score = 0;
        this.scoreText;
        this.gameOver = false;
        this.gameoverText;
        this.resetText;
        this.currentMap = 1;
    }


    preload ()
    {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('ground', 'assets/platform.png');
        this.load.image('star', 'assets/star.png');
        this.load.image('bomb', 'assets/bomb.png');
        this.load.spritesheet('dude', 'assets/dude.png', { frameWidth: 32, frameHeight: 48 });        
    }

    create ()
    {
        // add the background image to the scene
        this.add.image(400, 300, 'sky'); //.setOrigin(0);
        
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(function(child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.bombs = this.physics.add.group();

        // create a new map class and create map 1
        this.map = new GameMap(this, this.currentMap);
        this.map.createMap();

        // create the player
        this.player = this.physics.add.sprite(100, 450, 'dude');

        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);

        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        this.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 }],
            frameRate: 20
        });

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        this.player.body.setGravityY(300);

        // setup a collider for the player and the stars, this will call this.collectStar below
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);

        this.cursors = this.input.keyboard.addKeys({
            up:Phaser.Input.Keyboard.KeyCodes.SPACE,
            down:Phaser.Input.Keyboard.KeyCodes.S,
            left:Phaser.Input.Keyboard.KeyCodes.A,
            right:Phaser.Input.Keyboard.KeyCodes.D,
            reset:Phaser.Input.Keyboard.KeyCodes.R 
        });

        this.scoreText = this.add.text(16, 16, `score: ${this.score}`, { fontSize: '32px', fill: '#000' });
        this.gameoverText = this.add.text(16, 300, '', { fontSize: '64px', fill: '#000' });
        this.resetText = this.add.text(16, 375, "", { fontSize: '32px', fill: '#000' });
    }

    update ()
    {
        if(!this.gameOver) {
            if(this.cursors.left.isDown){
                this.player.setVelocityX(-160);

                this.player.anims.play('left', true);
            } else if (this.cursors.right.isDown) {
                this.player.setVelocityX(160);

                this.player.anims.play('right', true);                    
            } else {
                this.player.setVelocityX(0);

                this.player.anims.play('turn');
            }

            if(this.cursors.up.isDown && this.player.body.touching.down)
            {
                this.player.setVelocityY(-500);
            }
        } else {
            if(this.cursors.reset.isDown) {                
                this.setScore(0);
                this.resetBombs();
                this.resetStars();

                this.player.setTint(0xFFFFFF);
                this.player.setX(100);
                this.player.setY(450);
                this.physics.resume();
                this.gameoverText.setText('');
                this.resetText.setText('');
                this.gameOver = false;
            }
        }
    }

    collectStar(player, star) {
        star.disableBody(true, true);

        this.addToScore(10);

        if(this.stars.countActive(true) === 0) {
            this.resetStars();
            this.currentMap = this.map.nextMap();            

            var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);

            var bomb = this.bombs.create(x, 16, 'bomb');
            bomb.setBounce(1);
            bomb.setCollideWorldBounds(true);
            bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);

            this.scene.restart();
        }
    }

    hitBomb (player, bomb) {
        this.physics.pause();

        this.player.setTint(0xff0000);

        this.player.anims.play('turn');

        this.gameOver = true;
        this.gameoverText.setText(`GAME OVER SCORE: ${this.score}`);
        this.resetText.setText("Press 'R' to reset");
    }

    resetStars() {
        this.stars.children.iterate(function(child) {
            child.enableBody(true, child.x, 0, true, true);
        });
    }

    resetBombs() {
        this.bombs.children.iterate(function(bomb) {
            bomb.disableBody(true, true);
            //delete bomb;
        });
    }

    setScore(newScore) {
        this.score = newScore;
        this.scoreText.setText(`Score: ${newScore}`);
    }

    addToScore(value) {
        this.score += value;
        this.scoreText.setText(`Score: ${this.score}`);
    }
}