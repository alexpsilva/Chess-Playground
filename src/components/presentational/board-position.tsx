import React from 'react';
import styled from 'styled-components'
import { PiecePresentation } from './piece'
import { MarkerPresentation } from './marker';
import { Marker, Piece } from '../../entities'

const GridContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: inherit;
  height: inherit;

  display: grid;
  grid-template-columns: [col-1] 12.5% [col-2] 12.5%  [col-3] 12.5%  [col-4] 12.5%  [col-5] 12.5%  [col-6] 12.5%  [col-7] 12.5%  [col-8] 12.5%;
  grid-template-rows: [row-1] 12.5% [row-2] 12.5%  [row-3] 12.5%  [row-4] 12.5%  [row-5] 12.5%  [row-6] 12.5%  [row-7] 12.5%  [row-8] 12.5%;
`

// const GridItem = styled.div`
//   ${props => {
//     'grid-column': props.col,
//     'grid-row': props.row
//   }}
// `

export const BoardPositionPresentation = ({ pieces, markers, onPieceClick = () => {}, onMarkerClick = () => {} }: {
  pieces: Piece[],
  markers?: Marker[],
  onPieceClick?: (id: number) => void,
  onMarkerClick?: (id: number) => void
}) => {
  return <GridContainer>
    {pieces.map((piece) => (
      <div key={piece.id} style={{gridColumn: `col-${piece.position.col}`, gridRow: `row-${piece.position.row}`}} >
        <PiecePresentation 
          type={piece.type} 
          color={piece.color} 
          onClick={() => onPieceClick(piece.id)}
        >
          <a>{piece.position.raw}</a>
        </PiecePresentation>
      </div>
    ))}
    {markers?.map((marker) => (
      <div key={marker.id} style={{gridColumn: `col-${marker.position.col}`, gridRow: `row-${marker.position.row}`}} >
        <MarkerPresentation onClick={() => onMarkerClick(marker.id)}/>
      </div>
    ))}
  </GridContainer>
}