import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import data from "@solid/query-ldflex";

import './note-view-element.js'

class FlowElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      notes: {type: Array},
      lastUpdate: {type: Number},
      flow: {type: String},

    };
  }

  constructor() {
    super();
    this.something = "Flow Element";
    this.notes = []
    this.flow = ""
    this.lastUpdate = 0
  }

  render(){
    return html`
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">

    <h4>${this.something}</h4>
    ${this.flow}
    <br>
    ${this.notes.length}<br>

    <div class="container-fluid">
    <div class="card-columns">
    ${this.notes.map((note,index) => html`
      <note-view-element name="${'Note'+index}" .note=${note}>Loading...</note-view-element>
      `)}
      </div>
      </div>

      <br>  <br>  <br>  <br>  <br>
      <br>
      to do, need help, see <a href="https://github.com/scenaristeur/">https://github.com/scenaristeur/</a>
      <br>
      Something that retrieve post published on Agora's POD like <a href="https://scenaristeur.github.io/compagent-tuto/" target="_blank">Compagent-tuto</a>
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
      this.getAgoraData()
    }


    async getAgoraData(){
      this.lastUpdate = Date.now()
      let notes = []
      for await (const note_url of data[this.flow].subjects){
        /*  for await (const property of note_url.properties){
        console.log(`${property}`);*/
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
        //  }
        /*  let date = await data[note_url].schema$dateCreated
        let type = await data[note_url].rdf$type
        let creator = await data[note_url].schema$creator
        let label = await data[note_url].rdfs$label
        let actor = await data[note_url].as$actor
        let name = await data[note_url].as$name
        let target = await data[note_url].as$target // !! could have many targets
        let object = await data[note_url].as$object //
        let text = await data[note_url].schema$text
        let inReplyTo = await data[note_url].as$inReplyTo
        let rating = await data[note_url]['http://purl.org/stuff/rev#rating']

        console.log("note", `${note_url}`, `${date}`, `${type}`,
        `${creator}`, `${label}`, `${actor}`, `${name}` , `${target}`
        , `${object}`, `${text}`, `${inReplyTo}`, `${rating}` );
        let note = {}
        note.id = `${note_url}`.substring(this.flow.length+1)

        note.url = `${note_url}`
        note.date = `${date}`
        note.type = `${type}`
        note.creator = `${creator}`
        note.label = `${label}`
        note.actor = `${actor}`
        note.name = `${name}`
        note.target = `${target}`
        note.object = `${object}`
        note.text = `${text}`
        note.inReplyTo = `${inReplyTo}`
        note.rating = `${rating}`
        console.log(note)*/
        let note = {}
        note.url = `${note_url}`
        note.id = `${note_url}`.substring(this.flow.length+1)

  notes = [...notes, note]
        /*  let user = {}
        user.webId = `${connection_user}`.substring(this.connexionFile.length+1)
        let connection = await data[connection_user].dct$modified
        user.connection = `${connection}`
        users = [... users, user]*/
        /*if ( `${subject}` != discovurl){ // ne semble pas fonctionner ??
        docs = [... docs, `${subject}`]
        //console.log(docs)
      }*/
    }
    //this.notes = notes
    /*users.sort(function(a, b){
    return a.connection < b.connection;
  });
  app.users = users
  console.log(app.users)*/
  notes.sort(function(a, b){
    return a.id < b.id;
  });

  this.notes = notes



}


webIdChanged(webId){
  this.webId = webId
  if (webId != null){
    this.updateProfile();
  }else{

  }
}

}

customElements.define('flow-element', FlowElement);
