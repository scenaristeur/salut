//https://zocada.com/compress-resize-images-javascript-browser/
//https://stackoverflow.com/questions/20379027/javascript-reduce-the-size-and-quality-of-image-with-based64-encoded-code
//http://tech.novapost.fr/redimensionner-une-image-cote-client-avant-lupload.html

import { LitElement, html } from 'lit-element';
import { HelloAgent } from './agents/hello-agent.js';

class PicsuploadElement extends LitElement {

  static get properties() {
    return {
      name: {type: String},
      something: {type: String},
    };
  }

  constructor() {
    super();
    this.something = "Picsupload Element"
  }

  render(){
    return html`
    <link href="css/fontawesome/css/all.css" rel="stylesheet">
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <div class="container-fluid">
    <h4>${this.something}</h4>

    <!--
    <div class="custom-file">
    <input type="file" class="custom-file-input" id="customFile" accept="image/*" @change="${this.compress}">
    <label class="custom-file-label" for="customFile">Choose file</label>
    </div>-->
    <input id="file" type="file" accept="image/*" @change="${this.compress}">
    <canvas id="view"></canvas>
    </div>
    `;
  }

  compress(e) {
    console.log(e)
let app = this
  //  const width = 500;
    //const height = 300;
    const width = 300;

    const fileName = e.target.files[0].name;
    console.log(fileName)
    const reader = new FileReader();
    reader.readAsDataURL(e.target.files[0]);
    reader.onload = event => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => {
        const elem = app.shadowRoot.getElementById('view');
      //  elem.width = width;
      //  elem.height = height;
      const scaleFactor = width / img.width;
      elem.width = width;
      elem.height = img.height * scaleFactor;
        const ctx = elem.getContext('2d');
        // img.width and img.height will contain the original dimensions
        ctx.drawImage(img, 0, 0, width, img.height * scaleFactor); //height);
        ctx.canvas.toBlob((blob) => {
          const file = new File([blob], fileName, {
            type: 'image/jpeg',
            lastModified: Date.now()
          });
        }, 'image/jpeg', 1);
      },
      reader.onerror = error => console.log(error);
      //  console.log("New File to upload",file)
    };
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

}

customElements.define('picsupload-element', PicsuploadElement);
