function loadLevels() {
	game.load.tilemap("maptest1", "assets/tilemaps/mapTest1.json", null, Phaser.Tilemap.TILED_JSON);
	game.load.image("spritemap2", "assets/spritemaps/Sprite Map 2.png", 32, 32);
}

function makeLevel(mapdata, img) {
	var newmap = game.add.tilemap("maptest1");

	newmap.addTilesetImage("Sprite Map 2", "spritemap2");

	var floorLayer = newmap.createLayer("Floor");
	var wallLayer = newmap.createLayer("Walls");

	newmap.setCollisionBetween(0, 11, true, wallLayer);

	newmap.floorLayer = floorLayer;
	newmap.wallLayer = wallLayer;

	floorLayer.resizeWorld();
	wallLayer.resizeWorld();
	//0 - 12

	return newmap;
}
