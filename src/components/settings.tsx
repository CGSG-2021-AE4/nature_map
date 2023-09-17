import { TileWMS } from "ol/source";
import React, { CSSProperties, createRef } from "react";
import { PushButton, ButtonValueType } from "./support";

// Setting
export enum ValueType {
  Text,
  // Args:
  //   min: number,
  //   max: number,
  Number,
  Bool,
  Toggle,
  // Args:
  //   elements: string[]
}

export interface ValueProps {
  type: ValueType;
  args?: any;
}

interface SettingProps {
  name: string;
  valueProps: ValueProps;
  value: number | string;
}

interface SettingState {
  valueRef: React.MutableRefObject<any>
}

class Setting extends React.Component<SettingProps, SettingState> {

  constructor( props: SettingProps ) {
    super(props);

    this.state = {
      valueRef: createRef(),
    };
  }

  renderValue(): JSX.Element {
    switch (this.props.valueProps.type) {
      case ValueType.Text:
        return (<input ref={this.state.valueRef} type="text" placeholder="value"/>);
      case ValueType.Number:
        return (<input ref={this.state.valueRef} type="number" min={this.props.valueProps.args.min} max={this.props.valueProps.args.max}/>);
      case ValueType.Bool:
        return (<PushButton ref={this.state.valueRef} name={this.props.name} valueType={ButtonValueType.EnabledDisabled}/>);
      case ValueType.Toggle:
        return (
          <select ref={this.state.valueRef}>
            {this.props.valueProps.args.elements.map((e, i)=>{
              return (<option key={i} value={e}>{e}</option>);
            })}
          </select>
        );
    }
  }

  getValue() {
    switch (this.props.valueProps.type) {
      case ValueType.Text:
        return this.state.valueRef.current.value as string;
      case ValueType.Number:
        return this.state.valueRef.current.valueAsNumber as number;
      case ValueType.Bool:
        return this.state.valueRef.current.getValue() as boolean; // tmp
      case ValueType.Toggle:
        return this.state.valueRef.current.value; // tmp ??
    }
  }

  render() {
    return (
      <div className="flexRow spaceBetween alignCenter">
         {this.props.name}: {this.renderValue()}
      </div>
    );
  }

  componentDidMount(): void {
    switch (this.props.valueProps.type) {
      case ValueType.Text:
        this.state.valueRef.current.value = this.props.value;
        break;
      case ValueType.Number:
        this.state.valueRef.current.value = this.props.value;
        break;
      case ValueType.Bool:
        this.state.valueRef.current.setValue(this.props.value);
        break;
      case ValueType.Toggle:
        this.state.valueRef.current.value = this.props.value;
        break;
    }
  }
}

// Settings

interface SettingsProps<ValuesType> {
  name: string;
  style?: CSSProperties;
  valuesProps: {
    [eName: string]: ValueProps;
  };
  values: ValuesType;
  setSettingsCallBack: ( newSettings: any )=>void;
  closeCallBack: ()=>void;
}

interface SettingsState {
  refs: React.MutableRefObject<Setting>[];
}

export class Settings<ValuesType> extends React.Component<SettingsProps<ValuesType>, SettingsState> {
 
  constructor( props: SettingsProps<ValuesType> ) {
    super(props);
    this.state = {
      refs: Object.keys(props.valuesProps).map(()=>{ return createRef(); })
    };
  }

  renderValues() {
    return Object.keys(this.props.valuesProps).map(( name: string, i: number )=>{
      return (<Setting ref={this.state.refs[i]} key={i} name={name} valueProps={this.props.valuesProps[name]} value={this.props.values[name]}/>);
    });
  }

  getSettingsValue(): ValuesType {
    var out: ValuesType = this.props.values;
    Object.keys(this.props.valuesProps).map(( name: string, i: number )=>{
      out[name] = this.state.refs[i].current.getValue();
    });
    return out;
  }

  render() {
    return (
      <div className="mainBg border1" style={this.props.style}>
        <div className="flexRow spaceBetween alignCenter" style={{ background: 'var(--shadow-color)' }}>
          <h3>{this.props.name}</h3>
          <div>
            <input type="button" value="Save" onClick={()=>{
              this.props.setSettingsCallBack(this.getSettingsValue());
              this.props.closeCallBack();
            }}/>
            <input type="button" value="Cancel" onClick={()=>{
              this.props.closeCallBack();
            }}/>
          </div>
        </div>
        <div className="padded">
          {this.renderValues()}
        </div>
      </div>
    );
  }
}