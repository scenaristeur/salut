import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import data from "@solid/query-ldflex";


class NoteViewElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      note: {type: String},
    //  label: {type: String}
    };
  }

  constructor() {
    super();
    this.something = "Note Element"
    this.note = ""
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
    <h4 title="${JSON.stringify(this.note)}">${this.label}</h4>

    <p>
    <!--  ${new Date(this.date).toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit',hour: '2-digit', minute:'2-digit'})}

    ${this.date}  <br>
    ${this.text}<br>
    ${this.type}<br>
    ${this.actor}<br>
    ${this.target}<br>
    ${this.object}<br>
    ${this.inReplyTo}<br>
    ${this.rating}<br>    -->
    </p>
    </div>
    </div>
    `;
  }

  async firstUpdated(){
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
    //  this.init()
  }


  init(){
    console.log("Note",this.note)
    /*  for await (const property of data[this.note].properties){
    console.log(`${property}`);
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

    */
  //}
  /*  let date = await data[note].schema$dateCreated
  let type = await data[note].rdf$type
  let creator = await data[note].schema$creator
  let label = await data[note].rdfs$label
  let actor = await data[note].as$actor
  let name = await data[note].as$name
  let target = await data[note].as$target // !! could have many targets
  let object = await data[note].as$object //
  let text = await data[note].schema$text
  let inReplyTo = await data[note].as$inReplyTo
  let rating = await data[note]['http://purl.org/stuff/rev#rating']
  */
  /*  console.log("note", `${note}`, `${date}`, `${type}`,
  `${creator}`, `${label}`, `${actor}`, `${name}` , `${target}`
  , `${object}`, `${text}`, `${inReplyTo}`, `${rating}` );*/
  //  let note = {}
  //  this.id = `${note}`.substring(this.flow.length+1)

  //  note.url = `${note}`
  /*  this.date = `${date}`
  this.type = `${type}`
  this.creator = `${creator}`
  this.label = `${label}`
  this.actor = `${actor}`
  this.name = `${name}`
  this.target = `${target}`
  this.object = `${object}`
  this.text = `${text}`
  this.inReplyTo = `${inReplyTo}`
  this.rating = `${rating}`*/
  //  console.log(note)
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
