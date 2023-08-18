
import React from 'react';
import { Filter } from "./filter";
import { comp } from './comp';

export class FilterList extends comp {
  filters = new Array<Filter>;

  constructor() {
    super();
  } /* End of 'constructor' functoin */

  renderC = ()=>{
    var [filtersCount, setFiltersCount] = React.useState(this.filters.length);

    return (
      <div className="filter filterList">
        <div className="filter rowFlex">
          <div className="filter mainPart">
            <h1>Filter list</h1>
          </div>
          <input type="button" className="filter addButton" onClick={()=>{
              this.filters.push(new Filter(( filter: Filter )=>{
                console.log("Remove:");
                console.log(filter);

                console.log(this.filters);
                for (let i = 0; i < this.filters.length; i++)
                  if (this.filters[i] === filter)
                  {
                    this.filters.splice(i, 1)
                    break;
                  }
                console.log(this.filters);
                setFiltersCount(this.filters.length);
              }));
              setFiltersCount(this.filters.length);
            }}/>
        </div>
        {
          this.filters.map(( filter: Filter )=>{
            if (filter != undefined)
              return (<filter.renderC/>);
          })
        }
      </div>
    );
  }; /* End of 'renderC' function */

  getRequestStr = ()=>{
    var outStr = "";

    this.filters.map((e)=>{
      if (outStr.length > 0)
        outStr += "&";        
      outStr += e.getRequestStr();
    });

    return outStr;
  }; /* End of 'getRequestStr' function */

} /* End of 'FilterList' class */