import {TileImage, OSM, Vector as VectorSource} from '../node_modules/ol/source.js';
import {Tile as TileLayer, Vector as VectorLayer} from '../node_modules/ol/layer.js';
import Point from '../node_modules/ol/geom/Point.js';
import Feature from '../node_modules/ol/Feature.js';
import {createXYZ} from '../node_modules/ol/tilegrid.js';
import {
  Icon,
  Style,
} from '../node_modules/ol/style.js';

export function createMapLayer(): TileLayer<TileImage>
{
  return new TileLayer({
      source: new OSM(),
    });
} /* End of 'createMapLayer' function */

// Variables for create request layer function
const pixel_ratio = window.devicePixelRatio || 1;
var tile_grid_16 = createXYZ({
  minZoom: 0,
  maxZoom: 15,
  tileSize: 512,
});

export function createRequestLayer( request: string ): TileLayer<TileImage>
{
  return new TileLayer({
      source: new TileImage({
        projection: 'EPSG:3857',
        tileGrid: tile_grid_16,
        tilePixelRatio: pixel_ratio,
        //url: 'https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}' + /*pixel_ratio + */'.mvt?' + request/* + '&style=fire.point'*/, -- for vector
        url: 'https://api.gbif.org/v2/map/occurrence/density/{z}/{x}/{y}@' + pixel_ratio + 'x.png?' + request + '&style=fire.point',
        wrapX: true
      }),
    });
} /* End of 'createMapLayer' function */

export function createMarkersLayer( markersCoords: Array<Array<number>> ): object
{
  const iconStyle = new Style({
      image: new Icon({
        anchor: [0.5, 0.5],
        scale: 0.05,
        src: './bin/imgs/cross_mark.png',
      }),
    });
  
  var markers = [];

  for (let i = 0; i < markersCoords.length; i++)
  {
    markers[i] = new Feature({
      type: 'icon',
      geometry: new Point(markersCoords[i]),
    });
  }
  
  
  return new VectorLayer({
      source: new VectorSource({
        features: markers,
      }),
      style: iconStyle,
    });
} /* End of 'createMarkersLayer' function */

class layer {

  ImageLayerFromRequest = ( reqStr: string )=>{
    
  } /* End of 'ImageLayerFromRequest' function */

  constructor( ...args ) {

  } /* End of 'constructor' function */

} /* End of 'layer' cass */

class map {

} /* End of 'map' class */