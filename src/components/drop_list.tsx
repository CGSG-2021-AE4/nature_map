import { comp, genID } from './comp';
import { DndProvider, useDrag, useDrop} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import React from 'react';
import { DragItem, DragItemProps, DragItemInfo } from './drag_item';
 

interface DropListProps {
  type: string,
  id?: number,
  style?,
  children?: React.ReactNode[] | React.ReactNode,
  //moveItemCallBack: ( itemId: number, oldBoxId: number, newBoxId: number )=>void
}

interface DropListState {
  items: React.ReactNode[],
  id: number,
}

export function DropList( props: DropListProps ) {
  const [state, setState] = React.useState({
    items: props.children instanceof Array ? props.children : [props.children],
    id: props.id != undefined ? props.id : genID(),
  } as DropListState);

  const addItem = ( newItem: React.ReactNode )=>{
    setState(( prevState )=>{
        return {
          id: prevState.id,
          items: update(prevState.items, {
            $push: [newItem]
          }),
        };
      }
    );
  };

  const removeItem = ( index: number )=>{
    setState(( prevState ) => {
        return {
          id: prevState.id,
          items: update(prevState.items, {
            $splice: [[index, 1]],
          })
        };
      }
    );
  };

  const [{ isOver }, drop] = useDrop({
    accept: props.type,
    collect( monitor ) {
      return {
        isOver: monitor.isOver(),
      };
    },
    drop( item: DragItemInfo, monitor ) {
      console.log(item);

      if (item.boxId != state.id)
      {
        // Move item from those box to this
        item.removeFromBoxCallBack(item.index);
        addItem(item.children);
      }
    }

  });

  return (
    <div ref={drop} style={props.style}>
      {state.items.map((item, i)=>{
        return (
          <DragItem
            boxId={state.id}
            type={props.type}
            index={i}
            removeFromBoxCallBack={removeItem}>
            {item}
          </DragItem>
        );
      })}
    </div>
  );
} /* End of 'DropList' function */