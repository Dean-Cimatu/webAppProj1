import { BurnZone, FollowZone, LightningStrike, LightningFallStrike, OrbitingBlade } from './zones.js';

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
      e.takeDamage(damage, damageType);
      if (damageType && e.applyDebuff) e.applyDebuff(damageType, 1 + (player?.debuffPower || 0));
    }
  });
}

function coneDamage(scene, player, enemies, x, y, angle, radius, arcRadians, damage, damageType) {
  const start = angle - arcRadians/2, end = angle + arcRadians/2;
  const g = scene.add.graphics();
  // Filled wedge for better readability
  g.fillStyle(0xffd700, 0.18);
  g.lineStyle(8, 0xffd700, 0.5);
  g.beginPath();
  g.moveTo(x, y);
  g.arc(x, y, radius, start, end);
  g.closePath();
  g.fillPath();
  g.strokePath();
  g.setDepth(90);
  scene.tweens.add({ targets: g, alpha: 0, duration: 260, onComplete: () => g.destroy() });
  enemies.forEach(e => {
    if (!e.isAlive) return;
    const ang = Phaser.Math.Angle.Between(x, y, e.sprite.x, e.sprite.y);
    const dist = Phaser.Math.Distance.Between(x, y, e.sprite.x, e.sprite.y);
    const inArc = Phaser.Math.Angle.ShortestBetween(Phaser.Math.RadToDeg(angle), Phaser.Math.RadToDeg(ang));
    if (Math.abs(inArc) <= Phaser.Math.RadToDeg(arcRadians/2) && dist <= radius) {
      e.takeDamage(damage, damageType);
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
    case 'weapon_flail': {
      // Heavy sweeping arcs; at max, perform a brief whirlwind of repeated sweeps
      const baseDam = damage + player.baseDamage;
      const radius = weapon.attackRange || 120;
      const sweepArc = Math.PI * 1.2; // ~216 degrees
      // Two quick opposite-direction sweeps
      coneDamage(scene, player, enemies, px, py, angle, radius, sweepArc, baseDam, weapon.damageType);
      scene.time.delayedCall(160, () => {
        coneDamage(scene, player, enemies, px, py, angle + Math.PI, radius, sweepArc, Math.floor(baseDam*0.9), weapon.damageType);
      });
      if (weapon.maxMode) {
        // Whirlwind: pulse damage in a full circle for a short duration
        const pulses = 4; // total pulses across ~800ms
        for (let i = 0; i < pulses; i++) {
          scene.time.delayedCall(200 * i, () => {
            coneDamage(scene, player, enemies, px, py, angle + (i * Math.PI/2), radius + 10, Math.PI * 2, Math.floor(baseDam * 0.7), weapon.damageType);
          });
        }
      }
      return true;
    }
    case 'weapon_crystalsword': {
      // Lightning-aligned thrust with a chance to arc to nearby enemies; larger reach at max
      const len = (weapon.attackRange || 85) * (weapon.maxMode ? 1.6 : 1.0);
      const dam = Math.floor((damage + player.baseDamage) * (weapon.maxMode ? 1.2 : 1.0));
      lineDamage(scene, player, enemies, px, py, angle, len, 12, dam, weapon.damageType);
      // Simple chain: jump to up to 3 nearest additional targets around primary target if available
      if (target && target.isAlive) {
        // Collect nearby enemies within 120px of the target, excluding the target
        const candidates = enemies
          .filter(e => e.isAlive && e !== target)
          .map(e => ({ e, d: Phaser.Math.Distance.Between(target.sprite.x, target.sprite.y, e.sprite.x, e.sprite.y) }))
          .filter(ed => ed.d <= 120)
          .sort((a, b) => a.d - b.d)
          .slice(0, 3);
        candidates.forEach((ed, idx) => {
          const chainDmg = Math.max(1, Math.floor(dam * (0.7 - idx * 0.15)));
          ed.e.takeDamage(chainDmg, weapon.damageType);
          if (ed.e.applyDebuff) ed.e.applyDebuff('armor_weaken', 1);
          // Optional quick visual: thin line, kept lightweight
          const l = scene.add.line(0, 0, target.sprite.x, target.sprite.y, ed.e.sprite.x, ed.e.sprite.y, 0x99e0ff, 0.9);
          l.setDepth(1300); l.setLineWidth(2);
          scene.time.delayedCall(100, () => l.destroy());
        });
      }
      return true;
    }
    case 'weapon_whip': {
      const len = (weapon.attackRange || 170);
      if (weapon.maxMode) {
        // Wider arc and slightly longer reach when maxed
        coneDamage(scene, player, enemies, px, py, angle, Math.floor(len * 1.15), Math.PI * 0.7, damage + player.baseDamage, weapon.damageType);
      } else {
        // Thicker lash line for a wider hit
        lineDamage(scene, player, enemies, px, py, angle, len, 16, damage + player.baseDamage, weapon.damageType);
      }
      return true;
    }
    case 'weapon_claymore': { // persistent orbiting blades
      const lvl = weapon.level || (player.weaponLevels?.[weapon.id] || 1);
      const desiredCount = 1 + Math.floor((lvl - 1) / 2); // +1 blade every 2 levels
      player._claymoreBlades = (player._claymoreBlades || []).filter(b => b && b.isAlive);
      const radius = weapon.attackRange || 100;
      const speed = 2.0; // radians per second
      const bladeDamage = (damage + player.baseDamage);
      // Update existing blades' parameters
      player._claymoreBlades.forEach((b, i) => {
        b.radius = radius;
        b.speed = speed;
        b.damage = bladeDamage;
      });
      // Create additional blades if needed
      const current = player._claymoreBlades.length;
      for (let i = current; i < desiredCount; i++) {
        const phase = (Math.PI * 2) * (i / desiredCount);
        const blade = new OrbitingBlade(scene, player, radius, speed, phase, bladeDamage, weapon.damageType);
        zones.push(blade);
        player._claymoreBlades.push(blade);
      }
      // If too many (shouldn't usually happen), remove extras
      if (player._claymoreBlades.length > desiredCount) {
        const extras = player._claymoreBlades.splice(desiredCount);
        extras.forEach(b => b.destroy());
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
          e.takeDamage(Math.floor((damage+player.baseDamage)*0.6), weapon.damageType);
        }
      });
      // Max: brief impervious window to attacks
      if (weapon.maxMode && player && player.scene && player.isAlive) {
        const now = player.scene.time.now || Date.now();
        player.imperviousUntil = Math.max(player.imperviousUntil || 0, now + 1200);
        // Optional visual cue
        if (player.sprite) {
          const fx = player.scene.add.sprite(player.sprite.x, player.sprite.y, 'BlockFlash_0');
          fx.setDepth(1400);
          fx.setScale(1.1);
          fx.play('block_flash_anim');
          fx.once('animationcomplete', () => fx.destroy());
        }
      }
      return true;
    }
    case 'weapon_doubleaxe': { // Heavy cleaving swings around the player
      const baseDam = damage + player.baseDamage;
      const range = weapon.attackRange || 90;
      const arc = Math.PI * 0.9; // ~162 degrees wide
      // Two quick heavy cleaves: forward, then reverse
      coneDamage(scene, player, enemies, px, py, angle, range, arc, Math.floor(baseDam * 1.1), weapon.damageType);
      scene.time.delayedCall(140, () => {
        coneDamage(scene, player, enemies, px, py, angle + Math.PI, Math.floor(range * 0.95), arc, Math.floor(baseDam * 1.0), weapon.damageType);
      });
      if (weapon.maxMode) {
        // Max: finish with a brief 360° spin hit
        scene.time.delayedCall(300, () => {
          coneDamage(scene, player, enemies, px, py, angle, Math.floor(range * 1.1), Math.PI * 2, Math.floor(baseDam * 0.9), weapon.damageType);
        });
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
      const tx = target ? target.sprite.x : (px + Math.cos(angle)*120);
      const ty = target ? target.sprite.y : (py + Math.sin(angle)*120);
      // Primary strike: fall from sky then explode
      zones.push(new LightningFallStrike(scene, tx, ty, 70, damage + player.baseDamage, 1 + (player?.debuffPower || 0)));
      if (weapon.maxMode) {
        // Max: also center a strike on the player
        zones.push(new LightningFallStrike(scene, px, py, 90, Math.floor((damage+player.baseDamage)*1.2), 1 + (player?.debuffPower || 0)));
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
      // Use orange tint for clear zone indication
      zones.push(new FollowZone(scene, player, radius, dps, 2500, 0xffa500, options));
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
