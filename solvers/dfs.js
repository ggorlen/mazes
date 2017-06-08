/**
 * Depth first search maze solver
 */
DFS = function () {};

/**
 * Find a path through a maze from a start cell to an end cell
 *
 * @param start the starting cell to search from
 * @param end the ending cell to search to 
 * @return array the final path of the search 
 *               or false if no path was found
 */
DFS.prototype.solve = function (start, end) {
  let parents = {};
  let stack = [];
  stack.push(start);

  while (stack.length) {
    let cell = stack[stack.length-1];
    cell.visited = true;
    animStates.push(cell);

    if (cell === end) {
      let path = [];
      while (cell !== start) {
        path.push(cell);
        cell = parents[cell.x + " " + cell.y];
      }
      path.push(cell);
      return path;
    }

    let linked = cell.getLinkedRandNeighbors();
    let pop = true;
    for (let i = 0; i < linked.length && pop; i++) {
      if (linked[i] && !linked[i].visited) {
        parents[linked[i].x + " " + linked[i].y] = cell;
        stack.push(linked[i]);
        pop = false;
      }
    }
    if (pop) stack.pop();
  }
  return false;
}; // end solve
