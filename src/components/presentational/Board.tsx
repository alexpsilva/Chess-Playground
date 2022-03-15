import React from 'react';
import styled from 'styled-components'
import { PieceDisposition } from './PieceDisposition'
import { Marker, Piece } from '../../interfaces'

const Container = styled.div`
  width: 500px;
  height: 500px;
  background: url(${process.env.PUBLIC_URL}/board.png);
  background-repeat: no-repeat;
  background-size: cover;
`

export const Board = (props: {
  pieces: Piece[],
  markers?: Marker[],
  onPieceClick?: (id: number) => void,
  onMarkerClick?: (id: number) => void
}) => (
  <Container>
    <PieceDisposition {...props}/>
  </Container>
)