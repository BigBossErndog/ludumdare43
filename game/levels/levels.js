function loadLevels() {
	game.load.tilemap("maptest1", "assets/tilemaps/mapTest1.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.image("spritemap2", "assets/spritemaps/Sprite Map 2.png", 32, 32);
}

function makeLevel(mapdata, img) {
	console.log("HI");
	var newmap = game.add.tilemap("maptest1");

	newmap.addTilesetImage("Sprite Map 2", "spritemap2");

	newmap.setCollisionBetween(1, 5);

	var layer = newmap.createLayer("Tile Layer 1");

	layer.resizeWorld();
	//0 - 12

	return newmap;
}
