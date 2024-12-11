import { useState } from "react";

function Square({ value, onSquareClick, highlight }) {
    return (
        <button
            className={`square ${highlight? 'highlight' : ''}`}
            onClick={onSquareClick}
        >
            {value}
        </button>
    );
}

function Board({ xIsNext, squares, onPlay }) {
    const size = 16; 
    function handleClick(i) {
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        const nextSquares = squares.slice();
        nextSquares[i] = xIsNext? "X" : "O"; 
        onPlay(nextSquares);
    }
    const winnerInfo = calculateWinner(squares);
    let status;
    if (winnerInfo) {
        status = "Winner: " + winnerInfo.winner;
    } else if (squares.every(square => square!== null)) {
        status = "It's a draw!";
    } else {
        status = "Next player: " + (xIsNext? "X" : "O");
    }

    return (
        <>
            <div className="status">{status}</div>
            {/* 使用两个循环来生成方块 */}
            {[...Array(size)].map((_, row) => (
                <div className="board-row" key={row}>
                    {[...Array(size)].map((_, col) => {
                        const index = row * size + col;
                        const highlight = winnerInfo && winnerInfo.line.includes(index);
                        return (
                            <Square
                                key={col}
                                value={squares[index]}
                                onSquareClick={() => handleClick(index)}
                                highlight={highlight} // 传递高亮状态
                            />
                        );
                    })}
                </div>
            ))}
        </>
    );
}

export default function Game() {
    const [history, setHistory] = useState([Array(256).fill(null)]);
    const [currentMove, setCurrentMove] = useState(0);
    const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove];

    function handlePlay(nextSquares) {
        const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
        setHistory(nextHistory);
        setCurrentMove(nextHistory.length - 1);
    }

    function jumpTo(nextMove) {
        setCurrentMove(nextMove);
    }

    const moves = history.map((squares, move) => {
        let description;
        if (move === currentMove) {
            description = "You are at move #" + move;
        } else if (move > 0) {
            description = "Go to move #" + move;
        } else {
            description = "Go to game start";
        }
        return (
            <li key={move}>
                {move === currentMove? <span>{description}</span> : <button onClick={() => jumpTo(move)}>{description}</button>}
            </li>
        );
    });

    return (
        <div className="game">
            <div className="game-board">
                <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
            </div>
            <div className="game-info">
                <ol>{moves}</ol>
            </div>
        </div>
    );
}

function calculateWinner(squares) {
    const size = 16;
    const lines = [];
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (j <= size - 5) {// 行
                lines.push([
                    i * size + j,
                    i * size + j + 1,
                    i * size + j + 2,
                    i * size + j + 3,
                    i * size + j + 4,
                ]);
            }
            if (i <= size - 5) {  // 列
                lines.push([
                    i * size + j,
                    (i + 1) * size + j,
                    (i + 2) * size + j,
                    (i + 3) * size + j,
                    (i + 4) * size + j,
                ]);
            }
            if (i <= size - 5 && j <= size - 5) {// 主对角线
                lines.push([
                    i * size + j,
                    (i + 1) * size + j + 1,
                    (i + 2) * size + j + 2,
                    (i + 3) * size + j + 3,
                    (i + 4) * size + j + 4,
                ]);
            }
            if (i >= 4 && j <= size - 5) {// 副对角线
                lines.push([
                    i * size + j,
                    (i - 1) * size + j + 1,
                    (i - 2) * size + j + 2,
                    (i - 3) * size + j + 3,
                    (i - 4) * size + j + 4,
                ]);
            }
        }
    }

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c, d, e] = lines[i];
        if (
            squares[a] &&
            squares[a] === squares[b] &&
            squares[a] === squares[c] &&
            squares[a] === squares[d] &&
            squares[a] === squares[e]
        ) {
            return { winner: squares[a], line: lines[i] }; 
        }
    }
    return null; 
}