import { PositionedPiece, PiecePosition } from ".";
import { PieceType } from "./enums";

interface GameOperations {
  changeType: (pieceId: string, type: PieceType) => void,
  movePiece: (pieceId: string, destination: PiecePosition) => void,
  removePiece: (pieceId: string) => void,
}

export abstract class Play {
  gameOperations: GameOperations

  constructor(gameOperations: GameOperations) {
    this.gameOperations = gameOperations
  }

  abstract get position(): PiecePosition
  abstract perform(): void
  abstract toString(): string
}

export class Move extends Play {
  piece: PositionedPiece
  destination: PiecePosition

  constructor(
    gameOperations: GameOperations, 
    play: {piece: PositionedPiece, destination: PiecePosition}
  ) {
    super(gameOperations)
    this.piece = play.piece
    this.destination = play.destination
  }

  get position(): PiecePosition {
    return this.destination
  }

  perform(): void {
    this.gameOperations.movePiece(this.piece.id, this.destination)
  }

  toString() {
    return null
  }
}

export class Promote extends Play {
  piece: PositionedPiece
  type: PieceType
  promotingPlay: Play

  constructor(
    gameOperations: GameOperations, 
    play: {piece: PositionedPiece, type: PieceType, promotingPlay: Play}
  ) {
    super(gameOperations)
    this.piece = play.piece
    this.type = play.type
    this.promotingPlay = play.promotingPlay
  }

  get position(): PiecePosition {
    return this.promotingPlay.position
  }

  perform(): void {
    this.promotingPlay.perform()
    this.gameOperations.changeType(this.piece.id, this.type)
  }

  toString() {
    return null
  }
}

export class Capture extends Play {
  capturer: PositionedPiece
  captured: PositionedPiece

  constructor(
    gameOperations: GameOperations, 
    play: {capturer: PositionedPiece, captured: PositionedPiece}
  ) {
    super(gameOperations)
    this.capturer = play.capturer
    this.captured = play.captured
  }

  get position(): PiecePosition {
    return this.captured.position
  }

  perform(): void {
    this.gameOperations.removePiece(this.captured.id)
    this.gameOperations.movePiece(
      this.capturer.id, 
      new PiecePosition({raw: this.captured.position.raw})
    )
  }

  toString() {
    return null
  }
}

export class Castle extends Play {
  king: PositionedPiece
  rook: PositionedPiece

  constructor(
    gameOperations: GameOperations, 
    play: {king: PositionedPiece, rook: PositionedPiece}
  ) {
    super(gameOperations)
    this.king = play.king
    this.rook = play.rook
  }

  get position(): PiecePosition {
    return this.kingCastledPosition
  }

  perform(): void {
    this.gameOperations.movePiece(this.king.id, this.kingCastledPosition)
    this.gameOperations.movePiece(this.rook.id, this.rookCastledPosition)
  }

  toString() {
    return null
  }

  private get castleDirection(): number {
    return this.king.position.col < this.rook.position.col ? 1 : -1
  }

  private get kingCastledPosition(): PiecePosition {
    return new PiecePosition({
      coordinates: {
        row: this.king.position.row, 
        col: this.king.position.col + this.castleDirection*2
      }
    })
  }

  private get rookCastledPosition(): PiecePosition {
    return new PiecePosition({
      coordinates: {
        row: this.king.position.row, 
        col: this.king.position.col + this.castleDirection*1
      }
    })
  }
}

export class EnPassant extends Play {
  capturer: PositionedPiece
  captured: PositionedPiece

  constructor(
    gameOperations: GameOperations, 
    play: {capturer: PositionedPiece, captured: PositionedPiece
  }) {
    super(gameOperations)
    this.capturer = play.capturer
    this.captured = play.captured
  }

  get position(): PiecePosition {
    return this.enPassantPosition
  }

  perform(): void {
    this.gameOperations.movePiece(this.capturer.id, this.enPassantPosition)
    this.gameOperations.removePiece(this.captured.id)
  }

  toString() {
    return null
  }

  private get enPassantPosition(): PiecePosition {
    return new PiecePosition({
      coordinates: {
        row: this.captured.position.row - 1, 
        col: this.captured.position.col
      }
    })
  }
}