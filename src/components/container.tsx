import { comp, genID } from './comp';
import { DndProvider, useDrag, useDrop} from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import React from 'react';
import { DragItem, DragItemProps, DragItemInfo } from './card';
 

interface DropBoxProps {
  type: string
  style?,
  children?: React.ReactNode[] | React.ReactNode
}

interface DropBoxState {
  items: React.ReactNode[],
  id: number
}

export function DropBox( props: DropBoxProps ) {
  const [state, setState] = React.useState({
    items: props.children instanceof Array ? props.children : [props.children],
    id: genID()
  } as DropBoxState);

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
} /* End of 'DropBox' function */

// export class DropBox extends React.Component<DropBoxProps, DropBoxState> {
  
//   constructor( props: DropBoxProps ) {
//     super(props);
//     this.state = {
//       items: props.children instanceof Array ? props.children : [props.children],
//       id: genID()
//     };
//   } /* End of 'constructor' function */

//   addItem( newItem: React.ReactNode ) {
//     this.setState(( prevState )=>{
//         return {
//           items: update(prevState.items, {
//             $push: [newItem]
//           }),
//         };
//       }
//     );
//   } /* End of 'addItem' function */

//    removeItem( index: number ) {

//    } /* End of 'addItem' function */

//   render() {
//      return (
//       <div style={this.props.style}>
//         {this.state.items.map((item, i)=>{
//           return (
//             <DragItem
//               boxId={this.state.id}
//               type={this.props.type}
//               index={i}
//               removeFromBoxCallBack={this.removeItem}>
//               {item}
//             </DragItem>
//           );
//         })}
//       </div>
//      );
//   } /* End of 'render' function */

// } /* End of 'DropBox' class */

/*
export class Box extends comp {
  cards;
  id = genID();

  constructor( newCards: Item[] ) {
    super();
    this.cards = newCards;
  }

  renderC = ()=>{
    const [cards, setCards] = React.useState(this.cards);

    const removeCard = React.useCallback(( cardID: number ) => {
      setCards(
        (prevCards: Item[]) => {
          var ind = prevCards.findIndex((e)=>{
            return e.id == cardID;
          });

          return update(prevCards, {
            $splice: [[ind, 1]],
          });
        }
      );
    }, []);

    const addCard = React.useCallback(( card: Item ) => {
      setCards(
        (prevCards: Item[]) => 
          update(prevCards, {
            $push: [card],
          })
      );
    }, []);

    const moveCard = React.useCallback(( dragIndex: number, hoverIndex: number ) => {
      setCards(
        (prevCards: Item[]) =>
        update(prevCards, {
          $splice: [
            [dragIndex, 1],
            [hoverIndex, 0, prevCards[dragIndex] as Item],
          ],
        })
      )
    }, []);

    const renderCard = React.useCallback(
      (card: { id: number; text: string }, index: number) => {
        return (
          <Card
            key={card.id}
            index={index}
            id={card.id}
            text={card.text}
            moveCard={moveCard}
            removeCard={removeCard}
            boxID={this.id}
          />
        )
      },
      [],
    );

    const [{ isOver }, drop] = useDrop({
      accept: 'CARD',
      collect( monitor ) {
        return {
          isOver: monitor.isOver(),
        };
      },
      drop( item: DragItem, monitor ) {
        console.log(item);

        if (item.boxID != this.id)
        {
          // Move item from those box to this
          item.removeCallBack();
          addCard(item as Item);
        }
      }

    });

    return (
      <div style={{
        margin: '10px',
        backgroundColor: 'grey',
        border: '3px dashed',
        borderColor: isOver ? 'red' : 'gold',
        width: '500px',
        height: '700px'
      }} ref={drop}>
        {cards.map((card, i) => renderCard(card, i))}
      </div>
    );
  }
}

export class Over extends comp {
  box;

  constructor( newCards: Item[] ) {
    super();
    this.box = new Box(newCards);
  }

  renderC  = ()=>{
    return (
      <DndProvider backend={HTML5Backend}>
        <this.box.renderC/>
      </DndProvider>
    );
  }
}*/