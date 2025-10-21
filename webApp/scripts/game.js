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

let player;
let cursors;
let camera;
let tilemap;
let tileLayers = {};
let tilesets = {};

const CHUNK_SIZE = 32;
const TILE_SIZE = 48;
const RENDER_DISTANCE = 2;

let lastChunkX = null;
let lastChunkY = null;
let loadedChunks = new Map();

function preload() {
    // Load multiple grass tilesets for variety
    this.load.image('grass1', '../background/bgtile.png');
    this.load.image('grass2', '../background/bgtile.png');
    this.load.image('grass3', '../background/bgtile.png');
    this.load.image('grass4', '../background/bgtile.png');
    
    // Load player sprite sheets for animation
    this.load.spritesheet('player_idle', '../sprites/player/Idle/HeroKnight_Idle_0.png', { frameWidth: 128, frameHeight: 128 });
    this.load.spritesheet('player_run', '../sprites/player/Run/HeroKnight_Run_0.png', { frameWidth: 128, frameHeight: 128 });
    
    // Load all idle frames for animation
    for (let i = 0; i < 8; i++) {
        this.load.image(`idle_${i}`, `../sprites/player/Idle/HeroKnight_Idle_${i}.png`);
    }
    
    // Load all run frames for animation
    for (let i = 0; i < 10; i++) {
        this.load.image(`run_${i}`, `../sprites/player/Run/HeroKnight_Run_${i}.png`);
    }
}

function create() {
    // Create tilemap
    tilemap = this.make.tilemap({
        tileWidth: TILE_SIZE,
        tileHeight: TILE_SIZE,
        width: 1000,
        height: 1000
    });
    
    // Add multiple grass tilesets for variety
    tilesets.grass1 = tilemap.addTilesetImage('grass1', 'grass1', TILE_SIZE, TILE_SIZE);
    tilesets.grass2 = tilemap.addTilesetImage('grass2', 'grass2', TILE_SIZE, TILE_SIZE);
    tilesets.grass3 = tilemap.addTilesetImage('grass3', 'grass3', TILE_SIZE, TILE_SIZE);
    tilesets.grass4 = tilemap.addTilesetImage('grass4', 'grass4', TILE_SIZE, TILE_SIZE);
    
    // Create layer for grass tiles
    tileLayers.background = tilemap.createBlankLayer('background', [tilesets.grass1, tilesets.grass2, tilesets.grass3, tilesets.grass4]);
    
    // Apply different tints to create grass variety
    this.load.on('complete', () => {
        // Tint the grass textures for variety
        if (this.textures.get('grass2')) {
            this.textures.get('grass2').tintFill = true;
        }
        if (this.textures.get('grass3')) {
            this.textures.get('grass3').tintFill = true;
        }
        if (this.textures.get('grass4')) {
            this.textures.get('grass4').tintFill = true;
        }
    });
    
    // Create player
    player = this.physics.add.sprite(500 * TILE_SIZE, 500 * TILE_SIZE, 'idle_0');
    player.setDisplaySize(72, 72);
    player.setCollideWorldBounds(false);
    
    // Create animations
    this.anims.create({
        key: 'idle',
        frames: [
            { key: 'idle_0' }, { key: 'idle_1' }, { key: 'idle_2' }, { key: 'idle_3' },
            { key: 'idle_4' }, { key: 'idle_5' }, { key: 'idle_6' }, { key: 'idle_7' }
        ],
        frameRate: 8,
        repeat: -1
    });
    
    this.anims.create({
        key: 'run',
        frames: [
            { key: 'run_0' }, { key: 'run_1' }, { key: 'run_2' }, { key: 'run_3' },
            { key: 'run_4' }, { key: 'run_5' }, { key: 'run_6' }, { key: 'run_7' },
            { key: 'run_8' }, { key: 'run_9' }
        ],
        frameRate: 12,
        repeat: -1
    });
    
    // Start with idle animation
    player.play('idle');
    
    cursors = this.input.keyboard.createCursorKeys();
    
    camera = this.cameras.main;
    camera.startFollow(player);
    camera.setLerp(0.05, 0.05);
    
    generateInitialChunks.call(this);
}

function update() {
    const speed = 100;
    let isMoving = false;
    
    player.setVelocity(0);
    
    if (cursors.left.isDown) {
        player.setVelocityX(-speed);
        player.setFlipX(true);
        isMoving = true;
    } else if (cursors.right.isDown) {
        player.setVelocityX(speed);
        player.setFlipX(false);
        isMoving = true;
    }
    
    if (cursors.up.isDown) {
        player.setVelocityY(-speed);
        isMoving = true;
    } else if (cursors.down.isDown) {
        player.setVelocityY(speed);
        isMoving = true;
    }
    
    // Handle animations based on movement
    if (isMoving) {
        if (player.anims.currentAnim?.key !== 'run') {
            player.play('run');
        }
    } else {
        if (player.anims.currentAnim?.key !== 'idle') {
            player.play('idle');
        }
    }
    
    updateChunks.call(this);
}

function generateInitialChunks() {
    const playerChunkX = Math.floor(player.x / (CHUNK_SIZE * TILE_SIZE));
    const playerChunkY = Math.floor(player.y / (CHUNK_SIZE * TILE_SIZE));
    
    for (let x = playerChunkX - RENDER_DISTANCE; x <= playerChunkX + RENDER_DISTANCE; x++) {
        for (let y = playerChunkY - RENDER_DISTANCE; y <= playerChunkY + RENDER_DISTANCE; y++) {
            generateChunk.call(this, x, y);
        }
    }
    
    lastChunkX = playerChunkX;
    lastChunkY = playerChunkY;
}

function updateChunks() {
    const playerChunkX = Math.floor(player.x / (CHUNK_SIZE * TILE_SIZE));
    const playerChunkY = Math.floor(player.y / (CHUNK_SIZE * TILE_SIZE));
    
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
            
            // Get the appropriate grass tileset based on variant
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
                default:
                    tileset = tilesets.grass1;
            }
            
            // Place grass tile using tilemap
            const tile = tileLayers.background.putTileAt(tileset.firstgid, tileX, tileY);
            
            // Apply slight tint variations for more variety
            if (tile) {
                switch (grassVariant) {
                    case 1:
                        tile.tint = 0x90EE90; // Light green
                        break;
                    case 2:
                        tile.tint = 0x228B22; // Forest green
                        break;
                    case 3:
                        tile.tint = 0x32CD32; // Lime green
                        break;
                    case 4:
                        tile.tint = 0x9ACD32; // Yellow green
                        break;
                }
            }
        }
    }
    
    loadedChunks.set(chunkKey, true);
}

function generateGrassVariant(x, y) {
    // Use multiple layers of noise for more erratic, varied terrain
    const noise1 = Math.sin(x * 0.08) * Math.cos(y * 0.08);
    const noise2 = Math.sin(x * 0.03 + 100) * Math.cos(y * 0.03 + 100);
    const noise3 = Math.sin(x * 0.15 + 200) * Math.cos(y * 0.15 + 200);
    const noise4 = Math.sin(x * 0.05 + 300) * Math.cos(y * 0.12 + 300);
    
    // Combine multiple noise layers for more erratic patterns
    const combinedNoise = (noise1 * 0.4 + noise2 * 0.3 + noise3 * 0.2 + noise4 * 0.1);
    
    // Add some random variation for even more variety
    const randomFactor = (Math.sin(x * 0.234) * Math.cos(y * 0.567)) * 0.3;
    const finalNoise = combinedNoise + randomFactor;
    
    // Map noise to grass variants with more distinct thresholds
    if (finalNoise > 0.4) {
        return 1;
    } else if (finalNoise > 0.1) {
        return 2;
    } else if (finalNoise > -0.2) {
        return 3;
    } else {
        return 4;
    }
}

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight - 50);
});