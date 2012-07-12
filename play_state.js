function PlayState() {
  var player
  var blocks
  var viewport
  var tile_map
  this.columns = []

  this.setup = function() {
    this.columns = [{
      x: 0,
      blocks: [
        {y: 100, type: 'fire'},
        {y: 300, type: 'fire'},
        {y: 400, type: 'fire'},
        {y: 500, type: 'fire'},
      ]
    }, {
      x: 100,
      blocks: [
        {y: 150, type: 'branch'},
        {y: 250, type: 'branch'},
        {y: 450, type: 'branch'},
        {y: 550, type: 'branch'},
      ]
    }, {
      x: 200,
      blocks: [
        {y: 100, type: 'leaf'},
        {y: 200, type: 'leaf'},
        {y: 300, type: 'leaf'},
        {y: 500, type: 'leaf'},
      ]
    }]

    blocks = new jaws.SpriteList()
    var world = new jaws.Rect(0,0,300,320*3)

    // We will create block according to columns.block data
    for(var columnIndex = 0; columnIndex < 3; columnIndex++) { 
      column = this.columns[columnIndex]
      x = 45 + column.x
      for (var i=0; i < column.blocks.length; i++) {
        block = column.blocks[i]
        blocks.push( new Sprite({image: "images/" + block.type + ".png", x: x, y: block.y}) )
      }
    }


    // A tile map, each cell is 64x64 pixels. There's 100 such cells across and 100 downwards.
    // Fit all items in array blocks into correct cells in the tilemap
    // Later on we can look them up really fast (see player.move)
    tile_map = new jaws.TileMap({size: [100,100], cell_size: [64,64]})
    tile_map.push(blocks)

    viewport = new jaws.Viewport({max_x: world.width, max_y: world.height})

    columnIndex = 1
    columns = this.columns
    }

    playerO = (new Player).initialize()

    jaws.context.mozImageSmoothingEnabled = false;  // non-blurry, blocky retro scaling
    jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])
  }

  this.update = function() {
    player.setImage( player.anim_default.next() )
    jaws.on_keyup(['left', 'right'], player.changeColumn)

    // apply vx / vy (x velocity / y velocity), check for collision detection in the process.
    player.move()

    // Tries to center viewport around player.x / player.y.
    // It won't go outside of 0 or outside of our previously specified max_x, max_y values.
    viewport.centerAround(player)
  }

  this.draw = function() {
    jaws.clear()
    viewport.apply( function() {
      blocks.draw()
      playerO.player.draw()
    });
  }
}
