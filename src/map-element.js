import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';

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
