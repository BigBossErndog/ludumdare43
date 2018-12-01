function loadEnemies() {
	game.load.spritesheet("human", "assets/Head.png", 32, 32);
}

function makeHuman(x, y) {
	var human = game.add.sprite(x, y, "human");
	human.anchor.x = 0.5;
	human.anchor.y = 0.5;
	game.physics.enable(human, Phaser.Physics.ARCADE);

	human.logic = function() {
		this.angle = Math.atan2(player.head.body.y - this.body.y, player.head.body.x - this.body.x) * (180/Math.PI);

		this.body.velocity.x = Math.sin(this.angle);
		this.body.velocity.y = Math.cos(this.angle);
	}

	return human;
}

function makeDefaultEnemy(x, y) {
	var enemy = game.add.sprite(x, y, "defaultEnemy");
	enemy.anchor.x = 0.5;
	enemy.anchor.y = 0.5;

	enemy.logic = function() {
		this.angle = Math.atan2(player.head.body.y - this.body.y, player.head.body.x - this.body.x) * (180/Math.PI);

		this.body.velocity.x = Math.sin(this.angle);
		this.body.velocity.y = Math.cos(this.angle);
	}

	return enemy;
}
