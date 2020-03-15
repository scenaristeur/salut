import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
//import { solid, schema, rdf, rdfs } from 'rdf-namespaces';
import { namedNode } from '@rdfjs/data-model';
import  data  from "@solid/query-ldflex";

import 'bootstrap-switch-button';

import './note-element.js'
import './media-element.js'
import './graph-element.js'
import './triple-element.js'

class PostElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      profile_url: {type: String}
    };
  }

  constructor() {
    super();
    this.something = "Post Element"
    this.profile_url = ""
    this.fileClient = SolidFileClient;
    console.log(this.fileClient)
  }

  render(){
    return html`
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <link href="css/bootstrap-switch-button.min.css" rel="stylesheet">

    <style>
    body {font-family: Arial;}

    /* Style the tab */
    .tab {
      overflow: hidden;
      border: 1px solid #ccc;
      background-color: #f1f1f1;
    }

    /* Style the buttons inside the tab */
    .tab button {
      background-color: inherit;
      float: left;
      border: none;
      outline: none;
      cursor: pointer;
      padding: 5px 8px;
      transition: 0.3s;
      font-size: 17px;
    }

    /* Change background color of buttons on hover */
    .tab button:hover {
      background-color: #ddd;
    }

    /* Create an active/current tablink class */
    .tab button.active {
      background-color: #ccc;
    }

    /* Style the tab content */
    .tabcontent {
      display: none;
      padding: 6px 12px;
      border: 1px solid #ccc;
      border-top: none;
      width: 100%;
    }
    </style>
    <div class="container">
    <div class="row">
<br>
Agora : <a href="https://scenaristeur.github.io/compagent-tuto/" target="_blank">See the spogs on Agora</a>
    <label class="sr-only" for="title">Title</label>
    <div class="input-group mb-2">
    <input id="title" class="form-control" type="text" value="${this.title}" placeholder="Title">
    </div>
    </div>


    <div class="row"><!--style="height:50vh"-->
    <div id="Note" class="tabcontent" style="display:block;height: 40vh">
    <note-element id="note" name="Note"></note-element>
    </div>

    <div id="Media" class="tabcontent" style="height: 40vh">
    <media-element id="media" name="Media"></media-element>
    </div>

    <div id="Triple" class="tabcontent" style="height: 40vh">
    <triple-element id="triple" name="Triple"></triple-element>
    </div>

    <div id="Graph" class="tabcontent" style="height: 40vh">
    <h3 class="text-primary">Graph</h3>
    <p class="text-primary">todo.</p>
    <graph-element id="graph" name="Graph"></graph-element>
    </div>

    <div class="tab">
    <button class="tablinks active" tabName='Note' @click="${this.openTab}"><i class="far fa-sticky-note"></i> Note</button>
    <button class="tablinks" tabName='Media' @click="${this.openTab}"><i class="fas fa-photo-video"></i> Media</button>
    <button class="tablinks" tabName='Triple' @click="${this.openTab}"><i class="fas fa-receipt"> Triples (work in progress)</i></button>
    <button class="tablinks" tabName='Graph' @click="${this.openTab}"><i class="fas fa-dice-d20"> Graph (todo)</i></button>
    </div>

    </div>

    <div class="row">
    <label class="sr-only" for="title">Tags</label>
    <div class="input-group mb-2">
    <div class="input-group-append">
    <div class="input-group-text">Tags</div>
    </div>
    <input id="tags" class="form-control" type="text" placeholder="tags, comma separated">
    </div>
    </div>



    <div class="buttons">
    <div class="row">
    <div class="col-8">


    <div>
    <input type="checkbox"
    id="privacy_switch"
    data-toggle="switchbutton"
    checked data-onlabel="Private  (todo)"
    data-offlabel="Public (todo)"
    data-onstyle="success"
    data-offstyle="danger"
    data-width="150"
      data-size="sm">
    </div>

    <div>
    <input type="checkbox"
    id="agora_switch"
    data-toggle="switchbutton"
    checked data-onlabel="Don't push to Agora"
    data-offlabel="Push to Agora"
    data-onstyle="success"
    data-offstyle="danger"
    data-width="150"
    data-size="sm">
    </div>

    </div>
    <div class="col">
    <button type="button" class="btn btn-primary" primary @click=${this.submit}>Submit <i class="far fa-paper-plane"></i></button>
    <span id="spinner" class="spinner-border spinner-border-sm" hidden role="status" aria-hidden="true"></span>

    </div>
    <!--
    <button type="button" class="cancel btn btn-primary" @click="${this.toggleWrite}"><i class="fas fa-window-close"></i> </button>-->
    </div>
    </div>
    </div>
    <br>  <br>  <br>  <br>  <br>
    `;
  }



  async submit(){
    var date = new Date(Date.now())
    var id = date.getTime()
    var title = this.shadowRoot.getElementById('title').value.trim();
    var tags = this.shadowRoot.getElementById('tags').value.split(',');
    var agora_switch = this.shadowRoot.getElementById('agora_switch').checked

    //  this.shadowRoot.getElementById("submit_btn").disabled = true
    //  this.shadowRoot.getElementById("spinner").hidden = false
    var content = this.shadowRoot.getElementById("note").content
    var file = this.shadowRoot.getElementById("media").file
    var triples = this.shadowRoot.getElementById("triple").triples
    let priv = this.shadowRoot.getElementById("privacy_switch").checked
    console.log(date, id, title, tags, agora_switch, priv, content, file, triples)
    this.shadowRoot.getElementById('title').value = ""
    this.shadowRoot.getElementById('tags').value = ""
    let storage = await data.user.storage
    console.log(`${storage}`)
      let webId = await data.user
      console.log(`${webId}`)
    var userActivity = storage+"public/spoggy/activity.ttl#"+id
    console.log("Creation ", userActivity)
    await data[userActivity].as$name.set(title)
    await data[userActivity].rdfs$label.set(title)
    await data[userActivity].schema$dateCreated.set(date.toISOString())
    await data[userActivity].rdf$type.add(namedNode('https://www.w3.org/ns/activitystreams#Create'))

console.log("activity created")
    if (agora_switch == false){
      console.log("create agora ref")
      var agoraActivity = "https://agora.solid.community/public/spoggy/activity.ttl#"+id
      await data[agoraActivity].as$name.add(title)
      await data[agoraActivity].rdfs$label.add(title)
      await data[agoraActivity].schema$dateCreated.add(date.toISOString())
      await data[agoraActivity].rdf$type.add(namedNode('https://www.w3.org/ns/activitystreams#Create'))
      await data[agoraActivity].as$actor.add(namedNode(webId))
      await data[agoraActivity].as$target.add(namedNode(userActivity))
      //  inReplyTo!= null &&  inReplyTo.length > 0 ? await data[agoraActivity].as$inReplyTo.add(namedNode(inReplyTo)) : "";
  console.log("agora ref ok")
    }

    if (content.length > 0){
        console.log("create note")
      var userNote = storage+"public/Notes/"+id+".ttl"
      await data[userNote].schema$text.add(content);
      await data[userNote].rdf$type.add(namedNode('https://www.w3.org/ns/activitystreams#Note'))
      await data[userActivity].schema$text.add(content);
      await data[userActivity].as$object.add(namedNode(userNote))
  console.log("note created")
      if (agora_switch == false){
          console.log("create agora content ")
        await data[agoraActivity].schema$text.add(content);
        await data[agoraActivity].as$object.add(namedNode(userNote))
          console.log("agora content")
      }
    }

    if (file != undefined){
        console.log("create file")
      var contentType = file.contentType
      var newFilename = file.name // r.message.newFilename
      var classe = "Document"//r.message.type
      var userMedia = storage+"public/spoggy/"+classe+"/"+newFilename
      console.log("creation ",userMedia)
      await this.sendFile(userMedia, file, contentType)
      await  data[userActivity].as$object.add(namedNode(userMedia))
      await  data[agoraActivity].as$object.add(namedNode(userMedia))
  console.log("file created")
    }
    //this.shadowRoot.getElementById("content").value = ""
    //  this.shadowRoot.getElementById("submit_btn").disabled = false
    //  this.shadowRoot.getElementById("spinner").hidden = true
  }

  sendFile(uri, file, contentType){
      console.log(this.fileClient)
    this.fileClient.createFile(uri, file, contentType)
    .then(
      success =>{
        console.log(success)
        //  this.agent.send("Messages", {action: "info", status: "Save file OK", file: success})
      },
      err => {
        console.log(err)
      });
    }

    async submit1(){
      this.shadowRoot.getElementById("submit_btn").disabled = true
      this.shadowRoot.getElementById("spinner").hidden = false
      this.content = this.shadowRoot.getElementById("content").value.trim()
      this.file = this.shadowRoot.getElementById("Picsupload").file
      let priv = this.shadowRoot.getElementById("privacy_switch").checked
      console.log(priv, this.content,this.file)
      //this.shadowRoot.getElementById("content").value = ""
      this.shadowRoot.getElementById("submit_btn").disabled = false
      this.shadowRoot.getElementById("spinner").hidden = true
    }



    firstUpdated(){
      var app = this;
      this.agent = new HelloAgent(this.name);
      console.log(this.agent)
      app.shadowRoot.getElementById('privacy_switch').switchButton('off');
      app.shadowRoot.getElementById('agora_switch').switchButton('off');

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
        this.updateProfile();
      }else{

      }
    }

    openTab(e) {
      var node = e.target
      if (node.nodeName == "I"){
        // gestion des icones
        node = e.target.parentNode
      }
      var tabName = node.getAttribute('tabName')
      var i, tabcontent, tablinks;
      tabcontent = this.shadowRoot.querySelectorAll(".tabcontent");
      for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
      }
      tablinks = this.shadowRoot.querySelectorAll(".tablinks");
      for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
      }
      this.shadowRoot.getElementById(tabName).style.display = "block";
      node.className += " active";
    }

  }

  customElements.define('post-element', PostElement);
