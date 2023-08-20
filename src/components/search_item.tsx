import React from "react";
import { Hidden } from "./hidden";
import { Title } from "./support";

enum ReqType {
  Match = 'Match',
  Seach = 'Search',
  SearchChildren = 'Search childer',
  LinkReq = 'Link req',
}

export enum TaxonRank {
  Kingdom = 'KINGDOM',
  Phylum = 'PHYLUM',
  Order = 'ORDER',
  Family = 'FAMILY',
  Genus = 'GENUS',
  Species = 'SPECIES',
  Class = 'CLASS',
  All = 'ALL',
}
export const taxonRanks = [
  TaxonRank.Kingdom,
  TaxonRank.Phylum,
  TaxonRank.Order,
  TaxonRank.Family,
  TaxonRank.Genus,
  TaxonRank.Species,
  TaxonRank.Class,
  TaxonRank.All,
];

function getLowerRank( rank: TaxonRank ) {
  switch (rank) {
    case TaxonRank.Kingdom:
      return TaxonRank.Phylum;
    case TaxonRank.Phylum:
      return TaxonRank.Class;
    case TaxonRank.Class:
      return TaxonRank.Order;
    case TaxonRank.Order:
      return TaxonRank.Family;
    case TaxonRank.Family:
      return TaxonRank.Genus;
    case TaxonRank.Genus:
      return TaxonRank.Species;
    case TaxonRank.Species:
    case TaxonRank.All:
      return TaxonRank.All;
  }
}

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
  setSearchCallBack?: ( type: ReqType, props: any )=>void
}

interface ItemState {
  isChosen: boolean,
  name: string
}

export class Item extends React.Component<ItemProps, ItemState> {
  
  constructor( props: ItemProps ) {
    super(props);
    this.state = {
      isChosen: false,
      name: props.data.rank + '::' + props.data.key
    };
    this.setName();
  }

  focus() {
    this.props.focusCallBack(this);
    this.setState({isChosen: true});
  }

  defocus() {
    this.setState({isChosen: false});
  }

  static async getJson( url: string ) {
    return fetch(url).then(res=>{ return res.json(); });
  }

  async setName() {
    const res = await Item.getJson(`https://api.gbif.org/v1/species/${this.props.data.key}/name`);
    
    if (res.n != undefined)
      this.setState({ name: res.n });
    else if (res.canonicalName != undefined)
      this.setState({ name: res.canonicalName });
    else if (res.scientificName != undefined)
      this.setState({ name: res.scientificName });
  }

  render() {
    return (
      <div onClick={(e)=>{
        if ((e.target as HTMLElement).nodeName != 'INPUT')
          this.focus();
      }} className={`rounded gaped ${this.state.isChosen ? 'solidC' : 'dashedG'}`}>
        <Title title={this.state.name} description={String(this.props.data.key)}/>
        <div className="gaped">
          <Hidden name="Details">
            <p>Canonical name: {  this.props.data.canonicalName}</p>
            <p>Scientific name: { this.props.data.scientificName}</p>
            <p>Rank: {            this.props.data.rank}</p>
            <p>Path:
              {/* Sorry, I can't without SHIT */}
                                                              <p style={{paddingLeft: '0.5em'}}>Kingdom: {this.props.data.kingdom}</p>
              {this.props.data.rank != TaxonRank.Kingdom && <><p style={{paddingLeft: '1.0em'}}>Phylum: {this.props.data.phylum}</p>
              {this.props.data.rank != TaxonRank.Phylum  && <><p style={{paddingLeft: '1.5em'}}>Order: {this.props.data.order}</p>
              {this.props.data.rank != TaxonRank.Order   && <><p style={{paddingLeft: '2.0em'}}>Family: {this.props.data.family}</p>
              {this.props.data.rank != TaxonRank.Family  && <><p style={{paddingLeft: '2.5em'}}>Genus: {this.props.data.genus}</p>
              {this.props.data.rank != TaxonRank.Species && <><p style={{paddingLeft: '3.0em'}}>Species: {this.props.data.species}</p>
              </>}</>}</>}</>}</>}
            </p>
          </Hidden>
          <input type="button" value="See childs" onClick={()=>{
              this.props.setSearchCallBack(ReqType.Seach, {
                q: '',
                rank: getLowerRank(this.props.data.rank as TaxonRank),
                higherTaxon: this.props.data,
              });
            }}/>
        </div>
      </div>
    );
  }
}

export {Item as NameSearchItem};