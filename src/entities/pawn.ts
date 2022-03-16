import { Piece, PieceColor, PieceType } from "./piece";
import { PiecePosition } from "./position";

export class Pawn extends Piece {
  constructor(piece: {
    id: number,
    color: PieceColor,
    position?: PiecePosition,
    hasMoved?: boolean
  }) {
    super({...piece, type: PieceType.pawn})
  }
}