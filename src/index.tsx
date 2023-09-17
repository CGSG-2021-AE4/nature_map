import Map from 'ol/Map.js';
import View from 'ol/View.js';

import { Layer, LayerMap, creatIconStyle } from './layers.js';


import { renderC } from './components/comp';
import { Search } from './components/search';

// Map part

var layers = [];

const MapLayer = new Layer;
layers.push(MapLayer);

var RequestLayer = undefined; //createRequestLayer('publishingCountry=US&year=2000,2030');

//layers.push(new Layer([[3370533.758063, 8387091.147105]], creatIconStyle([0.5, 0.5], 0.05, './bin/imgs/cross_mark.png')));

const map = new LayerMap('map-container', [3370533.758063, 8387091.147105], 7, layers);

// Search part 
const searchList = (<Search map={map}/>);

renderC('layer1', searchList);



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

