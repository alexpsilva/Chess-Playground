import { Piece, PiecePosition, Play, PositionedPiece } from "../entities";
import { PieceColor, PieceType } from "../entities/enums";
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
      case PieceType.pawn:
        return this.calculatePawnPlays(piece)
      case PieceType.knight:
        return this.calculateKnightPlays(piece)
      case PieceType.bishop:
        return this.calculateBishopPlays(piece)
      case PieceType.rook:
        return this.calculateRookPlays(piece)
      case PieceType.king:
        return this.calculateKingPlays(piece)
      case PieceType.queen:
        return this.calculateQueenPlays(piece)
      default:
        throw new Error(`${piece.type} is not a valid piece type`)
    }
  }

  calculatePawnPlays(piece: PositionedPiece): Play[] {
    // const distanceLimit = piece.hasMoved ? 2 : 1
    const pawnDirection = piece.color === PieceColor.white ? 1 : -1
    const plays = [
      ...this.calculateDirectionalMovementPlays(
        piece, [[ pawnDirection, 0]], {distanceLimit: 1, canCapture: false}
      ),
      ...this.calculateDirectionalMovementPlays(
        piece, [[ pawnDirection, 1], [ pawnDirection, -1]], {distanceLimit: 1, canCapture: true}
      )
    ]
    return plays
  }

  calculateBishopPlays(piece: PositionedPiece): Play[] {
    return this.calculateDirectionalMovementPlays(
      piece, 
      [[ 1, 1],  [ 1,-1], [-1, 1],  [-1,-1]],
      {canCapture: true}
    )
  }

  calculateRookPlays(piece: PositionedPiece): Play[] {
    return this.calculateDirectionalMovementPlays(
      piece, 
      [[1, 0], [-1, 0], [0, 1], [0,-1]],
      {canCapture: true}
    )
  }

  calculateKingPlays(piece: PositionedPiece): Play[] {
    return this.calculateDirectionalMovementPlays(
      piece, 
      [[1, 0], [-1, 0], [0, 1], [0,-1], [1, 1], [1,-1], [-1, 1], [-1,-1]],
      {distanceLimit: 1, canCapture: true}
    )
  }

  calculateQueenPlays(piece: PositionedPiece): Play[] {
    return this.calculateDirectionalMovementPlays(
      piece, 
      [[1, 0], [-1, 0], [0, 1], [0,-1], [1, 1], [1,-1], [-1, 1], [-1,-1]],
      {canCapture: true}
    )
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

  private calculateDirectionalMovementPlays(
    piece: PositionedPiece, 
    directions: [number, number][], 
    options?: {distanceLimit?: number, canCapture?: boolean
  }): Play[] {
    const plays: Play[] = []

    for(const [row, col] of directions) {
      let distance = 1
      while(distance < 8) {
        const position = piece.position.offset(distance*row, distance*col)
        if(!position){
          break
        } 

        const play = this.moveOrCapture(piece, position)
        if(!play || (play instanceof Capture && !options.canCapture)){
          break
        }
        
        plays.push(play)
        
        distance++
        if(distance > options?.distanceLimit){
          break
        }
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
    }

    return null
  }
}