import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components'
import { Marker, PiecePosition } from '../../entities'
import { Board } from '../board';
import Piece from '../piece/piece'
import { selectAllPiecePositions } from './slice';

const GridContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: inherit;
  height: inherit;

  display: grid;
  grid-template-columns: [col-1] 12.5% [col-2] 12.5%  [col-3] 12.5%  [col-4] 12.5%  [col-5] 12.5%  [col-6] 12.5%  [col-7] 12.5%  [col-8] 12.5%;
  grid-template-rows: [row-8] 12.5% [row-7] 12.5%  [row-6] 12.5%  [row-5] 12.5%  [row-4] 12.5%  [row-3] 12.5%  [row-2] 12.5%  [row-1] 12.5%;
`

// const GridItem = styled.div`
//   grid-column: ${props => props.col};
//   grid-row': ${props => props.row};
// `

const BoardPosition = ({ rawPositionsByPiece, onPieceClick = () => {} }: {
  rawPositionsByPiece: {[id: string]: number},
  // markers?: Marker[],
  onPieceClick?: (id: string) => void,
  // onMarkerClick?: (id: string) => void
}) => {
  // (to-do) Create some logic to avoid multiple elements on the same grid position
  return (
    <Board>
      <GridContainer>
        {Object.entries(rawPositionsByPiece).map(([pieceId, raw]) => {
          const position = new PiecePosition({raw})
          return (
            <div key={pieceId} style={{gridColumn: `col-${position.col}`, gridRow: `row-${position.row}`}} >
              <Piece id={pieceId} onClick={onPieceClick}>
                <a>{position.raw}</a>
              </Piece>
            </div>
          )
        })}
        {/* {markers?.map((marker) => (
          <div key={marker.id} style={{gridColumn: `col-${marker.position.col}`, gridRow: `row-${marker.position.row}`}} >
            <MarkerPresentation onClick={() => onMarkerClick(marker.id)}/>
          </div>
        ))} */}
      </GridContainer>
    </Board>
  )
}

function mapStateToProps(state) {
  return {rawPositionsByPiece: selectAllPiecePositions(state)}
}

export default connect(mapStateToProps)(BoardPosition)