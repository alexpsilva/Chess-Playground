import React from 'react';
import styled from 'styled-components'
import { PieceDisposition } from './PieceDisposition'

const Container = styled.div`
  width: 500px;
  height: 500px;
  background: url(${process.env.PUBLIC_URL}/board.png);
  background-repeat: no-repeat;
  background-size: cover;
`

export const Board = ({ pieces }) => (
  <Container>
    <PieceDisposition pieces={pieces}/>
  </Container>
)