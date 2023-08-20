
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