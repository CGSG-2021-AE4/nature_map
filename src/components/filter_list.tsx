
import React from 'react';
import { Filter, } from "./filter";
import { comp } from './comp';
import update from 'immutability-helper';
import { genID } from './comp';

 

// interface FilterListProps {
//   id: number
// }
// interface FilterListState {
//   id: number,
//   filters: {
//     id: number,
//     dom: React.ReactNode
//   }[],
// }

// export class FilterList extends React.Component<React.PropsWithChildren<FilterListProps>, FilterListState> {
//   constructor( props: React.PropsWithChildren<FilterListProps> ) {
//     super(props);
//     this.state = {
//       id: props.id,
//       filters: props.children instanceof Array ? props.children.map(( e, i )=>{ return {id: i, dom: e}; }) : [{id: 0, dom: props.children}]
//     };
//   } /* End of 'constructor' function */

//   removeFilter( filter: Filter ) {
    
//   }

//   addFilter() {
//     this.setState( ( prevState )=>{
//       const id = genID();
//       return {
//         filters: update(prevState.filters, {
//           $push: [{
//             id: id,
//             dom: (<Filter key={this.state.id} listId={this.state.id} filterId={id} removeCallBack={this.removeFilter} />)
//           }]
//         })
//       };
//     });
//   }

  

//   render() {
//     return (
//       <div className="filter filterList">
//         <div className="filter rowFlex">
//           <div className="filter mainPart">
//             <h1>Filter list</h1>
//           </div>
//           <input type="button" className="filter addButton" onClick={()=>{
//               this.filters.push(new Filter(( filter: Filter )=>{
//                 console.log("Remove:");
//                 console.log(filter);

//                 console.log(this.filters);
//                 for (let i = 0; i < this.filters.length; i++)
//                   if (this.filters[i] === filter)
//                   {
//                     this.filters.splice(i, 1)
//                     break;
//                   }
//                 console.log(this.filters);
//                 setFiltersCount(this.filters.length);
//               }));
//               setFiltersCount(this.filters.length);
//             }}/>
//         </div>
//         {this.state.filters}
//       </div>
//     );
//   } /* End of 'render' function */
// } /* End of 'FilterList' class */

// export class FilterList extends comp {
//   filters = new Array<Filter>;

//   constructor() {
//     super();
//   } /* End of 'constructor' functoin */

//   renderC = ()=>{
//     var [filtersCount, setFiltersCount] = React.useState(this.filters.length);

//     return (
//       <div className="filter filterList">
//         <div className="filter rowFlex">
//           <div className="filter mainPart">
//             <h1>Filter list</h1>
//           </div>
//           <input type="button" className="filter addButton" onClick={()=>{
//               this.filters.push(new Filter(( filter: Filter )=>{
//                 console.log("Remove:");
//                 console.log(filter);

//                 console.log(this.filters);
//                 for (let i = 0; i < this.filters.length; i++)
//                   if (this.filters[i] === filter)
//                   {
//                     this.filters.splice(i, 1)
//                     break;
//                   }
//                 console.log(this.filters);
//                 setFiltersCount(this.filters.length);
//               }));
//               setFiltersCount(this.filters.length);
//             }}/>
//         </div>
//         {
//           this.filters.map(( filter: Filter )=>{
//             if (filter != undefined)
//               return (<filter.renderC/>);
//           })
//         }
//       </div>
//     );
//   }; /* End of 'renderC' function */

//   getRequestStr = ()=>{
//     var outStr = "";

//     this.filters.map((e)=>{
//       if (outStr.length > 0)
//         outStr += "&";        
//       outStr += e.getRequestStr();
//     });

//     return outStr;
//   }; /* End of 'getRequestStr' function */

// } /* End of 'FilterList' class */