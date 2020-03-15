import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';

class UserElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      user: {type: Object},
      lang: {type: String},
    };
  }

  constructor() {
    super();
    this.user = {}
    this.user.interests = []
    this.lang=navigator.language
  }

  render(){
    return html`
    <style>
    .user_img{
      width: 90px !important
    }
    .main{
      display: inline-block
    }
    </style>

    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <div class="col mb-4 main">
    <div class="card h-100">

    <div class="row">
    <div class="col-3 m-3">
    ${this.user.img != null && this.user.img != "undefined" && this.user.img != "" ?
    html`<img class="card-img-top rounded-circle user_img"
    src="//images.weserv.nl/?url=${this.user.img}&w=90&h=90">`
    :html`<i class="card-img-top fas fa-user-circle fa-5x"></i>`
  }
  </div>
  <div class="col m-2">
  <h5 class="card-title">${this.user.name}</h5>
  <p class="text-right font-weight-light">
  ${this.user.locality} / ${this.user.country}<br>
  ${this.user.organization} / ${this.user.role}<br>
  </p>

  <div class="row">
  <button type="button" class="btn btn-outline-info btn-sm">
  Mail (todo)
  <i class="fas fa-envelope-square" @click="${this.sendMail}"></i>
  </button>
  <button type="button" class="btn btn-outline-info btn-sm">
  Friends(todo)
  <i class="fas fa-envelope-square" @click="${this.sendMail}"></i>
  </button>
  </div>

  </div>

  </div>



  <div class="card-body">
  <div class="row">
  ${this.user.interests != undefined ?
    html `
    <div class="container">
    Interests :
    <div class="row">

    ${this.user.interests.map((interest,index) => html`
      <button type="button" class="btn btn-outline-info btn-sm">
      ${interest}</button>
      `)}

      </div>
      </div>
      `
      :html``
    }</div>

    <p class="card-text">
    ${this.user.description}
    </p>
    <a type="button" href="${this.user.webId}" target="_blank" class="btn btn-outline-primary">Pod</a>
    <button type="button" class="btn btn-outline-primary" f_webId="${this.user.webId}" @click="${this.showMore}">More</button>
    <button type="button" class="btn btn-outline-primary" f_webId="${this.user.webId}" @click="${this.addFriend}">Add to my Friends</button>

    </div>
    <div class="card-footer">
    <small class="text-muted">last connection: ${new Date(this.user.connection).toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit',hour: '2-digit', minute:'2-digit'})}<br>
    ${this.user.birthday != undefined && this.user.birthday.length > 0 ?
      html`birthday: ${this.user.birthday.toLocaleString([], {year: '2-digit', month: '2-digit', day: '2-digit'})}`
      :html ``
    }
    </small>
    </div>
    </div>
    </div>
    `;
  }

  async addFriend(e){
    console.log(this.user.webId)
    try{
      await data.user.friends.add(namedNode(this.user.webId))
      alert(this.user.name+" has been added to your friends")
    }catch(e){
      if (e == "Error: Cannot resolve user path: no user logged in"){
        alert ("You must login to add "+this.user.name+" to your friends !" )
      }else{
        alert(e)
      }
    }
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
    var storage = await data[this.user.webId].storage
    this.user.storage = `${storage}`

    let profile_url = this.user.storage+"public/salut/profile.ttl#me"

    const n = await data[profile_url].vcard$fn || await data[this.user.webId].vcard$fn || this.user.webId.split("/")[2].split('.')[0];
    const img =  await data[profile_url].vcard$hasPhoto || await data[this.user.webId].vcard$hasPhoto || "";
    const role = await data[profile_url].vcard$role || await data[this.user.webId].vcard$role || "";
    const birthday = await data[profile_url].vcard$bday || "";
    const gender = await data[profile_url].vcard$hasGender || "Unknown";
    const description = await data[profile_url].vcard$note || "";
    const organization = await data[profile_url]['http://www.w3.org/2006/vcard/ns#organization-name'] || await data[this.user.webId]['http://www.w3.org/2006/vcard/ns#organization-name'] || "";
    const locality = await data[profile_url].vcard$locality || await data[this.user.webId].vcard$hasAddress.vcard$locality || "";
    const country = await data[profile_url]['http://www.w3.org/2006/vcard/ns#country-name'] || await data[this.user.webId].vcard$hasAddress['http://www.w3.org/2006/vcard/ns#country-name'] || "";
    this.user.name = `${n}`
    this.user.img = `${img}`
    this.user.role = `${role}`
    this.user.birthday = `${birthday}`
    this.user.gender = `${gender}`
    this.user.description = `${description}`
    this.user.organization = `${organization}`
    this.user.locality = `${locality}`
    this.user.country = `${country}`
    //  this.user.inbox = `${inbox}`
    //  this.user.storage = `${storage}`
    //  this.user.instances = []
    //  console.log(this.user)
    let interests = []


    for await (const interest of data[profile_url].foaf$topic_interest){
      //  console.log(`${interest}`);
      interests = [...interests, interest]
    }
    this.user.interests = interests
    //  console.log("USER",this.user)
    this.requestUpdate()
  }

  webIdChanged(webId){
    this.webId = webId
    if (webId != null){
      //  this.updateProfile();
    }else{

    }
  }

}

customElements.define('user-element', UserElement);
