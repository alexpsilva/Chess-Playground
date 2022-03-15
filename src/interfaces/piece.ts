export interface Piece {
  id: number
  type: PieceType
  color: PieceColor
  position?: PiecePosition
}

export enum PieceType {
  pawn = 'pawn',
  knight = 'knight',
  bishop = 'bishop',
  rook = 'rook',
  queen = 'queen',
  king = 'king',
}

export enum PieceColor {
  black = 'black',
  white = 'white',
}

export interface PiecePosition {
  row: number
  col: PiecePositionColumn
}

export enum PiecePositionColumn {
  A = 'a',
  B = 'b',
  C = 'c',
  D = 'd',
  E = 'e',
  F = 'f',
  G = 'g',
  H = 'h',
}