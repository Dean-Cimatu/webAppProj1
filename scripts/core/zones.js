// Simple zone effects for burn, lightning, lantern
export class BurnZone {
  constructor(scene, x, y, radius, dps, durationMs, tint = 0xff6600) {
    this.scene = scene;
    this.x = x; this.y = y;
    this.radius = radius;
    this.dps = dps;
    this.remaining = durationMs;
    this.isAlive = true;
    this.graphics = scene.add.graphics();
    this.graphics.fillStyle(tint, 0.25);
    this.graphics.fillCircle(x, y, radius);
    this.graphics.setDepth(25);
    this._acc = 0;
  }
  update(dt, enemies) {
    if (!this.isAlive) return;
    this.remaining -= dt;
    if (this.remaining <= 0) { this.destroy(); return; }
    this._acc += dt;
    if (this._acc >= 250) { // tick every 250ms
      this._acc = 0;
      enemies.forEach(e => {
        if (!e.isAlive) return;
        const dist = Phaser.Math.Distance.Between(this.x, this.y, e.sprite.x, e.sprite.y);
        if (dist <= this.radius) {
          e.takeDamage(this.dps);
          if (e.applyDebuff) e.applyDebuff('burn', 1);
        }
      });
    }
  }
  destroy() { if (this.isAlive) { this.isAlive = false; this.graphics.destroy(); } }
}

export class FollowZone {
  constructor(scene, owner, radius, dps, durationMs, tint = 0xffff66, options = {}) {
    this.scene = scene; this.owner = owner;
    this.radius = radius; this.dps = dps;
    this.remaining = durationMs; this.isAlive = true;
    this.graphics = scene.add.graphics();
    this.graphics.fillStyle(tint, 0.2);
    this.graphics.setDepth(25);
    this._acc = 0;
    this._pushAcc = 0;
    this.pushIntervalMs = options.pushIntervalMs || 0; // 0 disables pushback
    this.pushForce = options.pushForce || 140;
  }
  update(dt, enemies) {
    if (!this.isAlive) return;
    this.remaining -= dt;
    if (this.remaining <= 0) { this.destroy(); return; }
    const x = this.owner.sprite.x; const y = this.owner.sprite.y;
    this.graphics.clear();
    this.graphics.fillStyle(0xffff66, 0.2);
    this.graphics.fillCircle(x, y, this.radius);
    this._acc += dt;
    if (this._acc >= 300) {
      this._acc = 0;
      enemies.forEach(e => {
        if (!e.isAlive) return;
        const dist = Phaser.Math.Distance.Between(x, y, e.sprite.x, e.sprite.y);
        if (dist <= this.radius) {
          e.takeDamage(this.dps);
        }
      });
    }
    if (this.pushIntervalMs > 0) {
      this._pushAcc += dt;
      if (this._pushAcc >= this.pushIntervalMs) {
        this._pushAcc = 0;
        enemies.forEach(e => {
          if (!e.isAlive) return;
          const dist = Phaser.Math.Distance.Between(x, y, e.sprite.x, e.sprite.y);
          if (dist <= this.radius) {
            const ang = Phaser.Math.Angle.Between(x, y, e.sprite.x, e.sprite.y);
            e.sprite.x += Math.cos(ang) * this.pushForce;
            e.sprite.y += Math.sin(ang) * this.pushForce;
          }
        });
      }
    }
  }
  destroy() { if (this.isAlive) { this.isAlive = false; this.graphics.destroy(); } }
}

export class LightningStrike {
  constructor(scene, x, y, radius, damage) {
    this.scene = scene; this.x = x; this.y = y; this.radius = radius; this.damage = damage;
    this.isAlive = true; this._done = false;
    this.sprite = scene.add.sprite(x, y, 'bluefire_effect');
    this.sprite.play('bluefire_effect_anim');
    this.sprite.setScale(1.3);
    this.sprite.on('animationcomplete', () => this.destroy());
  }
  update(dt, enemies) {
    if (this._done || !this.isAlive) return;
    enemies.forEach(e => {
      if (!e.isAlive) return;
      const dist = Phaser.Math.Distance.Between(this.x, this.y, e.sprite.x, e.sprite.y);
      if (dist <= this.radius) { e.takeDamage(this.damage); if (e.applyDebuff) e.applyDebuff('armor_weaken', 1); }
    });
    this._done = true;
  }
  destroy() { if (this.isAlive) { this.isAlive = false; this.sprite.destroy(); } }
}
