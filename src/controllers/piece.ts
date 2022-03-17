import { Piece, PiecePosition, Play, PositionedPiece } from "../entities";
import { PieceType } from "../entities/enums";
import { Capture, Move } from "../entities/play";

interface GameOperations {
  getPieceByPosition: (raw: number) => Piece | null
  changeType: (pieceId: string, type: PieceType) => void,
  movePiece: (pieceId: string, destination: PiecePosition) => void,
  removePiece: (pieceId: string) => void,
}

export class PieceController {
  gameOperations: GameOperations
  possiblePlays: Play[]

  constructor(gameOperations: GameOperations) {
    this.gameOperations = gameOperations
    this.possiblePlays = this.calculatePossiblePlays()
  }

  calculatePossiblePlays(): Play[] {
    return []
  }

  calculatePiecePossiblePlays(piece: PositionedPiece): Play[] {
    switch(piece.type) {
      // case PieceType.pawn:
      //   return this.pawnCapturePositions(piece)
      case PieceType.knight:
        return this.calculateKnightPlays(piece)
      // case PieceType.bishop:
      //   return this.bishopCapturePositions(piece)
      // case PieceType.rook:
      //   return this.rookCapturePositions(piece)
      // case PieceType.king:
      //   return this.kingCapturePositions(piece)
      // case PieceType.queen:
      //   return this.queenCapturePositions(piece)
      default:
        throw new Error(`${piece.type} is not a valid piece type`)
    }
  }

  calculateKnightPlays(piece: PositionedPiece): Play[] {
    const moveOffsets = [[2, 1], [2,-1], [-2, 1], [-2,-1], [1, 2], [-1, 2], [1,-2], [-1,-2]]
    const plays: Play[] = []

    for(const [row, col] of moveOffsets) {
      const position = piece.position.offset(row, col)
      if(!position){ continue }

      const play = this.moveOrCapture(piece, position)
      if(play) {
        plays.push(play)
      }
    }
    
    return plays
  }

  private moveOrCapture(piece: PositionedPiece, destination: PiecePosition): Move | Capture {
    const pieceAtPosition = this.gameOperations.getPieceByPosition(destination.raw)
    if(!pieceAtPosition) {
      return new Move(this.gameOperations, { piece: piece, destination: destination})
    } 
    
    if(pieceAtPosition.color !== piece.color) {
      return new Capture(this.gameOperations, { 
        capturer: piece, 
        captured: new PositionedPiece({piece: pieceAtPosition, position: destination}) 
      })
    } else {
      return null
    }
  }
}