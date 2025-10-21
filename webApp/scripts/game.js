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

const ENEMY_TYPES = {
    'lereon_knight': { 
        sprite: 'lereon_knight', 
        size: 64, 
        health: 100, 
        damage: 15,
        baseSpeed: 75 
    },
    'slime': { 
        sprite: 'slime', 
        size: 32, 
        health: 40, 
        damage: 8,
        baseSpeed: 90 
    },
    'bat': { 
        sprite: 'bat', 
        size: 28, 
        health: 30, 
        damage: 6,
        baseSpeed: 95 
    },
    'spider': { 
        sprite: 'spider', 
        size: 24, 
        health: 25, 
        damage: 5,
        baseSpeed: 100 
    },
    'snake': { 
        sprite: 'snake', 
        size: 40, 
        health: 50, 
        damage: 10,
        baseSpeed: 85 
    },
    'wolf': { 
        sprite: 'wolf', 
        size: 48, 
        health: 70, 
        damage: 12,
        baseSpeed: 80 
    },
    'worm': { 
        sprite: 'worm', 
        size: 36, 
        health: 45, 
        damage: 7,
        baseSpeed: 88 
    },
    'orc': { 
        sprite: 'orc', 
        size: 56, 
        health: 85, 
        damage: 14,
        baseSpeed: 78 
    },
    'skeleton_sword': { 
        sprite: 'skeleton_sword', 
        size: 52, 
        health: 75, 
        damage: 13,
        baseSpeed: 82 
    },
    'werewolf': { 
        sprite: 'werewolf', 
        size: 60, 
        health: 90, 
        damage: 16,
        baseSpeed: 76 
    },
    'burning_demon_imp': { 
        sprite: 'burning_demon_imp', 
        size: 44, 
        health: 60, 
        damage: 11,
        baseSpeed: 83 
    },
    'viking_warrior': { 
        sprite: 'viking_warrior', 
        size: 68, 
        health: 110, 
        damage: 18,
        baseSpeed: 73 
    },
    'baby_dragon': { 
        sprite: 'baby_dragon', 
        size: 72, 
        health: 120, 
        damage: 20,
        baseSpeed: 70 
    },
    'big_skeleton': { 
        sprite: 'big_skeleton', 
        size: 80, 
        health: 150, 
        damage: 25,
        baseSpeed: 65 
    },
    'burning_demon': { 
        sprite: 'burning_demon', 
        size: 84, 
        health: 160, 
        damage: 28,
        baseSpeed: 62 
    },
    'skeleton_king': { 
        sprite: 'skeleton_king', 
        size: 88, 
        health: 180, 
        damage: 30,
        baseSpeed: 60 
    },
    'death_angel': { 
        sprite: 'death_angel', 
        size: 92, 
        health: 200, 
        damage: 35,
        baseSpeed: 55 
    },
    'legendary_dragon': { 
        sprite: 'legendary_dragon', 
        size: 120, 
        health: 300, 
        damage: 50,
        baseSpeed: 45 
    },
    'skeleton_sword_animated': {
        sprite: 'skeleton_sword_walk_1',
        size: 54,
        health: 80,
        damage: 14,
        baseSpeed: 80,
        animated: true,
        animations: {
            walk: 'skeleton_sword_walk',
            attack: 'skeleton_sword_attack'
        }
    },
    'demon_axe_red': {
        sprite: 'demon_axe_walk_1',
        size: 68,
        health: 110,
        damage: 22,
        baseSpeed: 74,
        animated: true,
        animations: {
            walk: 'demon_axe_walk',
            attack: 'demon_axe_attack'
        }
    }
};

const ITEM_TYPES = {
    'berry01blue': {
        sprite: 'berry01blue',
        name: 'Frost Berry',
        category: 'berry',
        rarity: 'common',
        effects: {
            health: () => Math.floor(15 + Math.random() * 25), // 15-40 health
            speed: () => Math.floor(3 + Math.random() * 7), // 3-10 speed
        }
    },
    'berry02yellow': {
        sprite: 'berry02yellow',
        name: 'Lightning Berry',
        category: 'berry',
        rarity: 'common',
        effects: {
            health: () => Math.floor(10 + Math.random() * 20), // 10-30 health
            speed: () => Math.floor(8 + Math.random() * 12), // 8-20 speed
        }
    },
    'berry03purple': {
        sprite: 'berry03purple',
        name: 'Shadow Berry',
        category: 'berry',
        rarity: 'uncommon',
        effects: {
            health: () => Math.floor(20 + Math.random() * 30), // 20-50 health
            maxHealth: () => Math.floor(5 + Math.random() * 15), // 5-20 max health
        }
    },
    'berry04red': {
        sprite: 'berry04red',
        name: 'Fire Berry',
        category: 'berry',
        rarity: 'uncommon',
        effects: {
            health: () => Math.floor(25 + Math.random() * 35), // 25-60 health
            damage: () => Math.floor(2 + Math.random() * 6), // 2-8 damage
        }
    },
    'gem01orange': {
        sprite: 'gem01orange',
        name: 'Amber Gem',
        category: 'gem',
        rarity: 'rare',
        effects: {
            maxHealth: () => Math.floor(15 + Math.random() * 25), // 15-40 max health
            speed: () => Math.floor(5 + Math.random() * 10), // 5-15 speed
        }
    },
    'gem02blue': {
        sprite: 'gem02blue',
        name: 'Sapphire Gem',
        category: 'gem',
        rarity: 'rare',
        effects: {
            health: () => Math.floor(40 + Math.random() * 60), // 40-100 health
            defense: () => Math.floor(3 + Math.random() * 7), // 3-10 defense
        }
    },
    'gem03yellow': {
        sprite: 'gem03yellow',
        name: 'Citrine Gem',
        category: 'gem',
        rarity: 'rare',
        effects: {
            speed: () => Math.floor(12 + Math.random() * 18), // 12-30 speed
            critChance: () => Math.floor(2 + Math.random() * 8), // 2-10% crit chance
        }
    },
    'gem04purple': {
        sprite: 'gem04purple',
        name: 'Amethyst Gem',
        category: 'gem',
        rarity: 'epic',
        effects: {
            maxHealth: () => Math.floor(25 + Math.random() * 35), // 25-60 max health
            damage: () => Math.floor(5 + Math.random() * 10), // 5-15 damage
        }
    },
    'gem05red': {
        sprite: 'gem05red',
        name: 'Ruby Gem',
        category: 'gem',
        rarity: 'epic',
        effects: {
            damage: () => Math.floor(8 + Math.random() * 15), // 8-23 damage
            critDamage: () => Math.floor(10 + Math.random() * 20), // 10-30% crit damage
        }
    },
    'gem06green': {
        sprite: 'gem06green',
        name: 'Emerald Gem',
        category: 'gem',
        rarity: 'legendary',
        effects: {
            health: () => Math.floor(80 + Math.random() * 120), // 80-200 health
            maxHealth: () => Math.floor(40 + Math.random() * 60), // 40-100 max health
            speed: () => Math.floor(15 + Math.random() * 25), // 15-40 speed
        }
    },
    'glass01orange': {
        sprite: 'glass01orange',
        name: 'Phoenix Elixir',
        category: 'elixir',
        rarity: 'rare',
        effects: {
            health: () => Math.floor(60 + Math.random() * 80), // 60-140 health
            regeneration: () => Math.floor(1 + Math.random() * 3), // 1-4 HP per second
        }
    },
    'glass02blue': {
        sprite: 'glass02blue',
        name: 'Frost Elixir',
        category: 'elixir',
        rarity: 'rare',
        effects: {
            defense: () => Math.floor(5 + Math.random() * 10), // 5-15 defense
            slowResistance: () => Math.floor(20 + Math.random() * 30), // 20-50% slow resistance
        }
    },
    'glass03yellow': {
        sprite: 'glass03yellow',
        name: 'Lightning Elixir',
        category: 'elixir',
        rarity: 'epic',
        effects: {
            speed: () => Math.floor(20 + Math.random() * 30), // 20-50 speed
            attackSpeed: () => Math.floor(10 + Math.random() * 20), // 10-30% attack speed
        }
    },
    'glass04purple': {
        sprite: 'glass04purple',
        name: 'Shadow Elixir',
        category: 'elixir',
        rarity: 'epic',
        effects: {
            damage: () => Math.floor(10 + Math.random() * 20), // 10-30 damage
            dodgeChance: () => Math.floor(5 + Math.random() * 15), // 5-20% dodge chance
        }
    },
    'glass05red': {
        sprite: 'glass05red',
        name: 'Berserker Elixir',
        category: 'elixir',
        rarity: 'legendary',
        effects: {
            damage: () => Math.floor(15 + Math.random() * 25), // 15-40 damage
            speed: () => Math.floor(25 + Math.random() * 35), // 25-60 speed
            critChance: () => Math.floor(8 + Math.random() * 17), // 8-25% crit chance
        }
    },
    'glass06green': {
        sprite: 'glass06green',
        name: 'Vitality Elixir',
        category: 'elixir',
        rarity: 'legendary',
        effects: {
            maxHealth: () => Math.floor(60 + Math.random() * 90), // 60-150 max health
            health: () => Math.floor(100 + Math.random() * 150), // 100-250 health
            regeneration: () => Math.floor(3 + Math.random() * 7), // 3-10 HP per second
        }
    }
};

class Entity {
    constructor(scene, x, y, texture) {
        this.scene = scene;
        this.x = x;
        this.y = y;
        
        this.shadow = scene.add.ellipse(x, y + 35, 50, 25, 0x000000, 0.8);
        this.shadow.setDepth(0.5);
        
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
            this.shadow.x = this.sprite.x;
            this.shadow.y = this.sprite.y + 35;
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
        this.shadow.x = x;
        this.shadow.y = y + 35;
    }
    
    checkCollisionWith(otherEntity) {
        if (!this.isAlive || !otherEntity.isAlive) return false;
        if (!this.sprite || !otherEntity.sprite) return false;
        
        const distance = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            otherEntity.sprite.x, otherEntity.sprite.y
        );
        
        const minDistance = 60;
        return distance < minDistance;
    }
}

class Player extends Entity {
    constructor(scene, x, y) {
        super(scene, x, y, 'idle_0');
        
        this.sprite.setDisplaySize(72, 72);
        this.sprite.setCollideWorldBounds(false);
        
        this.speed = 100;
        this.isMoving = false;
        
        this.level = 4; // Start at level 4 for testing animated enemies
        this.experience = 0;
        this.experienceToNext = 100;
        this.maxHealth = 100;
        this.currentHealth = 100;
        this.killCount = 0; // Track enemy kills
        
        // New stats for items
        this.baseDamage = 10;
        this.defense = 0;
        this.critChance = 5; // 5% base crit chance
        this.critDamage = 150; // 150% base crit damage
        this.dodgeChance = 0;
        this.regeneration = 0; // HP per second
        this.attackSpeed = 100; // 100% base attack speed
        this.slowResistance = 0;
        
        this.inventory = [];
        this.maxInventorySize = 10;
        
        this.collisionCooldowns = new Map();
        
        this.createAnimations();
        this.sprite.play('idle');
        
        this.createUI();
        this.updateUI();
    }
    
    createUI() {
        this.hpBarBg = this.scene.add.rectangle(0, 0, 60, 8, 0x000000);
        this.hpBarBg.setDepth(999);
        
        this.hpBarFill = this.scene.add.rectangle(0, 0, 60, 8, 0x00ff00);
        this.hpBarFill.setDepth(1000);
        
        this.hpBarBg.setVisible(true);
        this.hpBarFill.setVisible(true);
        this.scene.time.delayedCall(50, () => {
            this.updateHPBar();
        });
        
        this.levelText = this.scene.add.text(16, 85, `Level: ${this.level}`, {
            fontSize: '18px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        
        this.killCountText = this.scene.add.text(16, 110, `Kills: ${this.killCount}`, {
            fontSize: '18px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        
        this.difficultyText = this.scene.add.text(16, 135, `Difficulty: ${getDifficultyLevel()}`, {
            fontSize: '18px',
            fill: '#ff4444',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.levelText.setScrollFactor(0);
        this.levelText.setDepth(1000);
        
        this.scene.gameTimer = 0;
        this.timerText = this.scene.add.text(16, 110, `Time: 0s`, {
            fontSize: '16px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.timerText.setScrollFactor(0);
        this.timerText.setDepth(1000);
        
        const screenWidth = this.scene.cameras.main.width;
        this.xpBarBg = this.scene.add.rectangle(screenWidth / 2, 20, screenWidth - 40, 20, 0x000000);
        this.xpBarBg.setScrollFactor(0);
        this.xpBarBg.setDepth(1000);
        
        this.xpBar = this.scene.add.rectangle(screenWidth / 2, 20, screenWidth - 40, 20, 0x00ff00);
        this.xpBar.setScrollFactor(0);
        this.xpBar.setDepth(1001);
        this.xpBar.scaleX = 0;
        
        this.xpText = this.scene.add.text(screenWidth / 2, 20, `XP: ${this.experience}/${this.experienceToNext}`, {
            fontSize: '14px',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        this.xpText.setOrigin(0.5);
        this.xpText.setScrollFactor(0);
        this.xpText.setDepth(1002);
        
        this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.scene.gameTimer++;
                this.timerText.setText(`Time: ${this.scene.gameTimer}s`);
            },
            loop: true
        });
    }
    
    updateHPBar() {
        if (this.hpBarBg && this.hpBarFill && this.sprite) {
            const playerX = this.sprite.x;
            const playerY = this.sprite.y;
            
            const hpBarY = playerY - 50;
            
            this.hpBarBg.x = playerX;
            this.hpBarBg.y = hpBarY;
            this.hpBarFill.x = playerX;
            this.hpBarFill.y = hpBarY;
            
            const healthPercent = this.currentHealth / this.maxHealth;
            
            this.hpBarFill.scaleX = healthPercent;
            this.hpBarBg.setVisible(true);
            this.hpBarFill.setVisible(true);
        }
    }
    
    updateUI() {
        this.updateHPBar();
        
        const xpPercent = this.experience / this.experienceToNext;
        this.xpBar.scaleX = xpPercent;
        this.xpBar.x = (this.scene.cameras.main.width / 2) + ((this.scene.cameras.main.width - 40) * (xpPercent - 1) / 2);
        this.xpText.setText(`XP: ${this.experience}/${this.experienceToNext}`);
        
        this.levelText.setText(`Level: ${this.level}`);
        this.killCountText.setText(`Kills: ${this.killCount}`);
        this.difficultyText.setText(`Difficulty: ${getDifficultyLevel()}`);
    }
    
    gainExperience(amount) {
        this.experience += amount;
        
        if (this.experience >= this.experienceToNext) {
            this.levelUp();
        }
        
        this.updateUI();
    }
    
    incrementKillCount() {
        this.killCount++;
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
    }
    
    showLevelUpSelection() {
        this.scene.physics.pause();
        
        // Larger overlay covering most of the screen
        const screenWidth = this.scene.cameras.main.width;
        const screenHeight = this.scene.cameras.main.height;
        
        const overlay = this.scene.add.rectangle(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY,
            screenWidth * 0.9, screenHeight * 0.8, 0x000000, 0.85
        );
        overlay.setScrollFactor(0);
        overlay.setDepth(2000);
        
        // Title with larger font
        const title = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY - (screenHeight * 0.3),
            'LEVEL UP! Choose an Upgrade:',
            { fontSize: '32px', fill: '#ffffff', fontStyle: 'bold' }
        );
        title.setOrigin(0.5);
        title.setScrollFactor(0);
        title.setDepth(2001);
        
        const items = this.getRandomItems(3);
        const uiElements = [overlay, title];
        let choiceMade = false;
        
        // Rarity colors
        const rarityColors = {
            'common': 0x808080,      // Gray
            'uncommon': 0x00ff00,    // Green  
            'rare': 0x0080ff,        // Blue
            'epic': 0x8000ff,        // Purple
            'legendary': 0xff8000     // Orange
        };
        
        const rarityBorderColors = {
            'common': 0xa0a0a0,
            'uncommon': 0x40ff40,
            'rare': 0x4080ff,
            'epic': 0xa040ff,
            'legendary': 0xff9040
        };
        
        items.forEach((item, index) => {
            const baseX = this.scene.cameras.main.centerX + (index - 1) * 280; // Spread items across width
            const baseY = this.scene.cameras.main.centerY;
            
            // Get rarity colors
            const bgColor = rarityColors[item.rarity] || rarityColors.common;
            const borderColor = rarityBorderColors[item.rarity] || rarityBorderColors.common;
            
            // Main item container - larger boxes
            const itemContainer = this.scene.add.rectangle(baseX, baseY, 240, 320, bgColor, 0.15);
            itemContainer.setScrollFactor(0);
            itemContainer.setDepth(2001);
            itemContainer.setStrokeStyle(3, borderColor);
            itemContainer.setInteractive();
            
            // Item sprite
            const itemSprite = this.scene.add.image(baseX, baseY - 80, item.sprite);
            itemSprite.setScrollFactor(0);
            itemSprite.setDepth(2003);
            itemSprite.setScale(2); // Make sprites larger and visible
            
            // Item name with rarity color
            const nameText = this.scene.add.text(baseX, baseY - 20, item.name, {
                fontSize: '18px',
                fill: '#ffffff',
                fontStyle: 'bold',
                align: 'center'
            });
            nameText.setOrigin(0.5);
            nameText.setScrollFactor(0);
            nameText.setDepth(2003);
            
            // Rarity label
            const rarityText = this.scene.add.text(baseX, baseY + 5, item.rarity.toUpperCase(), {
                fontSize: '14px',
                fill: `#${borderColor.toString(16).padStart(6, '0')}`,
                fontStyle: 'bold',
                align: 'center'
            });
            rarityText.setOrigin(0.5);
            rarityText.setScrollFactor(0);
            rarityText.setDepth(2003);
            
            // Description with word wrap
            const descText = this.scene.add.text(baseX, baseY + 50, item.description, {
                fontSize: '14px',
                fill: '#cccccc',
                align: 'center',
                wordWrap: { width: 200 }
            });
            descText.setOrigin(0.5);
            descText.setScrollFactor(0);
            descText.setDepth(2003);
            
            // Hover effects
            itemContainer.on('pointerover', () => {
                if (!choiceMade) {
                    itemContainer.setFillStyle(bgColor, 0.3);
                    itemContainer.setStrokeStyle(4, borderColor);
                    itemSprite.setScale(2.2); // Slightly larger on hover
                }
            });
            
            itemContainer.on('pointerout', () => {
                if (!choiceMade) {
                    itemContainer.setFillStyle(bgColor, 0.15);
                    itemContainer.setStrokeStyle(3, borderColor);
                    itemSprite.setScale(2);
                }
            });
            
            uiElements.push(itemContainer, itemSprite, nameText, rarityText, descText);
            
            // Selection handler
            itemContainer.on('pointerdown', () => {
                if (choiceMade) return;
                choiceMade = true;
                
                // Highlight selected item
                itemContainer.setFillStyle(0x00ff00, 0.4);
                itemContainer.setStrokeStyle(5, 0x00ff00);
                
                this.addToInventory(item);
                
                this.scene.time.delayedCall(300, () => {
                    uiElements.forEach(element => {
                        if (element && element.destroy) {
                            element.destroy();
                        }
                    });
                    
                    this.scene.physics.resume();
                });
            });
        });
    }
    
    getRandomItems(count = 3) {
        const rarityWeights = {
            'common': 50,
            'uncommon': 30,
            'rare': 15,
            'epic': 4,
            'legendary': 1
        };
        
        const allItemKeys = Object.keys(ITEM_TYPES);
        const selectedItems = [];
        
        for (let i = 0; i < count; i++) {
            let attempts = 0;
            let selectedItem = null;
            
            while (!selectedItem && attempts < 20) {
                const randomKey = allItemKeys[Math.floor(Math.random() * allItemKeys.length)];
                const itemData = ITEM_TYPES[randomKey];
                
                const rarityWeight = rarityWeights[itemData.rarity] || 1;
                const chance = Math.random() * 100;
                
                if (chance < rarityWeight) {
                    const randomizedItem = {
                        id: randomKey,
                        sprite: itemData.sprite,
                        name: itemData.name,
                        category: itemData.category,
                        rarity: itemData.rarity,
                        effects: {},
                        description: ''
                    };
                    
                    // Randomize effects
                    const effectDescriptions = [];
                    for (const [effectType, effectFunc] of Object.entries(itemData.effects)) {
                        const value = effectFunc();
                        randomizedItem.effects[effectType] = value;
                        
                        const sign = value > 0 ? '+' : '';
                        switch (effectType) {
                            case 'health': effectDescriptions.push(`${sign}${value} Health`); break;
                            case 'maxHealth': effectDescriptions.push(`${sign}${value} Max Health`); break;
                            case 'speed': effectDescriptions.push(`${sign}${value} Speed`); break;
                            case 'damage': effectDescriptions.push(`${sign}${value} Damage`); break;
                            case 'defense': effectDescriptions.push(`${sign}${value} Defense`); break;
                            case 'critChance': effectDescriptions.push(`${sign}${value}% Crit Chance`); break;
                            case 'critDamage': effectDescriptions.push(`${sign}${value}% Crit Damage`); break;
                            case 'dodgeChance': effectDescriptions.push(`${sign}${value}% Dodge Chance`); break;
                            case 'regeneration': effectDescriptions.push(`${sign}${value} HP/sec Regen`); break;
                            case 'attackSpeed': effectDescriptions.push(`${sign}${value}% Attack Speed`); break;
                            case 'slowResistance': effectDescriptions.push(`${sign}${value}% Slow Resist`); break;
                        }
                    }
                    
                    randomizedItem.description = effectDescriptions.join(', ');
                    selectedItem = randomizedItem;
                }
                attempts++;
            }
            
            if (selectedItem) {
                selectedItems.push(selectedItem);
            } else {
                // Fallback to a common item if we couldn't get anything
                const fallbackKey = 'berry01blue';
                const itemData = ITEM_TYPES[fallbackKey];
                const fallbackItem = {
                    id: fallbackKey,
                    sprite: itemData.sprite,
                    name: itemData.name,
                    category: itemData.category,
                    rarity: itemData.rarity,
                    effects: { health: 20 },
                    description: '+20 Health'
                };
                selectedItems.push(fallbackItem);
            }
        }
        
        return selectedItems;
    }
    
    addToInventory(item) {
        if (this.inventory.length < this.maxInventorySize) {
            this.inventory.push(item);
            
            this.applyItemEffect(item);
        }
    }
    
    applyItemEffect(item) {
        if (!item.effects) return;
        
        for (const [effectType, value] of Object.entries(item.effects)) {
            switch (effectType) {
                case 'health':
                    this.currentHealth = Math.min(this.currentHealth + value, this.maxHealth);
                    break;
                case 'maxHealth':
                    this.maxHealth += value;
                    this.currentHealth = Math.min(this.currentHealth + value, this.maxHealth); // Also heal when max health increases
                    break;
                case 'speed':
                    this.speed += value;
                    break;
                case 'damage':
                    this.baseDamage += value;
                    break;
                case 'defense':
                    this.defense += value;
                    break;
                case 'critChance':
                    this.critChance += value;
                    break;
                case 'critDamage':
                    this.critDamage += value;
                    break;
                case 'dodgeChance':
                    this.dodgeChance += value;
                    break;
                case 'regeneration':
                    this.regeneration += value;
                    break;
                case 'attackSpeed':
                    this.attackSpeed += value;
                    break;
                case 'slowResistance':
                    this.slowResistance += value;
                    break;
            }
        }
        
        this.updateUI();
    }
    
    update() {
        if (this.isAlive) {
            this.updateHPBar();
        }
    }
    
    takeDamage(amount) {
        if (!this.isAlive) return;
        
        this.currentHealth -= amount;
        if (this.currentHealth < 0) this.currentHealth = 0;
        
        this.sprite.setTint(0xff0000);
        this.scene.time.delayedCall(100, () => {
            if (this.isAlive) {
                this.sprite.setTint(0xffffff);
            }
        });
        
        if (this.currentHealth <= 0) {
            this.die();
        }
        
        this.updateHPBar();
        this.updateUI();
    }
    
    die() {
        if (this.isDying) return;
        this.isDying = true;
        this.isAlive = false;
        this.sprite.setVelocity(0, 0);
        this.sprite.clearTint();
        
        // Start death animation first, then pause physics
        this.playDeathAnimation();
        
        // Pause physics after a short delay to not interfere with death animation
        this.scene.time.delayedCall(100, () => {
            this.scene.physics.pause();
        });
    }
    
    playDeathAnimation() {
        if (this.deathAnimationStarted) return;
        this.deathAnimationStarted = true;
        
        // Stop all current animations and clear velocity
        this.sprite.stop();
        this.sprite.setVelocity(0, 0);
        
        let deathFrame = 0;
        const maxFrames = 10;
        
        const playNextFrame = () => {
            if (deathFrame < maxFrames) {
                this.sprite.setTexture(`death_${deathFrame}`);
                deathFrame++;
                
                this.scene.time.delayedCall(200, playNextFrame);
            } else {
                this.scene.time.delayedCall(500, () => {
                    this.showGameOverScreen();
                });
            }
        };
        
        playNextFrame();
    }
    
    showGameOverScreen() {
        const overlay = this.scene.add.rectangle(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY,
            this.scene.cameras.main.width,
            this.scene.cameras.main.height,
            0x000000, 0.8
        );
        overlay.setScrollFactor(0);
        overlay.setDepth(3000);
        
        const gameOverText = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY - 100,
            'GAME OVER',
            { fontSize: '48px', fill: '#ff0000', stroke: '#000000', strokeThickness: 4 }
        );
        gameOverText.setOrigin(0.5);
        gameOverText.setScrollFactor(0);
        gameOverText.setDepth(3001);
        
        const statsText = this.scene.add.text(
            this.scene.cameras.main.centerX,
            this.scene.cameras.main.centerY - 30,
            `Level Reached: ${this.level}\nTime Survived: ${this.scene.gameTimer}s`,
            { fontSize: '20px', fill: '#ffffff', stroke: '#000000', strokeThickness: 2, align: 'center' }
        );
        statsText.setOrigin(0.5);
        statsText.setScrollFactor(0);
        statsText.setDepth(3001);
        
        const restartButton = this.scene.add.rectangle(
            this.scene.cameras.main.centerX - 80,
            this.scene.cameras.main.centerY + 80,
            150, 50, 0x333333
        );
        restartButton.setScrollFactor(0);
        restartButton.setDepth(3001);
        restartButton.setInteractive();
        
        const restartText = this.scene.add.text(
            this.scene.cameras.main.centerX - 80,
            this.scene.cameras.main.centerY + 80,
            'Restart',
            { fontSize: '18px', fill: '#ffffff' }
        );
        restartText.setOrigin(0.5);
        restartText.setScrollFactor(0);
        restartText.setDepth(3002);
        
        const homeButton = this.scene.add.rectangle(
            this.scene.cameras.main.centerX + 80,
            this.scene.cameras.main.centerY + 80,
            150, 50, 0x333333
        );
        homeButton.setScrollFactor(0);
        homeButton.setDepth(3001);
        homeButton.setInteractive();
        
        const homeText = this.scene.add.text(
            this.scene.cameras.main.centerX + 80,
            this.scene.cameras.main.centerY + 80,
            'Home',
            { fontSize: '18px', fill: '#ffffff' }
        );
        homeText.setOrigin(0.5);
        homeText.setScrollFactor(0);
        homeText.setDepth(3002);
        
        restartButton.on('pointerdown', () => {
            this.scene.scene.restart();
        });
        
        homeButton.on('pointerdown', () => {
            window.location.href = '../index.html';
        });
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
            return;
        }
        
        if (cursors.A && cursors.A.isDown) {
            this.sprite.setVelocityX(-this.speed);
            this.sprite.setFlipX(true);
            this.isMoving = true;
        }
        if (cursors.D && cursors.D.isDown) {
            this.sprite.setVelocityX(this.speed);
            this.sprite.setFlipX(false);
            this.isMoving = true;
        }
        if (cursors.W && cursors.W.isDown) {
            this.sprite.setVelocityY(-this.speed);
            this.isMoving = true;
        }
        if (cursors.S && cursors.S.isDown) {
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
    constructor(scene, x, y, enemyType = 'lereon_knight') {
        const enemyData = ENEMY_TYPES[enemyType] || ENEMY_TYPES['lereon_knight'];
        
        super(scene, x, y, enemyData.sprite);
        
        this.enemyType = enemyType;
        this.enemyData = enemyData;
        this.id = `enemy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.sprite.name = this.id;
        
        // Apply difficulty scaling to stats (all stats except speed)
        const difficulty = getDifficultyLevel();
        const difficultyMultiplier = 1 + ((difficulty - 1) * 0.15); // 15% increase per difficulty level
        
        // Calculate sprite scale based on enemy density/HP (larger/denser enemies get bigger)
        const baseScale = 1.0;
        const densityFactor = (enemyData.health + enemyData.size) / 100; // Combine HP and size for density
        const scaleBonus = densityFactor > 1.5 ? 0.5 : 0; // 50% larger if dense/high HP
        const finalScale = baseScale + scaleBonus;
        
        // Set size based on enemy type with scaling
        const scaledSize = enemyData.size * finalScale;
        this.sprite.setDisplaySize(scaledSize, scaledSize);
        
        // Calculate speed with randomization and slight difficulty scaling (5% per level)
        const sizeSpeedModifier = Math.max(0.5, 1 - (enemyData.size - 24) / 200);
        const randomSpeedVariation = 0.8 + Math.random() * 0.4; // 80%-120% of base speed
        const speedDifficultyBonus = 1 + ((difficulty - 1) * 0.05); // Small speed increase with difficulty
        this.speed = enemyData.baseSpeed * sizeSpeedModifier * randomSpeedVariation * speedDifficultyBonus;
        
        // Set health and damage with difficulty scaling
        this.health = Math.floor(enemyData.health * difficultyMultiplier);
        this.maxHealth = this.health;
        this.damage = Math.floor(enemyData.damage * difficultyMultiplier);
        
        this.direction = Math.random() * Math.PI * 2;
        
        // Calculate collision and hurtbox based on scaled sprite size
        const shadowSize = Math.max(30, scaledSize * 0.6);
        this.collisionRadius = shadowSize * 0.75;
        this.hurtboxRadius = Math.max(25, scaledSize * 0.45);
        
        // Update shadow size based on scaled enemy size
        this.shadow.setSize(shadowSize, shadowSize * 0.5);
        
        this.createPatrolBehavior();
        
        this.createHPBar();
        
        // Create animations if this enemy type supports them
        if (enemyData.animated) {
            this.createAnimations();
            this.sprite.play(`${enemyType}_walk`);
        }
    }
    
    createHPBar() {
        this.hpBarBg = this.scene.add.rectangle(0, -40, 50, 6, 0x000000);
        this.hpBarBg.setDepth(999);
        
        this.hpBarFill = this.scene.add.rectangle(0, -40, 50, 6, 0xff0000);
        this.hpBarFill.setDepth(1000);
    }
    
    createAnimations() {
        const animPrefix = this.enemyData.animations;
        
        if (animPrefix.walk) {
            const walkKey = `${this.enemyType}_walk`;
            if (!this.scene.anims.exists(walkKey)) {
                this.scene.anims.create({
                    key: walkKey,
                    frames: [
                        { key: `${animPrefix.walk}_1` },
                        { key: `${animPrefix.walk}_2` },
                        { key: `${animPrefix.walk}_3` },
                        { key: `${animPrefix.walk}_4` },
                        { key: `${animPrefix.walk}_5` },
                        { key: `${animPrefix.walk}_6` }
                    ],
                    frameRate: 8,
                    repeat: -1
                });
            }
        }
        
        if (animPrefix.attack) {
            const attackKey = `${this.enemyType}_attack`;
            if (!this.scene.anims.exists(attackKey)) {
                this.scene.anims.create({
                    key: attackKey,
                    frames: [
                        { key: `${animPrefix.attack}_1` },
                        { key: `${animPrefix.attack}_2` },
                        { key: `${animPrefix.attack}_3` },
                        { key: `${animPrefix.attack}_4` },
                        { key: `${animPrefix.attack}_5` },
                        { key: `${animPrefix.attack}_6` }
                    ],
                    frameRate: 12,
                    repeat: 0
                });
            }
        }
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
            delay: 200,
            callback: () => {
                if (this.isAlive && player && player.isAlive) {
                    this.updateDirectionToPlayer();
                }
            },
            loop: true
        });
    }
    
    updateDirectionToPlayer() {
        if (!player || !player.isAlive) return;
        
        const distanceToPlayer = Phaser.Math.Distance.Between(
            this.sprite.x, this.sprite.y,
            player.sprite.x, player.sprite.y
        );
        
        const shadowDistance = 50;
        
        if (distanceToPlayer <= shadowDistance) {
            if (!this.lockedDirection) {
                this.lockedDirection = this.direction;
            }
            return;
        } else {
            this.lockedDirection = null;
        }
        
        const angleToPlayer = Phaser.Math.Angle.Between(
            this.sprite.x, this.sprite.y,
            player.sprite.x, player.sprite.y
        );
        
        let separationForceX = 0;
        let separationForceY = 0;
        const separationDistance = 60;
        
        if (enemies) {
            enemies.forEach(otherEnemy => {
                if (otherEnemy !== this && otherEnemy.isAlive) {
                    const distance = Phaser.Math.Distance.Between(
                        this.sprite.x, this.sprite.y,
                        otherEnemy.sprite.x, otherEnemy.sprite.y
                    );
                    
                    if (distance < separationDistance && distance > 0) {
                        const separationStrength = (separationDistance - distance) / separationDistance;
                        const angleAway = Phaser.Math.Angle.Between(
                            otherEnemy.sprite.x, otherEnemy.sprite.y,
                            this.sprite.x, this.sprite.y
                        );
                        
                        separationForceX += Math.cos(angleAway) * separationStrength;
                        separationForceY += Math.sin(angleAway) * separationStrength;
                    }
                }
            });
        }
        
        const playerForceX = Math.cos(angleToPlayer) * 0.7;
        const playerForceY = Math.sin(angleToPlayer) * 0.7;
        
        const totalForceX = playerForceX + separationForceX * 0.5;
        const totalForceY = playerForceY + separationForceY * 0.5;
        
        this.direction = Math.atan2(totalForceY, totalForceX);
        
        const randomOffset = (Math.random() - 0.5) * 0.2;
        this.direction += randomOffset;
    }
    
    update() {
        super.update();
        
        if (this.isAlive && player && player.isAlive) {
            this.updateDirectionToPlayer();
            
            const currentDirection = this.lockedDirection !== null ? this.lockedDirection : this.direction;
            const moveX = Math.cos(currentDirection) * this.speed;
            const moveY = Math.sin(currentDirection) * this.speed;
            
            this.sprite.setVelocity(moveX, moveY);
            
            // Handle sprite flipping
            if (moveX < -5) {
                this.sprite.setFlipX(true);
            } else if (moveX > 5) {
                this.sprite.setFlipX(false);
            }
            
            // Handle animations for animated enemies
            if (this.enemyData.animated) {
                const isMoving = Math.abs(moveX) > 5 || Math.abs(moveY) > 5;
                const walkAnimKey = `${this.enemyType}_walk`;
                
                if (isMoving && (!this.sprite.anims.isPlaying || this.sprite.anims.currentAnim.key !== walkAnimKey)) {
                    if (this.scene.anims.exists(walkAnimKey)) {
                        this.sprite.play(walkAnimKey);
                    }
                }
            }
            
            this.updateHPBar();
        } else if (this.isAlive) {
            this.sprite.setVelocity(0, 0);
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
            player.incrementKillCount(); // Track kill count for difficulty scaling
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
let currentDifficulty = 2; // Start at difficulty 2 for testing animated enemies
let maxEnemies = 5;
let currentEnemyCount = 0;

const CHUNK_SIZE = 32;
const TILE_SIZE = 48;
const RENDER_DISTANCE = 2;

let lastChunkX = null;
let lastChunkY = null;
let loadedChunks = new Map();

function preload() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    const loadingBg = this.add.rectangle(width / 2, height / 2, width, height, 0x000000);
    
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading Colosseum Fighters...', {
        fontSize: '24px',
        fill: '#ffffff',
        fontFamily: 'Arial'
    });
    loadingText.setOrigin(0.5);
    
    const loadingBarBg = this.add.rectangle(width / 2, height / 2, 400, 20, 0x333333);
    
    const loadingBar = this.add.rectangle(width / 2 - 200, height / 2, 0, 20, 0x00ff00);
    loadingBar.setOrigin(0, 0.5);
    
    const progressText = this.add.text(width / 2, height / 2 + 40, '0%', {
        fontSize: '18px',
        fill: '#ffffff',
        fontFamily: 'Arial'
    });
    progressText.setOrigin(0.5);
    
    this.load.on('progress', (value) => {
        loadingBar.width = 400 * value;
        progressText.setText(Math.round(value * 100) + '%');
    });
    
    
    this.load.on('complete', () => {
        loadingBg.destroy();
        loadingText.destroy();
        loadingBarBg.destroy();
        loadingBar.destroy();
        progressText.destroy();
    });
    
    this.load.image('grass', '../background/bgtile.png');
    
    for (let i = 0; i < 8; i++) {
        this.load.image(`idle_${i}`, `../sprites/player/Idle/HeroKnight_Idle_${i}.png`);
    }
    
    for (let i = 0; i < 10; i++) {
        this.load.image(`run_${i}`, `../sprites/player/Run/HeroKnight_Run_${i}.png`);
    }
    
    for (let i = 0; i < 10; i++) {
        this.load.image(`death_${i}`, `../sprites/player/Death/HeroKnight_Death_${i}.png`);
    }
    
    // Load enemy sprites (SINGLE PNG FILES ONLY)
    this.load.image('lereon_knight', '../sprites/enemies/lereon knight.png');
    this.load.image('baby_dragon', '../sprites/enemies/baby dragon.png');
    this.load.image('bat', '../sprites/enemies/bat.png');
    this.load.image('big_skeleton', '../sprites/enemies/big skeleton.png');
    this.load.image('burning_demon_imp', '../sprites/enemies/burning demon imp.png');
    this.load.image('burning_demon', '../sprites/enemies/burning demon.png');
    this.load.image('death_angel', '../sprites/enemies/death angel.png');
    this.load.image('legendary_dragon', '../sprites/enemies/legendary dragon.png');
    this.load.image('orc', '../sprites/enemies/orc.png');
    this.load.image('skeleton_king', '../sprites/enemies/skeleton king.png');
    this.load.image('skeleton_sword', '../sprites/enemies/skeleton sword.png');
    this.load.image('slime', '../sprites/enemies/slime.png');
    this.load.image('snake', '../sprites/enemies/snake.png');
    this.load.image('spider', '../sprites/enemies/spider.png');
    this.load.image('viking_warrior', '../sprites/enemies/viking warrior.png');
    this.load.image('werewolf', '../sprites/enemies/werewolf.png');
    this.load.image('wolf', '../sprites/enemies/wolf.png');
    this.load.image('worm', '../sprites/enemies/worm.png');
    
    // Load animated enemy frames
    for (let i = 1; i <= 6; i++) {
        this.load.image(`skeleton_sword_walk_${i}`, `../sprites/enemies/skeleton_sword/walk_${i}.png`);
        this.load.image(`skeleton_sword_attack_${i}`, `../sprites/enemies/skeleton_sword/attack1_${i}.png`);
        this.load.image(`demon_axe_walk_${i}`, `../sprites/enemies/demon_axe_red/walk_${i}.png`);
        this.load.image(`demon_axe_attack_${i}`, `../sprites/enemies/demon_axe_red/attack1_${i}.png`);
    }
    
    // Load item sprites
    this.load.image('berry01blue', '../sprites/items/berry01blue.gif');
    this.load.image('berry02yellow', '../sprites/items/berry02yellow.gif');
    this.load.image('berry03purple', '../sprites/items/berry03purple.gif');
    this.load.image('berry04red', '../sprites/items/berry04red.gif');
    this.load.image('gem01orange', '../sprites/items/gem01orange.gif');
    this.load.image('gem02blue', '../sprites/items/gem02blue.gif');
    this.load.image('gem03yellow', '../sprites/items/gem03yellow.gif');
    this.load.image('gem04purple', '../sprites/items/gem04purple.gif');
    this.load.image('gem05red', '../sprites/items/gem05red.gif');
    this.load.image('gem06green', '../sprites/items/gem06green.gif');
    this.load.image('glass01orange', '../sprites/items/glass01orange.gif');
    this.load.image('glass02blue', '../sprites/items/glass02blue.gif');
    this.load.image('glass03yellow', '../sprites/items/glass03yellow.gif');
    this.load.image('glass04purple', '../sprites/items/glass04purple.gif');
    this.load.image('glass05red', '../sprites/items/glass05red.gif');
    this.load.image('glass06green', '../sprites/items/glass06green.gif');
}

function create() {
    tilemap = this.make.tilemap({
        tileWidth: TILE_SIZE,
        tileHeight: TILE_SIZE,
        width: 2000,
        height: 2000
    });
    
    tilesets.grass = tilemap.addTilesetImage('grass', 'grass', TILE_SIZE, TILE_SIZE);
    
    tileLayers.background = tilemap.createBlankLayer('background', [tilesets.grass]);
    tileLayers.background.setDepth(-1);
    
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
        player.updateHPBar();
        
        checkEntityCollisions.call(this);
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
    // Advanced difficulty calculation based on kills, level, and time
    const levelFactor = Math.floor(player.level / 2); // Every 2 levels increases difficulty
    const killFactor = Math.floor(player.killCount / 20); // Every 20 kills increases difficulty
    const timeFactor = Math.floor(player.scene.gameTimer / 120); // Every 2 minutes increases difficulty
    
    return Math.max(1, levelFactor + killFactor + timeFactor + 1);
}

function updateDifficulty() {
    const newDifficulty = getDifficultyLevel();
    if (newDifficulty > currentDifficulty) {
        currentDifficulty = newDifficulty;
        maxEnemies = Math.min(5 + (currentDifficulty * 2), 15);
    }
}

function checkEntityCollisions() {
    if (!player || !player.isAlive || !enemies || enemies.length === 0) return;
    
    enemies.forEach(enemy => {
        if (!enemy || !enemy.isAlive || !enemy.sprite) return;
        
        const distance = Phaser.Math.Distance.Between(
            player.sprite.x, player.sprite.y,
            enemy.sprite.x, enemy.sprite.y
        );
        
        const hurtboxDistance = enemy.hurtboxRadius || 40;
        
        if (distance < hurtboxDistance) {
            const enemyId = enemy.id || `enemy_${enemy.sprite.x}_${enemy.sprite.y}`;
            const currentTime = Date.now();
            
            if (!player.collisionCooldowns.has(enemyId) || 
                currentTime - player.collisionCooldowns.get(enemyId) > 1000) {
                
                const damage = (enemy.damage || 15) + (currentDifficulty * 2);
                player.takeDamage(damage);
                player.collisionCooldowns.set(enemyId, currentTime);
                
                player.sprite.setTint(0xff0000);
                enemy.sprite.setTint(0xffaaaa);
                setTimeout(() => {
                    if (enemy && enemy.isAlive && enemy.sprite) {
                        enemy.sprite.setTint(0xff6666);
                    }
                }, 200);
            }
        }
    });
    
    for (let i = 0; i < enemies.length; i++) {
        for (let j = i + 1; j < enemies.length; j++) {
            const enemy1 = enemies[i];
            const enemy2 = enemies[j];
            
            if (!enemy1.isAlive || !enemy2.isAlive) continue;
            
            const distance = Phaser.Math.Distance.Between(
                enemy1.sprite.x, enemy1.sprite.y,
                enemy2.sprite.x, enemy2.sprite.y
            );
            
            if (distance < 50) {
                const pushForce = 20;
                const angle = Phaser.Math.Angle.Between(
                    enemy1.sprite.x, enemy1.sprite.y,
                    enemy2.sprite.x, enemy2.sprite.y
                );
                
                const pushX1 = Math.cos(angle + Math.PI) * pushForce;
                const pushY1 = Math.sin(angle + Math.PI) * pushForce;
                const pushX2 = Math.cos(angle) * pushForce;
                const pushY2 = Math.sin(angle) * pushForce;
                
                enemy1.sprite.body.velocity.x += pushX1;
                enemy1.sprite.body.velocity.y += pushY1;
                enemy2.sprite.body.velocity.x += pushX2;
                enemy2.sprite.body.velocity.y += pushY2;
            }
        }
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
    
    for (let i = 0; i < initialSpawn; i++) {
        spawnSingleEnemy.call(this);
    }
}

function getRandomEnemyType() {
    const difficultyBasedTypes = [
        // Early game (easier enemies)
        ['slime', 'bat', 'spider', 'snake', 'worm'],
        // Mid game  
        ['lereon_knight', 'wolf', 'skeleton_sword', 'orc', 'burning_demon_imp', 'skeleton_sword_animated'],
        // Late game (harder enemies)
        ['werewolf', 'viking_warrior', 'baby_dragon', 'big_skeleton', 'demon_axe_red'],
        // End game (boss-like enemies)
        ['burning_demon', 'skeleton_king', 'death_angel', 'legendary_dragon']
    ];
    
    const difficultyLevel = Math.min(3, Math.floor(currentDifficulty / 2));
    const availableTypes = [];
    
    // Add enemy types based on difficulty, with overlap for variety
    for (let i = 0; i <= difficultyLevel; i++) {
        availableTypes.push(...difficultyBasedTypes[i]);
    }
    
    return availableTypes[Math.floor(Math.random() * availableTypes.length)];
}

function spawnSingleEnemy() {
    const angle = Math.random() * Math.PI * 2;
    const distance = 300 + Math.random() * 200;
    const x = player.sprite.x + Math.cos(angle) * distance;
    const y = player.sprite.y + Math.sin(angle) * distance;
    
    const enemyType = getRandomEnemyType();
    const enemy = new Enemy(this, x, y, enemyType);
    enemies.push(enemy);
    currentEnemyCount++;
    
    enemy.sprite.setInteractive();
    enemy.sprite.on('pointerdown', () => {
        if (enemy.isAlive) {
            enemy.takeDamage(25 + (player.level * 5));
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
            
            const tile = tileLayers.background.putTileAt(tilesets.grass.firstgid, tileX, tileY);
            
            
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

const game = new Phaser.Game(config);

window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth, window.innerHeight - 50);
});