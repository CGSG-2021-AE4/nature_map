import React, { ReactComponentElement, ReactHTML, ReactPropTypes, createRef } from "react";
import { NameSearchItem, taxonRanks, WideTaxonData, TaxonData, TaxonRank } from "./search_item";
import { ValueList, ScrollBox } from "./support";
import { getItemDetailsList, getTaxonData } from "./search_item";

function ObjToQuery( obj: any ): string {
  return Object.keys(obj).map(function(k) {
    return encodeURIComponent(k) + '=' + encodeURIComponent(obj[k])
  }).join('&');
}

// Request types

export enum ReqType {
  Seach = 'Search',
  LinkReq = 'Link req',
}

const reqTypes = [
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

// Search set data

interface SearchTypeSearchSetData {
  q: string,
  rank: TaxonRank,
  datasetKey: string,
  higherTaxon: number | TaxonData,
}

interface SearchTypeByLinkSetData {
  link: string,
}

// Component interfaces

interface SearchProps {
  //searchType: ReqType,
  //startData
  chooseItemCallBack: ( itemInfo: TaxonData )=>void;
}

interface SearchState {
  searchResultsCount: number,
  searchResultsIsEnd: boolean,
  searchResults: TaxonData[],
  searchProps: {
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
}/* End of 'SearchState' interface */ 

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
  } /* End of 'constructor' function */ 

  itemFocusCallBack = ( item: NameSearchItem )=>{
    if (this.currentFocusItem != null)
      this.currentFocusItem.defocus();
    
    this.props.chooseItemCallBack(item.props.data);
    this.currentFocusItem = item;
  } /* End of 'itemFocusCallBack' function  */ 

  // Search part

  static makeTaxonDataFromJson( resJson: any ): TaxonData {
    var taxonData =  resJson as WideTaxonData;
    if (taxonData.key == undefined)
      taxonData.key = taxonData.usageKey;

    return taxonData as TaxonData;
  } /* End of 'makeTaxonDataFromJson' function */ 

  static makeSearchDataFromJson( type: ReqType, resJson: any ): TaxonData[] {
    switch (type) {
      case ReqType.Seach:
      case ReqType.LinkReq:
        return resJson.results.map(e=>{ return Search.makeTaxonDataFromJson(e)});
    }
  } /* End of 'makeSearchDataFromJson' function */ 

  static async makeReqStr( type: ReqType, reqInData: any ) {
    switch (type) {
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
  } /* End of 'makeReqStr' function */ 

  static async getJson( url: string ) {
    return fetch(url).then(res=>{ return res.json(); });
  } /* End of 'getJson' function */ 

  clearSearch() {
    this.curSearchOffset = 0;
    this.setState({
      isSearched: false,
      searchResults: [],
    });
  } /* End of 'clearSearch' function */ 

  updateHistoryState() {
    var setData = null;

    switch (this.state.searchType) {
      case ReqType.Seach:
        setData = {
          q: this.state.searchProps.search.qRef.current.value,
          rank: this.state.searchProps.search.rankRef.current.value,
          datasetKey: this.state.searchProps.search.datasetRef.current.value,
          higherTaxon: this.state.chosenTaxon != null ? this.state.chosenTaxon.key : null,
        } as SearchTypeSearchSetData;
        break;
      case ReqType.LinkReq:
        setData = {
          link: this.state.searchProps.linkReq.linkRef.current.value,
        } as SearchTypeByLinkSetData;
        break;
    }

    var state = {
      type: this.state.searchType,
      ...setData,
    };
    
    history.pushState(state, '', '?' + ObjToQuery(state));
    console.log(state);
    console.log("?" + ObjToQuery(state));
  } /* End of 'updateHistoryState' function */

  async search( searchLimit?: number ) {
    var reqData;

    switch (this.state.searchType) {
      case ReqType.Seach:
        reqData = {
          higherTaxonKey: this.state.chosenTaxon != null ? this.state.chosenTaxon.key : null,
          q: this.state.searchProps.search.qRef.current.value,
          rank: this.state.searchProps.search.rankRef.current.value,
          dataset: this.state.searchProps.search.datasetRef.current.value,
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

    this.updateHistoryState();
  } /* End of 'search' function */

  setSearchState =  async ( type: ReqType, inProps: SearchTypeSearchSetData | SearchTypeByLinkSetData )=>{
    var isSearched = false;
    if (type != this.state.searchType)
      this.setState({ searchType: type });

    this.clearSearch();
    var props = null;

    switch (type) {
      case ReqType.Seach:
        props = inProps as SearchTypeSearchSetData;

        this.state.searchProps.search.datasetRef.current.value = props.datasetKey != undefined ? props.datasetKey : datasets[defaultDataSetInd].key;    // Dataset index
        this.state.searchProps.search.qRef.current.value = props.q;                     // Q
        this.state.searchProps.search.rankRef.current.value = props.rank; // Rank
     
        if (props.higherTaxon != null) {
          isSearched = true;
          if (typeof props.higherTaxon == "number")
            this.setState({ chosenTaxon: await getTaxonData(props.higherTaxon) }, ()=>{
              this.search();
            }); // Higher taxon
          else
            this.setState({ chosenTaxon: props.higherTaxon }, ()=>{
              this.search();
            }); // Higher taxon
        }
        break;
      case ReqType.LinkReq:
        props = inProps as SearchTypeByLinkSetData;
        this.state.searchProps.linkReq.linkRef.current.value = props.link != undefined ? props.link : ''; // Link
        break;
    }

    if (!isSearched)
      this.search();
  } /* End of 'setSearchState' function */

  renderSearchProps( type: ReqType ) {
    switch (type) {
      case ReqType.Seach:
        return (
          <>
            Dataset: <select ref={this.state.searchProps.search.datasetRef} >
              {datasets.map((e, i)=>{
                  return (<option key={i} value={e.key}>{e.name} -- {e.discription}</option>);
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
                <ScrollBox maxHeight={'15em'}>
                  <ValueList list={getItemDetailsList(this.state.chosenTaxon)}></ValueList>
                </ScrollBox>
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
  } /* End of 'renderSearch' function  */

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
  } /* End of 'render' functoin */

  componentDidMount() {
    //this.setSearchState(ReqType.LinkReq, { link: 'asdfjkhasdkhjasdfkhj'});
    if (window.location.search == '')
      return;

    const urlParams = new URLSearchParams(window.location.search);
    const type = urlParams.get('type') as ReqType;
    var setSearchData = null;

    switch (type) {
      case ReqType.Seach:
        setSearchData = {
          q: urlParams.get('q'),
          rank: urlParams.get('rank') as TaxonRank,
          datasetKey: urlParams.get('datasetKey'),
          higherTaxon: urlParams.get('higherTaxon') == 'null' ? null : parseInt(urlParams.get('higherTaxon')),
        } as SearchTypeSearchSetData;
        break;
      case ReqType.LinkReq:
        setSearchData = {
          link: urlParams.get('link'),
        } as SearchTypeByLinkSetData;
        break;
    }
    console.log(setSearchData);
    if (setSearchData != null)
      this.setSearchState(type, setSearchData);
  }
} /* End of 'Search' class */ 


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