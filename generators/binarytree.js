"use strict";


/** 
 * Binary Tree
 *
 * Carves a maze with many dead ends and a north-east bias
 */
const BinaryTree = function () {};

BinaryTree.prototype.carve = function (maze, animStates) {
  const grid = maze.getFlattened();
  
  // Process each cell
  while (grid.length) {
    const cell = grid.shift();
   
    // Add this cell to the animation queue
    if (animStates) { animStates.push(cell); }
  
    // Mark this cell visited
    cell.visited = true;
    
    // Pick a random north or east neighbor and link
    if (cell.neighbors.n && cell.neighbors.e) {
      Math.random() < 0.5 ? cell.link(cell.neighbors.n) :
                            cell.link(cell.neighbors.e);
    }
    // If there's no east neighbor, choose north, and vice versa
    else if (cell.neighbors.n && !cell.neighbors.e) {
      cell.link(cell.neighbors.n);
    }
    else if (cell.neighbors.e && !cell.neighbors.n) {
      cell.link(cell.neighbors.e);
    }
  }

  return animStates;
}; // end carve
