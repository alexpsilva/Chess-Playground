import { PiecePosition } from "./position"

export class Piece {
  id: number
  type: PieceType
  color: PieceColor
  position?: PiecePosition

  hasMoved: boolean

  constructor(piece: {
    id: number,
    type: PieceType,
    color: PieceColor,
    position?: PiecePosition,
    hasMoved?: boolean
  }) {
    this.id = piece.id
    this.type = piece.type
    this.color = piece.color
    this.position = piece.position
    this.hasMoved = piece.hasMoved ?? false
  }
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