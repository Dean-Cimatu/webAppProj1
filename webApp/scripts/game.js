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
        
        this.level = 1;
        this.experience = 0;
        this.experienceToNext = 100;
        this.maxHealth = 100;
        this.currentHealth = 100;
        
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
        
        const uiElements = [overlay, title];
        let choiceMade = false;
        
        items.forEach((item, index) => {
            const button = this.scene.add.rectangle(
                this.scene.cameras.main.centerX,
                this.scene.cameras.main.centerY - 20 + (index * 50),
                300, 40, 0x333333
            );
            button.setScrollFactor(0);
            button.setDepth(2001);
            button.setInteractive();
            
            button.on('pointerover', () => {
                if (!choiceMade) {
                    button.setFillStyle(0x555555);
                }
            });
            
            button.on('pointerout', () => {
                if (!choiceMade) {
                    button.setFillStyle(0x333333);
                }
            });
            
            const text = this.scene.add.text(
                this.scene.cameras.main.centerX,
                this.scene.cameras.main.centerY - 20 + (index * 50),
                `${item.name} - ${item.description}`,
                { fontSize: '16px', fill: '#ffffff' }
            );
            text.setOrigin(0.5);
            text.setScrollFactor(0);
            text.setDepth(2002);
            
            uiElements.push(button, text);
            
            button.on('pointerdown', () => {
                if (choiceMade) return;
                choiceMade = true;
                
                button.setFillStyle(0x00ff00);
                
                this.addToInventory(item);
                
                this.scene.time.delayedCall(200, () => {
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
    
    addToInventory(item) {
        if (this.inventory.length < this.maxInventorySize) {
            this.inventory.push(item);
            
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
        
        // Set size based on enemy type
        this.sprite.setDisplaySize(enemyData.size, enemyData.size);
        
        // Calculate speed with randomization based on size (larger = slower)
        const sizeSpeedModifier = Math.max(0.5, 1 - (enemyData.size - 24) / 200);
        const randomSpeedVariation = 0.8 + Math.random() * 0.4; // 80%-120% of base speed
        this.speed = enemyData.baseSpeed * sizeSpeedModifier * randomSpeedVariation;
        
        // Set health and damage
        this.health = enemyData.health;
        this.maxHealth = this.health;
        this.damage = enemyData.damage;
        
        this.direction = Math.random() * Math.PI * 2;
        
        // Calculate collision and hurtbox based on sprite size
        const shadowSize = Math.max(30, enemyData.size * 0.6);
        this.collisionRadius = shadowSize * 0.75;
        this.hurtboxRadius = Math.max(25, enemyData.size * 0.45);
        
        // Update shadow size based on enemy size
        this.shadow.setSize(shadowSize, shadowSize * 0.5);
        
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
            
            if (moveX < -5) {
                this.sprite.setFlipX(true);
            } else if (moveX > 5) {
                this.sprite.setFlipX(false);
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
    
    // Load enemy sprites
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
    return Math.floor(player.level / 3) + 1;
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
        ['lereon_knight', 'wolf', 'skeleton_sword', 'orc', 'burning_demon_imp'],
        // Late game (harder enemies)
        ['werewolf', 'viking_warrior', 'baby_dragon', 'big_skeleton'],
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