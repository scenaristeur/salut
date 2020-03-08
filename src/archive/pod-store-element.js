import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
//import  Shighl  from 'shighl'
import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';


class PodStoreElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      webId: {type: String},
      //    pod: {type: Object},
      //  friends: {type: Array},
    };
  }

  constructor() {
    super();
    this.something = "PodStore Element"
    this.webId = null
    //const sh = new Shighl()
    //this.session = new sh.session()
    //this.pod = new sh.pod()
    //this.friends = []
  }

  render(){
    return html`
    <h4>${this.something}</h4>
    ${this.webId}<br>

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
    console.log("auth",auth)

    auth.trackSession(session => {
      if (!session){
        this.webId
        console.log('The user is not logged in')
      }
      else{
        this.webId = session.webId
        console.log("WebId",this.webId)
        console.log(`The user is ${session.webId}`)
      }

    })
    /*
    this.session.track(async function(webId){
    app.webId = webId
    app.pod.webId = webId
    if (webId != null){
    app.friends = await app.pod.friends
    console.log(app.friends)
  }else{
  app.friends = []
  console.log(app.friends)
}
})*/
}
/*
webIdChanged(webId){
console.log("WebId: ",webId)
this.webId = webId
if (webId != null){
this.webId = webId
}
else{

}
}*/




}

customElements.define('pod-store-element', PodStoreElement);
