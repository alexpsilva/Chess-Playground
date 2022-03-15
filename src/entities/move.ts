import { Piece, PiecePosition } from ".";

export interface Move {
  pieceId: number,
  destination: PiecePosition
}