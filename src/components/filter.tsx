
import React from 'react';

export enum FilterType {
  Default,
  Edit
}

export class Filter {
  name: string;
  value: string;

  removeCallBack;

  constructor( removeCallBack ) {
    this.removeCallBack = removeCallBack;
  } /* End of 'constructor' functoin */

  render = ()=>{
    let [filterType, setFilterType] = React.useState(FilterType.Edit);
    let [name, setName] = React.useState(this.name);
    let [value, setValue] = React.useState(this.value);
    
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
  } /* End of 'render' function */

  getRequestStr = ()=>{
    return this.name + "=" + this.value;
  }; /* End of 'getRequestStr' function */

} /* End of 'Filter' class */

export function FilterC( props: { filter: Filter } ) {
  return props.filter.render();
} /* End of 'FilterC' function */