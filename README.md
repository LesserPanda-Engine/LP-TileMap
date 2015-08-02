# TileMap for LesserPanda

A simple tilemap plugin for LesserPanda.

## Sample

```javascript
// Load tilesets
game.addAsset('tiles.png');
game.addAsset('tiles-inv.png');

// Create a tilemap which is a ParticleContainer subclass
var map = new game.TileMap('tiles.png', 16, 16, [
  [2, 1, 1, 1, 1, 1, 3],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [1, 0, 0, 0, 0, 0, 1],
  [4, 1, 1, 1, 1, 1, 5],
  [6, 6, 6, 6, 6, 6, 6]
])
.addTo(this.stage);
map.scale.set(4, 4);

// Set tile at (0, 0) to 7
map.setTile(0, 0, 7);

this.addTimer(1000, function() {
  // Change tileset
  map.setTileSet('tiles-inv.png');
});
```

## ChangeLog

### 0.1.0

- Add 4 tile related methods
- Add method to change tileset after creating

---

The MIT License (MIT)

Copyright (c) 2015 Sean Bohan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
