import React from "react";

interface HiddenProps {
  name: string
}

interface HiddenState {
  isShow: boolean
}

export class Hidden extends React.Component<React.PropsWithChildren<HiddenProps>, HiddenState> {
  
  constructor( props: React.PropsWithChildren<HiddenProps> ) {
    super(props);
    this.state = {
      isShow: false
    };
  }

  render() {
    return (
      <div className={`hidden ${this.state.isShow ? 'showed' : ''}`}>
        <div className={`flexRow hiddenHeader ${this.state.isShow ? 'showed' : ''}`} onClick={(e)=>{
          this.setState(prevState=>{ return { isShow: !prevState.isShow }; });
        }}>
          <h3 className="flex1" style={{ padding: '0.2em' }}>{this.props.name}</h3>
          <input type="button" className={this.state.isShow ? ' hideButton show' : 'hideButton'}/>
        </div>
        {this.state.isShow && this.props.children}
      </div>
    );
  }
}