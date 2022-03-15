import React from 'react';
import styled from 'styled-components'
import { BoardPositionPresentation } from './board-position'
import { Marker, Piece } from '../../entities'

const Container = styled.div`
  width: 500px;
  height: 500px;
  background: url(${process.env.PUBLIC_URL}/board.png);
  background-repeat: no-repeat;
  background-size: cover;
`

export const BoardPresentation = (props: {
  pieces: Piece[],
  markers?: Marker[],
  onPieceClick?: (id: number) => void,
  onMarkerClick?: (id: number) => void
}) => (
  <Container>
    <BoardPositionPresentation {...props}/>
  </Container>
)