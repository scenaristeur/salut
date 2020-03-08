import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';

class StoreLocationElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
    };
  }

  constructor() {
    super();
    this.something = "Store Location Element"
  }

  render(){
    return html`
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <h4>${this.something}</h4>


    <div class="input-group mb-3">
    <div class="input-group-prepend">
    <span class="input-group-text" id="">Latitude</span>
    </div>
    <input type="text" class="form-control">
    <div class="input-group-prepend">
    <span class="input-group-text" id="">Longitude</span>
    </div>
    <input type="text" class="form-control">
    <div class="input-group-prepend">
    <span class="input-group-text" id="">Altitude</span>
    </div>
    <input type="text" class="form-control">
    <div class="input-group-prepend">
    <span class="input-group-text" id="">Vitesse</span>
    </div>
    <input type="text" class="form-control">
</div>
<div class="input-group mb-3">
    <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1">Label</span>
    </div>
    <input type="text" class="form-control"
    placeholder="Label"
    aria-label="Label"
    aria-describedby="basic-addon1">

    <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon1">Tags</span>
    </div>
    <input type="text" class="form-control"
    placeholder="(comma separated)"
    aria-label="Tags"
    aria-describedby="basic-addon1">

    <button type="button" class="btn btn-primary">Save Location</button>
    </div>
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
      this.updateProfile();
    }else{

    }
  }

}

customElements.define('store-location-element', StoreLocationElement);
