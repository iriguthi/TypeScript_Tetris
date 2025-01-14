interface Tetromino {
  shape: number[][];
  x: number;
  y: number;
  color: string;
}

const grid_width = 10;
const grid_height = 20;

// 盤面
let grid: number[][] = Array.from({length: grid_height}, () =>
  Array(grid_width).fill(0)
);

// テトロミノ定義
const TETROMINOS: Tetromino[] =[
  // O
  {shape: [
    [1, 1],
    [1, 1]
  ], x: 4, y: 0, color: "yellow" },
  // I
  {shape: [
    [1, 1, 1, 1]
  ], x: 3, y: 0, color: "Cyan" },
  // Z
  {shape: [
    [1, 1, 0],
    [0, 1, 1]
  ], x: 3, y: 0, color: "red"},
  // S
  {shape: [
    [0, 1, 1],
    [1, 1, 0]
  ], x: 3, y: 0, color: "green" },
  // T
  {shape: [
    [1, 1, 1],
    [0, 1, 0]
  ], x: 3, y: 0, color: "purple" },
  // L
  {shape: [
    [1, 0, 0],
    [1, 1, 1]
  ], x: 3, y: 0, color: "orange" },
  // 逆L
  {shape: [
    [0, 0, 1],
    [1, 1, 1]
  ], x: 3, y: 0, color: "blue" },
];

// テトロミノランダム生成
const randomTetoromino = (): Tetromino => {
  const random = Math.floor(Math.random() * TETROMINOS.length);
  // console.log(random)
  return { ...TETROMINOS[random] } as Tetromino;
};

// 現在のテトロミノ
let currentTetromino: Tetromino = randomTetoromino();
// console.log("てとろみの",currentTetromino)

// グリッドリセット
function clearGrid() {
  grid = Array.from({ length: grid_height }, () =>
    Array(grid_width).fill(0)
  );
}

// 初期化
function renderGrid() {
  const gameContainer = document.getElementById("tetris_container")!;
  gameContainer.innerHTML = "";
  gridReset();
  // 現在のテトロミノの情報を一時的に統合して描画
  for(let y = 0; y < grid_height; y++) {
    for(let x = 0; x < grid_width; x++) {
      const div = document.createElement("div");
      div.className = "cell";

      // 描画値を選定（固定or現在）
      const isCurrentTetromino =
      currentTetromino.shape.some((row, dy) =>
        row.some((value, dx) => {
          return (
            value === 1 &&
            currentTetromino.x + dx === x &&
            currentTetromino.y + dy === y
          );
        })
      );

      if(grid[y]![x] === 1 || isCurrentTetromino) {
        div.classList.add("filled");
        div.style.backgroundColor = isCurrentTetromino? currentTetromino.color: "gray";
      }
      gameContainer.appendChild(div);
    }
  }
}

// グリッドリセット
function gridReset() {
  currentTetromino.shape.forEach((row, dy) => {
    row.forEach((value, dx) => {
      if (value === 1) {
        const x = currentTetromino.x + dx;
        const y = currentTetromino.y + dy;

        if (x >= 0 && x < grid_width && y >= 0 && y < grid_height) {
          if(grid[y] !== undefined && grid[y][x] !== undefined) {
          if(grid[y][x] === 2) grid[y][x] = 0;
          }
        }
      }
    });
  });
}

// テトロミノ描画
function drawTetromino() {
  currentTetromino.shape.forEach((row, dy) => {
    row.forEach((value, dx) => {
      if(value === 1) {
        const x = currentTetromino.x + dx;
        const y = currentTetromino.y + dy;

        // 描画範囲チェック
        // console.table(grid)
        if(x >= 0 || x < grid_width || y >= 0 || y < grid_height) {
          // grid[y]の存在有無判定しあれば描画
          if(grid[y] !== undefined && grid[y][x] !== undefined) {
            // テトロミノ(操作対象)
            grid[y][x] = 2;
            // console.table(grid)
            // console.log(currentTetromino)
          }
        }
        // console.table(grid)
      }
    });
  });
}

// 設置
function placeTetromino() {
  // console.log("currentTetromino:", currentTetromino);
  // console.table(grid);
  currentTetromino.shape.forEach((row, dy) => {
    row.forEach((value, dx) => {
      if(value === 1) {
        const x = currentTetromino.x + dx;
        const y = currentTetromino.y + dy;

        // 描画範囲チェック
        // console.table(grid)
        if(x >= 0 && x < grid_width && y >= 0 && y < grid_height) {
          // grid[y]の存在有無判定しあれば描画
          if(grid[y] !== undefined && grid[y][x] !== undefined) {
            grid[y][x] = 1;
            if(grid[y][x] === 2) grid[y][x] = 0;
            // console.log(`x: ${x}, y: ${y}, grid[y]:`, grid[y], "grid[y][x]:", grid[y]?.[x]);
            // console.table(grid)
          }
        }
      }
    });
  });

  // console.table(grid)

  clearLine()

  // 初期位置に既にある場合は終了
  const startY = currentTetromino.y;
  if(startY === 0) {
    clearInterval(gameInterval)
    alert("GAME OVER")
  }

  // 次のテトロミノ生成
  currentTetromino = randomTetoromino()
}

// ラインの削除
let score = 0;
function clearLine() {
  // 揃った列の検知
  grid = grid.filter(row => row.some(cell => cell ===0));

  // 列の削除
  const clearLine = grid_height - grid.length
  // 1列毎に100pt
  score += clearLine * 100;
  // console.log(score)
  document.getElementById("score")!.innerText = `${score}`

  while(grid.length < grid_height) {
    grid.unshift(Array(grid_width).fill(0));
  }
}

// テトロミノ落下管理
function fallTetromino() {
  // clearGrid();
  // console.log(canMove())
  if(canMove(0, 1)) {
    currentTetromino.y += 1;
  } else {
    // 次のテトロミノ生成
    placeTetromino()
  }

  drawTetromino();
  renderGrid();
}

// テトロミノ時限落下(1秒毎)
let interval = 1000;
let gameInterval = setInterval(fallTetromino, interval);

// テトロミノ移動可否
function canMove(dx: number, dy: number): boolean {
  return currentTetromino.shape.every((row, dyOffset) => {
    return row.every((value, dxOffset) => {
      // テトロミノと関係のない空のブロックは無視
      if(value === 0) return true;
// console.log("1")
      const x = currentTetromino.x + dxOffset + dx;
      const y = currentTetromino.y + dyOffset + dy;

      // 範囲チェック
      if(x < 0 || x >= grid_width || y >= grid_height) {
        return false;
      }

      // ブロックとの衝突
      if(grid[y]?.[x] === 1) {
        return false;
      }

      return true;
    })
  })
}

// 回転可否
function canRotate(newShape: number[][]): boolean {
  return newShape.every((row, dyOffset) =>
    row.every((value, dxOffset) => {
      if(value === 0) return true;

      const x = currentTetromino.x + dxOffset;
      const y = currentTetromino.y + dyOffset;

      // 範囲チェック
      if(x < 0 || x >= grid_width || y >= grid_height) {
        return false;
      }

      // ブロックとの衝突
      if(grid[y]?.[x] === 1) {
        return false;
      }

      return true;
    })
  );
}

// 描画更新
function updateGrid() {
  for(let y = 0; y < grid_height; y++) {
    for(let x = 0; x < grid_width; x++) {
      if(grid[y]![x] === 2) grid[y]![x] = 0
    }
  }
  // 描画内容更新
  drawTetromino();
}

// 移動
function moveTetromino(dx: number, dy: number) {
  if(canMove(dx, dy)) {
    currentTetromino.x += dx;
    currentTetromino.y += dy;
  }
  updateGrid();
  renderGrid();
}

// 回転
function rotateTetromino() {
  const newShape = rotateShape(currentTetromino.shape);
  // console.log(currentTetromino)
  if(canRotate(newShape)) {
    currentTetromino.shape = newShape;
    updateGrid();
    renderGrid();
  }
}

// 時計回り
function rotateShape(shape: number[][]): number[][] {
  if(shape.length === 0){
    return []
  }
  return shape[0]!.map((_, colIndex) =>
    // row[colIndex] = undefinedの場合"0"を返す
    shape.map(row => row[colIndex] ?? 0).reverse()
  );
}

// 一時停止
let isPaused = false;
function pause() {
  if (isPaused) {
    // 再開
    gameInterval = setInterval(fallTetromino, interval);
    isPaused = false;
  } else {
    // 一時停止
    clearInterval(gameInterval);
    isPaused = true;
  }
}

// 操作
document.addEventListener("keydown", handleKeyPress);
function handleKeyPress(event: KeyboardEvent) {
  switch (event.key) {
    case "ArrowLeft":
      // 左移動
      if(!isPaused) moveTetromino(-1, 0);
      break;
    case "ArrowRight":
      // 右移動
      if(!isPaused) moveTetromino(1, 0);
      break;
    case "ArrowDown":
      // 下移動
      if(!isPaused) moveTetromino(0, 1);
      break;
    case "ArrowUp":
      // 回転
      if(!isPaused) rotateTetromino();
      break;
    case " ":
      // 一時停止
      pause();
      break;
    default:
      break;
  }
};

// 初期描画
drawTetromino();
renderGrid();