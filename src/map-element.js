import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import './openlayer-element'

class MapElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      webId: {type: String}
    };
  }

  constructor() {
    super();
    this.something = "Map Element"
  }

  render(){
    return html`
    <h4>${this.something}</h4>

    to do, need help, see <a href="https://github.com/scenaristeur/">https://github.com/scenaristeur/</a>


    <openlayer-element name="OpenLayer">Loading OpenLayer Map...</openlayer-element>
    https://nouvelle-techno.fr/actualites/2018/07/10/geolocalisation-et-distance-avec-openstreetmap<br>
    https://leafletjs.com/reference-1.6.0.html#latlngbounds-contains<br>
    geolocation : https://openlayers.org/en/latest/examples/geolocation.html<br>
https://openlayers.org/workshop/en/mobile/geolocation.html<br>
https://github.com/Viglino/ol-ext<br>
    https://stackoverflow.com/questions/47910874/search-address-with-openlayers<br>
    https://nominatim.openstreetmap.org/search.php?q=france<br>
    https://openlayers.org/en/latest/examples/overlay.html


    `;
  }

  firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
    console.log(this.agent)
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
  }

  webIdChanged(webId){
    this.webId = webId
    if (webId != null){
      //  this.updateProfile();
    }else{

    }
  }

}

customElements.define('map-element', MapElement);
