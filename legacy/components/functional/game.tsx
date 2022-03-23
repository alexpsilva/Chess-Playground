import React, { useState } from "react"
import { Marker, Piece, PiecePosition, Play, PositionedPiece } from "../../../src/entities"
import { PieceColor, PieceType } from "../../../src/entities/enums"
import { BoardPositionPresentation } from "../presentational/board-position"
import { PieceController } from "../../controllers/piece"
import { FENParser } from "../../../src/parsers/fen"

const {
  pieces: piecesArray, 
  playingColor: initialPlayingColor
} = FENParser.parse('rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1')
const initialPiecesById = piecesArray.reduce<{[id: string]: Piece}>(
  (previous, positioned) => ({...previous, [positioned.id]: positioned.piece}), 
  {}
)
const initialIdsByPosition = piecesArray.reduce<{[raw: number]: string}>(
  (previous, positioned) => ({...previous, [positioned.position.raw]: positioned.id}), 
  {}
)
const positionsById = piecesArray.reduce<{[id: string]: number}>(
  (previous, positioned) => ({...previous, [positioned.id]: positioned.position.raw}), 
  {}
)

export const Game = () => {
  const [piecesById, setPieces] = useState(initialPiecesById)
  const [idsByPosition, setPositions] = useState(initialIdsByPosition)
  const [colorPlaying, setColorPlaying] = useState(initialPlayingColor)
  const [selectedPieceId, setSelectedPiece] = useState<string>(undefined)
  const [possiblePlays, setPossiblePlays] = useState<Play[]>([])
  
  const pieceController = new PieceController({
    getPieceByPosition: (raw: number) => piecesById[idsByPosition[raw]],
    changeType: (pieceId: string, type: PieceType) => {
      const piece = piecesById[pieceId]
      piece.type = type // possible problem! should never write on a state if not through the callback
      setPieces((_piecesById) => ({
        ..._piecesById,
        [pieceId]: piece
      }))
    },
    movePiece: async (pieceId: string, destination: PiecePosition) => {
      const oldRaw = positionsById[pieceId]
      positionsById[pieceId] = destination.raw
      
      setPositions((_idsByPosition) => {
        const {[oldRaw]: _, ...newPosition} = _idsByPosition
        return { ...newPosition, [destination.raw]: pieceId}
      })
      
      const piece = piecesById[pieceId]
      piece.hasMoved = true // possible problem! should never write on a state if not through the callback
      setPieces((_piecesById) => ({
        ..._piecesById,
        [pieceId]: piece
      }))
      setSelectedPiece(undefined)
    },
    removePiece: (pieceId: string) => {
      const raw = positionsById[pieceId]
      delete positionsById[pieceId]
      
      setPositions((_idsByPosition) => {
        const {[raw]: _, ...newPosition} = _idsByPosition
        return newPosition
      })
    }
  })

  const selectPiece = (pieceId?: string) => {
    setSelectedPiece(pieceId)
    if(pieceId){
      setPossiblePlays(pieceController.calculatePiecePossiblePlays(new PositionedPiece({
        piece: piecesById[pieceId],
        position: new PiecePosition({raw: positionsById[pieceId]})
      })))
    } else {
      setPossiblePlays([])
    }
  }

  const passTurn = () => {
    setColorPlaying((_colorPlaying) => _colorPlaying === PieceColor.white ? PieceColor.black : PieceColor.white)
    selectPiece(undefined)
  }

  return <BoardPositionPresentation 
    pieces={Object.entries(idsByPosition).map(([raw, pieceId]): PositionedPiece => new PositionedPiece({
      piece: piecesById[pieceId], 
      position: new PiecePosition({raw: parseInt(raw)})
    }))}
    onPieceClick={(pieceId: string) => { 
      const piece = piecesById[pieceId]
  
      if(piece.color === colorPlaying) {
        selectPiece(pieceId)
      }
    }}
    markers={possiblePlays.map((play, id): Marker => {
      return new Marker({ id: id.toString(), position: play.position })
    })}
    onMarkerClick={async (id: string) => {
      possiblePlays[id].perform()
      passTurn()
    }}
  />
}