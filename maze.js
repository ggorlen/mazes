"use strict";


/** 
 * Represents a maze
 */
const Maze = function (width, height) {
  this.width = width;
  this.height = height;
  this.grid;
}; // end Maze
  
/** 
 * For each on this grid
 */
Maze.prototype.onGrid = function (callback) {
  for (let i = 0; i < this.grid.length; i++) {
    for (let j = 0; j < this.grid[i].length; j++) {
      callback(this.grid[i][j]);
    }
  }
}; // end onGrid

/**
 * Links all neighboring cells in the maze
 */
Maze.prototype.linkAll = function () {
  this.onGrid(function (e) {
    for (const dir in e.neighbors) {
      e.link(e.neighbors[dir]);
    }
  }.bind(this));
}; // end linkAll

/** 
 * Returns a flattened grid
 */
Maze.prototype.getFlattened = function () {
  let tempGrid = [];

  for (let i = 0; i < this.grid.length; i++) {
    for (let j = 0; j < this.grid[i].length; j++) {
      tempGrid.push(this.grid[i][j]);
    }
  }

  return tempGrid;
}; // end getFlattened

/**
 * Initializes this maze
 */ 
Maze.prototype.init = function () {

  // Make a new 2d maze array of cells
  this.grid = [];

  for (let i = 0; i < this.height; i++) {
    this.grid.push([]);

    for (let j = 0; j < this.width; j++) {
      this.grid[i].push(new Cell(j, i));
    }
  }
  
  // Set neighbors for each cell
  this.onGrid(function (e) {
    e.setNeighbors(this);
  }.bind(this));
}; // end init

/**
 * Unvisits all cells in the maze
 */
Maze.prototype.unvisit = function () {
  this.onGrid(function (e) {
    e.visited = false;
  }.bind(this));
}; // end unvisit

/**
 * Visits all cells in the maze
 */
Maze.prototype.visit = function () {
  this.onGrid(function (e) {
    e.visited = true;
  }.bind(this));
}; // end visit

/**
 * Renders the maze as an HTML table
 */
Maze.prototype.toHTML = function () {
  const res = ["<table>"];

  for (let i = 0; i < this.grid.length; i++) {
    res.push("<tr>");

    for (let j = 0; j < this.grid[i].length; j++) {
      res.push(this.grid[i][j].toHTML());
    }

    res.push("</tr>");
  }

  res.push("</table>");
  return res.join("");
}; // end toHTML

/**
 * Renders the maze to canvas
 */
Maze.prototype.draw = function (ctx, gridSize) {
  for (let i = 0; i < this.grid.length; i++) {
    for (let j = 0; j < this.grid[i].length; j++) {
      this.grid[i][j].draw(ctx, gridSize);
    }
  }
}; // end draw
