import {TileImage, OSM, Vector as VectorSource} from '../node_modules/ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from '../node_modules/ol/layer.js';
import Point from '../node_modules/ol/geom/Point.js';
import Feature from '../node_modules/ol/Feature.js';
import {createXYZ} from '../node_modules/ol/tilegrid.js';
import {
  Icon,
  Style,
} from '../node_modules/ol/style.js';
import Map from 'ol/Map.js';
import View from 'ol/View.js';

export function creatIconStyle( center: number[], scale: number, imgFile: string ): Style {
  return new Style({
    image: new Icon({
      anchor: center,
      scale: scale,
      src: imgFile,
    }),
  });
} /* End of 'creatIconStyle' function */

export class Layer {
  layer;

  fromOSM = ()=> {
    this.layer = new TileLayer({
      source: new OSM(),
    });
  }; /* End of 'fromOSM' function */

  imageLayerFromRequest = ( reqStr: string )=>{
    // Variables for create request layer function
    const pixel_ratio = 1;//window.devicePixelRatio || 1;
    var tile_grid_16 = createXYZ({
      minZoom: 0,
      maxZoom: 15,
      tileSize: 512,
    });

    this.layer = new TileLayer({
      source: new TileImage({
        projection: 'EPSG:3857',
        tileGrid: tile_grid_16,
        tilePixelRatio: pixel_ratio,
        url: 'https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@' + pixel_ratio + 'x.png?' + reqStr + '&style=fire.point',
        wrapX: true
      }),
    });

  }; /* End of 'imageLayerFromRequest' function */

  markerLayer = ( markersCoords: Array<Array<number>>, style: Style )=>{
    this.layer = new VectorLayer({
      source: new VectorSource({
        features: markersCoords.map(e=>{
          return new Feature({
            type: 'icon',
            geometry: new Point(e),
          });
        }),
      }),
      style: style,
    });
  }; /* End of 'markerLayer' function */

  constructor( ...args ) {
    if (args.length == 0)
      this.fromOSM();
    else if (args.length == 1)
      this.imageLayerFromRequest(args[0]);
    else if (args.length == 2)
      this.markerLayer(args[0], args[1]);
  } /* End of 'constructor' function */

} /* End of 'Layer' cass */

export class LayerMap {
  map;

  constructor( target: string, viewCenter, viewZoom, layers: Layer[] = [] ) {
    this.map = new Map({
      target: target,
      layers: layers.map(e=>{ return e.layer; }),
      view: new View({
        center: viewCenter,
        zoom: viewZoom
      }),
    });  
    console.log('MAP CREATION');
    console.log(this);
  } /* End of 'constructor' function */

  addLayer = ( layer: Layer )=>{
    this.map.addLayer(layer.layer);
    console.log(this);
  }; /* End of 'addLayer' function  */
  
  removeLayer = ( layer: Layer )=>{
    this.map.removeLayer(layer.layer);
    console.log(this);
  }; /* End of 'removeLayer' function  */

} /* End of 'LayerMap' class */