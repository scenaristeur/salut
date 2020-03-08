import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import data from "@solid/query-ldflex";

class UtilisateursElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      webId: {type: String},
      connexionFile: {type: String},
      users: {type: String}
    };
  }

  constructor() {
    super();
    this.something = "UtilisateursElement"
    this.connexionFile = "conn"
    this.users = []
  }

  render(){
    return html`
    <h4>${this.something}</h4>
    ${this.connexionFile}<br>
    ${this.users.length}

    <ul>
    ${this.users.map((user) => html`<li>${user.webId}, ${user.connection}</li>`)}
    </ul>
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

    app.users = []
    for await (const connection_user of data[this.connexionFile].subjects){
      console.log("connection_user", `${connection_user}` );
      let user = {}
      user.webId = `${connection_user}`.substring(this.connexionFile.length+1)
      user.connection = await data[connection_user].dct$modified
      app.users = [... app.users, user]
      /*if ( `${subject}` != discovurl){ // ne semble pas fonctionner ??
      docs = [... docs, `${subject}`]
      //console.log(docs)
    }*/
  }
  console.log(app.users)

}

webIdChanged(webId){
  this.webId = webId
  if (webId != null){
    //  this.updateProfile();
  }else{

  }
}

}

customElements.define('utilisateurs-element', UtilisateursElement);
