import { LitElement, html } from 'lit-element';

class NoteElement extends LitElement {

  static get properties() {
    return {
      content: {type: String}
    };
  }

  constructor() {
    super();
    this.content = ""
  }

  render(){
    return html`
    <link href="css/bootstrap/bootstrap.min.css" rel="stylesheet">
    <textarea
    class="form-control"
    id="notearea"
    style="width:100%;height:38vh"
    placeholder="Write a note on your Pod & share it on Agora"
    @input="${this.updateContent}">
    </textarea>
    `;
  }

  updateContent(e){
    this.content = e.target.value.trim()
  }

}

customElements.define('note-element', NoteElement);
