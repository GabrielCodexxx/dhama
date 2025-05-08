"use client";
import { BoardState, PieceType } from './types';

export function getInitialBoard(): BoardState {
  const board: BoardState = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) board[row][col] = 'b';
    }
  }
  for (let row = 5; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      if ((row + col) % 2 === 1) board[row][col] = 'w';
    }
  }
  return board;
}

export function isValidMove(
  board: BoardState,
  from: { row: number; col: number },
  to: { row: number; col: number },
  player: 'w' | 'b'
): boolean {
  // Basic move validation (no forced captures, no multi-jump)
  const piece = board[from.row][from.col];
  if (!piece || (piece[0] !== player)) return false;
  if (board[to.row][to.col]) return false;
  const dir = player === 'w' ? -1 : 1;
  const isKing = piece.length === 2;
  const dr = to.row - from.row;
  const dc = Math.abs(to.col - from.col);
  if (dc !== Math.abs(dr)) return false;
  if (Math.abs(dr) === 1 && (isKing || dr === dir)) return true;
  if (Math.abs(dr) === 2) {
    const midRow = (from.row + to.row) / 2;
    const midCol = (from.col + to.col) / 2;
    const midPiece = board[midRow][midCol];
    if (midPiece && midPiece[0] !== player) {
      if (isKing || dr === 2 * dir) return true;
    }
  }
  return false;
}

export function makeMove(
  board: BoardState,
  from: { row: number; col: number },
  to: { row: number; col: number }
): BoardState {
  const newBoard = board.map(row => [...row]);
  const piece = newBoard[from.row][from.col];
  newBoard[from.row][from.col] = null;
  newBoard[to.row][to.col] = piece;
  // Handle capturing
  if (Math.abs(to.row - from.row) === 2) {
    const midRow = (from.row + to.row) / 2;
    const midCol = (from.col + to.col) / 2;
    newBoard[midRow][midCol] = null;
  }
  // Handle kinging
  if (piece === 'w' && to.row === 0) newBoard[to.row][to.col] = 'wk';
  if (piece === 'b' && to.row === 7) newBoard[to.row][to.col] = 'bk';
  return newBoard;
}

export function getWinner(board: BoardState): 'w' | 'b' | null {
  let w = 0, b = 0;
  for (let row of board) {
    for (let cell of row) {
      if (cell && cell[0] === 'w') w++;
      if (cell && cell[0] === 'b') b++;
    }
  }
  if (w === 0) return 'b';
  if (b === 0) return 'w';
  return null;
} 