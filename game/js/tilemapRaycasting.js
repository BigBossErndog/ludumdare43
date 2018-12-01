Phaser.TilemapLayer.prototype.getRayCastTiles_custom =function(line, stepRate, collides, interestingFace) {

    if (!stepRate) { stepRate = this.rayStepRate; }
    if (collides === undefined) { collides = false; }
    if (interestingFace === undefined) { interestingFace = false; }

    //  First get all tiles that touch the bounds of the line
    var tiles = this.getTiles(line.x, line.y, line.width, line.height, collides, interestingFace);

    if (tiles.length === 0)
    {
        return [];
    }

    //  Now we only want the tiles that intersect with the points on this line
    var coords = line.coordinatesOnLine(stepRate);
    var results = [];

    for (var i = 0; i < tiles.length; i++)
    {
        for (var t = 0; t < coords.length; t++)
        {
            var tile = tiles[i];
            var coord = coords[t];
            if (tile.containsPoint(coord[0], coord[1]))
            {
                results.push(tile);
                break;
            }
        }
    }

    return results;

}
