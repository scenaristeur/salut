import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
//import * as auth from 'solid-auth-client';
import data from "@solid/query-ldflex";
import { namedNode } from '@rdfjs/data-model';

class ProfileElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      webId: {type: String},
      profile: {type: Object},
      locationFile: {type: String}
    };
  }

  constructor() {
    super();
    this.something = "Profile"
    this.profile = {}
    this.locationFile = "https://salut.solid.community/public/log/location.ttl"
  }

  render(){
    return html`
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">

    <div class="container-fluid">
    ${this.something}
    <div class="row">

    <div class="col-sm-4">
    <h4><a href="${this.webId}" target="_blank">${this.profile.name}</a></h4>
    <div class="input-group mb-3">
    <div class="input-group-prepend">
    <span class="input-group-text" id="username-label">Username</span>
    </div>
    <input id="username" type="text" class="form-control"
    placeholder="Username" aria-label="Username"
    aria-describedby="username-label" value="${this.profile.name}">
    </div>

    <div class="input-group mb-3">
    <div class="input-group-prepend">
    <span class="input-group-text"
    id="role-label">Role</span>
    </div>
    <input id="role" type="text"
    class="form-control"
    placeholder="Role"
    aria-label="Role"
    aria-describedby="role-label" value="${this.profile.role}">
    </div>

    <div class="input-group mb-3">
    <div class="input-group-prepend">
    <span class="input-group-text"
    id="organization-label">Organization</span>
    </div>
    <input id="organization" type="text"
    class="form-control"
    placeholder="Organization"
    aria-label="Organization"
    aria-describedby="organization-label" value="${this.profile.organization}">
    </div>

    <div class="input-group mb-3">
    <div class="input-group-prepend">
    <span class="input-group-text"
    id="locality-label">Locality</span>
    </div>
    <input id="locality" type="text"
    class="form-control"
    placeholder="Locality"
    aria-label="Locality"
    aria-describedby="locality-label" value="${this.profile.locality}">
    </div>

    <div class="input-group mb-3">
    <div class="input-group-prepend">
    <span class="input-group-text" id="country-label">Country</span>
    </div>
    <input id="country" type="text" class="form-control"
    placeholder="Country"
    aria-label="Country"
    aria-describedby="country-label" value="${this.profile.country}">
    </div>

    </div>

    <div class="col-sm-8">


    <div class="input-group mb-3">
    <div class="input-group-prepend">
    <span class="input-group-text" id="basic-addon2">Description</span>
    </div>
    <textarea
    id="description"
    class="form-control"
    placeholder="Description"
    aria-label="Description"
    rows="5" cols="33"
    aria-describedby="basic-addon2">${this.profile.description}
    </textarea>
    </div>


    <div class="input-group mb-3">
    <div class="input-group-prepend">
    <label class="input-group-text" for="birthday">Birthday</label>
    </div>
    <input type="date" class="form-control"
    id="birthday" aria-describedby="birthday" placeholder="Birthday"
    value="${this.profile.birthday}">
    </div>

    <div class="input-group mb-3">
    <div class="input-group-prepend">
    <label class="input-group-text" for="gender">Gender</label>
    </div>
    <select class="custom-select" id="gender">
    <option value="Unknown" ?selected="${this.profile.gender == 'Unknown'}">Unknown</option>
    <option value="Female" ?selected="${this.profile.gender == 'Female'}">Female</option>
    <option value="Male" ?selected="${this.profile.gender == 'Male'}">Male</option>
    <option value="None" ?selected="${this.profile.gender == 'None'}">None</option>
    <option value="Other" ?selected="${this.profile.gender == 'Other'}">Other</option>

    </select>
    </div>
    <!--
    <div class="form-group">
    <label for="birthday2">Birthday</label>
    <input type="date" class="form-control"
    id="birthday2" aria-describedby="emailHelp" placeholder="Birthday">
    <small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
    </div>

    <div class="form-group">
    <label for="exampleInputPassword1">Password</label>
    <input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password">
    </div>
    <div class="form-check">
    <input type="checkbox" class="form-check-input" id="exampleCheck1">
    <label class="form-check-label" for="exampleCheck1">Check me out</label>
    </div>
    -->
    <button type="button" class="btn btn-primary"  @click=${this.submit}>Submit</button>

    </div>

    </div>
    </div>
    `;
  }

  async submit(){
    this.profile.name = this.shadowRoot.getElementById("username").value.trim()
    this.profile.role = this.shadowRoot.getElementById("role").value.trim()
    this.profile.organization = this.shadowRoot.getElementById("organization").value.trim()
    this.profile.locality = this.shadowRoot.getElementById("locality").value.trim()
    this.profile.country = this.shadowRoot.getElementById("country").value.trim()
    this.profile.description = this.shadowRoot.getElementById("description").value.trim()
    this.profile.birthday = this.shadowRoot.getElementById("birthday").value
    this.profile.gender = this.shadowRoot.getElementById("gender").value

    var dateIso = new Date().toISOString()

    var dateIso = new Date().toISOString()
    let url = this.locationFile+"#"+this.webId
    console.log(url)
    await data[url].dct$modified != undefined ? await data[url].dct$modified.set(dateIso) : await data[url].dct$modified.add(dateIso);
    await data[url].vcard$locality.set(this.profile.locality)
    await data[url].vcard$country.set(this.profile.country)

    console.log(dateIso, this.profile)
    await data[this.profile.url].dct$modified.add(dateIso)
    await data[this.profile.url].vcard$fn.set(this.profile.name)||
    await data[this.profile.url].vcard$hasPhoto.set(this.profile.img)
    await data[this.profile.url].vcard$role.set(this.profile.role);
    await data[this.profile.url]['http://www.w3.org/2006/vcard/ns#organization-name'].set(this.profile.organization)
    await data[this.profile.url].vcard$locality.set(this.profile.locality)
    await data[this.profile.url]['http://www.w3.org/2006/vcard/ns#country-name'].set(this.profile.country)
    await data[this.profile.url].vcard$note.set(this.profile.description)
    await data[this.profile.url].vcard$bday.set(this.profile.birthday)
    await data[this.profile.url].vcard$hasGender.set(this.profile.gender)
    // location info

    /*  var country = await data[url].vcard$country
    console.log(country == undefined)
    if(country == undefined ){
    console.log("add")
    await data[url].vcard$country.add(this.profile.country)
  }else{
  console.log("set")
  await data[url].vcard$country.set(this.profile.country)
}*/



//  await data[url].vcard$hasAddress['http://www.w3.org/2006/vcard/ns#country-name'].set(this.profile.country)



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
    this.updateProfile();
  }else{

  }
}

async  updateProfile(){
  console.log(this.webId)
  //  let storage = await data.user.storage
  const storage = await data.user.storage;
  const inbox = await data.user.inbox;
  this.profile.storage = `${storage}`
  this.profile.url = this.profile.storage+"public/salut/profile.ttl#me"
  let test_profile = await data[this.profile.url]
  await data[this.profile.url].dct$publisher.add(namedNode("https://salut.solid.community/"))
  await data[this.profile.url].foaf$maker.add(namedNode(this.webId))

  const n = await data[this.profile.url].vcard$fn || await data.user.vcard$fn || this.webId.split("/")[2].split('.')[0];
  const img = await data[this.profile.url].vcard$hasPhoto ||  await data.user.vcard$hasPhoto || "";
  const role = await data[this.profile.url].vcard$role || await data.user.vcard$role || "";
  const birthday = await data[this.profile.url].vcard$bday;
  const gender = await data[this.profile.url].vcard$hasGender || "Unknown";
  const description = await data[this.profile.url].vcard$note || "";
  const organization = await data[this.profile.url]['http://www.w3.org/2006/vcard/ns#organization-name'] || await data.user['http://www.w3.org/2006/vcard/ns#organization-name'] || "";
  const locality = await data[this.profile.url].vcard$locality || await data.user.vcard$hasAddress.vcard$locality || "";
  const country = await data[this.profile.url]['http://www.w3.org/2006/vcard/ns#country-name'] || await data.user.vcard$hasAddress['http://www.w3.org/2006/vcard/ns#country-name'] || "";
  this.profile.name = `${n}`
  this.profile.img = `${img}`
  this.profile.role = `${role}`
  this.profile.birthday = `${birthday}`
  this.profile.gender = `${gender}`
  this.profile.description = `${description}`
  this.profile.organization = `${organization}`
  this.profile.locality = `${locality}`
  this.profile.country = `${country}`
  this.profile.inbox = `${inbox}`
  this.profile.storage = `${storage}`
  this.profile.instances = []
//  console.log(this.profile)
  this.requestUpdate()

  let instances = []
  try{
    const publicTypeIndex = await data.user.publicTypeIndex || "undefined"
    //  console.log(`${publicTypeIndex}`);
    if (`${publicTypeIndex}` != "undefined"){
      for await (const subject of data[publicTypeIndex].subjects){
        //  console.log(`${subject}`);
        if (`${publicTypeIndex}` != `${subject}`) {
          const s = {subject: `${subject}`}
          for await (const property of subject.properties)
          {
            if (`${property}` == "http://www.w3.org/ns/solid/terms#instance")    {
              //  console.log( "--",`${property}`);
              const instance = await data[subject][`${property}`]
              const classe = await data[subject].solid$forClass
              //  console.log( "--nn",`${instance}`);
              s.predicate = `${property}`
              s.object = `${instance}`
              s.classe = `${classe}`
              s.shortClasse = this.localName(s.classe)
            }
          }
          //  if(s.shortClasse == "LongChat"){
          instances.push(s)
          //}
        }
      }
    }
  }catch(e){
    console.log(e)
  }
  this.profile.instances = instances
  console.log(this.profile)
  this.requestUpdate()
}

localName(str){
  var ln = str.substring(str.lastIndexOf('#')+1);
  //console.log(ln)
  ln == str ? ln = str.substring(str.lastIndexOf('/')+1) : "";
  return ln
}

}

customElements.define('profile-element', ProfileElement);
