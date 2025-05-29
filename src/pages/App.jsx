import { useState } from 'react';
import '../styles/App.css';

const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXTurn, setIsXTurn] = useState(true);
  const [winner, setWinner] = useState(null);

  //padroes possiveis
  const checkWinner = (currentBoard) => {
    const winPatterns = [
      [0, 1, 2], 
      [3, 4, 5], 
      [6, 7, 8], 
      [0, 3, 6], 
      [1, 4, 7], 
      [2, 5, 8],
      [0, 4, 8], 
      [2, 4, 6]  
    ];

    // verifica o jogo a cada jogada
    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      if (
        currentBoard[a] &&
        currentBoard[a] === currentBoard[b] &&
        currentBoard[a] === currentBoard[c]
      ) {
        return currentBoard[a]; // Return 'X' or 'O' as the winner
      }
    }

    // Check for a draw
    if (currentBoard.every(cell => cell !== null)) {
      return 'Draw';
    }

    return null;
  };

  const handleClick = (index) => {
    if (board[index] || winner) return; 

    const newBoard = [...board];
    newBoard[index] = isXTurn ? 'X' : 'O';
    setBoard(newBoard);
    setIsXTurn(!isXTurn);

    const result = checkWinner(newBoard);
    if (result) {
      setWinner(result);
    }
  };

  const handleReset = () => {
    setBoard(Array(9).fill(null));
    setIsXTurn(true);
    setWinner(null);
  };

  const renderCell = (index) => (
    <button
      className="tic-tac-toe-cell"
      onClick={() => handleClick(index)}
    >
      {board[index]}
    </button>
  );

  return (
    <div className="tic-tac-toe-container">
      <h1 className="tic-tac-toe-header">Tic-Tac-Toe</h1>
      <div className="tic-tac-toe-status">
        {winner
          ? winner === 'Draw'
            ? 'Game is a Draw!'
            : `Winner: ${winner}`
          : `Turn: ${isXTurn ? 'X' : 'O'}`}
      </div>
      <div className="tic-tac-toe-board">
        {board.map((_, index) => renderCell(index))}
      </div>
      <button className="tic-tac-toe-reset" onClick={handleReset}>
        Reset Game
      </button>
    </div>
  );
};

export default TicTacToe;