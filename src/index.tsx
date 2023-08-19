import Map from 'ol/Map.js';
import View from 'ol/View.js';

import { Layer, LayerMap, creatIconStyle } from './layers.js';


import { createRoot } from 'react-dom/client';
//import { FilterListC } from "./components/list";
//import { FilterList } from "./components/filter_list";
//import { Over } from './components/container';
//import { DropList } from './components/drop_list';
import { comp, renderC } from './components/comp';
//import { DndProvider, useDrag, useDrop} from 'react-dnd';
//import { HTML5Backend } from 'react-dnd-html5-backend';
import { Search } from './components/name_search.js';

// Map part

var layers = [];

const MapLayer = new Layer;
layers.push(MapLayer);

var RequestLayer = undefined; //createRequestLayer('publishingCountry=US&year=2000,2030');

layers.push(new Layer([[3370533.758063, 8387091.147105]], creatIconStyle([0.5, 0.5], 0.05, './bin/imgs/cross_mark.png')));

const map = new LayerMap('requestList2', [3370533.758063, 8387091.147105], 7, layers);

// Search part 
const a = (<Search chooseItemCallBack={(e)=>{
  console.log('Focused on ' + e.key);
  
  if (RequestLayer != undefined)
    map.removeLayer(RequestLayer);

  var reqStr = 'taxonKey=' + e.key;
  
  console.log(reqStr);
  RequestLayer = new Layer(reqStr);
  console.log(RequestLayer);
  map.addLayer(RequestLayer);
}}/>);

renderC('requestList1', a);



// // dnd usage example
// var box1 = (
//   <DndProvider backend={HTML5Backend}>
//     <div style={{
//       display: 'flex',
//       flexDirection: 'row'
//     }}>
//       <DropList style={{
//         margin: '10px',
//         backgroundColor: 'grey',
//         border: '3px dashed',
//         borderColor: 'gold',  
//         width: '500px',
//         height: '700px'
//       }} type='ITEM'>
//         <h1> SDFJSDFL:JSDFLkj </h1>
//       </DropList>
//       <DropList style={{
//         margin: '10px',
//         backgroundColor: 'grey',
//         border: '3px dashed',
//         borderColor: 'gold',  
//         width: '500px',
//         height: '700px'
//       }} type='ITEM'>
//         <h1> aaa </h1>
//       </DropList>
//     </div>
//   </DndProvider>
// );

// renderC('requestList1', box1);

// var filterList1 = new Over([
//   {
//     id: 0,
//     text: 'AAAAAAAAAAAAAAA'
//   },
//   {
//     id: 1,
//     text: 'BBBBBBBBBBBBBBBB'
//   },
//   {
//     id: 2,
//     text: 'CCCCCCCCCCCCCCC'
//   }
// ]);
// filterList1.render('requestList1');

// var filterList2 = new Over([]);
// filterList2.render('requestList2');

// var layers = [];
// 
// const MapLayer = new Layer;
// layers.push(MapLayer);
// 
// var RequestLayer = undefined; //createRequestLayer('publishingCountry=US&year=2000,2030');
// 
// layers.push(new Layer([[3370533.758063, 8387091.147105]], creatIconStyle([0.5, 0.5], 0.05, './bin/imgs/cross_mark.png')));
// 
// const map = new LayerMap('map-container', [3370533.758063, 8387091.147105], 7, layers);
// 
// document.getElementById('submitRequestButton').onclick = ()=>{
//   if (RequestLayer != undefined)
//     map.removeLayer(RequestLayer);
// 
//     var reqStr = firstFilterList.getRequestStr();
//     
//     console.log(reqStr);
//     RequestLayer = new Layer(reqStr);
//     map.addLayer(RequestLayer);
// };

