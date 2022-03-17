import { Piece, PiecePosition, Play, PositionedPiece } from "../entities";
import { PieceColor, PieceType } from "../entities/enums";
import { Capture, Move } from "../entities/play";

interface GameOperations {
  getPieceByPosition: (raw: number) => Piece | null
  changeType: (pieceId: string, type: PieceType) => void,
  movePiece: (pieceId: string, destination: PiecePosition) => void,
  removePiece: (pieceId: string) => void,
}

enum PieceMovementPermisisons {
  canMove,
  canCapture,
  canMoveAndCapture,
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
        piece, [[ pawnDirection, 0]], {distanceLimit: 1, permission: PieceMovementPermisisons.canMove}
      ),
      ...this.calculateDirectionalMovementPlays(
        piece, [[ pawnDirection, 1], [ pawnDirection, -1]], {distanceLimit: 1, permission: PieceMovementPermisisons.canCapture}
      )
    ]
    return plays
  }

  calculateBishopPlays(piece: PositionedPiece): Play[] {
    return this.calculateDirectionalMovementPlays(
      piece, 
      [[ 1, 1],  [ 1,-1], [-1, 1],  [-1,-1]],
      {permission: PieceMovementPermisisons.canMoveAndCapture}
    )
  }

  calculateRookPlays(piece: PositionedPiece): Play[] {
    return this.calculateDirectionalMovementPlays(
      piece, 
      [[1, 0], [-1, 0], [0, 1], [0,-1]],
      {permission: PieceMovementPermisisons.canMoveAndCapture}
    )
  }

  calculateKingPlays(piece: PositionedPiece): Play[] {
    return this.calculateDirectionalMovementPlays(
      piece, 
      [[1, 0], [-1, 0], [0, 1], [0,-1], [1, 1], [1,-1], [-1, 1], [-1,-1]],
      {distanceLimit: 1, permission: PieceMovementPermisisons.canMoveAndCapture}
    )
  }

  calculateQueenPlays(piece: PositionedPiece): Play[] {
    return this.calculateDirectionalMovementPlays(
      piece, 
      [[1, 0], [-1, 0], [0, 1], [0,-1], [1, 1], [1,-1], [-1, 1], [-1,-1]],
      {permission: PieceMovementPermisisons.canMoveAndCapture}
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
    options?: {distanceLimit?: number, permission?: PieceMovementPermisisons}
  ): Play[] {
    const plays: Play[] = []

    for(const [row, col] of directions) {
      let distance = 1
      let wasBlocked = false
      while(!wasBlocked) {
        const position = piece.position.offset(distance*row, distance*col)
        if(!position){
          break // out of bounds
        } 

        const play = this.moveOrCapture(piece, position)
        const permission = options.permission ?? PieceMovementPermisisons.canMove
        if(!play 
          || (play instanceof Capture && permission === PieceMovementPermisisons.canMove)
          || (play instanceof Move && permission === PieceMovementPermisisons.canCapture)
        ){
          break // blocked and cannot proceed
        }
        
        plays.push(play)
        
        if(play instanceof Capture) {
          break // can capture but not proceed
        }

        distance++
        if(distance > options?.distanceLimit){
          break // piece reached distance limit
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