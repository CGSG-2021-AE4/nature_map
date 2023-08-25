import React from "react";

interface HiddenProps {
  name: string
}

export function Hidden( props: React.PropsWithChildren<HiddenProps> ): JSX.Element {
  const [isShow, setShow] = React.useState(false);

  return (
    <div className={`hidden ${isShow ? 'showed' : ''}`}>
      <div className={`flexRow hiddenHeader ${isShow ? 'showed' : ''}`} onClick={(e)=>{
        e.stopPropagation();
        setShow(!isShow);
      }}>
        <h3 className="flex1" style={{ padding: '0.2em' }}>{props.name}</h3>
        <input type="button" className={isShow ? ' hideButton show' : 'hideButton'}/>
      </div>
      {isShow && props.children}
    </div>
  );
}

interface TitleProps {
  title: string,
  description?: string,
}

export function Title( props: TitleProps ): JSX.Element {
  return (
    <div style={{
      paddingLeft: '0.5em',
      overflow: 'hidden',
    }}>
      <h2 style={{
        padding: 0,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        fontSize: '1.3em',
      }}>{props.title}</h2>
      {props.description != undefined && <p className="description" style={{ paddingLeft: '0.5em' }}>{props.description}</p>}
    </div>
  );
}

export interface ValueProps {
  name: string,
  value: string,
  ind?: number,
  paddingInd?: number 
}

export function Value( props: ValueProps ): JSX.Element {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'row',
      justifyContent: 'space-between',
      background: props.ind != undefined ? (props.ind % 2 == 1 ? 'var(--shadow-color)' : 'transparent') : 'transparent',
      paddingBlock: '0.3em',
      paddingInline: '0.8em',
    }}>
      <p style={{ padding: 0, paddingLeft: props.paddingInd != undefined ? `${props.paddingInd}em` : 0 }}>{props.name}:</p>
      <p style={{ padding: 0 }}>{props.value}</p>
    </div>
  );
}

export function ValueList( props: { list: ValueProps[] } ) {
  return props.list.map((e, i)=>{ return (<Value {...e} ind={i}/>); });
}
