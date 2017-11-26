"use strict";


/* Todo:
 *
 * add djikstra's, solver with various algorithms such as recursive backtracker
 * https://en.wikipedia.org/wiki/Maze_solving_algorithm
 *
 * animate algorithm help:
 * http://stackoverflow.com/questions/17719662/animating-a-recursive-backtracking-algorithm-in-javascript
 * http://stackoverflow.com/questions/29588816/animate-javascript-canvas-while-in-recursive-calculation
 *
 * CSS border problems:
 * http://stackoverflow.com/questions/1339084/css-issue-on-firefox-border-not-show-correctly
 * http://stackoverflow.com/questions/5894642/how-to-fix-this-white-dot-border-issue-in-a-drop-down-menu
 */

"use strict";


(function () {
  //let canvas;
  //let ctx;
  let animationSpeed;
  let animStates;
  let maze;
  let interval;
  const solveBtn = document.getElementById("btn-solve");
  const generateBtn = document.getElementById("btn-generate");
  const mazeForm = document.getElementById("mazeform");
  const mazeOut = document.getElementById("mazeout");

  // Add event listeners on form and button elements
  solveBtn.addEventListener("click", solve);
  generateBtn.addEventListener("click", generate);
  mazeForm.addEventListener("submit", function (e) { e.preventDefault(); });
  
  // Processes the user's form submission to generate a maze
  function generate() {
  
    // Disable "solve" button
    solveBtn.disabled = true;
    
    // Clear previous interval if active
    clearInterval(interval);
  
    // Grab canvas and context from DOM
    //canvas = document.getElementById("mazecanvas");
    //ctx = canvas.getContext("2d");
  
    // Collect info from form
    const userForm = document.forms["mazein"].elements;
    const width = parseInt(userForm["width"].value) || 20;
    const height = parseInt(userForm["height"].value) || 20;
    const grid = userForm["gridsize"].value || 10;
    const animate = userForm["animate"].checked;
    const algorithm = userForm["algorithm"].selectedIndex;
    
    // Create animation vars
    animationSpeed = 40;
    animStates = [];
    
    // Create a maze object and carve it with the selected algorithm
    maze = new Maze(width, height);
    maze.init();
    mazeOut.innerHTML = maze.toHTML();
  
    if (algorithm === 0) {
      animStates = new Backtracker().carve(maze, []);
    }
    else if (algorithm === 1) {
      animStates = new Prims().carve(maze, []);
    }
    else if (algorithm === 2) {
      animStates = new BinaryTree().carve(maze, []);
    }
    else if (algorithm === 3) {
      animStates = new AldousBroder().carve(maze, []);
    }
    else if (algorithm === 4) {
      animStates = new Wilsons().carve(maze, []);
    }
    else if (algorithm === 5) {
      animStates = new Sidewinder().carve(maze, []);
    }
    else if (algorithm === 6) {
      animStates = new HuntAndKill().carve(maze, []);
    }
    else if (algorithm === 7) {
      animStates = new Divider().carve(maze, []);
    }
    else { throw "Invalid algorithm selection"; }
  
    // Create a cylindrical maze
    // aluminum can : 50x115 grid: 8 .. 13in x 5.75in in gimp (?)
    //for (let i = 0; i < height; i++) {
    //  maze.grid[i][width - 1].neighbors[2] = maze.grid[i][0];
    //  maze.grid[i][0].neighbors[3] = maze.grid[i][width - 1];
    //}
    
    // Add entrance and exit
    maze.grid[0][0].links.n = true;
    maze.grid[maze.height - 1][maze.width - 1].links.s = true;
    
    // Display maze, either as an animation or directly
    if (animate && animStates.length) {
      let cell;
      let cellClass;

      interval = setInterval(function () {
        if (animStates.length) {
          if (cell) {
            document.getElementById(cellClass).className = cell.getClass();
          }

          cell = animStates.shift();
          cellClass = "cell_" + cell.y + "_" + cell.x;
          document.getElementById(cellClass).className = 
            cell.getClass() + " gridactive";
        }
        else {
          clearInterval(interval);
          document.getElementById(cellClass).className = cell.getClass();
          solveBtn.disabled = false;
        }
      }, animationSpeed);
    }
    else {
      mazeOut.innerHTML = maze.toHTML();
      solveBtn.disabled = false;
    }
    
    // Set the grid's CSS properties
    setCSSOnClass("grid", ["width", "height"], grid + "px");
  } // end Process
  
  
  // Handler for the solve button
  function solve() {
    if (!maze) { return false; }

    const userForm = document.forms["mazein"].elements;
    const animate = userForm["animate"].checked;
    solveBtn.disabled = true;
    clearPath(maze.getFlattened());
  
    maze.unvisit();
    const res = new DFS().solve(
      maze.grid[0][0], maze.grid[maze.grid.length-1][maze.grid[0].length-1]
    );
    const soln = res.path;
    const animStates = res.animation;
    maze.visit();

    // Display maze, either as an animation or directly
    if (soln && animate && animStates.length) {
      let cell;
      let cellClass;
  
      interval = setInterval(function () {
        if (animStates.length) {
          if (cell) {
            document.getElementById(cellClass).className = cell.getClass();
          }

          cell = animStates.shift();
          cellClass = "cell_" + cell.y + "_" + cell.x;
          document.getElementById(cellClass).className = 
            cell.getClass() + " gridactive";
        }
        else {
          clearInterval(interval);
          document.getElementById(cellClass).className = cell.getClass();
          highlightPath(soln);
          solveBtn.disabled = false;
        }
      }, animationSpeed);
    }
    else if (soln) {
      highlightPath(soln);
      solveBtn.disabled = false;
    }
    
  } // end solve
  
  
  // Sets CSS highlighting for a path array of cells
  function highlightPath(path) {
    path.forEach(function (cell) {
      let cellClass = "cell_" + cell.y + "_" + cell.x;
      document.getElementById(cellClass).className = cell.getClass() + " gridactive";
    });
  } // end highlightPath
  
  
  // Removes CSS highlighting for a path array of cells
  function clearPath(path) {
    path.forEach(function (cell) {
      let cellClass = "cell_" + cell.y + "_" + cell.x;
      document.getElementById(cellClass).className = cell.getClass();
    });
  } // end clearPath
  
  
  // Sets CSS style properties on all elements matching a class
  function setCSSOnClass(cls, props, setting) {
    const elems = document.getElementsByClassName(cls);
  
    for (let i = 0; i < elems.length; i++) {
      props.forEach(function (e) {
        elems[i].style[e] = setting;
      });
    }
  } // end setCSSOnClass
})();
