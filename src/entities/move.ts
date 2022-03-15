import { Piece, PiecePosition } from ".";

export interface Move {
  piece: Piece,
  destination: PiecePosition
}