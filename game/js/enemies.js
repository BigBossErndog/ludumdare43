function loadEnemies() {
	game.load.spritesheet("human", "assets/Head.png", 32, 32);
}

function makeHuman(x, y) {
	var human = game.add.sprite(x, y, "human");
	human.anchor.x = 0.5;
	human.anchor.y = 0.5;

	game.physics.enable(human, Phaser.Physics.ARCADE);

	human.body.drag.x = 500;
	human.body.drag.y = 500;
	human.body.maxVelocity.set(100);

	human.logic = function() {
		this.angle = Math.atan2(player.head.body.y - this.body.y, player.head.body.x - this.body.x) * (180/Math.PI);

		this.body.velocity.y += Math.sin(this.angle * (Math.PI/180)) * 20;
		this.body.velocity.x += Math.cos(this.angle * (Math.PI/180)) * 20;
	}

	return human;
}

function makeDefaultEnemy(x, y) {
	var enemy = game.add.sprite(x, y, "human");
	enemy.anchor.x = 0.5;
	enemy.anchor.y = 0.5;

	game.physics.enable(enemy, Phaser.Physics.ARCADE);

	enemy.body.drag.x = 500;
	enemy.body.drag.y = 500;
	enemy.body.maxVelocity.set(100);

	enemy.gun = null;

	enemy.logic = function() {
		this.angle = Math.atan2(player.head.body.y - this.body.y, player.head.body.x - this.body.x) * (180/Math.PI);

		this.body.velocity.y += Math.sin(this.angle * (Math.PI/180)) * 20;
		this.body.velocity.x += Math.cos(this.angle * (Math.PI/180)) * 20;

		if (this.gun != null) {
			this.gun.fire();
		}
	}

	return enemy;
}
