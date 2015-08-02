/**
 * TileMap plugin for LesserPanda
 * @version 0.1.0
 * @author Sean Bohan
 */
game.module(
  'plugins.tile-map'
)
.require(
  'engine.renderer'
)
.body(function() { 'use strict';

  /**
   * TileMap
   * @constructor
   * @param {String} tileset        TileSet texture id for this map
   * @param {Number} tileWidth      Width of a single tile in pixels
   * @param {Number} tileHeight     Height of a single tile in pixels
   * @param {Number[Number[]]} data 2D Array which defines the map
   */
  function TileMap(tileset, tileWidth, tileHeight, data) {
    /**
     * Width of each tile
     * @type {Number}
     * @default 16
     */
    this.tileWidth = tileWidth || 16;
    /**
     * Height of each tile
     * @type {Number}
     * @default 16
     */
    this.tileHeight = tileHeight || 16;
    /**
     * 2D array defines the map
     * @type {Number[Number[]]}
     */
    this.data = data || [[]];
    /**
     * Array of textures for each tile
     * @type {game.Texture[]}
     */
    this.tiles = null;
    this.tileInstances = [[]];

    game.ParticleContainer.call(this);

    this._genTiles(tileset);
    this._instanceMap();
  }
  TileMap.prototype = Object.create(game.ParticleContainer.prototype);
  TileMap.prototype.constructor = game.ParticleContainer;

  /**
   * Map width in tiles
   * @readOnly
   */
  Object.defineProperty(TileMap.prototype, 'widthInTile', {
    get: function() {
      return this.data.length;
    }
  });
  /**
   * Map height in tiles
   * @readOnly
   */
  Object.defineProperty(TileMap.prototype, 'heightInTile', {
    get: function() {
      return this.data[0].length;
    }
  });

  /**
   * Get the tile id at a specific position (in tile)
   * @param  {Number} row
   * @param  {Number} column
   * @return {Number} Tile id at that position, 0 if out of the map
   */
  TileMap.prototype.getTile = function(row, column) {
    if (column < 0 || column >= this.widthInTile) {
      return 0;
    }
    if (row < 0 || row >= this.heightInTile) {
      return 0;
    }
    return this.data[row][column];
  };

  /**
   * Get the tile id at a specific position (in pixel)
   * @param  {Number} x
   * @param  {Number} y
   * @return {Number} Tile id at that position, 0 if out of the map
   */
  TileMap.prototype.getTilePx = function(x, y) {
    if (x < 0 || x > this.tileWidth * this.widthInTile) {
      return 0;
    }
    if (y < 0 || y > this.tileHeight * this.heightInTile) {
      return 0;
    }
    return this.data[Math.floor(y / this.tileWidth)][Math.floor(x / this.tileHeight)];
  };

  /**
   * Set the tile at (row, col)
   * @param  {Number} r  Tile at which row
   * @param  {Number} q  Tile at which column
   * @param  {Number} id Tile id to set
   */
  TileMap.prototype.setTile = function(r, q, id) {
    this.data[r][q] = id;
    var tile = this.tileInstances[r][q];

    if (id === 0 && tile) {
      tile.visible = false;
      return;
    }

    if (id >= this.tiles.length) {
      return;
    }

    if (tile) {
      tile.texture = this.tiles[id];
      tile.visible = true;
    }
    else {
      tile = new game.Sprite(this.tiles[id], q * this.tileWidth, r * this.tileHeight);
      this.tileInstances[r][q] = tile;
    }
  };

  /**
   * Set the tile id at a specific position (in pixel)
   * @param  {Number} x
   * @param  {Number} y
   * @param  {Number} id Tile id to set
   */
  TileMap.prototype.setTilePx = function(x, y, id) {
    if (x < 0 || x > this.tileWidth * this.widthInTile) {
      return;
    }
    if (y < 0 || y > this.tileHeight * this.heightInTile) {
      return;
    }
    this.setTile(Math.floor(y / this.tileWidth), Math.floor(x / this.tileHeight), id);
  };

  /**
   * Set a new tileset
   */
  TileMap.prototype.setTileSet = function(tileset) {
    this._genTiles(tileset);

    var r, q, rows, cols;
    var tile, id;
    for (r = 0, rows = this.data.length; r < rows; r++) {
      for (q = 0, cols = this.data[0].length; q < cols; q++) {
        tile = this.tileInstances[r][q];
        id = this.data[r][q];
        if (tile && id) {
          tile.texture = this.tiles[id];
        }
      }
    }
  };

  /**
   * Generate textures for each tile
   * @private
   * @param  {String} id TileSet texture
   */
  TileMap.prototype._genTiles = function(id) {
    var tiles = TileMap.tilesets[id];

    if (tiles) {
      this.tiles = tiles;
    }

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

    this.tiles = tiles;
  };

  /**
   * Create tile instances and add them for displaying
   * @private
   */
  TileMap.prototype._instanceMap = function() {
    var idx, row, tile;
    this.tileInstances.length = 0;
    for (var r = 0, rLen = this.widthInTile; r < rLen; r++) {
      row = [];
      this.tileInstances.push(row);
      for (var q = 0, qLen = this.heightInTile; q < qLen; q++) {
        tile = 0;
        idx = this.data[r][q];
        if (idx !== 0) {
          tile = new game.Sprite(this.tiles[idx], q * this.tileWidth, r * this.tileHeight);
          this.addChild(tile);
        }
        row.push(tile);
      }
    }
  };

  /**
   * "TileSet name -> TileSet textures" map
   * @type {Object}
   */
  TileMap.tilesets = {};

  game.TileMap = TileMap;

});
