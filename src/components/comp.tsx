import { createRoot } from 'react-dom/client';

export class comp {
  renderC = ()=>{
    console.log(`Component doesn't have overrided 'renderC' function but it's called.`);
    return (<></>);
  }; /* End of 'renderC' function */

  render = ( target: string )=> {
    const root = createRoot(document.getElementById(target));
    root.render(<this.renderC/>);
  }
} /* End of 'copm' class */

export function renderC( target: string, dom: any ) {
  const root = createRoot(document.getElementById(target));
  root.render(dom);
} /* End of 'renderC' function */

export function genID() {
  return Date.now() + Math.floor(Math.random() * 100);
} /* End of 'genID' function */