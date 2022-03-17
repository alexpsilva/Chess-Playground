import React, { useState } from "react"
import { Marker, Piece, PiecePosition, Play, PositionedPiece } from "../../entities"
import { PieceColor, PieceType } from "../../entities/enums"
import { BoardPositionPresentation } from "../presentational/board-position"
import { PieceController } from "../../controllers/piece"
import { FENParser } from "../../parsers/fen"

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
      setPieces({
        ...piecesById,
        [pieceId]: piece
      })
    },
    movePiece: (pieceId: string, destination: PiecePosition) => {
      const oldRaw = positionsById[pieceId]
      positionsById[pieceId] = destination.raw
      
      const {[oldRaw]: _, ...newPosition} = idsByPosition
      setPositions({
        ...newPosition, 
        [destination.raw]: pieceId
      })
      setSelectedPiece(undefined)
    },
    removePiece: (pieceId: string) => {
      const raw = positionsById[pieceId]
      delete positionsById[pieceId]
      
      const {[raw]: _, ...newPosition} = idsByPosition
      setPositions(newPosition)
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
    setColorPlaying(colorPlaying === PieceColor.white ? PieceColor.black : PieceColor.white)
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
      } else {
        // (to-do) attempt to capture
      }
    }}
    markers={possiblePlays.map((play, id): Marker => {
      return { id: id.toString(), position: play.position }
    })}
    onMarkerClick={(id: string) => {
      possiblePlays[id].perform()
      passTurn()
    }}
  />
}