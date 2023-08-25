import React, { ReactComponentElement, ReactHTML, ReactPropTypes, createRef } from "react";
import { NameSearchItem, taxonRanks, WideTaxonData, TaxonData, TaxonRank } from "./search_item";
import { ValueList } from "./support";
import { getItemDetailsList } from "./search_item";
// Request types

export enum ReqType {
  Match = 'Match',
  Seach = 'Search',
  LinkReq = 'Link req',
}

const reqTypes = [
  //ReqType.Match,
  ReqType.Seach,
  ReqType.LinkReq,
];

const defReqType = ReqType.Seach;

// Data sets

const datasets: { name: string , discription: string, key: string }[] = [
  {
    name: 'GBIF Backbone Taxonomy',
    discription: 'default dataset (recomended)',
    key: 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c',
  },
  {
    name: 'Advanced',
    discription: 'wide search without dataset',
    key: '',
  },
];
const defaultDataSetInd = 0;

// Component interfaces

interface SearchProps {
  chooseItemCallBack: ( itemInfo: TaxonData )=>void;
}

interface SearchState {
  searchResultsCount: number,
  searchResultsIsEnd: boolean,
  searchResults: TaxonData[],
  searchProps: {
    match: {
      nameRef: React.MutableRefObject<any>,
    },
    search: {
      qRef: React.MutableRefObject<any>,
      rankRef: React.MutableRefObject<any>,
      datasetRef: React.MutableRefObject<any>,
    },
    linkReq: {
      linkRef: React.MutableRefObject<any>, 
    }
  },
  searchType: ReqType,
  isSearched: boolean,
  chosenTaxon: TaxonData,
}

export class Search extends React.Component<SearchProps, SearchState> {
  currentFocusItem: NameSearchItem;
  curSearchOffset: number;
  searchLimit: number;
  
  constructor( props: SearchProps ) {
    super(props);
    this.currentFocusItem = null;
    this.curSearchOffset = 0;
    this.searchLimit = 100;
    this.state = {
      searchResults: [],
      searchResultsCount: 0,
      searchResultsIsEnd: false,
      searchProps: {
        match: {
          nameRef: createRef(),
        },
        search: {
          qRef: createRef(),
          rankRef: createRef(),
          datasetRef: createRef(),
        },
        linkReq: {
          linkRef: createRef(), 
        },
      },
      searchType: defReqType,
      isSearched: false,
      chosenTaxon: null,
    }
  }

  itemFocusCallBack = ( item: NameSearchItem )=>{
    if (this.currentFocusItem != null)
      this.currentFocusItem.defocus();
    
    this.props.chooseItemCallBack(item.props.data);
    this.currentFocusItem = item;
  }

  // Search part

  static makeTaxonDataFromJson( resJson: any ): TaxonData {
    var taxonData =  resJson as WideTaxonData;
    if (taxonData.key == undefined)
      taxonData.key = taxonData.usageKey;

    return taxonData as TaxonData;
  }

  static makeSearchDataFromJson( type: ReqType, resJson: any ): TaxonData[] {
    switch (type) {
      case ReqType.Match:
        return [Search.makeTaxonDataFromJson(resJson)];
      case ReqType.Seach:
      case ReqType.LinkReq:
        return resJson.results.map(e=>{ return Search.makeTaxonDataFromJson(e)});
    }
  }

  static async makeReqStr( type: ReqType, reqInData: any ) {
    switch (type) {
      case ReqType.Match:
        return `https://api.gbif.org/v1/species/match?name=${reqInData.name}`;
      case ReqType.Seach:
        return `https://api.gbif.org/v1/species/search?${
          reqInData.dataset != '' ? 'dataset_key=' + reqInData.dataset + '&': ''}${
          reqInData.rank != 'ALL' ? 'rank=' + reqInData.rank + '&': ''}${
          reqInData.offset != undefined ? 'offset=' + reqInData.offset + '&' : ''}${
          reqInData.limit != undefined ? 'limit=' + reqInData.limit + '&' : ''}${
          reqInData.higherTaxonKey != null ? 'highertaxon_key=' + reqInData.higherTaxonKey + '&': ''}q=${reqInData.q}`;
      case ReqType.LinkReq:
        return reqInData.link;
    }
  }

  static async getJson( url: string ) {
    return fetch(url).then(res=>{ return res.json(); });
  }

  clearSearch() {
    this.curSearchOffset = 0;
    this.setState({
      isSearched: false,
      searchResults: [],
    });
  }

  async search( searchLimit?: number ) {
    var reqData;
    switch (this.state.searchType) {
      case ReqType.Match:
        reqData = {
          name: this.state.searchProps.match.nameRef.current.value
        };
        break;
      case ReqType.Seach:
        reqData = {
          higherTaxonKey: this.state.chosenTaxon != null ? this.state.chosenTaxon.key : null,
          q: this.state.searchProps.search.qRef.current.value,
          rank: this.state.searchProps.search.rankRef.current.value,
          dataset: datasets[this.state.searchProps.search.datasetRef.current.value].key,
          offset: this.curSearchOffset,
          limit: searchLimit != undefined ? searchLimit : this.searchLimit,
        };
        break;
      case ReqType.LinkReq:
        reqData = {
          link: this.state.searchProps.linkReq.linkRef.current.value
        };
        break;
    }

    const reqStr = await Search.makeReqStr(this.state.searchType, reqData);
    const res = await Search.getJson(reqStr);
    this.setState({
      searchResults: [...this.state.searchResults, ...Search.makeSearchDataFromJson(this.state.searchType, res)],
      searchResultsCount: res.count,
      searchResultsIsEnd: res.endOfRecords,
      isSearched: true,
    });
  }

  setSearchState = ( type: ReqType, props: any )=>{
    var isSearched = false;
    if (type != this.state.searchType)
      this.setState({ searchType: type });

    this.clearSearch();

    switch (type) {
      case ReqType.Match:
        this.state.searchProps.match.nameRef.current.value = props.name != undefined ? props.name : ''; // Name
        break;
      case ReqType.Seach:
        this.state.searchProps.search.datasetRef.current.value = props.dataset != undefined ? props.dataset : 0;    // Dataset index
        this.state.searchProps.search.qRef.current.value = props.q != undefined ? props.q : '';                     // Q
        this.state.searchProps.search.rankRef.current.value = props.rank != undefined ? props.rank : TaxonRank.All as string; // Rank
     
        if (props.higherTaxon != undefined) {
          isSearched = true;
          this.setState({ chosenTaxon: props.higherTaxon }, ()=>{
            this.search();
          }); // Higher taxon
        }
        break;
      case ReqType.LinkReq:
        this.state.searchProps.linkReq.linkRef.current.value = props.link != undefined ? props.link : ''; // Link
        break;
    }

    if (!isSearched)
      this.search();
  }

  renderSearchProps( type: ReqType ) {
    switch (type) {
      case ReqType.Match:
        return (
          <>
            Name: <input ref={this.state.searchProps.match.nameRef} type="text"/> <br/>
          </>
        );
      case ReqType.Seach:
        return (
          <>
            Dataset: <select ref={this.state.searchProps.search.datasetRef} >
              {datasets.map((e, i)=>{
                  return (<option key={i} value={i}>{e.name} -- {e.discription}</option>);
                })}
            </select> <br/>
            Name: <input ref={this.state.searchProps.search.qRef} type="text"/> <br/>
            Rank: <select ref={this.state.searchProps.search.rankRef}>
              {taxonRanks.map((e, i)=>{
                  return (<option key={i} value={e}>{e}</option>);
                })}
            </select>
            {this.state.chosenTaxon != null &&
              <div className="border1 gapped">
                <div className="flexRow spaceBetween shadowBg">
                  <p>Higher taxon:</p>
                  <input type='button' className="deleteButton" onClick={()=>{
                    this.setState({ chosenTaxon: null });
                  }}/>  
                </div>
                <ValueList list={getItemDetailsList(this.state.chosenTaxon)}></ValueList>
              </div>
            }
          </>
        );
      case ReqType.LinkReq:
        return (
          <>
            Link: <input ref={this.state.searchProps.linkReq.linkRef} type="text"/> <br/>
          </>
        );
    }
  }

  render() {
    return (
      <div className="flex1 fullMaxSize flexColumn">
        <div className="padded gapped flex0 mainBg border1"> {/* Settings box */}
          <h1>GBIF map</h1>
          Type: <select value={this.state.searchType} onChange={(e)=>{
            this.setState({ searchType: e.target.value as ReqType, isSearched: false, searchResults: []});
          }}>
            {reqTypes.map((e, i)=>{
              return (<option key={i} value={e}>{e}</option>);
            })}
          </select>
          <hr/>
          {this.renderSearchProps(this.state.searchType)}
          <hr/>
          <input type="button" value="search" onClick={()=>{
            this.clearSearch();
            // For quicker search
            this.search(20);
            this.search(80);
          }}/>
          {this.state.isSearched && <>Found {this.state.searchResultsCount} results.</>}
        </div>
        <div className={`gapped flex1 mainBg ${this.state.isSearched ? "border1" : ""}`} style={{ overflowY: 'auto' }}> {/* Search box */}
          <div>
            {this.state.searchResults.length != 0 && <>
              {this.state.searchResults.map((e, i)=>{
                return <NameSearchItem key={i} data={e} focusCallBack={this.itemFocusCallBack} setSearchCallBack={this.setSearchState}/>;
              })}
              {this.state.searchResultsIsEnd == false && <div className="flexRow" style={{ margin: '0.6em' }}>
                <input type="button" value="show more" className="gapped flex1" onClick={(e)=>{
                  this.curSearchOffset += this.searchLimit;
                  this.search();
                }}/>
              </div>}
            </>}
            {(this.state.searchResults.length == 0 && this.state.isSearched) && <div className="rounded dashedC gapped flexColumn" style={{
              alignItems: 'center'
            }}><h1 style={{ padding: 0 }}>No Results :/</h1></div>}
          </div>
        </div>
      </div>
    );
  }
}


/*
Good result link:

https://www.gbif.org/api/species/search
  ?advanced=false
  &dataset_key=d7dddbf4-2cf0-4f39-9b2a-bb099caae36c
  &facet=rank
  &facet=dataset_key
  &facet=constituent_key
  &facet=highertaxon_key
  &facet=name_type
  &facet=status
  &facet=issue
  &facet=origin
  &facetMultiselect=true
  &issue.facetLimit=100
  &locale=en
  &name_type.facetLimit=100
  &q=bird
  &rank=ORDER
  &rank.facetLimit=100
  &status.facetLimit=100
*/