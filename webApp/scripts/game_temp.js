const config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight - 50,
    parent: 'gameContainer',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

class Entity {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        
        this.shadow = scene.add.ellipse(x + 5, y + 20, 30, 15, 0x000000, 0.3);
        this.shadow.setDepth(-1);
        
        this.sprite = scene.physics.add.sprite(x, y, texture);
        this.sprite.setDepth(1);
        
        this.hitbox = this.sprite.body;
        if (this.hitbox) {
            this.hitbox.setSize(this.sprite.width * 0.6, this.sprite.height * 0.8);
            this.hitbox.setOffset(this.sprite.width * 0.2, this.sprite.height * 0.2);
        }
        
        this.isAlive = true;
    }
    
    update() {
        if (this.shadow && this.sprite) {
            this.shadow.x = this.sprite.x + 5;
            this.shadow.y = this.sprite.y + 20;
        }
    }
    
    destroy() {
        if (this.shadow) this.shadow.destroy();
        if (this.sprite) this.sprite.destroy();
        this.isAlive = false;
    }
    
    setPosition(x, y) {
        this.sprite.x = x;
        this.sprite.y = y;
        this.shadow.x = x + 5;
        this.shadow.y = y + 20;
    }
}

class Player extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'idle_0');
        
        this.sprite.setDisplaySize(72, 72);
        this.sprite.setCollideWorldBounds(false);
        
        this.speed = 100;
        this.isMoving = false;
        
        
        this.level = 1;
        this.experience = 0;
        this.experienceToNext = 100;
        this.maxHealth = 100;
        this.currentHealth = 100;
        
        
        this.inventory = [];
        this.maxInventorySize = 10;
        
        
        this.createAnimations();
        this.sprite.play('idle');
        
        
        this.createUI();
        
        
        console.log("Player created at:", x, y);
        console.log("Player sprite:", this.sprite);
        console.log("Player physics body:", this.sprite.body);
    }
    
    createUI() {
        this.hpBarBg = this.scene.add.rectangle(0, -50, 60, 8, 0x000000);
        this.hpBarBg.setDepth(1000);
        
        this.hpBar = this.scene.add.rectangle(0, -50, 60, 8, 0x00ff00);
        this.hpBar.setDepth(1001);
        
        this.levelText = this.scene.add.text(16, 16, `Level: ${this.level}`, {
            fontSize: '18px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.levelText.setScrollFactor(0);
        this.levelText.setDepth(1000);
        
        this.scene.gameTimer = 0;
        this.timerText = this.scene.add.text(16, 45, `Time: 0s`, {
            fontSize: '16px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.timerText.setScrollFactor(0);
        this.timerText.setDepth(1000);
        
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.gameTimer++;
                this.timerText.setText(`Time: ${this.scene.gameTimer}s`);
            },
            loop: true
        });
    }
    
    updateUI() {
        const healthPercent = this.currentHealth / this.maxHealth;
        this.hpBar.scaleX = healthPercent;
        this.hpBar.x = this.sprite.x + (30 * (healthPercent - 1));
        this.hpBarBg.x = this.sprite.x;
        this.hpBarBg.y = this.sprite.y - 50;
        this.hpBar.y = this.sprite.y - 50;
        
        if (healthPercent > 0.6) {
            this.hpBar.setFillStyle(0x00ff00);
        } else if (healthPercent > 0.3) {
            this.hpBar.setFillStyle(0xffff00);
        } else {
            this.hpBar.setFillStyle(0xff0000);
        }
        
        this.levelText.setText(`Level: ${this.level}`);
    }
    
    gainExperience(amount) {
        this.experience += amount;
        
        if (this.experience >= this.experienceToNext) {
            this.levelUp();
        }
        
        this.updateUI();
    }
    
    levelUp() {
        this.level++;
        this.experience = 0;
        this.experienceToNext = Math.floor(this.experienceToNext * 1.5);
        this.maxHealth += 20;
        this.currentHealth = this.maxHealth; 
        
        
        this.showLevelUpSelection();
        
        this.updateUI();
        console.log(`Level up! Now level ${this.level}`);
    }
    
    showLevelUpSelection() {
        this.scene.physics.pause();
        
        const overlay = this.scene.add.rectangle(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY,
            400, 300, 0x000000, 0.8
        );
        overlay.setScrollFactor(0);
        overlay.setDepth(2000);
        
        const title = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY - 100,
            'LEVEL UP! Choose an item:',
            { fontSize: '24px', fill: '#ffffff' }
        );
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(2001);
        
        const items = [
            { name: 'Health Potion', description: '+50 Health' },
            { name: 'Speed Boost', description: '+20 Speed' },
            { name: 'Strength Ring', description: '+25 Damage' }
        ];
        
        items.forEach((item, index) => {
            const button = this.scene.add.rectangle(
                this.scene.cameras.main.centerX,
                this.scene.cameras.main.centerY - 20 + (index * 50),
                300, 40, 0x333333
            );
            button.setScrollFactor(0);
            button.setDepth(2001);
            button.setInteractive();
            
            const text = this.scene.add.text(
                this.scene.cameras.main.centerX,
                this.scene.cameras.main.centerY - 20 + (index * 50),
                `${item.name} - ${item.description}`,
                { fontSize: '16px', fill: '#ffffff' }
            );
            text.setOrigin(0.5);
            text.setScrollFactor(0);
            text.setDepth(2002);
            
            button.on('pointerdown', () => {
                this.addToInventory(item);
                overlay.destroy();
                title.destroy();
                button.destroy();
                text.destroy();
                this.scene.physics.resume();
            });
        });
    }
    
    addToInventory(item) {
        if (this.inventory.length < this.maxInventorySize) {
            this.inventory.push(item);
            console.log(`Added ${item.name} to inventory!`);
            
            
            this.applyItemEffect(item);
        }
    }
    
    applyItemEffect(item) {
        switch (item.name) {
            case 'Health Potion':
                this.currentHealth = Math.min(this.currentHealth + 50, this.maxHealth);
                break;
            case 'Speed Boost':
                this.speed += 20;
                break;
            case 'Strength Ring':
                
                break;
        }
        this.updateUI();
    }
    
    takeDamage(amount) {
        this.currentHealth -= amount;
        
        
        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            if (this.isAlive) {
                this.sprite.setTint(0xffffff);
            }
        });
        
        if (this.currentHealth <= 0) {
            this.die();
        }
        
        this.updateUI();
    }
    
    die() {
        this.isAlive = false;
        console.log('Game Over!');
        
    }
    
    createAnimations() {
        
        this.scene.anims.create({
            key: 'idle',
            frames: [
                { key: 'idle_0' }, { key: 'idle_1' }, { key: 'idle_2' }, { key: 'idle_3' },
                { key: 'idle_4' }, { key: 'idle_5' }, { key: 'idle_6' }, { key: 'idle_7' }
            ],
            frameRate: 4,
            repeat: -1
        });
        
        
        this.scene.anims.create({
            key: 'run',
            frames: [
                { key: 'run_0' }, { key: 'run_1' }, { key: 'run_2' }, { key: 'run_3' },
                { key: 'run_4' }, { key: 'run_5' }, { key: 'run_6' }, { key: 'run_7' },
                { key: 'run_8' }, { key: 'run_9' }
            ],
            frameRate: 12,
            repeat: -1
        });
    }
    
    handleInput(cursors) {
        this.isMoving = false;
        this.sprite.setVelocity(0);
        
        
        if (!cursors) {
            console.log("Cursors object is null or undefined");
            return;
        }
        
        
        if (cursors.A && cursors.A.isDown) {
            console.log("A key is down");
            this.sprite.setVelocityX(-this.speed);
            this.sprite.setFlipX(true);
            this.isMoving = true;
        }
        if (cursors.D && cursors.D.isDown) {
            console.log("D key is down");
            this.sprite.setVelocityX(this.speed);
            this.sprite.setFlipX(false);
            this.isMoving = true;
        }
        if (cursors.W && cursors.W.isDown) {
            console.log("W key is down");
            this.sprite.setVelocityY(-this.speed);
            this.isMoving = true;
        }
        if (cursors.S && cursors.S.isDown) {
            console.log("S key is down");
            this.sprite.setVelocityY(this.speed);
            this.isMoving = true;
        }
        
        
        if (this.isMoving) {
            if (this.sprite.anims.currentAnim?.key !== 'run') {
                this.sprite.play('run');
            }
        } else {
            if (this.sprite.anims.currentAnim?.key !== 'idle') {
                this.sprite.play('idle');
            }
        }
    }
    
    update() {
        super.update();
    }
}


class Enemy extends Entity {
    constructor(scene, x, y, enemyType = 'enemy') {
        super(scene, x, y, 'enemy');
        
        this.enemyType = enemyType;
        this.sprite.setDisplaySize(48, 48);
        this.sprite.setTint(0xff6666); 
        
        this.speed = 50;
        this.health = 100;
        this.maxHealth = this.health;
        this.direction = Math.random() * Math.PI * 2;
        
        console.log("Enemy created at:", x, y);
        
        
        this.createPatrolBehavior();
        
        
        this.createHPBar();
    }
    
    createHPBar() {
        
        this.hpBarBg = this.scene.add.rectangle(0, -40, 50, 6, 0x000000);
        this.hpBarBg.setDepth(999);
        
        
        this.hpBarFill = this.scene.add.rectangle(0, -40, 50, 6, 0xff0000);
        this.hpBarFill.setDepth(1000);
    }
    
    updateHPBar() {
        if (this.hpBarBg && this.hpBarFill) {
            
            this.hpBarBg.x = this.sprite.x;
            this.hpBarBg.y = this.sprite.y - 40;
            this.hpBarFill.x = this.sprite.x;
            this.hpBarFill.y = this.sprite.y - 40;
            
            
            const healthPercent = this.health / this.maxHealth;
            this.hpBarFill.scaleX = healthPercent;
        }
    }
    
    createPatrolBehavior() {
        
        this.scene.time.addEvent({
            delay: 2000,
            callback: () => {
                if (this.isAlive) {
                    this.direction = Math.random() * Math.PI * 2;
                }
            },
            loop: true
        });
    }
    
    update() {
        super.update();
        
        if (this.isAlive) {
            
            const moveX = Math.cos(this.direction) * this.speed;
            const moveY = Math.sin(this.direction) * this.speed;
            
            this.sprite.setVelocity(moveX, moveY);
            
            
            if (moveX < 0) {
                this.sprite.setFlipX(true);
            } else if (moveX > 0) {
                this.sprite.setFlipX(false);
            }
            
            this.updateHPBar();
        }
    }
    
    takeDamage(damage) {
        this.health -= damage;
        
        
        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            if (this.isAlive) {
                this.sprite.setTint(0xff6666);
            }
        });
        
        if (this.health <= 0) {
            this.die();
        }
        
        this.updateHPBar();
    }
    
    die() {
        this.isAlive = false;
        this.sprite.setTint(0x666666);
        this.sprite.setVelocity(0);
        
        
        if (player) {
            player.gainExperience(25 + (currentDifficulty * 10));
        }
        
        
        currentEnemyCount--;
        
        
        if (this.hpBarBg) this.hpBarBg.destroy();
        if (this.hpBarFill) this.hpBarFill.destroy();
        
        
        this.scene.tweens.add({
            targets: [this.sprite, this.shadow],
            alpha: 0,
            scaleY: 0.1,
            duration: 500,
            onComplete: () => this.destroy()
        });
    }
    
    destroy() {
        if (this.hpBarBg) this.hpBarBg.destroy();
        if (this.hpBarFill) this.hpBarFill.destroy();
        super.destroy();
    }
}

let player;
let cursors;
let camera;
let tilemap;
let tileLayers = {};
let tilesets = {};


let enemies = [];


let currentDifficulty = 1;
let maxEnemies = 5;
let currentEnemyCount = 0;

const CHUNK_SIZE = 32;
const TILE_SIZE = 48;
const RENDER_DISTANCE = 2;

let lastChunkX = null;
let lastChunkY = null;
let loadedChunks = new Map();

function preload() {
    this.load.image('grass1', '../background/bgtile.png');
    this.load.image('grass2', '../background/bgtile.png');
    this.load.image('grass3', '../background/bgtile.png');
    this.load.image('grass4', '../background/bgtile.png');
    this.load.image('grass5', '../background/bgtile.png');
    this.load.image('grass6', '../background/bgtile.png');
    
    for (let i = 0; i < 8; i++) {
        this.load.image(`idle_${i}`, `../sprites/player/Idle/HeroKnight_Idle_${i}.png`);
    }
    
    for (let i = 0; i < 10; i++) {
        this.load.image(`run_${i}`, `../sprites/player/Run/HeroKnight_Run_${i}.png`);
    }
    
    this.load.image('enemy', '../sprites/player/Idle/HeroKnight_Idle_0.png');
}

function create() {
    tilemap = this.make.tilemap({
        tileWidth: TILE_SIZE,
        tileHeight: TILE_SIZE,
        width: 2000,
        height: 2000
    });
    
    tilesets.grass1 = tilemap.addTilesetImage('grass1', 'grass1', TILE_SIZE, TILE_SIZE);
    tilesets.grass2 = tilemap.addTilesetImage('grass2', 'grass2', TILE_SIZE, TILE_SIZE);
    tilesets.grass3 = tilemap.addTilesetImage('grass3', 'grass3', TILE_SIZE, TILE_SIZE);
    tilesets.grass4 = tilemap.addTilesetImage('grass4', 'grass4', TILE_SIZE, TILE_SIZE);
    tilesets.grass5 = tilemap.addTilesetImage('grass5', 'grass5', TILE_SIZE, TILE_SIZE);
    tilesets.grass6 = tilemap.addTilesetImage('grass6', 'grass6', TILE_SIZE, TILE_SIZE);
    
    tileLayers.background = tilemap.createBlankLayer('background', [
        tilesets.grass1, tilesets.grass2, tilesets.grass3, 
        tilesets.grass4, tilesets.grass5, tilesets.grass6
    ]);
    
    player = new Player(this, 1000 * TILE_SIZE, 1000 * TILE_SIZE);
    
    cursors = this.input.keyboard.addKeys({
        W: Phaser.Input.Keyboard.KeyCodes.W,
        A: Phaser.Input.Keyboard.KeyCodes.A,
        S: Phaser.Input.Keyboard.KeyCodes.S,
        D: Phaser.Input.Keyboard.KeyCodes.D
    });
    
    camera = this.cameras.main;
    camera.startFollow(player.sprite);
    camera.setLerp(0.05, 0.05);
    
    generateInitialChunks.call(this);
    spawnEnemies.call(this);
    startDifficultyProgression.call(this);
}

function update() {
    if (player && player.isAlive) {
        player.handleInput(cursors);
        player.update();
    }
    
    enemies.forEach(enemy => {
        if (enemy.isAlive) {
            enemy.update();
        }
    });
    
    enemies = enemies.filter(enemy => enemy.isAlive);
    maintainEnemyLimit.call(this);
    updateChunks.call(this);
}


function getDifficultyLevel() {
    return Math.floor(player.level / 3) + 1;
}

function updateDifficulty() {
    const newDifficulty = getDifficultyLevel();
    if (newDifficulty > currentDifficulty) {
        currentDifficulty = newDifficulty;
        maxEnemies = Math.min(5 + (currentDifficulty * 2), 15); 
        console.log(`Difficulty increased to ${currentDifficulty}! Max enemies: ${maxEnemies}`);
    }
}


function createHPBar(entity, width = 50, height = 6, color = 0xff0000) {
    entity.hpBarBg = entity.scene.add.rectangle(0, -40, width, height, 0x000000);
    entity.hpBarBg.setDepth(999);
    
    entity.hpBarFill = entity.scene.add.rectangle(0, -40, width, height, color);
    entity.hpBarFill.setDepth(1000);
    
    return {
        background: entity.hpBarBg,
        fill: entity.hpBarFill
    };
}


function maintainEnemyLimit() {
    updateDifficulty();
    
    
    if (currentEnemyCount < maxEnemies) {
        const enemiesToSpawn = Math.min(maxEnemies - currentEnemyCount, 2);
        for (let i = 0; i < enemiesToSpawn; i++) {
            spawnSingleEnemy.call(this);
        }
    }
}

function spawnEnemies() {
    
    const initialSpawn = Math.min(maxEnemies, 3);
    console.log(`Spawning ${initialSpawn} initial enemies`);
    
    for (let i = 0; i < initialSpawn; i++) {
        spawnSingleEnemy.call(this);
    }
}

function spawnSingleEnemy() {
    
    const angle = Math.random() * Math.PI * 2;
    const distance = 300 + Math.random() * 200;
    const x = player.sprite.x + Math.cos(angle) * distance;
    const y = player.sprite.y + Math.sin(angle) * distance;
    
    console.log(`Spawning enemy at (${Math.round(x)}, ${Math.round(y)})`);
    
    const enemy = new Enemy(this, x, y, 'enemy');
    enemies.push(enemy);
    currentEnemyCount++;
    
    
    let canHit = true;
    this.physics.add.overlap(player.sprite, enemy.sprite, () => {
        if (canHit && enemy.isAlive && player.isAlive) {
            
            player.takeDamage(10 + (currentDifficulty * 5));
            console.log(`Player hit by ${enemy.enemyType}!`);
            canHit = false;
            
            this.time.delayedCall(1000, () => {
                canHit = true;
            });
        }
    });
    
    
    enemy.sprite.setInteractive();
    enemy.sprite.on('pointerdown', () => {
        if (enemy.isAlive) {
            enemy.takeDamage(25 + (player.level * 5));
            console.log(`Attacked ${enemy.enemyType}!`);
        }
    });
}

function startDifficultyProgression() {
    
    this.time.addEvent({
        delay: 30000,
        callback: () => {
            updateDifficulty();
        },
        loop: true
    });
    console.log("Difficulty progression started");
}

function generateInitialChunks() {
    const playerChunkX = Math.floor(player.sprite.x / (CHUNK_SIZE * TILE_SIZE));
    const playerChunkY = Math.floor(player.sprite.y / (CHUNK_SIZE * TILE_SIZE));
    
    for (let x = playerChunkX - RENDER_DISTANCE; x <= playerChunkX + RENDER_DISTANCE; x++) {
        for (let y = playerChunkY - RENDER_DISTANCE; y <= playerChunkY + RENDER_DISTANCE; y++) {
            generateChunk.call(this, x, y);
        }
    }
    
    lastChunkX = playerChunkX;
    lastChunkY = playerChunkY;
}

function updateChunks() {
    const playerChunkX = Math.floor(player.sprite.x / (CHUNK_SIZE * TILE_SIZE));
    const playerChunkY = Math.floor(player.sprite.y / (CHUNK_SIZE * TILE_SIZE));
    
    if (playerChunkX !== lastChunkX || playerChunkY !== lastChunkY) {
        for (let x = playerChunkX - RENDER_DISTANCE; x <= playerChunkX + RENDER_DISTANCE; x++) {
            for (let y = playerChunkY - RENDER_DISTANCE; y <= playerChunkY + RENDER_DISTANCE; y++) {
                const chunkKey = `${x},${y}`;
                if (!loadedChunks.has(chunkKey)) {
                    generateChunk.call(this, x, y);
                }
            }
        }
        
        const chunksToRemove = [];
        loadedChunks.forEach((chunk, key) => {
            const [chunkX, chunkY] = key.split(',').map(Number);
            const distance = Math.max(
                Math.abs(chunkX - playerChunkX),
                Math.abs(chunkY - playerChunkY)
            );
            
            if (distance > RENDER_DISTANCE + 1) {
                chunksToRemove.push(key);
            }
        });
        
        chunksToRemove.forEach(key => {
            loadedChunks.delete(key);
        });
        
        lastChunkX = playerChunkX;
        lastChunkY = playerChunkY;
    }
}

function generateChunk(chunkX, chunkY) {
    const chunkKey = `${chunkX},${chunkY}`;
    
    const startX = chunkX * CHUNK_SIZE;
    const startY = chunkY * CHUNK_SIZE;
    
    for (let x = 0; x < CHUNK_SIZE; x++) {
        for (let y = 0; y < CHUNK_SIZE; y++) {
            const tileX = startX + x;
            const tileY = startY + y;
            
            const grassVariant = generateGrassVariant(tileX * TILE_SIZE, tileY * TILE_SIZE);
            
            
            let tileset;
            switch (grassVariant) {
                case 1:
                    tileset = tilesets.grass1;
                    break;
                case 2:
                    tileset = tilesets.grass2;
                    break;
                case 3:
                    tileset = tilesets.grass3;
                    break;
                case 4:
                    tileset = tilesets.grass4;
                    break;
                case 5:
                    tileset = tilesets.grass5;
                    break;
                case 6:
                    tileset = tilesets.grass6;
                    break;
                default:
                    tileset = tilesets.grass1;
            }
            
            
            const tile = tileLayers.background.putTileAt(tileset.firstgid, tileX, tileY);
            
            
            if (tile) {
                switch (grassVariant) {
                    case 1:
                        tile.tint = 0x90EE90; 
                        break;
                    case 2:
                        tile.tint = 0x228B22; 
                        break;
                    case 3:
                        tile.tint = 0x32CD32; 
                        break;
                    case 4:
                        tile.tint = 0x9ACD32; 
                        break;
                    case 5:
                        tile.tint = 0x6B8E23; 
                        break;
                    case 6:
                        tile.tint = 0x7CFC00; 
                        break;
                }
            }
        }
    }
    
    loadedChunks.set(chunkKey, true);
}

function generateGrassVariant(x, y) {
    
    const noise1 = Math.sin(x * 0.005) * Math.cos(y * 0.005);
    const noise2 = Math.sin(x * 0.002 + 1000) * Math.cos(y * 0.002 + 1000);
    const combinedNoise = (noise1 + noise2) / 2;
    
    
    if (combinedNoise > 0.6) {
        return 1;
    } else if (combinedNoise > 0.2) {
        return 2;
    } else if (combinedNoise > -0.1) {
        return 3;
    } else if (combinedNoise > -0.4) {
        return 4;
    } else if (combinedNoise > -0.7) {
        return 5;
    } else {
        return 6;
    }
}

function generateInitialChunks() {
    const playerChunkX = Math.floor(player.sprite.x / (CHUNK_SIZE * TILE_SIZE));
    const playerChunkY = Math.floor(player.sprite.y / (CHUNK_SIZE * TILE_SIZE));
    
    for (let x = playerChunkX - RENDER_DISTANCE; x <= playerChunkX + RENDER_DISTANCE; x++) {
        for (let y = playerChunkY - RENDER_DISTANCE; y <= playerChunkY + RENDER_DISTANCE; y++) {
            generateChunk.call(this, x, y);
        }
    }
    
    lastChunkX = playerChunkX;
    lastChunkY = playerChunkY;
}

function updateChunks() {
    const playerChunkX = Math.floor(player.sprite.x / (CHUNK_SIZE * TILE_SIZE));
    const playerChunkY = Math.floor(player.sprite.y / (CHUNK_SIZE * TILE_SIZE));
    
    if (playerChunkX !== lastChunkX || playerChunkY !== lastChunkY) {
        for (let x = playerChunkX - RENDER_DISTANCE; x <= playerChunkX + RENDER_DISTANCE; x++) {
            for (let y = playerChunkY - RENDER_DISTANCE; y <= playerChunkY + RENDER_DISTANCE; y++) {
                const chunkKey = `${x},${y}`;
                if (!loadedChunks.has(chunkKey)) {
                    generateChunk.call(this, x, y);
                }
            }
        }
        
        const chunksToRemove = [];
        loadedChunks.forEach((chunk, key) => {
            const [chunkX, chunkY] = key.split(',').map(Number);
            const distance = Math.max(
                Math.abs(chunkX - playerChunkX),
                Math.abs(chunkY - playerChunkY)
            );
            
            if (distance > RENDER_DISTANCE + 1) {
                chunksToRemove.push(key);
            }
        });
        
        chunksToRemove.forEach(key => {
            loadedChunks.delete(key);
        });
        
        lastChunkX = playerChunkX;
        lastChunkY = playerChunkY;
    }
}

function generateChunk(chunkX, chunkY) {
    const chunkKey = `${chunkX},${chunkY}`;
    
    if (loadedChunks.has(chunkKey)) {
        return;
    }
    
    const startX = chunkX * CHUNK_SIZE;
    const startY = chunkY * CHUNK_SIZE;
    
    for (let x = 0; x < CHUNK_SIZE; x++) {
        for (let y = 0; y < CHUNK_SIZE; y++) {
            const tileX = startX + x;
            const tileY = startY + y;
            
            const grassVariant = generateGrassVariant(tileX * TILE_SIZE, tileY * TILE_SIZE);
            
            let tileset;
            switch (grassVariant) {
                case 1: tileset = tilesets.grass1; break;
                case 2: tileset = tilesets.grass2; break;
                case 3: tileset = tilesets.grass3; break;
                case 4: tileset = tilesets.grass4; break;
                case 5: tileset = tilesets.grass5; break;
                case 6: tileset = tilesets.grass6; break;
                default: tileset = tilesets.grass1; break;
            }
            
            const tile = tileLayers.background.putTileAt(tileset.firstgid, tileX, tileY);
            
            if (tile) {
                switch (grassVariant) {
                    case 1: tile.tint = 0x90EE90; break;
                    case 2: tile.tint = 0x228B22; break;
                    case 3: tile.tint = 0x32CD32; break;
                    case 4: tile.tint = 0x9ACD32; break;
                    case 5: tile.tint = 0x6B8E23; break;
                    case 6: tile.tint = 0x7CFC00; break;
                }
            }
        }
    }
    
    loadedChunks.set(chunkKey, true);
}

function generateGrassVariant(x, y) {
    
    const noise1 = Math.sin(x * 0.005) * Math.cos(y * 0.005);
    const noise2 = Math.sin(x * 0.002 + 1000) * Math.cos(y * 0.002 + 1000);
    const combinedNoise = (noise1 + noise2) / 2;
    
    
    if (combinedNoise > 0.6) {
        return 1;
    } else if (combinedNoise > 0.2) {
        return 2;
    } else if (combinedNoise > -0.1) {
        return 3;
    } else if (combinedNoise > -0.4) {
        return 4;
    } else if (combinedNoise > -0.7) {
        return 5;
    } else {
        return 6;
    }
}

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight - 50);
});
