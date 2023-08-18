import { DndProvider, useDrag, useDrop} from 'react-dnd';
import type { Identifier, XYCoord } from 'dnd-core'
import React from 'react';
import { genID } from './comp';


export interface DragItemProps {
  index: number,
  type: string,
  boxId: number,
  removeFromBoxCallBack: ( index: number ) => void,
};

interface DragItemState {
  id: number,
  index: number,
  boxId: number,
  removeFromBoxCallBack: ( index: number ) => void,
}

export interface DragItemInfo {
  id: number,
  index: number,
  boxId: number,
  children: any,
  removeFromBoxCallBack: ( index: number ) => void,
}

export function DragItem( props: React.PropsWithChildren<DragItemProps> )  {
  const [state, setState] = React.useState({id: genID(), ...props} as DragItemState);

  const [{ isDragging }, drag] = useDrag({
    type: props.type,
    item: () => {
      return {...state, children: props.children} as DragItemInfo;
    },
    collect: (monitor: any) => {
      return {isDragging: monitor.isDragging()};
    },
  });

  const opacity = 1;//isDragging ? 0.5 : 1;
  return (
  <div 
    ref={drag}
    style={{
    border: '4px solid red',
    opacity: opacity
  }}>
    {props.children != undefined && props.children}
  </div>
  );
} /* End of 'DragItem' function */

// export class DragItem extends React.Component<React.PropsWithChildren<DragItemProps>, DragItemState> {
  
//   constructor( props: DragItemProps ) {
//     super(props);
//     this.state = {id: genID(), ...props};
//   } /* End of 'constructor' function */

//   render() {
//     const [{ isDragging }, drag] = useDrag({
//       type: 'AA',
//       item: () => {
//         return this.state as DragItemInfo;
//       },
//       collect: (monitor: any) => {
//         return {isDragging: monitor.isDragging()};
//       },
//     })
  
//     const opacity = 1;//isDragging ? 0.5 : 1;
//     return (
//      <div style={{
//         border: '4px solid red',
//         opacity: opacity
//        }}>
//        {this.props.children}
//      </div>
//     );
//   } /* End of 'render' function */

// } /* End of 'DragItem' class */ 

/*
const style = {
  border: '1px dashed gray',
  padding: '0.5rem 1rem',
  marginBottom: '.5rem',
  backgroundColor: 'white',
  cursor: 'move',
}


export interface CardProps {
  id: any
  text: string
  index: number
  boxID: number
  moveCard: ( dragIndex: number, hoverIndex: number ) => void
  removeCard: ( cardID: number ) => void
}

export interface DragItem {
  index: number
  id: number
  boxID: number
  type: string
  text: string
  removeCallBack: () => void
}

export const Card: React.FC<CardProps> = ({ id, text, index, moveCard, removeCard, boxID }) => {
  
  const [{ isDragging }, drag] = useDrag({
    type: 'CARD',
    item: (): DragItem => {
      return {
        id: id,
        boxID: boxID,
        type: 'CARD',
        index: index,
        text: text,
        removeCallBack: ()=>{
          removeCard(id);
        }
      };
    },
    collect: (monitor: any) => {
      return {isDragging: monitor.isDragging()};
    },
  })

  const opacity = isDragging ? 0.3 : 1;
  return (
    <div ref={drag} style={{ ...style, opacity: opacity }}>
      {text}
    </div>
  )
}
*/