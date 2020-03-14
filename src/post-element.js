import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import 'bootstrap-switch-button';
import './picsupload-element.js'

class PostElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      profile_url: {type: String}
    };
  }

  constructor() {
    super();
    this.something = "Post Element"
    this.profile_url = ""
  }

  render(){
    return html`
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/bootstrap-switch-button.min.css" rel="stylesheet">

    <div class="container-fluid">
    <h4>${this.something}</h4>

    Working in progress, need help, see <a href="https://github.com/scenaristeur/">https://github.com/scenaristeur/</a>


    <div class="row">
    <textarea
    id="content"
    class="form-control"
    placeholder="Content"
    aria-label="Content"
    rows="10" cols="33">
    </textarea>
    </div>

    <div class="row">
    <picsupload-element id="Picsupload" name="Picsupload" profile_url=${this.profile_url}></picsupload-element>
    </div>

    <div>
    <input type="checkbox"
    id="privacy_switch"
    data-toggle="switchbutton"
    checked data-onlabel="Private"
    data-offlabel="Public"
    data-onstyle="success"
    data-offstyle="danger"
    data-width="150"
    data-size="sm">
    </div>

    <button id="submit_btn" class="btn btn-primary" type="button" @click=${this.submit}>Submit</button>
    <span id="spinner" class="spinner-border spinner-border-sm" hidden role="status" aria-hidden="true"></span>


    </div>
    `;
  }


  async submit(){
    this.shadowRoot.getElementById("submit_btn").disabled = true
    this.shadowRoot.getElementById("spinner").hidden = false
    this.content = this.shadowRoot.getElementById("content").value.trim()
    this.file = this.shadowRoot.getElementById("Picsupload").file
    let priv = this.shadowRoot.getElementById("privacy_switch").checked
    console.log(priv, this.content,this.file)
    //this.shadowRoot.getElementById("content").value = ""
    this.shadowRoot.getElementById("submit_btn").disabled = false
    this.shadowRoot.getElementById("spinner").hidden = true
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

customElements.define('post-element', PostElement);
