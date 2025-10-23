// Lightweight runtime debug overlay for hitboxes, projectile paths, and enemy steering
export class DebugOverlay {
  constructor(scene) {
    this.scene = scene;
    this.enabled = false;
    this.g = scene.add.graphics();
    this.g.setDepth(2000);
    // Toggle with F3
    scene.input.keyboard.on('keydown-F3', () => {
      this.enabled = !this.enabled;
      if (!this.enabled) this.g.clear();
    });
  }

  draw(scene, player, enemies, projectiles) {
    if (!this.enabled) return;
    const g = this.g;
    g.clear();
    // Projectiles: collision radius + travel path line
    if (Array.isArray(projectiles)) {
      projectiles.forEach(p => {
        if (!p || !p.isAlive || !p.sprite) return;
        // Collision radius (matches 25px check in Projectile)
        g.lineStyle(1, 0x00ffff, 0.8);
        g.strokeCircle(p.sprite.x, p.sprite.y, 25);
        // Travel path: draw a ray ahead in the velocity direction
        const vx = p.velocityX || 0; const vy = p.velocityY || 0;
        const vmag = Math.hypot(vx, vy) || 1;
        const ux = vx / vmag, uy = vy / vmag;
        const len = p.weapon && p.weapon.travelToEdge ? 1000 : Phaser.Math.Distance.Between(p.sprite.x, p.sprite.y, p.targetX || p.sprite.x, p.targetY || p.sprite.y);
        g.lineStyle(1, 0xffff00, 0.8);
        g.beginPath(); g.moveTo(p.sprite.x, p.sprite.y); g.lineTo(p.sprite.x + ux * len, p.sprite.y + uy * len); g.strokePath();
      });
    }
    // Enemies: steering toward player + hurtbox
    if (Array.isArray(enemies)) {
      enemies.forEach(e => {
        if (!e || !e.isAlive || !e.sprite) return;
        // Hurtbox radius
        const hr = e.hurtboxRadius || 40;
        g.lineStyle(1, 0xff00ff, 0.6);
        g.strokeCircle(e.sprite.x, e.sprite.y, hr);
        // Direction arrow from enemy forward
        const dir = (e.lockedDirection !== null && e.lockedDirection !== undefined) ? e.lockedDirection : e.direction || 0;
        const ex = e.sprite.x, ey = e.sprite.y;
        const ax = ex + Math.cos(dir) * 40; const ay = ey + Math.sin(dir) * 40;
        g.lineStyle(2, 0xff8800, 0.9);
        g.beginPath(); g.moveTo(ex, ey); g.lineTo(ax, ay); g.strokePath();
        // Steering line to player
        const p = player;
        if (p && p.isAlive) {
          g.lineStyle(1, 0x00ff00, 0.6);
          g.beginPath(); g.moveTo(ex, ey); g.lineTo(p.sprite.x, p.sprite.y); g.strokePath();
        }
      });
    }
    // Player: show current weapon nominal attack range
    if (player && player.currentWeapon && player.sprite) {
      const r = player.currentWeapon.attackRange || 80;
      g.lineStyle(1, 0x66ccff, 0.8);
      g.strokeCircle(player.sprite.x, player.sprite.y, r);
    }
  }
}
