import React, { useState } from "react";

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

export interface ScrollBoxProps {
  maxHeight: string,
}

export function ScrollBox( props: React.PropsWithChildren<ScrollBoxProps> ): JSX.Element {
  return (
    <div style={{
      maxHeight: props.maxHeight,
      overflowY: 'scroll',
    }}>
      {props.children}
    </div>
  );
}

export enum ButtonValueType {
  ValueName = 'ValueName',
  EnabledDisabled = 'EnabledDisabled',
  ActivePassive = 'ActivePassive',
  OnOff = 'OnOff',
}

interface PushButtonProps {
  name: string,
  value?: boolean,
  onChange?: ( newValue: boolean)=>void,
  valueType?: ButtonValueType,
}

interface PushButtonState {
  value,
}

export class PushButton extends React.Component<PushButtonProps, PushButtonState> {
  constructor( props: PushButtonProps ) {
    super(props);

    this.state = {
      value: props.value != undefined ? props.value : false,
    };
  }

  getValue(): boolean {
    return this.state.value;
  }

  setValue( newValue: boolean ): void {
    this.setState({ value: newValue });
  }

  getButtonValue() {
    if (this.props.valueType == undefined)
      return this.props.name;

    switch (this.props.valueType) {
      case ButtonValueType.ValueName:
        return this.props.name;
      case ButtonValueType.ActivePassive:
        if (this.state.value)
          return 'Active';
        else
          return 'Passive';
      case ButtonValueType.EnabledDisabled:
        if (this.state.value)
          return 'Enable';
        else
          return 'Disable';
      case ButtonValueType.OnOff:
        if (this.state.value)
          return 'On';
        else
          return 'Off';
    }
  }

  render() {
    return (
      <input type="button" className={`${this.state.value ? 'active' : ''}`} value={this.getButtonValue()} onClick={()=>{
        if (this.props.onChange != undefined)
          this.props.onChange(!this.state.value);
        this.setState({ value: !this.state.value });
      }}/>
    );
  }
}