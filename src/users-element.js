import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import data from "@solid/query-ldflex";
import './user-element.js'

class UsersElement extends LitElement {

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
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">

    <div class="container-fluid">
    <div class="card-columns">
    ${this.users.map((user,index) => html`
      <user-element name="${'User'+index}" .user=${user}>Loading...</user-element>
      `)}
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

      let users = []
      for await (const connection_user of data[this.connexionFile].subjects){
        console.log("connection_user", `${connection_user}` );
        let user = {}
        user.webId = `${connection_user}`.substring(this.connexionFile.length+1)
        let connection = await data[connection_user].dct$modified
        user.connection = `${connection}`
        users = [... users, user]
        /*if ( `${subject}` != discovurl){ // ne semble pas fonctionner ??
        docs = [... docs, `${subject}`]
        //console.log(docs)
      }*/
    }
    users.sort(function(a, b){
      return a.connection < b.connection;
    });
    app.users = users
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

customElements.define('users-element', UsersElement);
