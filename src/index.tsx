import Map from 'ol/Map.js';
import View from 'ol/View.js';

import { createMapLayer, createRequestLayer, createMarkersLayer } from './layers.js';


import { createRoot } from 'react-dom/client';
//import { FilterListC } from "./components/list";
import { FilterList } from "./components/filter_list";

var layers = [];

const MapLayer = createMapLayer();
layers.push(MapLayer);

var RequestLayer = undefined; //createRequestLayer('publishingCountry=US&year=2000,2030');

//layers.push(RequestLayer);

layers.push(createMarkersLayer([[3370533.758063, 8387091.147105]]));

const map = new Map({
  target: 'map-container',
  layers: layers,
  view: new View({
    center: [3370533.758063, 8387091.147105],
    //center: [0, 0],
    zoom: 7
    }),
});

var filterList = new FilterList;

document.getElementById('submitRequestButton').onclick = ()=>{
  if (RequestLayer != undefined)
    map.removeLayer(RequestLayer);

    var reqStr = filterList.getRequestStr();
    
    console.log(reqStr);
    RequestLayer = createRequestLayer(reqStr);
    map.addLayer(RequestLayer);
};


function initFilters() {
  const root = createRoot(document.getElementById('requestList'));
  root.render(<filterList.render/>);

} /* End of 'initFilters' function */

initFilters();