"use strict";
const grid_width = 10;
const grid_height = 20;
// 盤面
let grid = Array.from({ length: grid_height }, () => Array(grid_width).fill(0));
// テトロミノ定義
const TETROMINOS = [
    // O
    { shape: [
            [1, 1],
            [1, 1]
        ], x: 0, y: 0, color: "yellow" },
    // I
    { shape: [
            [1, 1, 1, 1]
        ], x: 0, y: 0, color: "Cyan" },
    // Z
    { shape: [
            [1, 1, 0],
            [0, 1, 1]
        ], x: 0, y: 0, color: "red" },
    // S
    { shape: [
            [0, 1, 1],
            [1, 1, 0]
        ], x: 0, y: 0, color: "green" },
    // T
    { shape: [
            [1, 1, 1],
            [0, 1, 0]
        ], x: 0, y: 0, color: "purple" },
    // L
    { shape: [
            [1, 0, 0],
            [1, 1, 1]
        ], x: 0, y: 0, color: "orange" },
    // 逆L
    { shape: [
            [0, 0, 1],
            [1, 1, 1]
        ], x: 0, y: 0, color: "blue" },
];
// テトロミノランダム生成
const randomTetoromino = () => {
    var _a, _b;
    const random = Math.floor(Math.random() * TETROMINOS.length);
    // console.log(random)
    const tetromino = { ...TETROMINOS[random] };
    // 存在しない場合はエラー(shapeが空などで来てしまった場合を想定)
    if (!tetromino.shape || tetromino.shape.length === 0) {
        throw new Error("テトロミノのshapeが不正です");
    }
    // 中央で生成
    const tetrominoWidth = (_b = (_a = tetromino.shape[0]) === null || _a === void 0 ? void 0 : _a.length) !== null && _b !== void 0 ? _b : 1;
    tetromino.x = Math.floor((grid_width - tetrominoWidth) / 2);
    return tetromino;
};
// 現在のテトロミノ
let currentTetromino = randomTetoromino();
// console.log("てとろみの",currentTetromino)
// テトロミノの次弾生成
let nextTetromino = randomTetoromino();
function renderNextTetromino() {
    var _a;
    const nextContainer = document.getElementById("next_tetromino");
    // 前回内容をクリアしておく
    nextContainer.innerHTML = "";
    // nextTetrominoのshape,colorをそれぞれ代入
    const { shape, color } = nextTetromino;
    // テトロミノの列数に合わせてカラム数を設定
    nextContainer.style.gridTemplateColumns = `repeat(${(_a = shape[0]) === null || _a === void 0 ? void 0 : _a.length}, 20px)`;
    for (let y = 0; y < shape.length; y++) {
        for (let x = 0; x < shape[y].length; x++) {
            const cell = document.createElement("div");
            cell.style.width = "20px";
            cell.style.height = "20px";
            cell.style.boxSizing = "border-box";
            cell.style.border = "1px solid #ccc";
            if (shape[y][x] === 1) {
                cell.style.backgroundColor = color;
            }
            else {
                cell.style.border = "none";
            }
            nextContainer.appendChild(cell);
        }
    }
}
// グリッドリセット
function clearGrid() {
    grid = Array.from({ length: grid_height }, () => Array(grid_width).fill(0));
}
// 初期化
function renderGrid() {
    const gameContainer = document.getElementById("tetris_container");
    // 前回内容をクリアしておく
    gameContainer.innerHTML = "";
    gridReset();
    // 現在のテトロミノの情報を一時的に統合して描画
    for (let y = 0; y < grid_height; y++) {
        for (let x = 0; x < grid_width; x++) {
            const div = document.createElement("div");
            div.className = "cell";
            // 描画値を選定（固定or現在）
            const isCurrentTetromino = currentTetromino.shape.some((row, dy) => row.some((value, dx) => {
                return (value === 1 &&
                    currentTetromino.x + dx === x &&
                    currentTetromino.y + dy === y);
            }));
            if (grid[y][x] === 1 || isCurrentTetromino) {
                div.classList.add("filled");
                div.style.backgroundColor = isCurrentTetromino ? currentTetromino.color : "gray";
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
                    if (grid[y] !== undefined && grid[y][x] !== undefined) {
                        if (grid[y][x] === 2)
                            grid[y][x] = 0;
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
            if (value === 1) {
                const x = currentTetromino.x + dx;
                const y = currentTetromino.y + dy;
                // 描画範囲チェック
                // console.table(grid)
                if (x >= 0 || x < grid_width || y >= 0 || y < grid_height) {
                    // grid[y]の存在有無判定しあれば描画
                    if (grid[y] !== undefined && grid[y][x] !== undefined) {
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
            if (value === 1) {
                const x = currentTetromino.x + dx;
                const y = currentTetromino.y + dy;
                // 描画範囲チェック
                // console.table(grid)
                if (x >= 0 && x < grid_width && y >= 0 && y < grid_height) {
                    // grid[y]の存在有無判定しあれば描画
                    if (grid[y] !== undefined && grid[y][x] !== undefined) {
                        grid[y][x] = 1;
                        if (grid[y][x] === 2)
                            grid[y][x] = 0;
                        // console.log(`x: ${x}, y: ${y}, grid[y]:`, grid[y], "grid[y][x]:", grid[y]?.[x]);
                        // console.table(grid)
                    }
                }
            }
        });
    });
    // console.table(grid)
    clearLine();
    // 初期位置に既にある場合は終了
    const startY = currentTetromino.y;
    if (startY === 0) {
        clearInterval(gameInterval);
        alert("GAME OVER");
    }
    // 次のテトロミノ生成
    currentTetromino = nextTetromino;
    nextTetromino = randomTetoromino();
    renderNextTetromino();
}
// ラインの削除
let score = 0;
function clearLine() {
    // 揃った列の検知
    grid = grid.filter(row => row.some(cell => cell === 0));
    // 列の削除
    const clearLine = grid_height - grid.length;
    // 1列毎に100pt
    score += clearLine * 100;
    // console.log(score)
    document.getElementById("score").innerText = `${score}`;
    // 落下速度更新
    updateSpeed();
    while (grid.length < grid_height) {
        grid.unshift(Array(grid_width).fill(0));
    }
}
// テトロミノ落下管理
function fallTetromino() {
    // clearGrid();
    // console.log(canMove())
    if (canMove(0, 1)) {
        currentTetromino.y += 1;
    }
    else {
        // 次のテトロミノ生成
        placeTetromino();
    }
    drawTetromino();
    renderGrid();
}
// テトロミノ時限落下(1秒毎)
let interval = 1000;
let gameInterval = setInterval(fallTetromino, interval);
// 落下速度更新
function updateSpeed() {
    // 1000pt毎に落下速度を10%づつ早める
    interval = Math.max(1000 - Math.floor(score / 1000) * 100, 100);
    clearInterval(gameInterval);
    gameInterval = setInterval(fallTetromino, interval);
    // console.log(interval)
}
// テトロミノ移動可否
function canMove(dx, dy) {
    return currentTetromino.shape.every((row, dyOffset) => {
        return row.every((value, dxOffset) => {
            var _a;
            // テトロミノと関係のない空のブロックは無視
            if (value === 0)
                return true;
            // console.log("1")
            const x = currentTetromino.x + dxOffset + dx;
            const y = currentTetromino.y + dyOffset + dy;
            // 範囲チェック
            if (x < 0 || x >= grid_width || y >= grid_height) {
                return false;
            }
            // ブロックとの衝突
            if (((_a = grid[y]) === null || _a === void 0 ? void 0 : _a[x]) === 1) {
                return false;
            }
            return true;
        });
    });
}
// 回転可否
function canRotate(newShape) {
    return newShape.every((row, dyOffset) => row.every((value, dxOffset) => {
        var _a;
        if (value === 0)
            return true;
        const x = currentTetromino.x + dxOffset;
        const y = currentTetromino.y + dyOffset;
        // 範囲チェック
        if (x < 0 || x >= grid_width || y >= grid_height) {
            return false;
        }
        // ブロックとの衝突
        if (((_a = grid[y]) === null || _a === void 0 ? void 0 : _a[x]) === 1) {
            return false;
        }
        return true;
    }));
}
// 描画更新
function updateGrid() {
    for (let y = 0; y < grid_height; y++) {
        for (let x = 0; x < grid_width; x++) {
            if (grid[y][x] === 2)
                grid[y][x] = 0;
        }
    }
    // 描画内容更新
    drawTetromino();
}
// 移動
function moveTetromino(dx, dy) {
    if (canMove(dx, dy)) {
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
    if (canRotate(newShape)) {
        currentTetromino.shape = newShape;
        updateGrid();
        renderGrid();
    }
}
// 時計回り
function rotateShape(shape) {
    if (shape.length === 0) {
        return [];
    }
    return shape[0].map((_, colIndex) => 
    // row[colIndex] = undefinedの場合"0"を返す
    shape.map(row => { var _a; return (_a = row[colIndex]) !== null && _a !== void 0 ? _a : 0; }).reverse());
}
// 一時停止
let isPaused = false;
function pause() {
    if (isPaused) {
        // 再開
        gameInterval = setInterval(fallTetromino, interval);
        isPaused = false;
    }
    else {
        // 一時停止
        clearInterval(gameInterval);
        isPaused = true;
    }
}
// 操作
document.addEventListener("keydown", handleKeyPress);
function handleKeyPress(event) {
    switch (event.key) {
        case "ArrowLeft":
            // 左移動
            if (!isPaused)
                moveTetromino(-1, 0);
            break;
        case "ArrowRight":
            // 右移動
            if (!isPaused)
                moveTetromino(1, 0);
            break;
        case "ArrowDown":
            // 下移動
            if (!isPaused)
                moveTetromino(0, 1);
            break;
        case "ArrowUp":
            // 回転
            if (!isPaused)
                rotateTetromino();
            break;
        case " ":
            // 一時停止
            pause();
            break;
        default:
            break;
    }
}
;
// 初期描画
drawTetromino();
renderGrid();
renderNextTetromino();
