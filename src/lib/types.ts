"use client";

import Piece from '../components/Piece';

export type PieceType = 'w' | 'b' | 'wk' | 'bk' | null;
export type BoardState = PieceType[][]; 