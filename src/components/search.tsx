import React, { ReactComponentElement, ReactHTML, ReactPropTypes, createRef } from "react";
import { NameSearchItem, taxonRanks, WideTaxonData, TaxonData, TaxonRank } from "./search_item";
import { ValueList, ScrollBox } from "./support";
import { getItemDetailsList, getTaxonData } from "./search_item";
import { LayerMap, Layer, queryToStr } from "../layers";
import { Settings, ValueType } from "./settings";
import { makeReqStr, getJson } from "./request";
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

const datasets: {[datasetName: string]: {name: string , discription: string, key: string }} = {
  backbone: {
    name: 'GBIF Backbone Taxonomy',
    discription: 'default dataset (recomended)',
    key: 'd7dddbf4-2cf0-4f39-9b2a-bb099caae36c',
  },
  advanced: {
    name: 'Advanced',
    discription: 'wide search without dataset',
    key: '',
  },
};

const defaultDataSetInd = 0;

// Search set data

interface SearchTypeSearchSetData {
  q: string,
  rank: TaxonRank,
  higherTaxon: number | TaxonData,
}

const defaultSearchTypeSearchSetData: SearchTypeSearchSetData = {
  q: '',
  rank: TaxonRank.All,
  higherTaxon: null,
};

interface SearchTypeByLinkSetData {
  link: string,
}

const defaultSearchTypeByLinkSetData: SearchTypeByLinkSetData = {
  link: ''
};

// Settings

const mapPointColors = [
  'purpleHeat',
  'blueHeat',
  'orangeHeat',
  'greenHeat',
  'classic',
  'purpleYellow',
  'fire',
  'glacier',
];

const mapPolyColors = [
  'iNaturalist',
  'purpleYellow',
  'classic',
  'green',
  'green2',
  'red',
];

const mapStyles = [
  'point',
  'poly',
];

console.log(Object(datasets).keys);

var settingsValuesProps = {
  advancedMode: { type: ValueType.Bool },
  enableLinkLog: { type: ValueType.Bool },
  searchLimit:  { type: ValueType.Number, args: { min: 1, max: 1000 } },
  mapStyle: { type: ValueType.Toggle, args: { elements: mapStyles }},
  mapPointColor: { type: ValueType.Toggle, args: { elements: mapPointColors }},
  mapPolyColor: { type: ValueType.Toggle, args: { elements: mapPolyColors }},
  dataset: { type: ValueType.Toggle, args: { elements: Object.keys(datasets) }},
}

interface SettingValues {
  dataset: string;
  advancedMode: boolean;
  enableLinkLog: boolean;
  searchLimit: number;
  mapStyle: string;
  mapPointColor: string;
  mapPolyColor: string;
}

// Component interfaces

interface SearchProps {
  map: LayerMap;
}

interface SearchState {
  searchResultsCount: number;
  searchResultsIsEnd: boolean;
  searchResults: TaxonData[];
  searchProps: {
    search: {
      qRef: React.MutableRefObject<any>;
      rankRef: React.MutableRefObject<any>;
    },
    linkReq: {
      linkRef: React.MutableRefObject<any>;
    }
  };
  searchType: ReqType;
  isSearched: boolean;
  chosenTaxon: TaxonData;
  isShowSettings: boolean;
  settings: SettingValues;
}/* End of 'SearchState' interface */ 

export class Search extends React.Component<SearchProps, SearchState> {
  currentFocusItem: NameSearchItem;
  curSearchOffset: number;
  curShowLayer: Layer = null;

  constructor( props: SearchProps ) {
    super(props);
    this.currentFocusItem = null;
    this.curSearchOffset = 0;
    this.state = {
      searchResults: [],
      searchResultsCount: 0,
      searchResultsIsEnd: false,
      searchProps: {
        search: {
          qRef: createRef(),
          rankRef: createRef(),
        },
        linkReq: {
          linkRef: createRef(), 
        },
      },
      searchType: defReqType,
      isSearched: false,
      chosenTaxon: null,
      isShowSettings: false,
      settings: {
        enableLinkLog: true,
        advancedMode: true,
        searchLimit: 100,
        mapStyle: 'poly',
        mapPointColor: 'purpleYellow',
        mapPolyColor: 'purpleYellow',
        dataset: 'backbone',
      }
    }
  } /* End of 'constructor' function */ 

  async showItemLayer( data: TaxonData ) {
    console.log('Focused on ' + data.key);
  
    if (this.curShowLayer != undefined)
      this.props.map.removeLayer(this.curShowLayer);

    const proj = 'EPSG:3857';
    const dataSource = 'https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@';
    const mapStyle = this.state.settings.mapStyle == 'poly' ? {
      style: this.state.settings.mapPolyColor + '-noborder.poly',
      bin: 'square',
      squareSize: '8',
    } : {
      style: this.state.settings.mapPointColor + '.point',
    };
    const req = {
      taxonKey: data.key,
    };

    // Need to get dentisy
    const count = await getJson('https://api.gbif.org/v1/occurrence/count?' + queryToStr({ ...req, }));
    // const cap = await  Search.getJson('https://api.gbif.org/v2/map/occurrence/density/capabilities.json?' + queryToStr({ ...req, }));
    // const area = (cap.maxLat - cap.minLat) * (cap.maxLng - cap.minLng);
    // console.log('Search...');
    // console.log('Count: ' + cap.total);
    // console.log('Area:' + area);
    // console.log('Density:' + cap.total / area);

    // Simple tile sizing
    if (count < 10000)
      mapStyle.squareSize = '16';

    this.curShowLayer = new Layer(dataSource, proj, { ...mapStyle, ...req });
    this.props.map.addLayer(this.curShowLayer);
  }

  itemFocusCallBack = ( item: NameSearchItem )=>{
    if (this.currentFocusItem != null)
      this.currentFocusItem.defocus();
    
    this.showItemLayer(item.props.data);
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
          higherTaxon: this.state.chosenTaxon != null ? this.state.chosenTaxon.key : null,
          settings: JSON.stringify(this.state.settings)
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
    
    history.pushState(state, '', '?' + queryToStr(state));
  } /* End of 'updateHistoryState' function */

  async search() {
    var reqData;
    var reqStr = "";

    switch (this.state.searchType) {
      case ReqType.Seach:
        reqData = {
          highertaxon_key: this.state.chosenTaxon != null ? this.state.chosenTaxon.key : undefined,
          q: this.state.searchProps.search.qRef.current.value,
          rank: this.state.searchProps.search.rankRef.current.value,
          dataset_key: datasets[this.state.settings.dataset].key,
          offset: this.curSearchOffset,
          limit: this.state.settings.searchLimit,
        };
        reqStr = await makeReqStr('https://api.gbif.org/v1/species/search', reqData);
        break;
      case ReqType.LinkReq:
        reqStr = this.state.searchProps.linkReq.linkRef.current.value;
        break;
    }

    if (this.state.settings.enableLinkLog)
      console.log("Search request: " + reqStr);
    const res = await getJson(reqStr);
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
      <>
        <div className="fullMaxSize flexColumn" style={{
          width: '30em',
        }}>
          <div className="padded gapped flex0 mainBg border1"> {/* Settings box */}
            <h1 style={{
              userSelect: 'none',
              background: 'var(--color3)',
              paddingBlock: '0.2em',
            }} onClick={()=>{
              window.location.href = window.location.href.split('?')[0]; // CAN I??? *request without query
            }}>GBIF map</h1>
            <div className="flexRow spaceBetween alignCenter">
              <div>
                Type: <select value={this.state.searchType} onChange={(e)=>{
                  this.setState({ searchType: e.target.value as ReqType, isSearched: false, searchResults: []});
                }}>
                  {reqTypes.map((e, i)=>{
                    return (<option key={i} value={e}>{e}</option>);
                  })}
                </select>
              </div>
              <input type="button" value="settings" onClick={()=>{
                this.setState({ isShowSettings: true });
              }}/>
            </div>
            <hr/>
            {this.renderSearchProps(this.state.searchType)}
            <hr/>
            <input type="button" value="search" onClick={()=>{
              this.clearSearch();
              // For quicker search
              const searchLimit = this.state.settings.searchLimit;

              this.state.settings.searchLimit = 20;
              this.search();
              if (!this.state.searchResultsIsEnd)
              {
                this.curSearchOffset += 20;
                this.state.settings.searchLimit = searchLimit - 20;
                this.search();
              }
              this.state.settings.searchLimit = searchLimit;
            }}/>
            {this.state.isSearched && <> Found {this.state.searchResultsCount} results.</>}
          </div>
          <div className={`gapped flex1 mainBg ${this.state.isSearched ? "border1" : ""}`} style={{ overflowY: 'scroll' }}> {/* Search box */}
            <div>
              {this.state.searchResults.length != 0 && <>
                {this.state.searchResults.map((e, i)=>{
                  return <NameSearchItem key={i} data={e} focusCallBack={this.itemFocusCallBack} setSearchCallBack={this.setSearchState}/>;
                })}
                {this.state.searchResultsIsEnd == false && <div className="flexRow" style={{ margin: '0.6em' }}>
                  <input type="button" value="show more" className="gapped flex1" onClick={(e)=>{
                    this.curSearchOffset += this.state.settings.searchLimit;
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
        {this.state.isShowSettings && <div style={{
          zIndex: 999,
          position: 'fixed',

          bottom: 0,
          left: 0,
          right: 0,
          top: 0,

          display: 'flex',
          justifyContent: 'center',
          flexWrap: 'wrap',
          alignContent: 'center',
          background: '#00000082'
        }}>
          <Settings<SettingValues> name="Settings" style={{ width: '20em'}} valuesProps={settingsValuesProps} values={this.state.settings} setSettingsCallBack={( newS: any )=>{
            console.log("NEW SETTINGS ");
            console.log(newS);
            this.setState( {settings: newS });
            this.updateHistoryState();
          }} closeCallBack={()=>{
            this.setState({ isShowSettings: false });
          }}/>
        </div>}
      </>
    );
  } /* End of 'render' functoin */

  componentDidMount() {
    //this.setSearchState(ReqType.LinkReq, { link: 'asdfjkhasdkhjasdfkhj'});
    //console.log(JSON.parse(JSON.stringify({ a: this.state.settings} )));

    if (window.location.search == '')
      return;

    const urlParams = new URLSearchParams(window.location.search);

    if (urlParams.get('settings') != undefined)
      this.setState({ settings: JSON.parse(urlParams.get('settings'))});

    const type = urlParams.get('type') as ReqType;
    var setSearchData = null;

    switch (type) {
      case ReqType.Seach:
        setSearchData = {
          q: urlParams.get('q') != undefined ? urlParams.get('q') : defaultSearchTypeSearchSetData.q,
          rank: urlParams.get('rank') != undefined ? urlParams.get('rank') as TaxonRank : defaultSearchTypeSearchSetData.rank,
          higherTaxon: urlParams.get('higherTaxon') != undefined ? urlParams.get('higherTaxon') == 'null' ? null : parseInt(urlParams.get('higherTaxon')) : defaultSearchTypeSearchSetData.higherTaxon,
        } as SearchTypeSearchSetData;
        break;
      case ReqType.LinkReq:
        setSearchData = {
          link: urlParams.get('link') != undefined ? urlParams.get('link') : defaultSearchTypeByLinkSetData.link,
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
