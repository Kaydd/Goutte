function PlayState() {
  var player
  var blocks
  var viewport
  var tile_map
  this.columns = []

  /* Called once when a game state is activated. Use it for one-time setup code. */
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
    // var world = new jaws.Rect(0,0,600,640*lines)
    var world = new jaws.Rect(0,0,300,320*3)

    /* We create some 64x64 blocks and save them in array blocks */
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

    player = new jaws.Sprite({x:177, y:50, scale: 2, anchor: "center_bottom"})
    columnIndex = 1
    columns = this.columns

    window.player= player

    // There are 3 columns, findable in @columns
    player.changeColumn= function(direction) {
      columnIndex += (direction == 'left') ? -1 : 1;
      if(columnIndex > 2) {return columnIndex = 2}
      if(columnIndex < 0) {return columnIndex = 0}
      player.x = columns[columnIndex].x + 77;
    }

    player.move = function() {
      // this.x += this.vx
      // if(tile_map.atRect(player.rect()).length > 0) { 
      //   this.x -= this.vx 
      // }
      // this.vx = 0



      this.y += this.vy
      var block = tile_map.atRect(player.rect())[0]
      if(block) { 
        // Heading downwards
        if(this.vy > 0) { 
          this.y = block.rect().y - 1
        }
        this.vy = 0
      }
    }

    var anim = new jaws.Animation({sprite_sheet: "images/droid_11x15.png", frame_size: [11,15], frame_duration: 100})
    player.anim_default = anim.slice(0,5)
    player.anim_up = anim.slice(6,8)
    player.anim_down = anim.slice(8,10)
    player.anim_left = anim.slice(10,12)
    player.anim_right = anim.slice(12,14)
    player.vx = player.vy = 0

    player.setImage( player.anim_default.next() )
    jaws.context.mozImageSmoothingEnabled = false;  // non-blurry, blocky retro scaling
    jaws.preventDefaultKeys(["up", "down", "left", "right", "space"])
  }

  /* update() will get called each game tick with your specified FPS. Put game logic here. */
  this.update = function() {
    player.setImage( player.anim_default.next() )

    player.vx = 0
    jaws.on_keyup(['left', 'right'], player.changeColumn)

    // some gravity
    player.vy = 0.8

    // apply vx / vy (x velocity / y velocity), check for collision detection in the process.
    player.move()

    // Tries to center viewport around player.x / player.y.
    // It won't go outside of 0 or outside of our previously specified max_x, max_y values.
    viewport.centerAround(player)
  }

  /* Directly after each update draw() will be called. Put all your on-screen operations here. */
  this.draw = function() {
    jaws.clear()

    // the viewport magic. wrap all draw()-calls inside viewport.apply and it will draw those relative to the viewport.
    viewport.apply( function() {
      blocks.draw()
      player.draw()
    });
  }
}
