import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import data from "@solid/query-ldflex";


class NoteViewElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      note: {type: Object},
      //  label: {type: String}
    };
  }

  constructor() {
    super();
    this.something = "Note Element"
    this.note = {}
    //  this.label = ""
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

    <p>

    ${this.note.text}<br>
    ${this.note.uri}

    </p>
    </div>
    </div>
    `;
  }

  async firstUpdated(){
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
    this.init()
  }


  async init(){
    console.log("Note",this.note)
    /*  for await (const property of data[this.note].properties){
    console.log(`${property}`);
  }*/
  /*http://www.w3.org/1999/02/22-rdf-syntax-ns#type flow-element.js:67
  http://schema.org/creator flow-element.js:67
  http://schema.org/dateCreated flow-element.js:67
  http://www.w3.org/2000/01/rdf-schema#label flow-element.js:67
  https://www.w3.org/ns/activitystreams#actor flow-element.js:67
  https://www.w3.org/ns/activitystreams#name flow-element.js:67
  https://www.w3.org/ns/activitystreams#target flow-element.js:67
  https://www.w3.org/ns/activitystreams#object flow-element.js:67
  http://schema.org/text flow-element.js:67
  https://www.w3.org/ns/activitystreams#inReplyTo
  http://purl.org/stuff/rev#rating flow-element.js:67


}*/
let date = await data[this.note.uri].schema$dateCreated
let type = await data[this.note.uri].rdf$type
let label = await data[this.note.uri].rdfs$label
let actor = await data[this.note.uri].as$actor
let name = await data[this.note.uri].as$name
let target = await data[this.note.uri].as$target // !! could have many targets
let object = await data[this.note.uri].as$object //
let text = await data[this.note.uri].schema$text
let inReplyTo = await data[this.note.uri].as$inReplyTo
let rating = await data[this.note.uri]['http://purl.org/stuff/rev#rating']
/*
console.log("note",  `${date}`, `${type}`,
`${creator}`, `${label}`, `${actor}`, `${name}` , `${target}`
, `${object}`, `${text}`, `${inReplyTo}`, `${rating}` );*/
//  let note = {}
//  this.id = `${note}`.substring(this.flow.length+1)

//  note.url = `${note}`
this.note.date = `${date}`
this.note.type = `${type}`
this.note.title = `${label}`
this.note.actor = `${actor}`
this.note.name = `${name}`
this.note.target = `${target}`
this.note.object = `${object}`
this.note.text = `${text}`
this.note.inReplyTo = `${inReplyTo}`
this.note.rating = `${rating}`
console.log(this.note)
this.requestUpdate()
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
