"use client";

import { BoardState } from './types';
import { isValidMove, makeMove } from './gameLogic';

export function getAIMove(board: BoardState, player: 'w' | 'b') {
  const moves: { from: { row: number; col: number }; to: { row: number; col: number } }[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece[0] === player) {
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            if (Math.abs(dr) === Math.abs(dc) && dr !== 0) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                if (isValidMove(board, { row: r, col: c }, { row: nr, col: nc }, player)) {
                  moves.push({ from: { row: r, col: c }, to: { row: nr, col: nc } });
                }
              }
            }
          }
        }
      }
    }
  }
  if (moves.length === 0) return null;
  return moves[Math.floor(Math.random() * moves.length)];
}

// Minimax AI for extreme mode
function evaluateBoard(board: BoardState, player: 'w' | 'b'): number {
  // Simple evaluation: +3 for each own king, +1 for each own piece, -3 for opponent king, -1 for opponent piece
  let score = 0;
  for (const row of board) {
    for (const cell of row) {
      if (cell) {
        if (cell[0] === player) {
          score += cell.length === 2 ? 3 : 1;
        } else {
          score -= cell.length === 2 ? 3 : 1;
        }
      }
    }
  }
  return score;
}

function getAllMoves(board: BoardState, player: 'w' | 'b') {
  const moves: { from: { row: number; col: number }; to: { row: number; col: number } }[] = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const piece = board[r][c];
      if (piece && piece[0] === player) {
        for (let dr = -2; dr <= 2; dr++) {
          for (let dc = -2; dc <= 2; dc++) {
            if (Math.abs(dr) === Math.abs(dc) && dr !== 0) {
              const nr = r + dr;
              const nc = c + dc;
              if (nr >= 0 && nr < 8 && nc >= 0 && nc < 8) {
                if (isValidMove(board, { row: r, col: c }, { row: nr, col: nc }, player)) {
                  moves.push({ from: { row: r, col: c }, to: { row: nr, col: nc } });
                }
              }
            }
          }
        }
      }
    }
  }
  return moves;
}

function minimax(board: BoardState, player: 'w' | 'b', depth: number, maximizing: boolean): { score: number, move: { from: { row: number; col: number }; to: { row: number; col: number } } | null } {
  if (depth === 0) {
    return { score: evaluateBoard(board, player), move: null };
  }
  const moves = getAllMoves(board, maximizing ? player : (player === 'w' ? 'b' : 'w'));
  if (moves.length === 0) {
    return { score: maximizing ? -Infinity : Infinity, move: null };
  }
  let bestMove: { from: { row: number; col: number }; to: { row: number; col: number } } | null = null;
  let bestScore = maximizing ? -Infinity : Infinity;
  for (const move of moves) {
    const newBoard = makeMove(board, move.from, move.to);
    const result = minimax(newBoard, player, depth - 1, !maximizing);
    if (maximizing) {
      if (result.score > bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
    } else {
      if (result.score < bestScore) {
        bestScore = result.score;
        bestMove = move;
      }
    }
  }
  return { score: bestScore, move: bestMove };
}

export function getExtremeAIMove(board: BoardState, player: 'w' | 'b') {
  const result = minimax(board, player, 4, true); // depth 4 for reasonable performance
  return result.move;
} 