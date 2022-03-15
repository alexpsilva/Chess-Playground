import { Move, Piece, PieceColor, PieceType } from ".";
import { PiecePosition } from "./position";

export class BoardPosition {
  private piecesById: {[x: number]: Piece} = {}
  private piecesByRawPosition: {[x: number]: Piece} = {}
  private lastId: number = 0

  currentColor: PieceColor

  constructor(boardPosition?: {
    pieces?: Piece[],
    currentColor?: PieceColor
  }) {
    boardPosition?.pieces?.forEach((piece) => this.addPiece(piece))
    this.currentColor = boardPosition?.currentColor ?? PieceColor.white
  }

  get pieces(){
    return Object.values(this.piecesById)
  }

  addPiece(piece: Piece){ 
    this.piecesByRawPosition[piece.position.raw] = piece
    this.piecesById[this.lastId] = piece
    this.lastId += 1
  }

  movePiece(move: Move){
    const piece = this.piecesById[move.pieceId]
    piece.position = new PiecePosition({raw: move.destination.raw})
    piece.hasMoved = true

    const oldRaw = piece.position.raw
    this.piecesByRawPosition = { ...this.piecesByRawPosition, [move.destination.raw]: piece }
    delete this.piecesByRawPosition[oldRaw]
  }

  legalMoves = (pieceId: number): Move[] => {
    const piece = this.piecesById[pieceId]
    let candidateMoves: Move[] = []
  
    switch(piece.type){
      case PieceType.pawn:
        // (to-do) check pawn direction
        candidateMoves = [
          ...candidateMoves,
          { pieceId, destination: new PiecePosition({ raw: piece.position.raw + 8 }) }
        ]
        if(!piece.hasMoved) {
          candidateMoves = [
            ...candidateMoves,
            { pieceId, destination: new PiecePosition({ raw: piece.position.raw + 16 }) }
          ]
        }
        // (to-do) standard capture
        // (to-do) en-passant  capture
    }
  
    // (to-do) check move in bounds
    // (to-do) check move is blocked
    // (to-do) check move legal (doesn`t expose the king)
    return candidateMoves
  }

  static fromFEN(FEN: string): BoardPosition {
    const newBoard = new BoardPosition()
    const splitFEN = FEN.split(' ')
    if(splitFEN.length !== 6){ throw new Error(`Invalid FEN provided. ${FEN}`) }

    let [piecesString, currentColor] = splitFEN
    piecesString = piecesString.replace(/\//g, '')
    newBoard.currentColor = currentColor === 'w' ? PieceColor.white : PieceColor.black

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