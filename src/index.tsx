import Map from 'ol/Map.js';
import View from 'ol/View.js';

import { Layer, LayerMap, creatIconStyle } from './layers.js';


import { createRoot } from 'react-dom/client';
//import { FilterListC } from "./components/list";
import { FilterList } from "./components/filter_list";

var layers = [];

const MapLayer = new Layer;
layers.push(MapLayer);

var RequestLayer = undefined; //createRequestLayer('publishingCountry=US&year=2000,2030');

//layers.push(RequestLayer);

layers.push(new Layer([[3370533.758063, 8387091.147105]], creatIconStyle([0.5, 0.5], 0.05, './bin/imgs/cross_mark.png')));

const map = new LayerMap('map-container', [3370533.758063, 8387091.147105], 7, layers);

var filterList = new FilterList;

document.getElementById('submitRequestButton').onclick = ()=>{
  if (RequestLayer != undefined)
    map.removeLayer(RequestLayer);

    var reqStr = filterList.getRequestStr();
    
    console.log(reqStr);
    RequestLayer = new Layer(reqStr);
    map.addLayer(RequestLayer);
};


function initFilters() {
  const root = createRoot(document.getElementById('requestList'));
  root.render(<filterList.render/>);

} /* End of 'initFilters' function */

initFilters();