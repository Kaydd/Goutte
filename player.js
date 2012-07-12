function Player() {
  this.player

  this.initialize = function() {
    player = new jaws.Sprite({x:177, y:50, scale: 2, anchor: "center_bottom"})
    player.vy = 0.8

    var anim = new jaws.Animation({sprite_sheet: "images/droid_11x15.png", frame_size: [11,15], frame_duration: 100})
    player.anim_default = anim.slice(0,5)
    player.anim_up = anim.slice(6,8)
    player.anim_down = anim.slice(8,10)
    player.anim_left = anim.slice(10,12)
    player.anim_right = anim.slice(12,14)
    player.setImage( player.anim_default.next() )
    this.player = player
  }

  this.incrementSpeed = function(value = 0.1) {
    this.player.vx += value
  }

  this.changeColumn = function(direction) {
      columnIndex += (direction == 'left') ? -1 : 1;
      if(columnIndex > 2) {return columnIndex = 2}
      if(columnIndex < 0) {return columnIndex = 0}
      this.player.x = columns[columnIndex].x + 77;
    }  

     // #move only consider vy
  this.move = function() {
    player = this.player
    // Move
    player.y += player.vy

    // Check collision
    // In case of collision, :
    //    If block is feature, then block disapear and player change
    //    If block is obstacle:
    //      If block can be overcome, nothing happened.
    //      If block cannot be overcome, player stop and Game over.
    var block = tile_map.atRect(player.rect())[0]
    if(block) { 
      if(player.vy > 0) { 
        player.y = block.rect().y - 1
      }
    } 
    this.player = player
  }
}