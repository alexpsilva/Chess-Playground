import { PieceType, PieceColor } from "./enums"
import { PiecePosition } from "./position"

export class Piece {
  id: string
  type: PieceType
  color: PieceColor

  hasMoved: boolean
  static lastId: number = 0

  constructor(piece: {
    type: PieceType,
    color: PieceColor,
    hasMoved?: boolean,
  }) {
    this.id = (Piece.lastId++).toString()
    this.type = piece.type
    this.color = piece.color
    this.hasMoved = piece.hasMoved ?? false
  }
}

export class PositionedPiece{
  piece: Piece
  position: PiecePosition

  constructor(positionedPiece: {
    piece: Piece
    position: PiecePosition
  }) {
    this.piece = positionedPiece.piece
    this.position = positionedPiece.position
  }

  get id(): string {
    return this.piece.id
  }

  get type(): PieceType {
    return this.piece.type
  }

  set type(newType: PieceType) {
    this.piece.type = newType
  }

  get color(): PieceColor {
    return this.piece.color
  }

  set color(newColor: PieceColor) {
    this.piece.color = newColor
  }

  get hasMoved(): boolean {
    return this.piece.hasMoved
  }

  set hasMoved(hasMoved: boolean) {
    this.piece.hasMoved = hasMoved
  }
}