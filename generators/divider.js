"use strict";


/**
 * Divider
 *
 * Marks the entire maze as one room, then divides the room in half 
 * and adds a link at a random point along that wall. Process repeats on 
 * both halves until no further subdivisions are possible or a specified 
 * limit is hit.
 */
const Divider = function () {};

Divider.prototype.carve = function (maze, animStates, limit) {
  if (!limit || limit <= 0) { limit = 1; }

  this.animStates = animStates;
  // Add this cell to the animation queue
  //if (this.animStates) { this.animStates.push(cell); }

  maze.linkAll();
  maze.visit();

  if (Math.random() < 0.5) {
    this.cutVertically(
      maze.grid, 0, 0, maze.grid[0].length, maze.grid.length, limit
    );
  }
  else {
    this.cutHorizontally(
      maze.grid, 0, 0, maze.grid[0].length, maze.grid.length, limit
    );
  }

  return [];
}; // end carve

Divider.prototype.cut = function (grid, x, y, width, height, limit) {
  if (width > limit && height > limit) {
    width > height ? this.cutVertically(grid, x, y, width, height, limit):
                     this.cutHorizontally(grid, x, y, width, height, limit);
  }  
}; // end cut

Divider.prototype.cutHorizontally = function (grid, x, y, width, height, limit) {
  const row = Math.random() * (height - 1) | 0;
  const gap = Math.random() * width | 0;

  for (let i = 0; i < width; i++) {
    if (i !== gap) {
      grid[x+row][y+i].unlink(grid[x+row][y+i].neighbors.s);
    }
  }
  
  this.cut(grid, x, y, width, row + 1, limit);
  this.cut(grid, x + row + 1, y, width, height - row - 1, limit);
}; // end cutVertically

Divider.prototype.cutVertically = function (grid, x, y, width, height, limit) {
  const col = Math.random() * (width - 1) | 0;
  const gap = Math.random() * height | 0;

  for (let i = 0; i < height; i++) {
    if (i !== gap) {
      grid[x+i][y+col].unlink(grid[x+i][y+col].neighbors.e);
    }
  }

  this.cut(grid, x, y, col + 1, height, limit);
  this.cut(grid, x, y + col + 1, width - col - 1, height, limit);
}; // end cutHorizontally
