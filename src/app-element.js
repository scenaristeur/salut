import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
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
      webId: {type: String}
    };
  }

  constructor() {
    super();
    this.something = "AppElement"
    this.webId = null
  }

  render(){
    return html`
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <style>
    /* Sticky footer styles
    -------------------------------------------------- */
    .footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      /* Set the fixed height of the footer here */
      height: 60px;
      background-color: #f5f5f5;
    }
    </style>
    <h4>${this.something}</h4>
    <login-element name="Login"></login-element>

    <profile-element ?hidden="${this.webId == null}" name="Profile"></profile-element>
<!--
    <friends-element ?hidden="${this.webId == null}" name="Friends"></friends-element>
    <map-element name="Map"></map-element>
    <swiper-element ?hidden="${this.webId == null}" name="Swiper"></swiper-element>
    <utilisateurs-element name="Utilisateurs"></utilisateurs-element>
    -->

    <footer class="footer">
    <div class="container">
    <nav class="navbar  navbar-expand-lg navbar-light bg-light" style="background-color: #e3f2fd;">
      <a class="navbar-brand" href="#">Salut</a>
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

</nav>
    </div>
    </footer>

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
      //  this.updateProfile();
    }else{

    }
  }

}

customElements.define('app-element', AppElement);
