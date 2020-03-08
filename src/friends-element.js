import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";

class FriendsElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      webId: {type: String},
      friendsWebIds: {type: Array}
    };
  }

  constructor() {
    super();
    this.something = "Friends Element"
    this.friendsWebIds = []
  }

  render(){
    return html`
    <h4>${this.something}</h4>
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
      this.updateFriends();
    }else{

    }
  }

  async updateFriends(){
    this.friendsWebIds = []
    this.friendsWebIds.push(await data.user)
    for await (const friend of data.user.friends){
      //  console.log(friend)
      this.friendsWebIds = [... this.friendsWebIds, friend]
    }
    console.log(this.friendsWebIds)
  }

}

customElements.define('friends-element', FriendsElement);
