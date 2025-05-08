"use client";

import React from 'react';
import Piece from './Piece';
import styles from '../styles/Board.module.css';
import { BoardState, PieceType } from '../lib/types';

interface BoardProps {
  board: BoardState;
  onSquareClick: (row: number, col: number) => void;
  selected: { row: number; col: number } | null;
}

const Board: React.FC<BoardProps> = ({ board, onSquareClick, selected }) => {
  return (
    <div className={styles.board}>
      {board.map((row: PieceType[], rowIdx: number) => (
        <div key={rowIdx} className={styles.row}>
          {row.map((cell: PieceType, colIdx: number) => {
            const isSelected = selected && selected.row === rowIdx && selected.col === colIdx;
            return (
              <div
                key={colIdx}
                className={`${styles.square} ${(rowIdx + colIdx) % 2 === 1 ? styles.dark : styles.light} ${isSelected ? styles.selected : ''}`}
                onClick={() => onSquareClick(rowIdx, colIdx)}
              >
                {cell && <Piece type={cell} />}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};

export default Board; 