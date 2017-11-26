"use strict";


/**
 * Simplified Prim's algorithm
 *
 * http://sebastianthomas.net/prims-algorithm.html
 * http://weblog.jamisbuck.org/2011/1/10/maze-generation-prim-s-algorithm
 * https://en.wikipedia.org/wiki/Maze_generation_algorithm#Randomized_Prim.27s_algorithm
 */
const Prims = function () {};

Prims.prototype.carve = function (maze, animStates) {
  const grid = maze.getFlattened(); 

  // Set of cells left to explore
  const frontier = [];

  // Randomly select an unvisited cell from the grid and mark it part of the maze
  let cell = sample(grid);
  cell.visited = true;

  // Add this cell to the animation queue
  if (animStates) { animStates.push(cell); }

  // Add its neighbors to the frontier
  for (const dir in cell.neighbors) {
    if (cell.neighbors[dir]) {
      frontier.push(cell.neighbors[dir]);
    }
  }

  // Keep going while there are unvisited cells in the frontier
  while (frontier.length) {

    // Remove a random cell from the frontier
    cell = randPop(frontier);

    // Mark this cell as part of the maze
    cell.visited = true;

    // Carve a path between this cell and a random neighbor cell already in the maze
    const randNeighbors = cell.getRandNeighbors();

    for (let i = 0; i < randNeighbors.length; i++) {
      const neighbor = randNeighbors[i];

      if (neighbor && neighbor.visited) {
        cell.link(neighbor);
        break;
      }
    }

    // Add this cell's neighbors to the frontier if they aren't 
    // already a member of the frontier or part of the maze
    for (const dir in cell.neighbors) {
      const neighbor = cell.neighbors[dir];

      if (neighbor && frontier.indexOf(neighbor) < 0 && !neighbor.visited) {
        frontier.push(neighbor);
      }
    }

    // Add this cell to the animation queue
    if (animStates) { animStates.push(cell); }
  }

  return animStates;
}; // end carve
