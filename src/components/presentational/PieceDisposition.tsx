import React from 'react';
import styled from 'styled-components'
import { Piece } from './Piece'
import { Marker as MarkerInterface, Piece as PieceInterface } from '../../interfaces'
import { Marker } from './Marker';

const GridContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: inherit;
  height: inherit;

  display: grid;
  grid-template-columns: [col-a] 12.5% [col-b] 12.5%  [col-c] 12.5%  [col-d] 12.5%  [col-e] 12.5%  [col-f] 12.5%  [col-g] 12.5%  [col-h] 12.5%;
  grid-template-rows: [row-1] 12.5% [row-2] 12.5%  [row-3] 12.5%  [row-4] 12.5%  [row-5] 12.5%  [row-6] 12.5%  [row-7] 12.5%  [row-8] 12.5%;
`

// const GridItem = styled.div`
//   ${props => {
//     'grid-column': props.col,
//     'grid-row': props.row
//   }}
// `

export const PieceDisposition = ({ pieces, markers, onPieceClick = () => {}, onMarkerClick = () => {} }: {
  pieces: PieceInterface[],
  markers?: MarkerInterface[],
  onPieceClick?: (id: number) => void,
  onMarkerClick?: (id: number) => void
}) => (
  <GridContainer>
    {pieces.map((piece) => (
      <div key={piece.id} style={{gridColumn: `col-${piece.position.col}`, gridRow: `row-${piece.position.row}`}} >
        <Piece 
          type={piece.type} 
          color={piece.color} 
          onClick={() => onPieceClick(piece.id)}
        />
      </div>
    ))}
    {markers?.map((marker) => (
      <div key={marker.id} style={{gridColumn: `col-${marker.position.col}`, gridRow: `row-${marker.position.row}`}} >
        <Marker onClick={() => onMarkerClick(marker.id)}/>
      </div>
    ))}
  </GridContainer>
)