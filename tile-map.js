game.module(
  'plugins.tile-map'
)
.require(
  'engine.renderer'
)
.body(function() { 'use strict';

  function TileMap(tileset, width, height, data) {
    this.tileWidth = width || 16;
    this.tileHeight = height || 16;
    this.data = data || [];
    this.tiles = this.genTiles(tileset);

    game.ParticleContainer.call(this);

    this.instanceMap();
  }
  TileMap.prototype = Object.create(game.ParticleContainer.prototype);
  TileMap.prototype.constructor = game.ParticleContainer;

  TileMap.prototype.genTiles = function(id) {
    var tiles = TileMap.tilesets[id];
    if (tiles) {
      return tiles;
    }
    else {
      tiles = [0];

      var texture = game.Texture.fromAsset(id);
      var baseTexture = texture.baseTexture;

      var width = texture.width;
      var height = texture.height;

      var columns = Math.floor(width / this.tileWidth);
      var rows = Math.floor(height / this.tileHeight);

      for (var r = 0; r < rows; r++) {
        for (var q = 0; q < columns; q++) {
          tiles.push(new game.Texture(baseTexture, new game.HitRectangle(q * this.tileWidth, r * this.tileHeight, this.tileWidth, this.tileHeight)));
        }
      }

      TileMap.tilesets[id] = tiles;

      return tiles;
    }
  };

  TileMap.prototype.instanceMap = function() {
    var idx;
    for (var r = 0, rLen = this.data.length; r < rLen; r++) {
      for (var q = 0, qLen = this.data[r].length; q < qLen; q++) {
        idx = this.data[r][q];
        if (idx !== 0) {
          this.addChild(new game.Sprite(this.tiles[idx], q * this.tileWidth, r * this.tileHeight));
        }
      }
    }
  };

  TileMap.tilesets = {};

  game.TileMap = TileMap;

});
