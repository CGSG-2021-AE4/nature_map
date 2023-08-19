import React, { ReactComponentElement, ReactHTML, ReactPropTypes, createRef } from "react";
import { NameSearchItem, taxonRanks, WideTaxonData, TaxonData } from "./name_search_item";

interface SearchInData {
  name: string
}

enum ReqType {
  Match = 'Match',
  Seach = 'Search'
}

const reqTypes = [
  ReqType.Match,
  ReqType.Seach
];

const defReqTypeInd = 1;

interface SearchProps {
  chooseItemCallBack: ( itemInfo: TaxonData )=>void;
}

interface SearchState {
  searchResults: TaxonData[],
  searchProps: {
    match: {
      nameRef: React.MutableRefObject<any>,
    },
    search: {
      qRef: React.MutableRefObject<any>,
      rankRef: React.MutableRefObject<any>,
    }
  },
  searchType: ReqType,
  searchTypeInd: number,
}

export class Search extends React.Component<SearchProps, SearchState> {
  currentFocusItem: NameSearchItem;
  
  constructor( props: SearchProps ) {
    super(props);
    this.currentFocusItem = null;
    this.state = {
      searchResults: [],
      searchProps: {
        match: {
          nameRef: createRef(),
        },
        search: {
          qRef: createRef(),
          rankRef: createRef(),
        }
      },
      searchType: reqTypes[defReqTypeInd],
      searchTypeInd: defReqTypeInd,
    }
  }

  itemFocusCallBack = ( item: NameSearchItem )=>{
    if (this.currentFocusItem != null)
      this.currentFocusItem.defocus();
    
    this.props.chooseItemCallBack(item.props.data);
    this.currentFocusItem = item;
  }

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
        return resJson.results.map(e=>{ return Search.makeTaxonDataFromJson(e)});
    }
  }

  static async makeReqStr( type: ReqType, reqInData: any ) {
    switch (type) {
      case ReqType.Match:
        return `https://api.gbif.org/v1/species/match?name=${reqInData.name}`;
      case ReqType.Seach:
        return `https://api.gbif.org/v1/species/search?q=${reqInData.q}&rank=${reqInData.rank}`;
    }
  }

  static async getJson( url: string ) {
    return fetch(url).then(res=>{ return res.json(); });
  }

  async search() {
    var reqData;
    switch (this.state.searchType) {
      case ReqType.Match:
        reqData = {
          name: this.state.searchProps.match.nameRef.current.value
        };
        break;
      case ReqType.Seach:
        reqData = {
          q: this.state.searchProps.search.qRef.current.value,
          rank: taxonRanks[this.state.searchProps.search.rankRef.current.value]
        };
        break;
    }

    const reqStr = await Search.makeReqStr(this.state.searchType, reqData);
    this.setState({
      searchResults: Search.makeSearchDataFromJson(this.state.searchType, await Search.getJson(reqStr)),
    });
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
            Q: <input ref={this.state.searchProps.search.qRef} type="text"/> <br/>
            Rank: <select ref={this.state.searchProps.search.rankRef}>
              {taxonRanks.map((e, i)=>{
                  return (<option key={i} value={i}>{e}</option>);
                })}
            </select>
          </>
        );
    }
  }

  render() {
    return (
      <>
        <div className="lined gaped padded">
          <h1>Search bar</h1>
          Type: <select value={this.state.searchTypeInd} onChange={(e)=>{
            this.setState({ searchType: reqTypes[e.target.value], searchTypeInd: Number(e.target.value) });
          }}>
            {reqTypes.map((e, i)=>{
              return (<option key={i} value={i}>{e}</option>);
            })}
          </select>
          <div>
            <hr/>
            {this.renderSearchProps(this.state.searchType)}
            <hr/>
          </div>
          <input type="button" value="search" onClick={()=>{
            this.search();
          }}/>
        </div>
        <div className="lined gaped" style={{
          overflowY: 'auto',
          flex: '1'
        }}>
          <div>
            {this.state.searchResults.map((e, i)=>{
              return <NameSearchItem key={i} data={e} focusCallBack={this.itemFocusCallBack}/>;
            })}
          </div>
        </div>
      </>
    );
  }
}