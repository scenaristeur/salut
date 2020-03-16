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
      lang: {type: String},
    };
  }

  constructor() {
    super();
    this.something = "Flow Element";
    this.notes = []
    this.flow = ""
    this.lastUpdate = 0
    this.lang=navigator.language
  }

  render(){

    const noteCard = (n) => html `
    <div class="card">


    <div>
    ${n.objects.map((o) => html`
      ${this.templateImage(o)}
      `)}
      </div>
      <!--    <img class="card-img-top" src="..." alt="Card image cap">-->
      <div class="card-body">

      <p class="card-text">
      <!--  ${n.count}-->
      <a  href="${n.actor}" ?hidden=${n.actor == null} target="_blank" >
      <i title="${n.actor}" primary small  class="bd-placeholder-img mr-2 rounded fas fa-user"></i>
      <small><b>${n.actorname}</b></small>
      </a>
      <small class="text-muted">${n.date}<!--Last updated 3 mins ago--></small>
      </p>

      <h5 class="card-title">
      <a href="${n.uri}" target="_blank">${n.title}</a>
      </h5>

      <blockquote class="blockquote mb-0">
      ${n.text != "null" ?
      html`<p>${n.text}</p>`
      :html``
    }

    <footer class="blockquote-footer">
    ${n.keywords!= "null" ?
    html`  <small>${n.keywords}</small>`
    :html``
  }


  <!--  ${n.inReplyTo != "null" ?
  html`
  <small>In replyTo <a href="${n.inReplyTo}" target="_blank">${n.inReplyToShort}</a></small><br>`
  :html``
}-->
<small class="text-muted">
<cite title="Source Title">
${n.objects.map((o) => html`
  ${this.templateDefaultObject(o)}
  `)}
  </cite>
  </small>
  </footer>
  </blockquote>

  <div class="row icon-pan">

  <div class="col">
  <button class="btn btn-outline-primary btn-sm" uri="${n.uri}" @click="${this.reply}">
  <i  class="fas fa-comment-dots fa-sm" title="Reply" uri="${n.uri}"></i>
  </button>
  <!--<a href="${n.uri}" target="_blank">  <i title="open" primary small  class="fas fa-eye"></i></a>-->
  <button class="btn btn-outline-primary btn-sm">
  <a href="${n.target}" target="_blank"><i class="fas fa-external-link-alt fa-sm"></i></a>
  </button>

  <button class="btn btn-outline-primary btn-sm">
  <a href="https://scenaristeur.github.io/spoggy-simple/?source=${n.target}"  title="${n.target}" target="_blank">
  <i title="see spoggy graph" class="fas fa-dice-d20 fa-sm"></i><a>
  </button>

  <button class="btn btn-outline-primary btn-sm">
  <i title="copy" primary @click="${this.copy}" uri=${n.uri} class="fas fa-copy  fa-sm"></i>
  </button>
  </div>

  <div class="col">
  <button class="btn btn-outline-primary btn-sm" value=1 uri="${n.uri}"  @click="${this.like}">
  <i value=1 uri="${n.uri}" class="far fa-thumbs-up fa-sm" @click="${this.like}"></i>
  </button>
  <button class="btn btn-outline-primary btn-sm">  ${n.rating} </button>
  <button class="btn btn-outline-primary btn-sm" value=-1 uri="${n.uri}"  @click="${this.like}">
  <i value=-1 uri="${n.uri}" class="far fa-thumbs-down fa-sm" @click="${this.like}"></i>
  </button>


  </div>
  </div>
  </div>
  `;



  return html`
  <link href="css/fontawesome/css/all.css" rel="stylesheet">
  <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
  <style>
  .card-columns {
    @include media-breakpoint-only(lg) {
      column-count: 4;
    }
    @include media-breakpoint-only(xl) {
      column-count: 5;
    }
  }
  .fa-sm {
    padding:0px;
  }
  </style>

  <h6 class="border-bottom border-gray pb-2 mb-0 text-primary">Spogs on Agora (${this.notes.length})
  <select id="mySelect" @change=${this.sort}>
  <option id="date_inc" value="date_inc">Date Increase</option>
  <option id="date_dec" value="date_dec" selected>Date Decrease</option>
  <option id="rating_inc" value="rating_inc">Rating Increase</option>

  <option id="rating_dec" value="rating_dec">Rating Decrease</option>
  </select>
  <small class="d-block text-right mt-3">
  <a href="${this.flow}"  title="${this.flow}" target="_blank">All Agora's spogs<a>
  <a href="https://scenaristeur.github.io/spoggy-simple/?source=${this.flow}"  title="${this.flow}" target="_blank"><i class="fas fa-dice-d20"></i><a>
  </small>
  </h6>


  <!--    <div  style="height: 50vh; overflow: auto">-->
  <div class="card-columns" style="background:#c7f3fc">


  ${this.notes.reverse().map((note, index) => html`
    <note-view-element name="${'Note'+index}" .note=${note}>Loading...</note-view-element>

    <!--  ${noteCard(note)}-->
    `
  )}

  </div>
  <!--  </div> -->




  <!--
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
    </div>-->

    <br>  <br>  <br>  <br>  <br>
    <br>
    to do, need help, see <a href="https://github.com/scenaristeur/">https://github.com/scenaristeur/</a>
    <br>
    Something that retrieve post published on Agora's POD like <a href="https://scenaristeur.github.io/compagent-tuto/" target="_blank">Compagent-tuto</a>
    `;
  }


  async like(e){
    console.log(e.target)
    var uri = e.target.getAttribute("uri")
    var value = e.target.getAttribute("value")
    var score = await data[uri]['http://purl.org/stuff/rev#rating'] || 0

    console.log(score)
    score == undefined  || isNaN(score) ? score = 0 : "";
    var new_score = parseInt(score)+parseInt(value)
    console.log(new_score)
    await data[uri]['http://purl.org/stuff/rev#rating'].set(new_score.toString())
  }


  sort(e){
    var element = e.target
    var val = element.options[element.selectedIndex].value
    console.log(val)
    switch(val) {
      case "date_inc":
      this.notes.sort(function(a, b) { //tri par date
        return a.id - b.id;
      });
      break;
      case "date_dec":
      this.notes.sort(function(a, b) { //tri par date
        return b.id - a.id;
      });
      break;
      case "rating_inc":
      this.notes.sort(function(a, b) {   //tri par popularite
        return a.rating - b.rating;
      });
      break;
      case "rating_dec":
      this.notes.sort(function(a, b) {   //tri par popularite
        return b.rating - a.rating;
      });
      break;
      default:
      console.log("Unknown select ",val)
    }
    this.requestUpdate()

  }


  reply(e){
    console.log(e.target.getAttribute('uri'))
    var object = e.target.getAttribute('uri')
    var mess = {action:"toggleWrite"}
    this.agent.send("Post", mess)
    var messRep = {action:"setReplyTo", replyTo: object }
    this.agent.send("PostTabs", messRep)
  }

  templateImage(o){
    switch(o.extension){
      case ".png":
      case ".jpg":
      case ".gif":
      return html`
      <img class="card-img-top" src="${o.uri}" style="max-width:300px">
      <!--          <a href="${o.uri}" target="_blank"></a> -->
      `
      break;
      default:

    }
  }

  templateDefaultObject(o){
    if (o.extension !== ".png" && o.extension !== ".jpg" && o.extension !== ".gif"){
      return html`
      <a href="${o.uri}" target="_blank">${o.short}</a><br>
      `
    }
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
    for await (const note_uri of data[this.flow].subjects){
      let note = {}
      note.id = `${note_uri}`.substring(this.flow.length+1)

      note.uri = `${note_uri}`
      note.objects = []
      /*  for await (const property of note_uri.properties){
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
      http://puri.org/stuff/rev#rating flow-element.js:67

      */
      //}

      //  console.log(note)
      notes = [...notes, note]

      /*  let user = {}
      user.webId = `${connection_user}`.substring(this.connexionFile.length+1)
      let connection = await data[connection_user].dct$modified
      user.connection = `${connection}`
      users = [... users, user]*/
      /*if ( `${subject}` != discovuri){ // ne semble pas fonctionner ??
      docs = [... docs, `${subject}`]
      //console.log(docs)
    }*/
    this.notes = notes
    this.requestUpdate()
  }
  /*notes.sort(function(a, b){
    return a.id < b.id;
  });*/
  // select last 12
  this.notes = notes//.slice(0, 12)
  /*for(var i= 0; i<this.notes.length; i++){
  let n = this.notes[i]

  let dateLit = await data[n.uri].schema$dateCreated
  let type = await data[n.uri].rdf$type
  //  let creator = await data[n.uri].schema$creator
  let label = await data[n.uri].rdfs$label
  let actor = await data[n.uri].as$actor
  let name = await data[n.uri].as$name
  let target = await  data[n.uri].as$target//
  let keywords  = await data[n.uri].schema$keywords || null
  let text = await data[n.uri].schema$text || null
  let inReplyTo = await data[n.uri].as$inReplyTo || null
  let rating = await data[n.uri]['http://purl.org/stuff/rev#rating'] || 0

  //  let objects = []
  for await (const o of data[n.uri].as$object){
  var object = {}
  object.uri = `${o}`
  object.extension = `${o}`.substring(`${o}`.lastIndexOf("."));
  object.short = `${o}`.substring(`${o}`.lastIndexOf("/"));
  n.objects = [... n.objects, object]
  //  objects = [...objects,`${o}`]
}

n.date =  new Date(`${dateLit}`).toLocaleString(this.lang)
n.type = `${type}`
//  n.creator = `${creator}`
n.title = `${label}`
n.actor = `${actor}`
n.name = `${name}`
n.target = `${target}`
n.keywords = `${keywords}`
n.text = `${text}`
n.inReplyTo = `${inReplyTo}`
n.inReplyToShort = n.inReplyTo != null ? n.inReplyTo.substring(n.inReplyTo.lastIndexOf("/")) : null;
n.rating = `${rating}`

n.actorname = await   data[`${actor}`].vcard$fn
//  console.log(n)
}*/
this.requestUpdate()
//websocket
/*  if (this.socket == undefined){
this.subscribe()
}else{
console.log("socket exist deja")
}*/



//this.notes = notes
/*users.sort(function(a, b){
return a.connection < b.connection;
});
app.users = users
console.log(app.users)*/
/*     let date = await data[note_uri].schema$dateCreated
let type = await data[note_uri].rdf$type
let creator = await data[note_uri].schema$creator
let label = await data[note_uri].rdfs$label
let actor = await data[note_uri].as$actor
let name = await data[note_uri].as$name
let target = await data[note_uri].as$target // !! could have many targets
let object = await data[note_uri].as$object //
let text = await data[note_uri].schema$text
let inReplyTo = await data[note_uri].as$inReplyTo
let rating = await data[note_uri]['http://purl.org/stuff/rev#rating']

/*  console.log("note", `${note_uri}`, `${date}`, `${type}`,
`${creator}`, `${label}`, `${actor}`, `${name}` , `${target}`
, `${object}`, `${text}`, `${inReplyTo}`, `${rating}` );*/

/*  note.date = `${date}`
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
*/



}


webIdChanged(webId){
  this.webId = webId
  if (webId != null){
    this.updateProfile();
  }else{

  }
}

subscribe(){
  var app = this
  //  app.callback = callback

  //https://github.com/scenaristeur/spoggy-chat-solid/blob/master/index.html

  var myEfficientFn = this.debounce(function(data) {
    // All the taxing stuff you do
    //  console.log("Update",data)
    //  app.callback()
    //  callback(data)
    app.getAgoraData()
  }, 5000); //250

  var websocket = "wss://agora.solid.community/"
  //  console.log("WEBSOCK",websocket)
  app.socket = new WebSocket(websocket);
  //  console.log ("socket",app.socket)
  app.socket.onopen = function() {
    const d = new Date();
    var now = d.toLocaleTimeString(app.lang) + `.${d.getMilliseconds()}`
    this.send('sub '+app.flow);
    app.agent.send('Messages', now+"[souscription] "+app.flow)
    // console.log("OPENED SOCKET",app.socket)
  };
  app.socket.onmessage = function(msg) {
    //  console.log("update")
    if (msg.data && msg.data.slice(0, 3) === 'pub') {
      //  console.log("update")
      console.log("websocket timestamp",msg.timeStamp)

      myEfficientFn(msg.data)
      //  module.callback(msg.data)

    }
    //  Date.now() - app.lastUpdate > 1000 ?   app.getAgoraData() : "";
    //app.getAgoraData()
    //  }
    //else{console.log("message inconnu",msg)}
  };
}

copy(e){
  var dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = e.target.getAttribute("uri");
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}

debounce(func, wait, immediate) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

}

customElements.define('flow-element', FlowElement);
