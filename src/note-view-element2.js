import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';

class NoteViewElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      note: {type: Object}
    };
  }

  constructor() {
    super();
    this.something = "Note Element"
    this.note = {"text": "L o A d I n G . . ."}
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <style>
    .user_img{
      width: 90px !important
    }
    .main{
      display: inline-block
    }
    </style>

    <div class="col mb-4 main">
    <div class="card h-100">
    <h4>${this.note.title}</h4>
    ${this.note.text},
    <p>
  <!--  ${new Date(this.date).toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit',hour: '2-digit', minute:'2-digit'})}
-->
${this.note.date}  <br>
    ${this.note.text}<br>
    ${this.note.type}<br>
    ${this.note.actor}<br>
    ${this.note.target}<br>
    ${this.note.object}<br>
    ${this.note.inReplyTo}<br>
    ${this.note.rating}<br>
    </p>
    </div>
    </div>
    `;
  }

  firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
  //  console.log(this.agent)
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

customElements.define('note-view-element', NoteViewElement);
