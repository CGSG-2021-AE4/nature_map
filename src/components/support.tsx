
interface TitleProps {
  title: string,
  description?: string,
}

export function Title( props: TitleProps ): JSX.Element {
  return (
    <div style={{
      paddingLeft: '0.5em'
    }}>
      <h2 style={{
        padding: 0
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
