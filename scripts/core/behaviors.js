import { BurnZone, FollowZone, LightningStrike } from './zones.js';

// Helper: damage enemies in a line segment from (x,y) in angle dir with length L and width W
function lineDamage(scene, player, enemies, x, y, angle, length, width, damage, damageType) {
  const dx = Math.cos(angle), dy = Math.sin(angle);
  const endX = x + dx * length, endY = y + dy * length;
  const g = scene.add.graphics();
  g.lineStyle(width, 0xffffff, 0.5);
  g.beginPath(); g.moveTo(x, y); g.lineTo(endX, endY); g.strokePath();
  g.setDepth(90);
  scene.tweens.add({ targets: g, alpha: 0, duration: 180, onComplete: () => g.destroy() });
  enemies.forEach(e => {
    if (!e.isAlive) return;
    // project point onto line and check distance to segment
    const vx = e.sprite.x - x, vy = e.sprite.y - y;
    const t = Math.max(0, Math.min(1, (vx*dx + vy*dy) / (length)));
    const px = x + dx * length * t, py = y + dy * length * t;
    const dist = Phaser.Math.Distance.Between(e.sprite.x, e.sprite.y, px, py);
    if (dist <= width * 0.6) {
      e.takeDamage(damage);
      if (damageType && e.applyDebuff) e.applyDebuff(damageType, 1 + (player?.debuffPower || 0));
    }
  });
}

function coneDamage(scene, player, enemies, x, y, angle, radius, arcRadians, damage, damageType) {
  const start = angle - arcRadians/2, end = angle + arcRadians/2;
  const g = scene.add.graphics();
  g.lineStyle(10, 0xffd700, 0.5);
  g.beginPath(); g.arc(x, y, radius, start, end); g.strokePath();
  g.setDepth(90);
  scene.tweens.add({ targets: g, alpha: 0, duration: 180, onComplete: () => g.destroy() });
  enemies.forEach(e => {
    if (!e.isAlive) return;
    const ang = Phaser.Math.Angle.Between(x, y, e.sprite.x, e.sprite.y);
    const dist = Phaser.Math.Distance.Between(x, y, e.sprite.x, e.sprite.y);
    const inArc = Phaser.Math.Angle.ShortestBetween(Phaser.Math.RadToDeg(angle), Phaser.Math.RadToDeg(ang));
    if (Math.abs(inArc) <= Phaser.Math.RadToDeg(arcRadians/2) && dist <= radius) {
      e.takeDamage(damage);
      if (damageType && e.applyDebuff) e.applyDebuff(damageType, 1 + (player?.debuffPower || 0));
    }
  });
}

export function executeWeaponAttack(scene, player, weapon, target, enemies, projectiles, zones) {
  const px = player.sprite.x, py = player.sprite.y;
  const damage = weapon.instanceDamage || (typeof weapon.damage === 'function' ? weapon.damage() : weapon.damage) || 5;
  const angle = target
    ? Phaser.Math.Angle.Between(px, py, target.sprite.x, target.sprite.y)
    : (player.lastFacingAngle || 0);

  switch (weapon.id) {
    case 'weapon_longsword': { // Sword: thrust
      const len = weapon.attackRange || 100;
      lineDamage(scene, player, enemies, px, py, angle, len, 10, damage + player.baseDamage, weapon.damageType);
      if (weapon.maxMode) { // giant thrust
        lineDamage(scene, player, enemies, px, py, angle, len * 1.8, 18, Math.floor((damage + player.baseDamage) * 1.6), weapon.damageType);
      }
      return true;
    }
    case 'weapon_whip': {
      const len = (weapon.attackRange || 130);
      if (weapon.maxMode) {
        coneDamage(scene, player, enemies, px, py, angle, len, Math.PI/2, damage + player.baseDamage, weapon.damageType);
      } else {
        lineDamage(scene, player, enemies, px, py, angle, len, 8, damage + player.baseDamage, weapon.damageType);
      }
      return true;
    }
    case 'weapon_claymore': { // spin around
      const spin = scene.add.graphics();
      spin.lineStyle(12, 0xffd700, 0.4);
      spin.strokeCircle(px, py, (weapon.attackRange||100));
      scene.tweens.add({ targets: spin, alpha: 0, duration: 220, onComplete: () => spin.destroy() });
      enemies.forEach(e => {
        const dist = Phaser.Math.Distance.Between(px, py, e.sprite.x, e.sprite.y);
        if (dist <= (weapon.attackRange||100)) e.takeDamage(damage + player.baseDamage);
      });
      if (weapon.maxMode) {
        // Giant sword falls from the sky at target
        const tx = target ? target.sprite.x : (px + Math.cos(angle)*120);
        const ty = target ? target.sprite.y : (py + Math.sin(angle)*120);
        const strike = scene.add.sprite(tx, ty - 200, 'weapon_longsword');
        strike.setRotation(Math.PI/2);
        scene.tweens.add({ targets: strike, y: ty, duration: 180, ease: 'Sine.easeIn', onComplete: () => {
          const boom = scene.add.graphics(); boom.fillStyle(0xffffff, 0.2); boom.fillCircle(tx, ty, 80);
          enemies.forEach(e => { if (Phaser.Math.Distance.Between(tx, ty, e.sprite.x, e.sprite.y) <= 80) e.takeDamage(Math.floor((damage+player.baseDamage)*1.5)); });
          scene.tweens.add({ targets: boom, alpha: 0, duration: 250, onComplete: () => boom.destroy() });
          strike.destroy();
        }});
      }
      return true;
    }
    case 'weapon_shield': {
      // Push enemies in front arc, or around if max
      const rad = (weapon.attackRange||70);
      enemies.forEach(e => {
        const dist = Phaser.Math.Distance.Between(px, py, e.sprite.x, e.sprite.y);
        if (dist <= rad) {
          const ang = Phaser.Math.Angle.Between(px, py, e.sprite.x, e.sprite.y);
          const push = weapon.maxMode ? 120 : 60;
          e.sprite.x += Math.cos(ang) * push;
          e.sprite.y += Math.sin(ang) * push;
          e.takeDamage(Math.floor((damage+player.baseDamage)*0.6));
        }
      });
      // Max: brief impervious window to attacks
      if (weapon.maxMode && player && player.scene && player.isAlive) {
        const now = player.scene.time.now || Date.now();
        player.imperviousUntil = Math.max(player.imperviousUntil || 0, now + 1200);
        // Optional visual cue
        if (player.sprite && player.sprite.setTintFill) {
          player.sprite.setTintFill(0x88ccff);
          player.scene.time.delayedCall(200, () => { if (player.isAlive) player.sprite.clearTint(); });
        }
      }
      return true;
    }
    case 'weapon_doubleaxe': { // Axe throw upwards with total damage pool
      const tx = px; const ty = py - (weapon.attackRange || 150);
      const proj = {
        isAlive: true,
        remainingDamage: (damage + player.baseDamage) * 3,
        sprite: scene.add.sprite(px, py, 'weapon_doubleaxe'),
        update() {
          if (!this.isAlive) return;
          // move upward
          this.sprite.y -= (weapon.projectileSpeed||250) * (scene.game.loop.delta/1000);
          enemies.forEach(e => {
            if (!this.isAlive || !e.isAlive) return;
            const d = Phaser.Math.Distance.Between(this.sprite.x, this.sprite.y, e.sprite.x, e.sprite.y);
            if (d < 30) {
              const hit = Math.min(this.remainingDamage, Math.floor((damage+player.baseDamage)*0.8));
              e.takeDamage(hit);
              this.remainingDamage -= hit;
              if (this.remainingDamage <= 0) this.destroy();
            }
          });
          if (this.sprite.y <= ty) this.destroy();
        },
        destroy() { if (this.isAlive) { this.isAlive = false; this.sprite.destroy(); } }
      };
      projectiles.push(proj);
      if (weapon.maxMode) {
        // spin around player minor aoe
        const spin = scene.add.graphics(); spin.lineStyle(8, 0xffffff, 0.3); spin.strokeCircle(px, py, 90);
        enemies.forEach(e => { if (Phaser.Math.Distance.Between(px, py, e.sprite.x, e.sprite.y) <= 90) e.takeDamage(Math.floor((damage+player.baseDamage)*0.5)); });
        scene.tweens.add({ targets: spin, alpha: 0, duration: 200, onComplete: () => spin.destroy() });
      }
      return true;
    }
    case 'weapon_torch': {
      const radius = weapon.maxMode ? 140 : 70;
      // Ensure near-100% uptime at max by using a long duration that overlaps the cooldown
      const dur = weapon.maxMode ? 6000 : 2000;
      const dps = Math.max(2, Math.floor((damage+player.baseDamage)*0.2));
      const rx = px + (Math.random()*2-1) * (weapon.attackRange||220);
      const ry = py + (Math.random()*2-1) * (weapon.attackRange||220);
      zones.push(new BurnZone(scene, rx, ry, radius, dps, dur));
      return true;
    }
    case 'weapon_spear': {
      // piercing projectile
      weapon.piercing = true;
      return false; // fall back to default projectile path
    }
    case 'weapon_stone': {
      // on hit, split handled in Projectile by weapon.special flag (set here)
      weapon.special = 'stone_split';
      return false;
    }
    case 'weapon_staff': {
      const tx = target ? target.sprite.x : (px + Math.cos(angle)*100);
      const ty = target ? target.sprite.y : (py + Math.sin(angle)*100);
      zones.push(new LightningStrike(scene, tx, ty, 70, damage + player.baseDamage));
      if (weapon.maxMode) {
        zones.push(new LightningStrike(scene, px, py, 90, Math.floor((damage+player.baseDamage)*1.2)));
        // Apply a short self-buff: small attack speed and defense boost for a few seconds
        player._staffBuffs = player._staffBuffs || 0;
        if (player._staffBuffs === 0) {
          player.applyStatBonus('attackSpeed', 15);
          player.applyStatBonus('defense', 2);
          const clearBuff = () => {
            // revert by subtracting the same amount if still alive
            if (!player || !player.isAlive) return;
            player.attackSpeed -= 15;
            player.defense -= 2;
            player._staffBuffs = 0;
          };
          player._staffBuffs = 1;
          scene.time.delayedCall(4000, clearBuff);
        }
      }
      return true;
    }
    case 'magic_wand': {
      weapon.piercing = true;
      weapon.special = weapon.maxMode ? 'wand_burn_trail' : undefined;
      return false;
    }
    case 'weapon_rose': {
      weapon.special = weapon.maxMode ? 'rose_poison_aoe' : undefined;
      return false;
    }
    case 'weapon_lantern': {
      const radius = (weapon.attackRange||80) * (weapon.maxMode ? 2 : 1);
      const dps = Math.max(1, Math.floor((damage+player.baseDamage)*0.2));
      const options = weapon.maxMode ? { pushIntervalMs: 2000, pushForce: 160 } : {};
      zones.push(new FollowZone(scene, player, radius, dps, 2500, 0xffff66, options));
      return true;
    }
    case 'weapon_claws': {
      const baseDam = damage + player.baseDamage;
      const len = weapon.attackRange || 60;
      const arc = Math.PI/3;
      coneDamage(scene, player, enemies, px, py, angle, len, arc, baseDam, weapon.damageType);
      if (weapon.maxMode) {
        coneDamage(scene, player, enemies, px, py, angle - Math.PI/2, len*1.2, arc*1.3, Math.floor(baseDam*1.1), weapon.damageType);
        coneDamage(scene, player, enemies, px, py, angle + Math.PI/2, len*1.2, arc*1.3, Math.floor(baseDam*1.1), weapon.damageType);
      }
      return true;
    }
  }
  return false; // not handled, use default attack
}
