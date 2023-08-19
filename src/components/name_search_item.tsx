import React from "react";

export enum TaxonRank {
  Kingdom = 'KINGDOM',
  Phylum = 'PHYLUM',
  Order = 'ORDER',
  Family = 'FAMILY',
  Genus = 'GENUS',
  Species = 'SPECIES',
  Class = 'CLASS'
}
export const taxonRanks = [
  TaxonRank.Kingdom,
  TaxonRank.Phylum,
  TaxonRank.Order,
  TaxonRank.Family,
  TaxonRank.Genus,
  TaxonRank.Species,
  TaxonRank.Class,
];

export interface WideTaxonData {
  key: number,
  usageKey: number,
  scientificName: string,
  canonicalName: string,
  rank: string,
  status: string,
  confidence: number,
  matchType: string,
  kingdom: string,
  phylum: string,
  order: string,
  family: string,
  genus: string,
  species: string,
  kingdomKey: number,
  phylumKey: number,
  classKey: number,
  orderKey: number,
  familyKey: number,
  genusKey: number,
  speciesKey: number,
  synonym: boolean,
  class: string,
}

export interface TaxonData {
  
  // Names
  canonicalName: string,
  scientificName: string,
  kingdom: string,
  phylum: string,
  order: string,
  family: string,
  genus: string,
  species: string,
  
  // Keys
  key: number,
  kingdomKey: number,
  phylumKey: number,
  classKey: number,
  orderKey: number,
  familyKey: number,
  genusKey: number,
  speciesKey: number,
  
  // Other
  rank: string,
  status: string,
  confidence: number,
  matchType: string,
  synonym: boolean,
  class: string,
}


interface ItemProps {
  data: TaxonData,
  focusCallBack: ( item: Item )=>void,
}

interface ItemState {
  isChosen: boolean,
}

export class Item extends React.Component<ItemProps, ItemState> {
  
  constructor( props: ItemProps ) {
    super(props);
    this.state = {
      isChosen: false,
    };
  }

  focus() {
    this.props.focusCallBack(this);
    this.setState({isChosen: true});
  }

  defocus() {
    this.setState({isChosen: false});
  }

  render() {
    return (
      <div onClick={()=>{
        this.focus();
      }} style={{
        margin: '8px',
        border: this.state.isChosen ? '4px solid lightcoral' : '4px dashed lightgreen'
      }}>
        <h2>{this.props.data.canonicalName}</h2>
        <div className="gaped">
          <p className="description">Rank: {           this.props.data.rank}</p>
          <p className="description">Key: {            this.props.data.key}</p>
          <p className="description">Canonical name: {  this.props.data.canonicalName}</p>
          <p className="description">Scientific name: { this.props.data.scientificName}</p>
          <p className="description">Path: {
            this.props.data.kingdom + '-->' +
            this.props.data.phylum + '-->' +
            this.props.data.order + '-->' +
            this.props.data.family + '-->' +
            this.props.data.genus + '-->' +
            this.props.data.species
          }</p>
        </div>
      </div>
    );
  }
}

export {Item as NameSearchItem};