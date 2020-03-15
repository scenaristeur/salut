import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';

class GraphElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      count: {type: Number}
    };
  }

  constructor() {
    super();
    this.count = 0
  }

  render(){
    return html`
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <style>
    .conteneur
    {
      position: relative;
    }

    .conteneur iframe
    {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
    </style>
    <p>${this.name}</p>
    TODO, work in progress
    <br>
    Something to deal with graphs like <a href="https://scenaristeur.github.io/spoggy-simple/?source=https://agora.solid.community/public/spoggy/activity.ttl" target="_blank">Spoggy Simple</a>
  <!--  <button @click="${this.sendMessage}">Open in another Window</button> -->

    <div class="conteneur">
  <!--  <iframe src="https://scenaristeur.github.io/spoggy-simple/?source=https://agora.solid.community/public/spoggy/activity.ttl"> sans les propriétés width et height déterminées par le conteneur parent... </iframe>
  -->  </div>

    `;
  }

  firstUpdated(){
    var app = this;
    this.agent = new HelloAgent(this.name);
    this.agent.receive = function(from, message) {
      if (message.hasOwnProperty("action")){
        switch(message.action) {
          case "doSomething":
          app.doSomething(message);
          break;
          default:
          console.log("Unknown action ",message)
        }
      }
    };
  }

  doSomething(message){
    console.log(message)
  }

  sendMessage(){
    this.count++
    this.agent.send("Messages", {action:"info", info:"Now counter is "+this.count}  )
  }

}

customElements.define('graph-element', GraphElement);
