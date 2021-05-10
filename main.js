const root = document.documentElement;
var size = 0;
var table = [];
var rowsArray = [];
var full = [];
var rows = parseInt(getComputedStyle(root).getPropertyValue("--var--rows"));
var cols = parseInt(getComputedStyle(root).getPropertyValue("--var--cols"));

let permitted = true;
let turn = true;
let difficulty = 0;

const preferencias = document.getElementById("preferencias");
const juego = document.getElementById("juego");
const formulario = document.getElementById("formulario");

formulario.addEventListener("submit", (e) => {
  e.preventDefault();
});

const elegirPreferencias = () => {
  const dificultad = document.getElementById("dificultad").value;

  var n_col = document.getElementById("n_col").value;
  var n_row = document.getElementById("n_row").value;

  difficulty = dificultad;

  document.documentElement.style.setProperty("--var--rows", n_row);
  document.documentElement.style.setProperty("--var--cols", n_col);

  juego.style.display = "block";
  preferencias.style.display = "none";

  rows = parseInt(getComputedStyle(root).getPropertyValue("--var--rows"));
  cols = parseInt(getComputedStyle(root).getPropertyValue("--var--cols"));

  init();
};

const botonElegir = document.getElementById("iniciar");

botonElegir.addEventListener("click", elegirPreferencias);

var rem = document.createElement("img");
rem.src = "rem.png";
rem.width = 50;
rem.height = 50;

var ram = document.createElement("img");
ram.src = "ram.png";
ram.width = 50;
ram.height = 50;

class Coin {
  constructor() {
    var img;
    var type;
    var x;
    var y;
    var isMoving;
    var hasNeighbour;
  }
}

class RowCalculationFuckit {
  constructor() {
    var upPriority;
    var downPriority;
    var leftPriority;
    var rightPriority;
    var upSpace;
    var leftSpace;
    var rightSpace;
    var visited;
    var leftIsBest;
    var rightIsBest;
    var upIsBest;
    var bestIs;
  }
}

function init() {
  size = cols * rows;

  for (let i = 0; i < cols; i++) {
    rowsArray.push(new RowCalculationFuckit());
    rowsArray[i].upPriority = -1;
    rowsArray[i].downPriority = -1;
    rowsArray[i].leftPriority = -1;
    rowsArray[i].rightPriority = -1;
    rowsArray[i].upSpace = true;
    rowsArray[i].leftSpace = true;
    rowsArray[i].rightSpace = true;
    rowsArray[i].visited = false;
    rowsArray[i].leftIsBest = false;
    rowsArray[i].rightIsBest = false;
    rowsArray[i].upIsBest = false;
    rowsArray[i].bestIs = 0;
  }

  var counterX = 0;
  var counterY = 0;
  firstTime = false;

  for (let i = 0; i < size; i++) {
    var img = document.createElement("img");
    img.src = "square.png";
    img.width = 50;
    img.height = 50;

    table.push(new Coin());
    table[i].img = img;
    table[i].type = 0;
    table[i].x = counterX;
    table[i].y = counterY;
    table[i].isMoving = true;
    table[i].hasNeighbour = 0;

    if (counterX >= cols) {
      counterX = 0;
      table[i].x = 0;
      firstTime = true;
      table[i].container = document.querySelector(".scene");
      table[i].container.appendChild(table[i].img);
      counterY++;
      table[i].y = counterY;
    } else if (counterX < cols && !firstTime) {
      let btn = document.createElement("button");
      btn.innerHTML = i;
      btn.type = "submit";
      btn.name = "btn";
      btn.style.width = "40px";
      btn.style.height = "40px";
      btn.addEventListener("click", function () {
        play(this);
      });
      table[i].container = document.querySelector(".scene");
      table[i].container.appendChild(btn);
    } else {
      table[i].container = document.querySelector(".scene");
      table[i].container.appendChild(table[i].img);
    }
    counterX++;
  }
}

function play(e) {
  console.clear();
  if (permitted) {
    if (turn) {
      var pos = parseInt(e.innerHTML);
      for (let i = 0; i < size; i++) {
        if (table[i].y == 1 && table[i].x == pos) {
          if (table[i].type != 0) {
            break;
          }
          table[i].img.src = "ram.png";
          table[i].type = 1;
          permitted = false;
          turn = false;
          break;
        }
      }
    }
  }
  //console.log(pos);
}

setInterval(function () {
  if (permitted && !turn) {
    if (difficulty == 0) {
      level1();
    } else if (difficulty == 1) {
      level2();
    }
    permitted = false;
    turn = true;
  }

  for (let i = 0; i < size; i++) {
    if (table[i].type == 1 || table[i].type == 2) {
      if (i + cols < size && table[i + cols].type == 0) {
        let tmp = table[i + cols].img.src;
        let tmp2 = table[i + cols].type;
        table[i + cols].img.src = table[i].img.src;
        table[i + cols].type = table[i].type;
        table[i].img.src = tmp;
        table[i].type = tmp2;
        if (
          table[i].y == rows - 2 ||
          (i + cols < size && !table[i + cols].isMoving)
        ) {
          table[i].isMoving = false;
        }
        if (!table[i].isMoving) {
          permitted = true;
        }
        break;
      } else if (table[i].isMoving == false && table[i].y == 1) {
        if (!full.includes(i)) {
          full.push(i);
          permitted = true;
        }
      }
    }
  }
}, 200);

function level1() {
  var bucleOp = true;
  while (bucleOp) {
    var rand = Math.floor(Math.random() * cols);
    for (let i = 0; i < size; i++) {
      if (table[i].y == 1 && table[i].x == rand && table[i].type != 0) {
        break;
      }
      if (table[i].y == 1 && table[i].x == rand) {
        table[i].img.src = "rem.png";
        table[i].type = 2;
        bucleOp = false;
        break;
      }
    }
  }
}

let curPos = 0;

function calculatePriorityLeft(rowNum) {
  //find left
  if (table[rowNum].x >= 0 && table[rowNum].type == 2) {
    rowsArray[curPos].leftPriority += 1;
    if (
      table[rowNum].x == 0 ||
      (rowNum - 1 >= 0 && table[rowNum - 1].type == 1)
    ) {
      rowsArray[curPos].leftSpace = false;
    } else if (table[rowNum - 1].type == 2) {
      rowsArray[curPos].leftSpace = false;
      calculatePriorityLeft(rowNum - 1);
    } else {
      calculatePriorityLeft(rowNum - 1);
    }
    rowsArray[curPos].visited = true;
  }
}

function calculatePriorityRight(rowNum) {
  //find right
  if (table[rowNum].x <= cols && table[rowNum].type == 2) {
    rowsArray[curPos].rightPriority += 1;
    if (
      table[rowNum].x == cols - 1 ||
      (rowNum + 1 <= cols && table[rowNum + 1].type == 1)
    ) {
      rowsArray[curPos].rightSpace = false;
    } else if (table[rowNum + 1].type == 2) {
      rowsArray[curPos].rightSpace = false;
      calculatePriorityRight(rowNum + 1);
    } else {
      calculatePriorityRight(rowNum + 1);
    }
    rowsArray[curPos].visited = true;
  }
}

function calculatePriorityUp(rowNum) {
  //find up
  if (table[rowNum].y >= 0 && table[rowNum].type == 2) {
    rowsArray[curPos].upPriority += 1;
    if (
      table[rowNum].y == 0 ||
      (rowNum - cols >= 0 && table[rowNum - cols].type == 1) ||
      (rowNum - cols >= 0 && table[rowNum - cols].type == 2)
    ) {
      rowsArray[curPos].upSpace = false;
    } else {
      calculatePriorityUp(rowNum - cols);
    }
    rowsArray[curPos].visited = true;
  }
}

function calculatePriorityDown(rowNum) {
  //find down
  if (table[rowNum].y < rows && table[rowNum].type == 2) {
    rowsArray[curPos].downPriority += 1;
    if (table[rowNum].y == rows - 1) {
    } else {
      calculatePriorityDown(rowNum + cols);
    }
    rowsArray[curPos].visited = true;
  }
}

var overall = 0;
var horizontalPriority = 0;
var verticalPriority = 0;

function resetInfo() {
  for (let i = 0; i < rows; i++) {
    rowsArray[i].upPriority = -1;
    rowsArray[i].downPriority = -1;
    rowsArray[i].leftPriority = -1;
    rowsArray[i].rightPriority = -1;
    rowsArray[i].upSpace = true;
    rowsArray[i].leftSpace = true;
    rowsArray[i].rightSpace = true;
    rowsArray[i].visited = false;
    rowsArray[i].leftIsBest = false;
    rowsArray[i].rightIsBest = false;
    rowsArray[i].upIsBest = false;
    rowsArray[i].bestIs = 0;
  }
  overall = 0;
  horizontalPriority = 0;
  verticalPriority = 0;
}

function calculateResult2() {
  for (let u = 0; u < cols; u++) {
    if (rowsArray[u].visited == true) {
      horizontalPriority =
        rowsArray[u].leftPriority + rowsArray[u].rightPriority;
      verticalPriority = rowsArray[u].upPriority + rowsArray[u].downPriority;
      if (rowsArray[u].leftSpace == true || rowsArray[u].rightSpace == true) {
        if (horizontalPriority >= verticalPriority || !rowsArray[u].upSpace) {
          if (rowsArray[u].leftSpace) {
            rowsArray[u].leftIsBest = true;
            rowsArray[u - 1].bestIs = horizontalPriority;
          } else {
            rowsArray[u].rightIsBest = true;
            rowsArray[u + 1].bestIs = horizontalPriority;
          }
          if (horizontalPriority > overall) {
            overall = horizontalPriority;
          }
        }
      }
      if (rowsArray[u].upSpace == true) {
        if (
          verticalPriority >= horizontalPriority ||
          (!rowsArray[u].leftSpace && !rowsArray[u].rightSpace)
        ) {
          rowsArray[u].upIsBest = true;
          rowsArray[u].bestIs = verticalPriority;
          if (verticalPriority > overall) {
            overall = verticalPriority;
          }
          //console.log("vert is: " + verticalPriority);
        }
      }
    }
  }
}

function level2() {
  //spy
  for (let i = 0; i < size; i++) {
    if (table[i].type == 2) {
      var pos = (table[i].y + 1) * (rows + 1);
      pos -= i;
      pos -= rows + 1;
      pos = Math.abs(pos);
      if (!rowsArray[pos].visited) {
        curPos = pos;
        calculatePriorityUp(i);
        calculatePriorityDown(i);
        calculatePriorityLeft(i);
        calculatePriorityRight(i);

        if (rowsArray[pos].leftSpace) {
          if (table[i].y <= rows - 2) {
            if (table[i + -1 + cols].type == 0) {
              rowsArray[pos].leftSpace = false;
            }
          }
        }
        if (rowsArray[pos].rightSpace) {
          if (table[i].y <= rows - 2) {
            if (table[i + 1 + cols].type == 0) {
              rowsArray[pos].rightSpace = false;
            }
          }
        }

        console.log("----------------------------");
        console.log("PosX: " + table[i].x + " PosY: " + table[i].y);
        console.log("Visited: " + rowsArray[pos].visited);
        console.log("Up: " + rowsArray[pos].upPriority);
        console.log("Down: " + rowsArray[pos].downPriority);
        console.log("Left: " + rowsArray[pos].leftPriority);
        console.log("Right: " + rowsArray[pos].rightPriority);
        console.log("Up-Space: " + rowsArray[pos].upSpace);
        console.log("Left-Space: " + rowsArray[pos].leftSpace);
        console.log("Right-Space: " + rowsArray[pos].rightSpace);
        console.log("----------------------------");
      }
    }
  }
  calculateResult2();
  //do stuff
  for (let u = 0; u < cols; u++) {
    if (overall == rowsArray[u].bestIs && overall != 0) {
      for (let i = 0; i < size; i++) {
        if (table[i].y == 1 && table[i].x == u) {
          if (table[i].type != 0) {
            console.log("RandomMove");
            level1();
            u = 100;
            break;
          }
          table[i].img.src = "rem.png";
          table[i].type = 2;
          u = 100;
          console.log("SmaaaartMove");
          break;
        }
      }
    }
    //AQUIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII
    if (overall == 0 && rowsArray[u].visited == true) {
      if (
        rowsArray[u].upSpace ||
        rowsArray[u].rightSpace ||
        rowsArray[u].leftSpace
      ) {
        if (rowsArray[u].upSpace) {
          table[u].img.src = "rem.png";
          table[u].type = 2;
          console.log("Up: ");
        } else if (rowsArray[u].rightSpace) {
          table[u + 1].img.src = "rem.png";
          table[u + 1].type = 2;
          console.log("Right: ");
        } else {
          table[u - 1].img.src = "rem.png";
          table[u - 1].type = 2;
          console.log("Left: ");
        }
        console.log("SmurtMove");
        break;
      }
    }

    if (u == cols - 1) {
      level1();
      console.log("RandomMove");
      check = false;
    }
  }
  resetInfo();
}