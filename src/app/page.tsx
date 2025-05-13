"use client";
import React, { useState, useEffect } from 'react';
import Board from '../components/Board';
import ModeSelector from '../components/ModeSelector';
import { getInitialBoard, isValidMove, makeMove, getWinner } from '../lib/gameLogic';
import { getAIMove, getExtremeAIMove } from '../lib/ai';
import { BoardState } from '../lib/types';
import styles from '../styles/Home.module.css';

const MOVE_TIME_LIMIT = 10; // seconds

const HomePage = () => {
  const [mode, setMode] = useState<'solo' | '2p' | 'extreme'>('solo');
  const [board, setBoard] = useState<BoardState>(getInitialBoard());
  const [turn, setTurn] = useState<'w' | 'b'>('w');
  const [selected, setSelected] = useState<{ row: number; col: number } | null>(null);
  const [winner, setWinner] = useState<'w' | 'b' | null>(null);
  const [timer, setTimer] = useState<number>(MOVE_TIME_LIMIT);

  // Timer effect for extreme mode
  useEffect(() => {
    if (mode === 'extreme' && !winner) {
      setTimer(MOVE_TIME_LIMIT);
      const interval = setInterval(() => {
        setTimer((t) => {
          if (t <= 1) {
            clearInterval(interval);
            setTurn((prev) => (prev === 'w' ? 'b' : 'w'));
            setSelected(null);
            return MOVE_TIME_LIMIT;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [turn, mode, winner]);

  useEffect(() => {
    setBoard(getInitialBoard());
    setTurn('w');
    setSelected(null);
    setWinner(null);
    setTimer(MOVE_TIME_LIMIT);
  }, [mode]);

  useEffect(() => {
    if ((mode === 'solo' && turn === 'b' && !winner) || (mode === 'extreme' && turn === 'b' && !winner)) {
      const aiMove = mode === 'extreme' ? getExtremeAIMove(board, 'b') : getAIMove(board, 'b');
      if (aiMove) {
        setTimeout(() => {
          setBoard((prev) => makeMove(prev, aiMove.from, aiMove.to));
          // Forced multiple jumps for AI
          if (mode === 'extreme' && Math.abs(aiMove.from.row - aiMove.to.row) === 2) {
            if (canCaptureAgain(makeMove(board, aiMove.from, aiMove.to), aiMove.to.row, aiMove.to.col, 'b')) {
              setSelected({ row: aiMove.to.row, col: aiMove.to.col });
              setTurn('b');
              return;
            }
          }
          setTurn('w');
        }, 600);
      }
    }
  }, [turn, mode, board, winner]);

  useEffect(() => {
    const win = getWinner(board);
    if (win) setWinner(win);
  }, [board]);

  // Forced multiple jumps logic
  function canCaptureAgain(board: BoardState, row: number, col: number, player: 'w' | 'b') {
    const piece = board[row][col];
    if (!piece || piece[0] !== player) return false;
    const directions = piece.length === 2 ? [1, -1] : [player === 'w' ? -1 : 1];
    for (const dr of directions) {
      for (const dc of [-1, 1]) {
        const midRow = row + dr;
        const midCol = col + dc;
        const endRow = row + dr * 2;
        const endCol = col + dc * 2;
        if (
          endRow >= 0 && endRow < 8 &&
          endCol >= 0 && endCol < 8 &&
          board[endRow][endCol] === null &&
          board[midRow] && board[midRow][midCol] &&
          board[midRow][midCol] !== null &&
          board[midRow][midCol]![0] !== player
        ) {
          return true;
        }
      }
    }
    return false;
  }

  const handleSquareClick = (row: number, col: number) => {
    if (winner) return;
    if ((mode === 'solo' && turn === 'b') || (mode === 'extreme' && turn === 'b')) return;
    const piece = board[row][col];
    if (selected) {
      if (isValidMove(board, selected, { row, col }, turn)) {
        const newBoard = makeMove(board, selected, { row, col });
        setBoard(newBoard);
        // Extreme mode: check for forced multiple jumps
        if (mode === 'extreme' && Math.abs(selected.row - row) === 2) {
          if (canCaptureAgain(newBoard, row, col, turn)) {
            setSelected({ row, col });
            return;
          }
        }
        setTurn(turn === 'w' ? 'b' : 'w');
        setSelected(null);
      } else if (piece && piece[0] === turn) {
        setSelected({ row, col });
      } else {
        setSelected(null);
      }
    } else if (piece && piece[0] === turn) {
      setSelected({ row, col });
    }
  };

  const handleRestart = () => {
    setBoard(getInitialBoard());
    setTurn('w');
    setSelected(null);
    setWinner(null);
    setTimer(MOVE_TIME_LIMIT);
  };

  const handleModeChange = (newMode: 'solo' | '2p' | 'extreme') => {
    setMode(newMode);
    handleRestart();
  };

  return (
    <main style={{ minHeight: '100vh', background: '#f5f5f5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <h1 style={{ fontSize: 40, fontWeight: 800, margin: '32px 0 8px', color: '#333' }}>Gabriel Dama Tournament</h1>
      <ModeSelector mode={mode} setMode={handleModeChange} />
      <div style={{ marginBottom: 16, fontSize: 20, fontWeight: 600, color: '#444' }}>
        {winner ? (
          <span style={{ color: winner === 'w' ? '#2196f3' : '#7b3f00' }}>{winner === 'w' ? 'White' : 'Black'} wins!</span>
        ) : (
          <span>
            Turn: <span style={{ color: turn === 'w' ? '#2196f3' : '#7b3f00' }}>{turn === 'w' ? 'White' : 'Black'}</span>
            {mode === 'extreme' && (
              <span style={{ marginLeft: 16, color: timer <= 3 ? '#d32f2f' : '#333' }}>⏰ {timer}s</span>
            )}
          </span>
        )}
      </div>
      <Board board={board} onSquareClick={handleSquareClick} selected={selected} />
      <button onClick={handleRestart} style={{ marginTop: 24, padding: '8px 32px', fontSize: 18, borderRadius: 8, border: 'none', background: '#2196f3', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>Restart</button>
      <div style={{ marginTop: 32, color: '#888', fontSize: 16 }}>Made with Next.js & React</div>
    </main>
  );
};

export default HomePage; 