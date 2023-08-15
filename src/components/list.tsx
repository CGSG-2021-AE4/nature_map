import React from 'react';

function FilterC( props: { name: string } ) {
  return (
    <div className="nodeFrame">
      <h1>{props.name}</h1>
      {/*<h2>{node.imgName}</h2>*/}
    </div>
  );
} /* End of 'FilterC' function */

export function FilterListC( props: { filterNames: Array<string> } ) {
  console.log("Node list...");

  return props.filterNames.map(name=>{
    return (<FilterC name={name}/>);
  });
} /* End of 'FilterListC' function */


