import React from "react";
import { Hidden } from "./hidden";
import { Title, Value, ValueList, ValueProps } from "./support";

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

function getLowerRank( rank: TaxonRank ): TaxonRank {
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

function getRankName( data: TaxonData, rank: TaxonRank ): string {
  switch (rank) {
    case TaxonRank.Kingdom:
      return data.kingdom;
    case TaxonRank.Phylum:
      return data.phylum;
    case TaxonRank.Class:
      return data.class;
    case TaxonRank.Order:
      return data.order;
    case TaxonRank.Family:
      return data.family;
    case TaxonRank.Genus:
      return data.genus;
    case TaxonRank.Species:
      return data.species;
    case TaxonRank.All:
      return '';
  }
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
    const details: ValueProps[] = [
      { name: 'Rank', value: this.props.data.rank },
      { name: 'Name', value: this.props.data.canonicalName },
      { name: 'Sientific name', value: this.props.data.scientificName }
    ];

    if (this.props.data.rank != TaxonRank.Kingdom)
      details.push({ name: 'Parents', value: '' });

    var curRank = TaxonRank.Kingdom;

    while (String(curRank) != TaxonRank.All && curRank != this.props.data.rank) {
      const value = getRankName(this.props.data, curRank);
      if (value != '')
        details.push({
          name: curRank,
          value: getRankName(this.props.data, curRank),
          paddingInd: 1,
        });
      curRank = getLowerRank(curRank);
    }

    return (
      <div onClick={(e)=>{
        if ((e.target as HTMLElement).nodeName != 'INPUT')
          this.focus();
      }} className={`gaped ${this.state.isChosen ? 'border1Focus' : 'border1'}`}>
        <Title title={this.props.data.rank + " - " + this.state.name} description={String(this.props.data.key)}/>
        <div className="gaped">
          <Hidden name="Details"> 
            <ValueList list={details}/>
          </Hidden>
          <input type="button" value="See children" onClick={()=>{
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