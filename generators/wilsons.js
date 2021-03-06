"use strict";


/**
 * Wilson's Algorithm
 *
 * Carves a maze by selecting a random cell and marking it part of the maze, then
 * choosing another random cell outside of the maze and creating a loopless
 * random walk path which will eventually encounter a part of the maze, 
 * at which point the path is added to the maze and another non-maze cell is 
 * selected at random.
 */
const Wilsons = function () {};

Wilsons.prototype.carve = function (maze, animStates) {
  const grid = maze.getFlattened(); 

  // Randomly select an unvisited cell from the grid and mark it part of the maze
  let cell = randPop(grid);
  cell.visited = true;
  
  // Add this cell to the animation queue
  if (animStates) { animStates.push(cell.clone()); }

  // Keep going while there are unvisited cells
  while (grid.length) {

    // Pick a random cell not yet in the maze and begin new path
    cell = randPop(grid);
    const path = [cell];

    // Perform a loop-erased random walk until a cell in the maze is encountered
    let walking = true;

    while (walking) {
    
      // Add this cell to the animation queue
      if (animStates) { animStates.push(cell.clone()); }

      const randNeighbor = cell.getRandNeighbors()[0];

      if (!randNeighbor.visited) {

        // Eliminate loops in the path if necessary
        const idx = path.indexOf(randNeighbor);
        if (idx >= 0) { path.splice(idx); }
        cell = randNeighbor;
      }
      else { // This neighbor is part of the maze; end the walk
        walking = false;
      }

      path.push(randNeighbor);
    }

    // Add path to maze, linking cells, marking them visited, 
    // and removing them from remaining cells grid
    for (let i = 0; i < path.length; i++) {
      if (path[i+1]) {
        path[i].link(path[i+1]);
      }
      path[i].visited = true;
      const idx = grid.indexOf(path[i]);
      if (idx >= 0) { grid.splice(idx, 1); }
    
      // Add this cell to the animation queue
      if (animStates) { animStates.push(path[i]); }
    }
  }

  return animStates;
}; // end carve
