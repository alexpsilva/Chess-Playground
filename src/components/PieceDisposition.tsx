import React from 'react';
import styled, { css } from 'styled-components'
import { Piece } from './Piece'

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

export const PieceDisposition = ({
  pieces
}) => {
  return <GridContainer>
    {pieces.map((piece, index: number) => (
      <div key={index} style={{gridColumn: `col-${piece.col}`, gridRow: `row-${piece.row}`}} >
        <Piece type={piece.type} color={piece.color}/>
      </div>
    ))}
  </GridContainer>
}