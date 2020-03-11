import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import 'bootstrap-switch-button';
import Feature from 'ol/Feature';
import Geolocation from 'ol/Geolocation';
import Map from 'ol/Map';
import View from 'ol/View';
import Point from 'ol/geom/Point';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {OSM, Vector as VectorSource} from 'ol/source';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';

class LocalisationElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
    };
  }

  constructor() {
    super();
    this.something = "Localisation Element"
  }

  render(){
    return html`
    <link href="css/ol.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet" >
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap-switch-button.min.css" rel="stylesheet">
    <style>
    #map {
      height: 300px;
      width: 100%;
    }
    </style>
    <div id="map"></div>
    <div>
    <input type="checkbox"
    id="locate_switch"
    @change="${this.toggleLocate}"
    data-toggle="switchbutton"
    checked data-onlabel="Locate me"
    data-offlabel="Don't locate me"
    data-onstyle="success"
    data-offstyle="danger"
    data-width="150"
    data-size="sm">
    </div>
    <h4>${this.something}</h4>
    <p>
    info : <code id="info"></code>&nbsp;&nbsp;
    position accuracy : <code id="accuracy"></code>&nbsp;&nbsp;
    latitude : <code id="latitude"></code>&nbsp;&nbsp;
    longitude : <code id="longitude"></code>&nbsp;&nbsp;
    altitude : <code id="altitude"></code>&nbsp;&nbsp;
    altitude accuracy : <code id="altitudeAccuracy"></code>&nbsp;&nbsp;
    heading : <code id="heading"></code>&nbsp;&nbsp;
    speed : <code id="speed"></code>
    </p>
    `;
  }

  toggleLocate(e){
    //  var app = this
    //  console.log(e.target.checked)
    this.geolocation ? this.geolocation.setTracking(e.target.checked) : null;
  }

  firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
    console.log(this.agent)
    app.shadowRoot.getElementById('locate_switch').switchButton('off');

    //this.getCoordFromAdress() // seulement une requete autorisee par seconde

    this.agent.receive = function(from, message) {
      //  console.log("messah",message)
      if (message.hasOwnProperty("action")){
        //  console.log(message)
        switch(message.action) {
          case "webIdChanged":
          app.webIdChanged(message.webId)
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };

    var view = new View({
      center: [0, 0],
      zoom: 3
    });

    this.map = new Map({
      target: app.shadowRoot.getElementById('map'),
      layers: [
        new TileLayer({
          source: new OSM()
        })
      ],
      view: view
    });
    this.loadData()

    app.geolocation = new Geolocation({
      // enableHighAccuracy must be set to true to have the heading value.
      trackingOptions: {
        enableHighAccuracy: true
      },
      projection: view.getProjection()
    });

    // update the HTML page when the position changes.
    app.geolocation.on('change', function() {
      app.shadowRoot.getElementById('accuracy').innerText = app.geolocation.getAccuracy() + ' [m]';
      app.shadowRoot.getElementById('altitude').innerText = app.geolocation.getAltitude() + ' [m]';
      app.shadowRoot.getElementById('altitudeAccuracy').innerText = app.geolocation.getAltitudeAccuracy() + ' [m]';
      app.shadowRoot.getElementById('heading').innerText = app.geolocation.getHeading() + ' [rad]';
      app.shadowRoot.getElementById('speed').innerText = app.geolocation.getSpeed() + ' [m/s]';
      app.shadowRoot.getElementById('latitude').innerText = app.geolocation.position_[1];
      app.shadowRoot.getElementById('longitude').innerText = app.geolocation.position_[0];
      console.log(app.geolocation.position_)
    });

    // handle geolocation error.
    app.geolocation.on('error', function(error) {
      var info = app.shadowRoot.getElementById('info');
      info.innerHTML = error.message;
      info.style.display = '';
    });

    var accuracyFeature = new Feature();
    app.geolocation.on('change:accuracyGeometry', function() {
      accuracyFeature.setGeometry(app.geolocation.getAccuracyGeometry());
    });

    var positionFeature = new Feature();
    positionFeature.setStyle(new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({
          color: '#3399CC'
        }),
        stroke: new Stroke({
          color: '#fff',
          width: 2
        })
      })
    }));

    app.geolocation.on('change:position', function() {
      var coordinates = app.geolocation.getPosition();
      console.log(coordinates)
      positionFeature.setGeometry(coordinates ?
        new Point(coordinates) : null);

        //  app.flyTo(coordinates, view, function() {});
        /*view.setCenter(coordinates);
        view.setZoom(15);*/
        var duration = 2000;
        view.animate({
          center: coordinates,
          duration: duration
        });
        view.animate({
          zoom: 15,
          duration: duration
        })
      });

      new VectorLayer({
        map: this.map,
        source: new VectorSource({
          features: [accuracyFeature, positionFeature]
        })
      });
    }

    getCoordFromAdress(){
      console.log("COORD")
      var data = {
        "format": "json",
        "addressdetails": 1,
        "q": "22 rue mouneyra bordeaux",
        "limit": 1
      };
      console.log(data)
      /*
      var myInit = { method: 'POST',
      //  headers: myHeaders,
      mode: 'cors',
      cache: 'default',
      body:data };*/

      //  var myRequest = new Request('https://nominatim.openstreetmap.org',myInit);
      let url="https://nominatim.openstreetmap.org?"+
      "format=json"+
      "&addressdetails=1"+
      "&q=22 rue mouneyra bordeaux"+
      "&limit=1"


      fetch(url).then(function(response) {
        var contentType = response.headers.get("content-type");
        if(contentType && contentType.indexOf("application/json") !== -1) {
          return response.json().then(function(json) {
            console.log("result",json)
            // traitement du JSON
          });
        } else {
          console.log("Oops, nous n'avons pas du JSON!", response);
        }
      });
      /*
      $.ajax({
      method: "GET",
      url: "https://nominatim.openstreetmap.org",
      data: data
    })
    .done(function( msg ) {
    console.log("Eureka", msg );
  });*/
}


flyTo(location, view, done) {
  var duration = 2000;
  var zoom = view.getZoom();
  var parts = 2;
  var called = false;
  function callback(complete) {
    --parts;
    if (called) {
      return;
    }
    if (parts === 0 || !complete) {
      called = true;
      done(complete);
    }
  }
  view.animate({
    center: location,
    duration: duration
  }, callback);
  view.animate({
    zoom: zoom - 1,
    duration: duration / 2
  }, {
    zoom: zoom,
    duration: duration / 2
  }, callback);
}


loadData(){
  console.log("Load Data")
}


webIdChanged(webId){
  this.webId = webId
  if (webId != null){
    this.updateProfile();
  }else{

  }
}

}

customElements.define('localisation-element', LocalisationElement);
