// collectible items
export const ITEM_TYPES = {
  'berry01blue': {
    sprite: 'berry01blue',
    name: 'Frost Berry',
    category: 'berry',
    rarity: 'common',
    description: 'Provides steady health and minor speed',
    effects: { health: () => 20, speed: () => 2 }
  },
  'sword_sharpener': { sprite: 'weapon_longsword', name: 'Sword Sharpener', category: 'item', rarity: 'common', description: 'Increases flat attack damage', effects: { damage: () => 5 } },
  'arrow_quiver': { sprite: 'weapon_bow', name: 'Arrow Quiver', category: 'item', rarity: 'common', description: 'Increases projectile speed', effects: { projectileSpeed: () => 50 } },
  'leather_handle': { sprite: 'weapon_dagger', name: 'Leather Handle', category: 'item', rarity: 'common', description: 'Increases handling, increases attack hit area', effects: { range: () => 10 } },
  'null_magic_rock': { sprite: 'gem01orange', name: 'Null Magic Rock', category: 'item', rarity: 'uncommon', description: 'Decreases magic damage, increases attack damage', effects: { magicDamageDown: () => 10, damage: () => 8 } },
  'iron_handle': { sprite: 'gem02blue', name: 'Iron Handle', category: 'item', rarity: 'uncommon', description: 'Slows down character, increases armor', effects: { speedDown: () => 5, defense: () => 5 } },
  'leather_vest': { sprite: 'berry03purple', name: 'Leather Vest', category: 'item', rarity: 'common', description: 'Increases attack percent', effects: { damagePercent: () => 10 } },
  'oil_jar': { sprite: 'glass01orange', name: 'Oil Jar', category: 'item', rarity: 'uncommon', description: 'Increase burn AOE', effects: { burnRadius: () => 20 } },
  'glove': { sprite: 'berry04red', name: 'Glove', category: 'item', rarity: 'common', description: 'Increases weapon size', effects: { weaponSize: () => 0.1 } },
  'rock_bag': { sprite: 'gem03yellow', name: 'Rock Bag', category: 'item', rarity: 'common', description: 'Increases attack speed', effects: { attackSpeed: () => 10 } },
  'magic_book': { sprite: 'gem04purple', name: 'Magic Book', category: 'item', rarity: 'rare', description: 'Increase debuffs given to enemies', effects: { debuffPower: () => 1 } },
  'wizard_robe': { sprite: 'gem05red', name: 'Wizard Robe', category: 'item', rarity: 'rare', description: 'Increases explosion radius', effects: { explosionRadius: () => 20 } },
  'seeds': { sprite: 'berry01blue', name: 'Seeds', category: 'item', rarity: 'common', description: 'Increases poison damage', effects: { poisonDamage: () => 5 } },
  'health_vile': { sprite: 'glass02blue', name: 'Health Vile', category: 'item', rarity: 'common', description: 'Increases healing per second', effects: { regeneration: () => 3 } }
};

export const ENHANCED_ITEM_TYPES = {
  'blueshroom': {
    sprite: 'blueshroom',
    name: 'Blue Mushroom',
    category: 'consumable',
    rarity: 'common',
    description: 'Mysterious fungus with healing properties',
    effects: {
      health: () => Math.floor(25 + Math.random() * 20),
      regeneration: () => Math.floor(1 + Math.random() * 2),
    }
  },
  'bongo': {
    sprite: 'bongo',
    name: 'Battle Bongo',
    category: 'artifact',
    rarity: 'uncommon',
    description: 'Rhythmic drums that boost combat performance',
    effects: {
      attackSpeed: () => Math.floor(15 + Math.random() * 20),
      speed: () => Math.floor(8 + Math.random() * 12),
    }
  },
  'clock': {
    sprite: 'clock',
    name: 'Time Keeper',
    category: 'artifact',
    rarity: 'rare',
    description: 'Ancient timepiece that manipulates temporal flow',
    effects: {
      attackSpeed: () => Math.floor(20 + Math.random() * 25),
      dodgeChance: () => Math.floor(8 + Math.random() * 15),
    }
  },
  'crown': {
    sprite: 'crown',
    name: 'Royal Crown',
    category: 'artifact',
    rarity: 'epic',
    description: 'Majestic headpiece that enhances all abilities',
    effects: {
      maxHealth: () => Math.floor(30 + Math.random() * 40),
      damage: () => Math.floor(8 + Math.random() * 15),
      speed: () => Math.floor(10 + Math.random() * 15),
    }
  },
  'diamond': {
    sprite: 'diamond',
    name: 'Perfect Diamond',
    category: 'gem',
    rarity: 'legendary',
    description: 'Flawless crystal that amplifies inner power',
    effects: {
      critChance: () => Math.floor(15 + Math.random() * 20),
      critDamage: () => Math.floor(25 + Math.random() * 35),
      damage: () => Math.floor(12 + Math.random() * 20),
    }
  },
  'goldencup': {
    sprite: 'goldencup',
    name: 'Golden Chalice',
    category: 'artifact',
    rarity: 'epic',
    description: 'Sacred vessel that overflows with life energy',
    effects: {
      maxHealth: () => Math.floor(50 + Math.random() * 50),
      regeneration: () => Math.floor(3 + Math.random() * 5),
      health: () => Math.floor(60 + Math.random() * 80),
    }
  },
  'lantern': {
    sprite: 'lantern',
    name: 'Guiding Lantern',
    category: 'tool',
    rarity: 'uncommon',
    description: 'Illuminating beacon that reveals hidden potential',
    effects: {
      speed: () => Math.floor(12 + Math.random() * 18),
      dodgeChance: () => Math.floor(5 + Math.random() * 10),
      defense: () => Math.floor(3 + Math.random() * 7),
    }
  }
};
