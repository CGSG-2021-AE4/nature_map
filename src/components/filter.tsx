import React, {DetailedHTMLProps} from 'react';
import { comp } from './comp';
import { Draggable } from 'drag-react';
import { createSignal, For } from "solid-js";
import { dndzone } from "solid-dnd-directive";
import { DivProps } from "react-html-props";


export enum FilterType {
  Default,
  Edit
}

export class Filter extends comp{
  name: string;
  value: string;

  removeCallBack;

  constructor( removeCallBack ) {
    super();
    this.removeCallBack = removeCallBack;
  } /* End of 'constructor' functoin */

  handleDragStart(event) {
      // This method runs when the dragging starts
      console.log("Started")
  }

  handleDrag(event) {
      // This method runs when the component is being dragged
      console.log("Dragging...")
  }

  handleDragEnd(event) {
      // This method runs when the dragging stops
      console.log("Ended")
  }

  renderC = ()=>{
    let [filterType, setFilterType] = React.useState(FilterType.Edit);
    let [name, setName] = React.useState(this.name);
    let [value, setValue] = React.useState(this.value);

     const containerStyle = {
      border: "1px solid black",
      padding: "0.3em",
      "max-width": "200px"
    };
    const itemStyle = {
      border: "1px solid blue",
      padding: "0.3em",
      margin: "0.2em 0"
    };

    interface ItemIa {
      id: number,
      title: string
    }
    
    const [items, setItems] = createSignal([
      { id: 1, title: "item 1" },
      { id: 2, title: "item 2" },
      { id: 3, title: "item 3" }
    ]);
    function handleDndEvent(e) {
      const { items: newItems } = e.detail;
      setItems(newItems);
    }

    var t = items as DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

    if (filterType == FilterType.Default as FilterType) {
      return (
        <div className="filter filterFrame">
          <div className="filter mainPart">
            <p className="filter text">{this.name + ' = ' + this.value}</p>
          </div>
          <input type="button" className="filter editButton" onClick={()=>{
              setFilterType(FilterType.Edit);
            }}/>
          <input type="button" className="filter deleteButton"  onClick={()=>{
              this.removeCallBack(this);
            }}/>
        </div>
      );
    } else if (filterType == FilterType.Edit as FilterType) {
      return (
        <div className="filter filterFrame">
          <div className="filter mainPart">
            <input type="text" className="filter nameInput" value={name} placeholder="name" onChange={e=>{
                setName(e.target.value);
              }}/>
            <p style={{marginInline: '0.5em', padding: 0}}>=</p>
            <input type="text" className="filter valueInput" value={value} placeholder="value" onChange={e=>{
                setValue(e.target.value);
              }}/>
          </div>
          <input type="button" className="filter saveButton" onClick={()=>{
              this.name = name;
              this.value = value;
              setFilterType(FilterType.Default);
            }}/>
          <input type="button" className="filter deleteButton" onClick={()=>{
              this.removeCallBack(this);
            }}/>
        </div>
      );
    }
  } /* End of 'renderC' function */

  getRequestStr = ()=>{
    return this.name + "=" + this.value;
  }; /* End of 'getRequestStr' function */

} /* End of 'Filter' class */