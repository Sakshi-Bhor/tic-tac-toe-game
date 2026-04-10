let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let msg = document.querySelector("#msg");

// 🔊 Sounds
let clickSound = document.querySelector("#clickSound");
let winSound = document.querySelector("#winSound");
let drawSound = document.querySelector("#drawSound");

// 🌙 Theme Toggle
let toggleBtn = document.querySelector("#theme-toggle");

let board = ["", "", "", "", "", "", "", "", ""];
let human = "O";
let ai = "X";
let gameOver = false;

// win patterns
const winPatterns = [
    [0,1,2],[0,3,6],[0,4,8],
    [1,4,7],[2,5,8],[2,4,6],
    [3,4,5],[6,7,8],
];

// 👇 Load saved theme
if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light-mode");
    if (toggleBtn) toggleBtn.innerText = "☀️";
}

// 🎮 Game Click
boxes.forEach((box, index) => {
    box.addEventListener("click", () => {

        if (board[index] !== "" || gameOver) return;

        clickSound.currentTime = 0;
        clickSound.play();

        makeMove(index, human);

        if (!gameOver) {
            setTimeout(() => {
                let bestMove = minimax(board, ai).index;
                makeMove(bestMove, ai);
            }, 300);
        }
    });
});

// 🧠 Make Move
const makeMove = (index, player) => {
    board[index] = player;
    boxes[index].innerText = player;

    let winner = checkWinner();
    if (winner) endGame(winner);
};

// 🏆 Check Winner
const checkWinner = () => {
    for (let p of winPatterns) {
        let [a,b,c] = p;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            highlight(p);
            return board[a];
        }
    }
    if (!board.includes("")) return "draw";
    return null;
};

// ✨ Highlight Winner
const highlight = (pattern) => {
    pattern.forEach(i => {
        boxes[i].style.backgroundColor = "#00f7ff";
        boxes[i].style.boxShadow = "0 0 20px #00f7ff";
    });
};

// 🎯 End Game
const endGame = (winner) => {
    gameOver = true;

    if (winner === "draw") {
        msg.innerText = "It's a Draw 🤝";
        drawSound.play();
    } else {
        msg.innerText = `🎉 Winner: ${winner}`;
        winSound.play();
    }

    boxes.forEach(b => b.disabled = true);
};

// 🔁 Reset Game
resetBtn.addEventListener("click", () => {
    board = ["", "", "", "", "", "", "", "", ""];
    gameOver = false;
    msg.innerText = "";

    boxes.forEach(b => {
        b.innerText = "";
        b.disabled = false;
        b.style.backgroundColor = "#fff";
        b.style.boxShadow = "none";
    });
});

// 🌙 Toggle Theme
if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        document.body.classList.toggle("light-mode");

        if (document.body.classList.contains("light-mode")) {
            toggleBtn.innerText = "☀️";
            localStorage.setItem("theme", "light");
        } else {
            toggleBtn.innerText = "🌙";
            localStorage.setItem("theme", "dark");
        }
    });
}

/* 🤖 Minimax AI */
const minimax = (newBoard, player) => {

    let avail = newBoard
        .map((v,i)=> v===""?i:null)
        .filter(v=>v!==null);

    let winner = checkStatic(newBoard);

    if (winner === human) return {score:-10};
    if (winner === ai) return {score:10};
    if (avail.length === 0) return {score:0};

    let moves = [];

    for (let i of avail) {
        let move = {index:i};
        newBoard[i] = player;

        let result = minimax(newBoard, player===ai ? human : ai);
        move.score = result.score;

        newBoard[i] = "";
        moves.push(move);
    }

    let bestMove;

    if (player === ai) {
        let bestScore = -Infinity;
        moves.forEach((m,i)=>{
            if (m.score > bestScore){
                bestScore = m.score;
                bestMove = i;
            }
        });
    } else {
        let bestScore = Infinity;
        moves.forEach((m,i)=>{
            if (m.score < bestScore){
                bestScore = m.score;
                bestMove = i;
            }
        });
    }

    return moves[bestMove];
};

// static check for AI
const checkStatic = (b) => {
    for (let p of winPatterns) {
        let [a,b1,c] = p;
        if (b[a] && b[a] === b[b1] && b[a] === b[c]) {
            return b[a];
        }
    }
    if (!b.includes("")) return "draw";
    return null;
};