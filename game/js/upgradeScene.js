class UpgradesEquipped {
	constructor() {
		this.scannerActive = false;
        this.ammoCountActive = false;
        this.speedActive = false;
        this.blinkActive = false;
		this.blinkRunning = false;
		this.lastBlink = 0;
        this.bulletBombActive = false;
        this.superPunchActive = false;
		this.equipped = [];
		this.inhumanity = 0;
	}

	get(up) {
		this.equipped.push(up);
	}

	has(up) {
		for (var i = 0; i < this.equipped.length; i++) {
			if (this.equipped[i] == up) {
				return true;
			}
		}
		return false;
	}
}
var upgrades = new UpgradesEquipped();

var upgradeConf = {};
function addUpgradeConf(conf) {
	upgradeConf[conf.name] = conf;
}

addUpgradeConf({
	name: "Optics",
	desc: "See information about people.",
	frame:0,
	action:function() {
		upgrades.scannerActive = true;
		upgrades.inhumanity += 6;
	}
});
addUpgradeConf({
	name: "Ammo Count",
	desc: "See ammo.",
	frame:1,
	action:function() {
		upgrades.ammoCountActive = true;
		upgrades.inhumanity += 3;
	}
});
addUpgradeConf({
	name: "Leg Enhancement",
	desc: "Run faster.",
	frame:2,
	action:function() {
		upgrades.speedActive = true;
		upgrades.inhumanity += 10;
	}
});
addUpgradeConf({
	name: "Blink",
	desc: "Teleport a short distance.",
	frame:3,
	action:function() {
		upgrades.blinkActive = true;
		upgrades.inhumanity += 20;
	}
});
addUpgradeConf({
	name: "Punch of Death",
	desc: "Punches instantly kill.",
	frame:4,
	action:function() {
		upgrades.superPunchActive = true;
		meleeDamage = 1000;
		upgrades.inhumanity += 20;
	}
});
addUpgradeConf({
	name: "Bullet Explosion",
	desc: "Powerful bullets are fired in every direction.",
	frame:6,
	action:function() {
		upgrades.bulletBombActive = true;
		upgrades.bulletBomb = null;
		meleeDamage = 1000;
		upgrades.inhumanity += 15;
	}
});

var upgradeList = ["Optics", "Ammo Count", "Leg Enhancement", "Blink", "Punch of Death", "Bullet Explosion"];
var selectedUpgrade;

function makeUpgradeIcon(x, y, conf) {
	if (conf == null || conf == undefined) return null;
	var u = game.add.sprite(x, y, "upgradeIcons");
	u.conf = conf;

	u.animations.frame = conf.frame;

	return u;
}

var UpgradeScene = {
	preload: function() {
		game.load.image("upgradesBG", "assets/upgradesBG.png");
		loadDefaults();
	},

	create: function() {
		this.upgradesBG = game.add.sprite(0, 0, "upgradesBG");
		this.upgradesBG.fixedToCamera = true;
		this.upgradesBG.alpha = 0.05;

		this.justStarted = true;
		this.leaving = false;

		game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
		game.renderer.renderSession.roundPixels = true;
		Phaser.Canvas.setImageRenderingCrisp(this.game.canvas);
		game.stage.backgroundColor = '#04434c';

		this.blackBox = game.add.image(50, 50, "blackBox");
		this.blackBox.alpha = 0;

		this.iconGroup = game.add.group();

		this.icons = [];
		for (var i = 0; i < 4; i++) {
			this.icons[i] = [];
			for (var j = 0; j < 3; j++) {
				if (j*4 + i < upgradeList.length) {
					var newicon = makeUpgradeIcon(50 + i * 50, 50 + j * 50, upgradeConf[upgradeList[j*4 + i]]);
					this.icons[i][j] = newicon;
					if (newicon != null) {
						this.iconGroup.add(newicon);
						newicon.inputEnabled = true;

						if (upgrades.has(newicon.conf.name)) {
							newicon.alpha = 0.3;
						}
					}
				}
			}
		}

		var txtstyle = { font: "18px Courier", stroke: '#000000', strokeThickness: 0, fill: "#fff", tabs: 10, wordWrap:true, wordWrapWidth:100 };
		this.upgradeName = game.add.text(250, 50, "", txtstyle);

		var txtstyle = { font: "12px Courier", stroke: '#000000', strokeThickness: 0, fill: "#fff", tabs: 10, wordWrap:true, wordWrapWidth:100 };
		this.upgradeDesc = game.add.text(250, 100, "", txtstyle);

		this.getUpgrade = game.add.image(250, 50, "getUpgrade");
		this.getUpgrade.alpha = 0;
		this.getUpgrade.inputEnabled = true;
		this.skipUpgrades = game.add.image(250, 50, "skipUpgrade");
		this.skipUpgrades.inputEnabled = true;

		targeter = game.add.sprite(100, 100, 'reticle');

		targeter.anchor.x = 0.5;
		targeter.anchor.y = 0.5;
		targeter.fixedToCamera = true;

		this.selectedUpgrade = null;
	},

	update: function() {
		this.upgradesBG.cameraOffset.x -= 1;
		this.upgradesBG.cameraOffset.x = this.upgradesBG.cameraOffset.x % 80;

		if (this.justStarted) {
			if (blackScreen == null || blackScreen == undefined) {
				blackScreen = game.add.image(0, 0, "blackScreen");
				blackScreen.alpha = 1;
			}
			else {
				if (blackScreen.alpha > 0) {
					blackScreen.alpha -= 0.02;
				}
				else {
					blackScreen = null;
					this.justStarted = false;
				}
			}
		}

		if (!this.leaving) {
			this.iconGroup.forEachExists(function(icon) {
				if (icon.input.justPressed(0, 1000)) {
					this.upgradeName.text = icon.conf.name;
					this.upgradeDesc.text = icon.conf.desc;

					this.getUpgrade.alpha = 1;

					this.selectedUpgrade = icon;

					this.blackBox.alpha = 0.2;
					this.blackBox.x = icon.x;
					this.blackBox.y = icon.y;

					if (upgrades.has(this.selectedUpgrade.conf.name)) {
						this.getUpgrade.alpha = 0.3;
					}
				}
			}, this);

			this.upgradeDesc.y = this.upgradeName.bottom + 5;
			if (this.getUpgrade.alpha > 0) {
				this.getUpgrade.y = this.upgradeDesc.bottom + 5;
				this.skipUpgrades.y = this.getUpgrade.bottom + 5;

				if (!upgrades.has(this.selectedUpgrade.conf.name) && this.getUpgrade.input.justPressed(0, 1000)) {
					this.selectedUpgrade.conf.action();
					this.selectedUpgrade.alpha = 0.5;
					upgrades.get(this.selectedUpgrade.conf.name);
					this.getUpgrade.alpha = 0.3;
					this.leaving = true;
				}
			}

			if (!this.leaving) {
				if (this.skipUpgrades.input.justPressed(0, 1000)) {
					this.leaving = true;
					this.skipUpgrades.alpha = 0.3;
				}
			}
		}
		else {
			if (blackScreen == null || blackScreen == undefined) {
				blackScreen = game.add.image(0, 0, "blackScreen");
				blackScreen.alpha = 0;
			}
			else {
				if (blackScreen.alpha < 1) {
					blackScreen.alpha += 0.01;
				}
				else {
					blackScreen = null;
					game.stage.backgroundColor = "#000000";
					game.state.start(nextLevel, true, false);
				}
			}
		}

		targeter.cameraOffset.x = game.input.activePointer.x;
		targeter.cameraOffset.y = game.input.activePointer.y;
		targeter.angle += 10;

		//game.state.start(nextLevel, true, false);
	}
}
