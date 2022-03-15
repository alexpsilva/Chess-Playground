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

  addPiece(piece: Piece){ 
    this.piecesByRawPosition[piece.position.raw] = piece
    this.piecesById[this.lastId] = piece
    this.lastId += 1
  }

  movePiece(move: Move){
    const oldRaw = move.piece.position.raw
    this.piecesByRawPosition = {
      ...this.piecesByRawPosition,
      [move.destination.raw]: this.piecesByRawPosition[oldRaw]
    }
    delete this.piecesByRawPosition[oldRaw]
  }

  get pieces(){
    return Object.values(this.piecesById)
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