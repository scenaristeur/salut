import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import data from "@solid/query-ldflex";

class InterestsElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      interests: {type: Array},
      profile_url: {type: String}
    };
  }

  constructor() {
    super();
    this.something = "Interests"
    this.interests = []
    this.profile_url = ""
  }

  render(){
    return html`
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <div class="container-fluid">
    ${this.something}
    <div class="row">

    <div class="input-group mb-3">
    <div class="input-group-prepend">
    <span class="input-group-text" id="int-label">I'm intersted in :</span>
    </div>
    <input id="interest" type="text" class="form-control"
    placeholder="Interest" aria-label="Interest"
    aria-describedby="interest-label">
    <div class="input-group-append">
    <button id="submit_btn" class="btn btn-primary" type="button" @click=${this.submit}>Add
    <span id="submit_spinner" class="spinner-border spinner-border-sm" hidden role="status" aria-hidden="true"></span>
    </button>
    </div>
    </div>

    </div>

    <div class="row">
    <ul class="list-group list-group-horizontal">
    ${this.interests.map((interest,index) => html`
      <li class="list-group-item list-group-item-primary 3">
      ${interest}
      <i class="fas fa-trash-alt" index="${index}" @click="${this.delete}"></i>

      </li>
      `)}

      </ul>
      </div>



      `;
    }

    async delete(e){
      let index = e.target.getAttribute("index")
      let interest = this.interests[index]

      this.interests.splice(index,1);
      console.log(this.interests, interest)
      await data[this.profile_url].foaf$topic_interest.delete(interest)
      this.requestUpdate()
    }

    async submit(){
      this.shadowRoot.getElementById("submit_btn").disabled = true
      this.shadowRoot.getElementById("submit_spinner").hidden = false
      let interest = this.shadowRoot.getElementById("interest").value.trim()
      this.interests = [...this.interests, interest]

      await data[this.profile_url].foaf$topic_interest.add(interest)

      this.shadowRoot.getElementById("interest").value = ""
      this.shadowRoot.getElementById("submit_btn").disabled = false
      this.shadowRoot.getElementById("submit_spinner").hidden = true
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
            case "profileUrlChanged":
            app.profileUrlChanged(message.url)
            break;
            default:
            console.log("Unknown action ",message)
          }
        }
      };
    }

    async profileUrlChanged(url){
      this.profile_url = url
      this.interests = []
      console.log("GGGGGGGGGGGGGGG",this.profile_url)
      /*  for await (const interest of data[this.profile_url].foaf$topic_interest;
      interests.push(`${interest}`)
    }*/
    for await (const interest of data[this.profile_url].foaf$topic_interest){
      console.log(`${interest}`);
      this.interests = [...this.interests, interest]
    }
    //this.interests = interests
  }
}

customElements.define('interests-element', InterestsElement);
