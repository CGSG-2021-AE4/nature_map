
import React from 'react';
import { Filter } from "./filter";

export class FilterList {
  filters = new Array<Filter>;

  constructor() {
  } /* End of 'constructor' functoin */

  render = ()=>{
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
              return (<filter.render/>);
          })
        }
      </div>

      /*
      <div style={{
          margin: '0.5em',
          border: '3px dashed black'
        }}>
        <h1>Filter list:</h1>
        <input type="button" value="Add filter" onClick={()=>{
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
          }} style={{
            margin: '0.5em'
          }}/>
          */
        //{
        //  this.filters.map(( filter: Filter )=>{
        //    if (filter != undefined)
        //      return (<filter.render/>);
        //  })
        //}
      /*</div>*/
    );
  }; /* End of 'render' function */

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