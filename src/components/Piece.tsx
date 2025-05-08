"use client";

import React from 'react';
import { PieceType } from '../lib/types';

interface PieceProps {
  type: PieceType;
}

const Piece: React.FC<PieceProps> = ({ type }) => {
  // Simple rendering for now
  if (!type) return null;
  const isWhite = type === 'w' || type === 'wk';
  const isKing = type === 'wk' || type === 'bk';
  return (
    <div style={{
      width: 44,
      height: 44,
      borderRadius: '50%',
      background: isWhite ? '#fff' : '#7b3f00',
      border: '3px solid #333',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'bold',
      fontSize: 20,
      color: isWhite ? '#2196f3' : '#f5f5f5',
      position: 'relative',
      boxShadow: isKing ? '0 0 0 4px gold' : undefined,
    }}>
      {isKing ? 'K' : ''}
    </div>
  );
};

export default Piece; 