// hiển thị 
const gameBoard = document.querySelector("#gameBoard");
let board = [
    1, 2, 3, 4,
    5, 6, 7, 8,
    9, 10, 11, 0
];

let emptyIndex = 11;
let isPlaying = false;
let moves = 0;

// Hàm hiển thị bàn cờ
function renderBoard() {

    gameBoard.innerHTML = "";

    for (let i = 0; i < board.length; i++) {

        const tile = document.createElement("div");

        tile.classList.add("tile");

        if (board[i] === 0) {

            tile.classList.add("empty");

        } else {

            tile.innerText = board[i];

        }

        gameBoard.appendChild(tile);
    }
}
// Hiển thị bàn cờ ban đầu
renderBoard();

// ĐẾM GIỜ
const timer = document.querySelector("#timer");
let seconds = 0;
let intervalId = null;

function updateTimer() {
    const minute = Math.floor(seconds / 60);
    const second = seconds % 60;
    timer.innerText =
        String(minute).padStart(2, "0") +
        ":" +
        String(second).padStart(2, "0");
}

function startTimer() {
    clearInterval(intervalId);
    seconds = 0;
    updateTimer();
    intervalId = setInterval(function () {

        seconds++;

        updateTimer();

    }, 1000);
}

function stopTimer() {
    clearInterval(intervalId);
    intervalId = null;
}

//DI CHUYỂN Ô ĐEN


function move(direction, countMove = true) {

    const SIZE = 4;
    const row = Math.floor(emptyIndex / SIZE);
    const col = emptyIndex % SIZE;
    let newIndex = emptyIndex;

    if (direction === "up") {

        // Đang ở hàng đầu thì không đi lên
        if (row === 0) {
            return false;
        }

        newIndex = emptyIndex - SIZE;
    }
    else if (direction === "down") {

        // Bàn cờ có 3 hàng: 0, 1, 2
        if (row === 2) {
            return false;
        }

        newIndex = emptyIndex + SIZE;
    }
    else if (direction === "left") {

        if (col === 0) {
            return false;
        }

        newIndex = emptyIndex - 1;
    }

    else if (direction === "right") {

        if (col === 3) {
            return false;
        }

        newIndex = emptyIndex + 1;
    }

    else {
        return false;
    }
    board[emptyIndex] = board[newIndex];

    board[newIndex] = 0;
    emptyIndex = newIndex;
    if (countMove) {

        moves++;

        renderBoard();

        checkWin();
    }

    return true;
}

// TRỘN BÀN CỜ

function shuffleBoard() {
    const directions = [
        "up",
        "down",
        "left",
        "right"
    ];
    const opposite = {
        up: "down",
        down: "up",
        left: "right",
        right: "left"
    };
    board = [
        1, 2, 3, 4,
        5, 6, 7, 8,
        9, 10, 11, 0
    ];

    emptyIndex = 11;
    let count = 0;
    let previousDirection = "";
    while (count < 100) {

        const randomIndex = Math.floor(
            Math.random() * directions.length
        );

        const direction = directions[randomIndex];

        if (direction === opposite[previousDirection]) {
            continue;
        }

        const success = move(direction, false);

        if (success) {

            count++;

            previousDirection = direction;
        }
    }

    renderBoard();
}

//   WIN KHI

function isWin() {

    for (let i = 0; i < 11; i++) {

        if (board[i] !== i + 1) {
            return false;
        }
    }

    return board[11] === 0;
}

function checkWin() {

    if (isWin()) {
        isPlaying = false;

        stopTimer();
        btnStart.innerText = "Chơi lại";
        saveHistory();
        alert("YOU WIN!");
    }
}

// History

const historyBody = document.querySelector("#historyBody");

let history = [];


function saveHistory() {

    const result = {
        moves: moves,
        time: timer.innerText
    };

    history.push(result);

    renderHistory();
}

function renderHistory() {

    historyBody.innerHTML = "";

    for (let i = 0; i < history.length; i++) {

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${i + 1}</td>
            <td>${history[i].moves}</td>
            <td>${history[i].time}</td>
        `;

        historyBody.appendChild(row);
    }
}

// START/END BTN

const btnStart = document.querySelector("#startBtn");

btnStart.onclick = function () {

    if (isPlaying) {

        isPlaying = false;

        stopTimer();

        btnStart.innerText = "Bắt đầu";

        return;
    }

    isPlaying = true;
    moves = 0;
    shuffleBoard();
    startTimer();
    btnStart.innerText = "Kết thúc";
};


// WADS

document.addEventListener("keydown", function (event) {

    if (!isPlaying) {
        return;
    }
    const key = event.key.toLowerCase();

    let direction = "";

    if (key === "w" || key === "arrowup") {

        direction = "up";
    }

    else if (key === "s" || key === "arrowdown") {

        direction = "down";
    }

    else if (key === "a" || key === "arrowleft") {

        direction = "left";
    }

    else if (key === "d" || key === "arrowright") {

        direction = "right";
    }

    if (direction !== "") {

        event.preventDefault();
        move(direction);
    }
});