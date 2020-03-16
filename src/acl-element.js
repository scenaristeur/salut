import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';
import * as auth from 'solid-auth-client';
//https://github.com/Otto-AA/solid-acl-utils/blob/master/README.md
//https://otto-aa.github.io/solid-acl-parser/#/quickstart

class AclElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
      inboxAccess: {type: String},
      state: {type: Object},
      webId: {type: String}
    };
  }

  constructor() {
    super();
    this.something = "Acl Element"
    this.inboxAccess = "Unknown"
    this.state =  {
      fileUrl: undefined,
      webIds: [],
      public: false,
      permissions: {
        read: false,
        write: false,
        append: false,
        control: false
      }
    }
    this.webiId =  'https://solid.example.org/profile/card#me'
  }

  render(){
    return html`
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <h4>${this.something}</h4>

    <!--  <form action="./"> -->
    <h3>File/Folder</h3>
    <label for="fileUrl">Enter the url of the file/folder for which the permissions will be changed</label>
    <input type="text" name="fileUrl" id="fileUrl" value="https://spoggy.solid.community/public/acl_test.ttl">
    <h3>Agents</h3>
    <p>The agents describe with whom you want to share the file/folder</p>
    <label for="webIds">Enter zero or more Web IDs separated by ","</label>
    <input id="webIds" name="webIds" type="text" value="https://example.solid.community/profile/card#me">
    <br>
    <label for="public">Check if you want to give the permissions to everyone</label>
    <input id="public" name="public" type="checkbox">
    <hr>
    <h3>Permissions</h3>
    <p>Choose what type of access you want to grant. Read, Write, Append and/or Control (which means they will be able to change permissions too)</p>
    <label for="permRead">Read</label>
    <input type="checkbox" name="permRead" id="permRead">
    <label for="permWrite">Write</label>
    <input type="checkbox" name="permWrite" id="permWrite">
    <label for="permAppend">Append</label>
    <input type="checkbox" name="permAppend" id="permAppend">
    <label for="permControl">Control</label>
    <input type="checkbox" name="permControl" id="permControl">
    <hr>
    <button id="share"  class="btn btn-primary" type="button" @click=${this.updatePermissions} >Grant permissions</button>


    <!--  </form>-->
    <hr><hr><hr>

    <div class="row">
    <div class="col">
    Inbox Access : ${this.inboxAccess}
    </div>
    <div class="col">
    <button id="check_inbox_btn" class="btn btn-primary" type="button" @click=${this.submit}>Check my Inbox</button>
    </div>
    </div>

    `;
  }


async aclTest(){
  console.log("########################TEST TEST######################")
  const { AclDoc, Permissions, Agents } = SolidAclParser
const { READ, WRITE, CONTROL } = Permissions



  const doc = new AclDoc({ accessTo: 'https://spoggy.solid.community/public/test_acl/' })

  // Note: Following two lines are the same as using Agents.PUBLIC
  const agents = new Agents()
  agents.addPublic()

  doc.addRule(READ, agents)
  console.log(doc.hasRule(READ, agents)) // true
  doc.deleteRule(READ, Agents.PUBLIC)
  console.log(doc.hasRule(READ, agents)) // false

////

const permissions = doc.getPermissionsFor(this.webId)
console.log(permissions.has(READ)) // false (It doesn't include Public permissions)
console.log(permissions.has(WRITE)) // true
console.log(permissions.has(CONTROL)) // true
console.log([...permissions]) // ["http://www.w3.org/ns/auth/acl#Write", "http://www.w3.org/ns/auth/acl#Control"]


}


  async updatePermissions() {
    const { AclApi, Permissions, Agents } = SolidAclUtils
    const { READ, WRITE, APPEND, CONTROL } = Permissions

    const fetch = auth.fetch.bind(auth)
    const utils = new AclApi(fetch, { autoSave: true })
    const acl = await utils.loadFromFileUrl(this.state.fileUrl)

    let test = acl.hasRule(Permissions.ALL, this.webId)
    console.log("TEST",test)

const permissions = new Permissions()
    if (this.state.permissions.read)
    permissions.add(READ)
    if (this.state.permissions.write)
    permissions.add(WRITE)
    if (this.state.permissions.append)
    permissions.add(APPEND)
    if (this.state.permissions.control)
    permissions.add(CONTROL)

    const agents = new Agents()
    agents.addWebId(...this.state.webIds)
    if (this.state.public)
    agents.addPublic()

    try {
      await acl.addRule(permissions, agents)
      console.log('updated the acl')
    } catch (e) {
      console.error('Error while adding rule')
      console.error(e)
      throw e
    }
  }



  async check_inbox(){
    console.log(this.inboxAccess)
    var inbox = await data.user.inbox
    console.log(`${inbox}`)

    var storage = await data.user.storage
    console.log(`${storage}`)
    var public_folder = `${storage}`+"public/"
    var notes_file = "https://spoggy.solid.community/public/acl_test.ttl"
    // You could also use SolidAclUtils.Permissions.READ instead of following
    // This is just more convenient
    console.log(SolidAclUtils)
    const { AclApi, Permissions, Agents } = SolidAclUtils
    const { READ, WRITE, APPEND, CONTROL } = Permissions
    //
    const fetch = auth.fetch.bind(auth)
    const aclApi = new AclApi(fetch, { autoSave: true })
    const acl = await aclApi.loadFromFileUrl(notes_file)
    //const acl_folder = await aclApi.loadFromFileUrl(public_folder)

    const permissions = new Permissions()
    if (this.state.permissions.read)
    permissions.add(READ)
    if (this.state.permissions.write)
    permissions.add(WRITE)
    if (this.state.permissions.append)
    permissions.add(APPEND)
    if (this.state.permissions.control)
    permissions.add(CONTROL)

    console.log(permissions)


    console.log(`${acl}`.toString())
    //  console.log(`${acl_folder}`.toString())
    //  var inbox_acl = await data.user.inbox.acl
    //  console.log(inbox_acl)

    const agents = new Agents()
    agents.addWebId(...this.state.webIds)
    if (this.state.public)
    agents.addPublic()


    try {
      await acl.addRule(permissions, agents)
      console.log('updated the acl')
    } catch (e) {
      console.error('Error while adding rule')
      console.error(e)
      throw e
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
    this.init()
    this.updateState()
    this.aclTest()
  }

  init(){
    this.inputs = {
      fileUrl: this.shadowRoot.getElementById('fileUrl'),
      webIds: this.shadowRoot.getElementById('webIds'),
      public: this.shadowRoot.getElementById('public'),
      permissions: {
        read: this.shadowRoot.getElementById('permRead'),
        write: this.shadowRoot.getElementById('permWrite'),
        append: this.shadowRoot.getElementById('permAppend'),
        control: this.shadowRoot.getElementById('permControl')
      }
    }
    const form = this.shadowRoot.querySelector('form')
    this.state = {
      fileUrl: undefined,
      webIds: [],
      public: false,
      permissions: {
        read: false,
        write: false,
        append: false,
        control: false
      }
    }

    console.log(this.inputs)
    console.log(this.state)

  }


  updateState(){
    this.state.fileUrl = this.inputs.fileUrl.value
    this.state.webIds = this.inputs.webIds.value ? this.inputs.webIds.value.split(',').filter(val => !!val) : []
    this.state.public = this.inputs.public.checked
    this.state.permissions.read = this.inputs.permissions.read.checked
    this.state.permissions.write = this.inputs.permissions.write.checked
    this.state.permissions.append = this.inputs.permissions.append.checked
    this.state.permissions.control = this.inputs.permissions.control.checked
    console.log(this.state)
  }

  webIdChanged(webId){
    this.webId = webId
    if (webId != null){
      this.updateProfile();
    }else{

    }
  }



}

customElements.define('acl-element', AclElement);
