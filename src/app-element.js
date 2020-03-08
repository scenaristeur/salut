import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
//import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";

import './login-element.js'
import './friends-element.js'
import './map-element.js'
import './profile-element.js'
import './swiper-element.js'
import './utilisateurs-element.js'

class AppElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      webId: {type: String},
      connexionFile: {type: String},
      locationFile: {type: String},
      menu: {type: String}
    };
  }

  constructor() {
    super();
    this.something = "Salut"
    this.webId = null
    this.connexionFile = "https://salut.solid.community/public/log/connection.ttl"
    this.locationFile = "https://salut.solid.community/public/log/location.ttl"
    this.menu = "landing_menu"
  }

  render(){
    return html`
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <style>
    /* Sticky footer styles
    -------------------------------------------------- */
    .footer {
      position: fixed;
      bottom: 0;
      width: 100%;
      /* Set the fixed height of the footer here */
      height: 60px;
      background-color: #f5f5f5;
    }
    </style>
    <h4>${this.something}</h4>
    <login-element name="Login"></login-element>

    <profile-element ?hidden="${this.webId == null || this.menu != 'profile_menu'}" name="Profile"></profile-element>

    <friends-element ?hidden="${this.webId == null || this.menu != 'friends_menu'}" name="Friends"></friends-element>
    <map-element ?hidden="${this.menu != 'map_menu'}" name="Map"></map-element>
    <swiper-element ?hidden="${this.webId == null || this.menu != 'swipper_menu'}" name="Swiper"></swiper-element>
    <utilisateurs-element ?hidden="${this.menu != 'users_menu'}" name="Utilisateurs" connexionFile="${this.connexionFile}" ></utilisateurs-element>

    <br><br>    <br><br>    <br><br>

    <footer class="footer">
    <div class="container">
    <nav class="navbar navbar-expand-sm navbar-light bg-light" style="background-color: #e3f2fd;">
    <ul class="navbar-nav">
    <li class="nav-item" name="users_menu" @click=${this.menuChanged}>
    <a class="nav-link" name="users_menu" href="#">Users</a>
    </li>
    <li class="nav-item" name="map_menu" @click=${this.menuChanged}>
    <a class="nav-link" name="map_menu" href="#">Map</a>
    </li>
    <li class="nav-item" name="swipper_menu" @click=${this.menuChanged} ?hidden="${this.webId == null}">
    <a class="nav-link" name="swipper_menu" href="#">Swipper</a>
    </li>
    <li class="nav-item" name="profile_menu"  @click=${this.menuChanged} ?hidden="${this.webId == null}">
    <a class="nav-link" name="profile_menu" href="#">Profile</a>
    </li>
    <li class="nav-item" name="friends_menu"  @click=${this.menuChanged} ?hidden="${this.webId == null}">
    <a class="nav-link" name="friends_menu" href="#">Friends</a>
    </li>
    </ul>
    <!--<a class="navbar-brand" href="#">Salut</a>
    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
    <span class="navbar-toggler-icon"></span>
    </button>
    <div class="collapse navbar-collapse" id="navbarNavDropdown">
    <ul class="navbar-nav">
    <li class="nav-item active">
    <a class="nav-link" href="#">Profile <span class="sr-only">(current)</span></a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="#">Friends</a>
    </li>
    <li class="nav-item">
    <a class="nav-link" href="#">Swiper</a>
    </li>
    <li class="nav-item dropdown">
    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
    Dropdown link
    </a>
    <div class="dropdown-menu" aria-labelledby="navbarDropdownMenuLink">
    <a class="dropdown-item" href="#">Action</a>
    <a class="dropdown-item" href="#">Another action</a>
    <a class="dropdown-item" href="#">Something else here</a>
    </div>
    </li>
    </ul>
    </div>
    -->
    </nav>
    </div>
    </footer>

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

    for await (const location_user of data[this.locationFile].subjects){
      console.log("location_user", `${location_user}` );
      /*if ( `${subject}` != discovurl){ // ne semble pas fonctionner ??
      docs = [... docs, `${subject}`]
      //console.log(docs)
    }*/
  }

}
menuChanged(e){
  console.log(e.target.name)
  this.menu=e.target.name
}

async webIdChanged(webId){
  this.webId = webId
  if (webId != null){
    this.menu = "profile_menu"
    //  this.updateProfile();
    console.log("Send connected")
    var dateIso = new Date().toISOString()
    let url = this.connexionFile+"#"+webId
    console.log(url)
  //  await data[url].vcard$connection.add(dateIso)
  //  await data[url].dct$modified != undefined ?
     await data[url].dct$modified.set(dateIso)
     // : await data[url].dct$modified.add(dateIso);


  }else{
    this.menu = "users_menu"
  }
}

}

customElements.define('app-element', AppElement);
