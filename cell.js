"use strict";


/** 
 * Represents a maze cell
 */
const Cell = function (x, y) {
  this.x = x;
  this.y = y;
  this.neighbors = {};
  this.links = { n: false, s: false, e: false, w: false };
  this.visited = false;
}; // end Cell class
  
/** 
 * Prepares cell for HTML output
 * @return string HTML tag for this cell
 */
Cell.prototype.toHTML = function () {
  return "<td id='cell_" + this.y + 
    "_" + this.x + "' class='" + 
    this.getClass() + "'></td>";
}; // end toHTML
  
/** 
 * Returns a CSS class representation of this cell
 * @return string of CSS
 */
Cell.prototype.getClass = function () {
  let output = "grid";
  if (this.links.n) { output += " n"; }
  if (this.links.s) { output += " s"; }
  if (this.links.e) { output += " e"; }
  if (this.links.w) { output += " w"; } 
  if (!this.visited) { output += " gridunvisited"; }
  return output;
}; // end getClass
  
/** 
 * Renders cell to a canvas context
 */
Cell.prototype.draw = function (ctx, grid) {
  let x = this.x * grid + 1;
  let y = this.y * grid + 1;
  
  ctx.beginPath();
  ctx.strokeStyle = "#000000";
  ctx.moveTo(x, y);
  
  this.links.n ? ctx.moveTo(x + grid, y) : 
                 ctx.lineTo(x + grid, y);
  this.links.e ? ctx.moveTo(x + grid, y + grid) : 
                 ctx.lineTo(x + grid, y + grid);
  this.links.s ? ctx.moveTo(x, y + grid) : 
                 ctx.lineTo(x, y + grid);
  this.links.w ? ctx.moveTo(x, y) : 
                 ctx.lineTo(x, y);
           
  ctx.closePath();
  ctx.stroke();
}; // end draw

/**
 * Sets the neighbors for this cell
 * @param maze the maze this cell is a member of
 */
Cell.prototype.setNeighbors = function (maze) {        
  const dirs = { 
    w: {x: -1, y: 0}, 
    e: {x: 1, y: 0}, 
    s: {x: 0, y: 1}, 
    n: {x: 0, y: -1}
  };

  keys(dirs).forEach(function (e) { 
    if (this.y + dirs[e].y >= 0 &&
        this.x + dirs[e].x >= 0 &&
        this.y + dirs[e].y < maze.height &&
        this.x + dirs[e].x < maze.width) {
      this.neighbors[e] = maze.grid[this.y + dirs[e].y][this.x + dirs[e].x];
    }
  }.bind(this));
}; // end setNeighbors

/**
 * Links this and parameter cell
 * @param otherCell the cell to link to this
 */
Cell.prototype.link = function (otherCell) {
  if (!otherCell) { return false; }

  // Set this cell's link
  for (const dir in this.neighbors) {
    if (this.neighbors[dir] === otherCell) {
      this.links[dir] = true;

      // Set the other cell's link
      for (const otherDir in otherCell.neighbors) {
        if (this === otherCell.neighbors[otherDir]) {
          otherCell.links[otherDir] = true;
          return true;
        }
      }
    }
  }

  return false;
}; // end link

/**
 * Unlinks this and parameter cell
 * @param otherCell the cell to unlink
 */
Cell.prototype.unlink = function (otherCell) {
  if (!otherCell) { return false; }

  // Set this cell's link
  for (const dir in this.neighbors) {
    if (this.neighbors[dir] === otherCell) {
      this.links[dir] = false;

      // Set the other cell's link
      for (const otherDir in otherCell.neighbors) {
        if (this === otherCell.neighbors[otherDir]) {
          otherCell.links[otherDir] = false;
          return true;
        }
      }
    }
  }

  return false;
}; // end unlink

/**
 * Returns an array of random neighbors or undefined if no neighbors
 * @return array of random neighbors
 */ 
Cell.prototype.getRandNeighbors = function () {
  return shuffle(values(this.neighbors));
}; // end getRandNeighbors

/**
 * Returns an array of linked neighbors or undefined if no neighbors
 * @return array of linked neighbors
 */ 
Cell.prototype.getLinkedNeighbors = function () {
  const dirs = keys(this.neighbors);
  const linkedNeighbors = [];

  for (let i = 0; i < dirs.length; i++) { 
    if (this.links[dirs[i]]) {
      linkedNeighbors.push(this.neighbors[dirs[i]]);
    }
  }

  return linkedNeighbors;
}; // end getLinkedNeighbors

/**
 * Creates a copy of this cell
 * @return the copy cell
 */
Cell.prototype.clone = function () {
  const cell = new Cell(); 
  cell.x = this.x;
  cell.y = this.y;

  // Avoid circular references in copy of neighbors object
  cell.neighbors = {};

  for (const direction in this.neighbors) {
    cell.neighbors[direction] = this.neighbors[direction]; 
  }

  cell.links = JSON.parse(JSON.stringify(this.links));
  cell.visited = this.visited;
  return cell;
}; // end clone
