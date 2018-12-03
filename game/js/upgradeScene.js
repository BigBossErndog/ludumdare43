var upgradeConf = {};
function addUpgradeConf(conf) {
	upgradeConf[conf.name] = conf;
}

addUpgradeConf({
	name: "Optics",
	desc: "See Health, AI, etc.",
	frame:0,
	action:function() {
		player.scannerActive = true;
	}
});
addUpgradeConf({
	name: "Ammo Count",
	desc: "See ammo.",
	frame:1,
	action:function() {
		player.ammoCountActive = true;
	}
});
addUpgradeConf({
	name: "Leg Enhancement",
	desc: "Run faster.",
	frame:2,
	action:function() {
		player.speedActive = true;
	}
});
addUpgradeConf({
	name: "Blink",
	desc: "Teleport a short distance.",
	frame:3,
	action:function() {
		player.blinkActive = true;
	}
});

var upgradeList = ["Optics", "Ammo Count", "Leg Enhancement", "Blink"];
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
		loadDefaults();
	},
	
	create: function() {
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
					this.icons[i][j] = makeUpgradeIcon(50 + i * 50, 50 + j * 50, upgradeConf[upgradeList[j*4 + i]]);
					if (this.icons[i][j] != null) {
						this.iconGroup.add(this.icons[i][j]);
						this.icons[i][j].inputEnabled = true;
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
	},
	
	update: function() {
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
					
					selectedUpgrade = icon;
					
					this.blackBox.alpha = 0.2;
					this.blackBox.x = icon.x;
					this.blackBox.y = icon.y;
				}
			}, this);
			
			this.upgradeDesc.y = this.upgradeName.bottom + 5;
			if (this.getUpgrade.alpha > 0) {
				this.getUpgrade.y = this.upgradeDesc.bottom + 5;
				this.skipUpgrades.y = this.getUpgrade.bottom + 5;
				
				if (this.getUpgrades.input.justPressed(0, 1000)) {
					this.selectedUpgrade.action();
					this.leaving = true;
				}
			}
			
			if (!this.leaving) {
				if (this.skipUpgrades.input.justPressed(0, 1000)) {
					this.leaving = true;
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