import { Dispatch } from '@reduxjs/toolkit';
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components'
import { BOARD_SIZE } from '../../constants';
import { RootState } from '../../redux';
import { Board } from '../board';
import Piece from '../piece/piece'
import { PiecePositionState, selectAllPiecePositions } from './slice';

const GridContainer = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: inherit;
  height: inherit;

  display: grid;
  grid-template-columns:  [col-0] 12.5% [col-1] 12.5% [col-2] 12.5%  [col-3] 12.5%  [col-4] 12.5%  [col-5] 12.5%  [col-6] 12.5%  [col-7] 12.5%;
  grid-template-rows: [row-7] 12.5%  [row-6] 12.5%  [row-5] 12.5%  [row-4] 12.5%  [row-3] 12.5%  [row-2] 12.5%  [row-1] 12.5%  [row-0] 12.5%;
`

const GridItem = ({ children, col, row }) => (
  <div style={{gridColumn: `col-${col}`, gridRow: `row-${row}`}}>
    {children}
  </div>
)

const BoardPosition = ({ piecePositions, onPieceClick = () => {} }: {
  piecePositions: {[id: string]: PiecePositionState},
  // markers?: Marker[],
  onPieceClick?: (id: string) => void,
  // onMarkerClick?: (id: string) => void
}) => {
  // (to-do) Create some logic to avoid multiple elements on the same grid position
  return (
    <Board>
      <GridContainer>
        {Object.entries(piecePositions).map(([pieceId, position]) => 
          <GridItem key={pieceId} {...position}>
            <Piece id={pieceId} onClick={onPieceClick}/>
          </GridItem> 
        )}
        {/* {markers?.map((marker) => (
          <div key={marker.id} style={{gridColumn: `col-${marker.position.col}`, gridRow: `row-${marker.position.row}`}} >
            <MarkerPresentation onClick={() => onMarkerClick(marker.id)}/>
          </div>
        ))} */}
      </GridContainer>
    </Board>
  )
}

function mapStateToProps(state: RootState) {
  return {piecePositions: selectAllPiecePositions(state)}
}

const mapDispatchToProps = (dispatch: Dispatch, ownProps) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(BoardPosition)