let player;
let cursors;

const config = {
    type: phaser.Auto,
    width: 800,
    height: 600,
    backgroundColor: '#7CFC00',
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};
