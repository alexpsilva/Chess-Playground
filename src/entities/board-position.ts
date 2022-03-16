import { Move, Piece, PieceColor, PieceType } from ".";
import { PiecePosition } from "./position";

export class BoardPosition {
  private piecesById: {[x: number]: Piece} = {}
  private piecesByRawPosition: {[x: number]: Piece} = {}
  private lastId: number = 0

  colorPlaying: PieceColor

  constructor(boardPosition?: {
    pieces?: Piece[],
    colorPlaying?: PieceColor
  }) {
    boardPosition?.pieces?.forEach((piece) => this.addPiece(piece))
    this.colorPlaying = boardPosition?.colorPlaying ?? PieceColor.white
  }

  get pieces(){
    return Object.values(this.piecesById)
  }

  getPieceById(pieceId: number): Piece {
    return this.piecesById[pieceId]
  }

  getPieceByRaw(raw: number): Piece {
    return this.piecesByRawPosition[raw]
  }

  addPiece(piece: Piece) { 
    this.piecesByRawPosition[piece.position.raw] = piece
    this.piecesById[this.lastId] = piece
    this.lastId += 1
  }

  removePieceById(pieceId: number) {
    const raw = this.piecesById[pieceId].position.raw
    delete this.piecesByRawPosition[raw]
    delete this.piecesById[pieceId]
  }

  removePieceByRaw(raw: number) {
    const pieceId = this.piecesByRawPosition[raw].id
    delete this.piecesByRawPosition[raw]
    delete this.piecesById[pieceId]
  }

  movePiece(move: Move){
    const { pieceId, destination } = move
    const piece = {...this.piecesById[pieceId]}
    
    this.removePieceById(piece.id)
    if(destination.raw in this.piecesByRawPosition){
      this.removePieceByRaw(destination.raw)
    }

    piece.position = new PiecePosition({raw: destination.raw})
    piece.hasMoved = true
    this.piecesByRawPosition[piece.position.raw] = piece
    this.piecesById[piece.id] = piece
    
    this.switchPlayer()
  }

  switchPlayer() {
    this.colorPlaying = this.colorPlaying === PieceColor.white ? PieceColor.black : PieceColor.white
  }

  positionColor(position: PiecePosition): PieceColor {
    return this.piecesByRawPosition[position.raw].color
  }

  isPositionOccupied(position: PiecePosition): boolean {
    return position?.raw in this.piecesByRawPosition
  }

  hopMovementPositions(pieceId: number, offsets: [number, number][]) {
    const positions: PiecePosition[] = []
    const piece = this.getPieceById(pieceId)

    for(const [row, col] of offsets) {
      const position = piece.position.offset(row, col)
      if(position && (!this.isPositionOccupied(position) || this.positionColor(position) !== piece.color)){
        positions.push(position)
      }
    }
    
    return positions
  }

  directionalMovementPositions(pieceId: number, directions: [number, number][], options?: {distanceLimit?: number, canCapture?: boolean}) {
    const positions: PiecePosition[] = []
    const piece = this.getPieceById(pieceId)

    for(const [row, col] of directions) {
      let distance = 1
      let wasBlocked = false
      while(!wasBlocked) {
        const position = piece.position.offset(distance*row, distance*col)
        if(!position || this.isPositionOccupied(position)){
          wasBlocked = true
        }
        
        if(position && (!this.isPositionOccupied(position) || (options?.canCapture && this.positionColor(position) !== piece.color))){
          positions.push(position)
        }
        distance++
        
        if(distance > options?.distanceLimit){
          break
        }
      }
    }
    
    return positions
  }

  capturePositions(pieceId: number): PiecePosition[] {
    const piece = this.getPieceById(pieceId)
    switch(piece.type) {
      case PieceType.pawn:
        return this.pawnCapturePositions(piece)
      case PieceType.knight:
        return this.knightCapturePositions(piece)
      case PieceType.bishop:
        return this.bishopCapturePositions(piece)
      case PieceType.rook:
        return this.rookCapturePositions(piece)
      case PieceType.king:
        return this.kingCapturePositions(piece)
      case PieceType.queen:
        return this.queenCapturePositions(piece)
      default:
        throw new Error(`${piece.type} is not a valid piece type`)
    }
  }

  pawnCapturePositions(piece: Piece): PiecePosition[] {
    const positions: PiecePosition[] = []
    const pawnDirection = this.colorPlaying === PieceColor.white ? 1 : -1

    const leftCapture = piece.position.offset(pawnDirection, -1)
    if(leftCapture && this.isPositionOccupied(leftCapture) && this.positionColor(leftCapture) !== piece.color){
      positions.push(leftCapture)
    }

    const rightCapture = piece.position.offset(pawnDirection, 1)
    if(rightCapture && this.isPositionOccupied(rightCapture) && this.positionColor(rightCapture) !== piece.color){
      positions.push(rightCapture)
    }

    // en-passant
    return positions
  }

  knightCapturePositions(piece: Piece): PiecePosition[] {
    return this.hopMovementPositions(
      piece.id,
      [[2, 1], [2,-1], [-2, 1], [-2,-1], [1, 2], [-1, 2], [1,-2], [-1,-2]]
    )
  }

  bishopCapturePositions(piece: Piece): PiecePosition[] {
    return this.directionalMovementPositions(
      piece.id, 
      [[ 1, 1],  [ 1,-1], [-1, 1],  [-1,-1]],
      {canCapture: true}
    )
  }

  rookCapturePositions(piece: Piece): PiecePosition[] {
    return this.directionalMovementPositions(
      piece.id, 
      [[1, 0], [-1, 0], [0, 1], [0,-1]],
      {canCapture: true}
    )
  }

  kingCapturePositions(piece: Piece): PiecePosition[] {
    return this.directionalMovementPositions(
      piece.id, 
      [[1, 0], [-1, 0], [0, 1], [0,-1], [1, 1], [1,-1], [-1, 1], [-1,-1]],
      {distanceLimit: 1, canCapture: true}
    )
  }

  queenCapturePositions(piece: Piece): PiecePosition[] {
    return this.directionalMovementPositions(
      piece.id, 
      [[1, 0], [-1, 0], [0, 1], [0,-1], [1, 1], [1,-1], [-1, 1], [-1,-1]],
      {canCapture: true}
    )
  }

  nonCapturePositions(pieceId: number): PiecePosition[] {
    const piece = this.getPieceById(pieceId)
    const positions: PiecePosition[] = []

    if(piece.type === PieceType.pawn) {
      const pawnDirection = this.colorPlaying === PieceColor.white ? 1 : -1

      const standardMove = piece.position.offset(pawnDirection, 0)
      if(standardMove && !this.isPositionOccupied(standardMove)){
        positions.push(standardMove)
      }

      const initialMove = piece.position.offset(2*pawnDirection, 0)
      if(initialMove && !this.isPositionOccupied(initialMove) && !piece.hasMoved) {
        positions.push(initialMove)
      }
    } else if(piece.type === PieceType.king) {
      // castling
    }
    return positions
  }

  legalPositions = (pieceId: number): PiecePosition[] => {
    const nonCaptures = this.nonCapturePositions(pieceId)
    const captures = this.capturePositions(pieceId)

    return [...nonCaptures, ...captures]
  }

  static fromFEN(FEN: string): BoardPosition {
    const newBoard = new BoardPosition()
    const splitFEN = FEN.split(' ')
    if(splitFEN.length !== 6){ throw new Error(`Invalid FEN provided. ${FEN}`) }

    let [piecesString, currentColor] = splitFEN
    piecesString = piecesString.replace(/\//g, '')
    newBoard.colorPlaying = currentColor === 'w' ? PieceColor.white : PieceColor.black

    let currentRaw = 0
    for(let stringIndex = 0; stringIndex < piecesString.length; stringIndex++) {
      const currentChar = piecesString[stringIndex]
      const charToInt = parseInt(currentChar)
      
      if (Number.isInteger(charToInt)) {
        currentRaw += charToInt
      }
      else {
        newBoard.addPiece(new Piece({
          id: newBoard.lastId,
          type: currentChar.toLowerCase() as PieceType,
          color: currentChar === currentChar.toUpperCase() ? PieceColor.black : PieceColor.white,
          position: new PiecePosition({raw: currentRaw + 1})
        }))    
        currentRaw += 1
      }
    }
    return newBoard
  }
}